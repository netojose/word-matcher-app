import { ChallengeDetailDto } from "@/utils/types";

type Props = {
  challengeDetails: ChallengeDetailDto;
};

export default function WaitChallenge({ challengeDetails }: Props) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_APP_URL}/challenge/${challengeDetails.challenges.id}/join`
    );
  };
  return (
    <div>
      <h1>{challengeDetails.challenges.name}</h1>
      <p>{challengeDetails.name}</p>
      <p>Wait for the challenge to start</p>
      <input
        type="button"
        value="Copy link to invite"
        onClick={handleCopyLink}
      />
    </div>
  );
}
