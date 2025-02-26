export type Challenge = {
  createdAt: string;
  id: string;
  name: string;
  participantsPerTeam: number;
  placeholders: unknown;
  status: "AVAILABLE" | "RUNNING" | "FINISHED";
  teamsAmount: number;
  text: string;
};

export type ChallengeDetailDto = {
  id: string;
  name: string;
  team: number;
  challenges: Challenge;
};

export type JoinChallenge = {
  name: string;
  team: number;
  participantId: string;
};
