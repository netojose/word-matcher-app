import { UniqueIdentifier } from "@dnd-kit/core";

export type Placeholder = {
  word: string;
  position: number;
};

export type Challenge = {
  createdAt: string;
  id: string;
  name: string;
  participantsPerTeam: number;
  placeholders: Array<Placeholder>;
  status: "AVAILABLE" | "RUNNING" | "FINISHED";
  teamsAmount: number;
  text: string;
};

export type Snapshot = {
  locks: number[];
  filled: Array<{ wordPosition: UniqueIdentifier; position: number }>;
  submitted: boolean;
};

export type ChallengeDetail = {
  id: string;
  name: string;
  team: number;
  challenges: Challenge;
  snapshot: Snapshot;
};

export type JoinChallenge = {
  name: string;
  team: number;
  participantId: string;
};
