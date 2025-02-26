import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { mutationFn } from "@/utils/fetch";
import { JoinChallenge } from "@/utils/types";

import { css } from "@/styled-system/css";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";
import Title from "@/components/Title";

type Inputs = {
  userName: string;
  challengeName: string;
  teamsAmount: number;
  participantsPerTeam: number;
};

function Index() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<Inputs>();

  const { mutate, isPending } = useMutation<JoinChallenge, Error, Inputs>({
    mutationFn: mutationFn<JoinChallenge>("/challenge"),
    onSuccess(data) {
      navigate({
        to: "/challenge/$participantId/play",
        params: { participantId: data.participantId.toString() },
      });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutate(data);
  };

  return (
    <div>
      <Title text="Create a new challenge" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 4,
          maxW: 400,
          margin: "0 auto",
        })}
      >
        <Input
          placeholder="Your name"
          maxLength={30}
          required
          {...register("userName")}
        />

        <Input
          placeholder="Challenge name"
          maxLength={30}
          required
          {...register("challengeName")}
        />

        <Select
          required
          defaultValue=""
          options={[
            { label: "Teams amount", value: "", disabled: true },
            { label: "1", value: "1" },
            { label: "2", value: "2" },
            { label: "3", value: "3" },
            { label: "4", value: "4" },
            { label: "5", value: "5" },
          ]}
          {...register("teamsAmount")}
        />

        <Select
          required
          defaultValue=""
          options={[
            { label: "Participants per team", value: "", disabled: true },
            { label: "1", value: "1" },
            { label: "2", value: "2" },
            { label: "3", value: "3" },
            { label: "4", value: "4" },
            { label: "5", value: "5" },
          ]}
          {...register("participantsPerTeam")}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create"}
        </Button>
      </form>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});
