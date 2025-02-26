import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { mutationFn } from "@/utils/fetch";
import { JoinChallenge } from "@/utils/types";

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
      <h3>Create a new challenge</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Your name"
          maxLength={30}
          required
          {...register("userName")}
        />

        <input
          type="text"
          placeholder="Challenge name"
          maxLength={30}
          required
          {...register("challengeName")}
        />

        <select required defaultValue="" {...register("teamsAmount")}>
          <option value="" disabled>
            Teams amount
          </option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>

        <select required defaultValue="" {...register("participantsPerTeam")}>
          <option value="" disabled>
            Participants per team
          </option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>

        <button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});
