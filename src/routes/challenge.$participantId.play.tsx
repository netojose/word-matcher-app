import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";

import Challenge from "@/components/Challenge";
import { getChallengeDetails } from "@/query-options/get-challenge-details";
import WaitChallenge from "@/components/WaitChallenge";
import { useEffect, useRef } from "react";

function Play() {
  const params = useParams({ from: "/challenge/$participantId/play" });
  const { data } = useQuery(getChallengeDetails(params.participantId));
  const queryClient = useQueryClient();

  const socket = useRef<Socket>(null);

  useEffect(
    function setupSocket() {
      if (socket.current || !data) {
        return;
      }

      socket.current = io(import.meta.env.VITE_API_URL);

      socket.current.on(`start-challenge:${data.challenges.id}`, (payload) => {
        queryClient.setQueryData(
          getChallengeDetails(params.participantId).queryKey,
          (old) => (!old ? undefined : { ...old, challenges: payload })
        );
      });
    },
    [data, params.participantId, queryClient]
  );

  if (!data) {
    return <div>Loading...</div>;
  }

  switch (data.challenges.status) {
    case "AVAILABLE":
      return <WaitChallenge challengeDetails={data} />;
    case "RUNNING":
      return <Challenge />;
    case "FINISHED":
      return <div>Challenge finished</div>;
  }
}

export const Route = createFileRoute("/challenge/$participantId/play")({
  component: Play,
});
