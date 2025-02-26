import { useNavigate, useParams } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { JoinChallenge } from "@/utils/types";
import { mutationFn } from "@/utils/fetch";

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
      <h3>Join on this challenge</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Your name"
          maxLength={30}
          required
          {...register("name")}
        />

        <button type="submit" disabled={isPending}>
          {isPending ? "Loading..." : "Join"}
        </button>
      </form>
    </div>
  );
}

export const Route = createFileRoute("/challenge/$id/join")({
  component: Challenge,
});
