import { useNavigate, useParams } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { JoinChallenge } from "@/utils/types";
import { mutationFn } from "@/utils/fetch";
import Input from "@/components/Input";
import { css } from "@/styled-system/css";
import Button from "@/components/Button";
import Title from "@/components/Title";

type Inputs = {
  name: string;
};

function Challenge() {
  const navigate = useNavigate();
  const params = useParams({ from: "/challenge/$id/join" });
  const { register, handleSubmit } = useForm<Inputs>();

  const { mutate, isPending } = useMutation<
    JoinChallenge,
    Error,
    Inputs & { challengeId: string }
  >({
    mutationFn: mutationFn<JoinChallenge>("/challenge/join"),
    onSuccess(data) {
      navigate({
        to: "/challenge/$participantId/play",
        params: { participantId: data.participantId },
      });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutate({ name: data.name, challengeId: params.id });
  };

  return (
    <div>
      <Title text="Join on this challenge" />
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
          {...register("name")}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Loading..." : "Join"}
        </Button>
      </form>
    </div>
  );
}

export const Route = createFileRoute("/challenge/$id/join")({
  component: Challenge,
});
