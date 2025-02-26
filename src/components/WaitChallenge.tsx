import { ChallengeDetail } from "@/utils/types";
import Title from "./Title";
import Button from "./Button";
import { css } from "@/styled-system/css";

type Props = {
  challengeDetails: ChallengeDetail;
};

export default function WaitChallenge({ challengeDetails }: Props) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_APP_URL}/challenge/${challengeDetails.challenges.id}/join`
    );
  };
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 4,
        maxW: 400,
        margin: "0 auto",
      })}
    >
      <Title text={challengeDetails.challenges.name} />
      <p className={css({ fontWeight: "bold" })}>
        Hello {challengeDetails.name}!
      </p>
      <p>Wait for other players to join the challenge..</p>
      <Button type="button" onClick={handleCopyLink}>
        Copy link to invite more players
      </Button>
    </div>
  );
}
