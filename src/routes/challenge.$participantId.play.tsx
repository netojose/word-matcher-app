import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";

import Challenge, { EventPayload } from "@/components/Challenge";
import { getChallengeDetails } from "@/query-options/get-challenge-details";
import WaitChallenge from "@/components/WaitChallenge";
import { useEffect, useRef, useState } from "react";
import { Snapshot } from "@/utils/types";
import { toInt } from "radash";

function Play() {
  const params = useParams({ from: "/challenge/$participantId/play" });
  const { participantId } = params;
  const { data: challengeDetails } = useQuery(
    getChallengeDetails(participantId)
  );
  const queryClient = useQueryClient();

  const socket = useRef<Socket>(null);

  const [snapshot, setSnapshot] = useState<Snapshot>({ locks: [], filled: [] });

  useEffect(
    function hydrateStatus() {
      if (!challengeDetails) {
        return;
      }

      setSnapshot(challengeDetails.snapshot);
    },
    [challengeDetails]
  );

  useEffect(
    function setupSocket() {
      if (socket.current || !challengeDetails) {
        return;
      }

      socket.current = io(import.meta.env.VITE_API_URL);

      socket.current.on(
        `challenge:${challengeDetails.challenges.id}`,
        ({ event, payload }) => {
          if (event === "CHALLENGE_START") {
            queryClient.setQueryData(
              getChallengeDetails(participantId).queryKey,
              (old) => (!old ? undefined : { ...old, challenges: payload })
            );
          }

          if (payload.participantId === participantId) {
            return;
          }

          switch (event) {
            case "DRAG_START":
            case "DRAG_CANCEL":
            case "DRAG_END":
            case "REMOVE_ITEM":
              setSnapshot({ filled: payload.filled, locks: payload.locks });
              break;
            case "DRAG_MOVE":
              // console.log({ drag: payload });
              break;
            case "CHALLENGE_END":
              // console.log({ challengeEnd: payload });
              break;
          }
        }
      );
    },
    [challengeDetails, participantId, queryClient]
  );

  const emit = (
    event: "drag:start" | "drag:cancel" | "drag:end" | "remove:item",
    { wordPosition, position }: EventPayload
  ) => {
    socket.current?.emit(event, {
      challengeId: challengeDetails?.challenges.id,
      participantId,
      wordPosition,
      position,
    });
  };

  const handleDragStart = (data: EventPayload) => emit("drag:start", data);

  const handleDragCancel = (data: EventPayload) => emit("drag:cancel", data);

  const handleDragEnd = (data: EventPayload) => {
    setSnapshot((prev) => ({
      ...prev,
      locks: [...prev.locks, toInt(data.wordPosition)],
      filled: [...prev.filled, data],
    }));

    emit("drag:end", data);
  };

  const handleRemoveItem = (data: EventPayload) => {
    setSnapshot((prev) => ({
      ...prev,
      locks: prev.locks.filter((id) => id !== data.wordPosition),
      filled: prev.filled.filter((item) => item.position !== data.position),
    }));

    emit("remove:item", data);
  };

  if (!challengeDetails) {
    return <div>Loading...</div>;
  }

  const { text, placeholders } = challengeDetails.challenges;

  switch (challengeDetails.challenges.status) {
    case "AVAILABLE":
      return <WaitChallenge challengeDetails={challengeDetails} />;
    case "RUNNING":
      return (
        <Challenge
          snapshot={snapshot}
          text={text}
          placeholders={placeholders}
          team={challengeDetails.team}
          setFilledWords={() => undefined}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
          onDragEnd={handleDragEnd}
          onRemoveItem={handleRemoveItem}
        />
      );
    case "FINISHED":
      return <div>This challenge is finished</div>;
  }
}

export const Route = createFileRoute("/challenge/$participantId/play")({
  component: Play,
});
