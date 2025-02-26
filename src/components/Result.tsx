import { Snapshot } from "@/utils/types";
import { ReactNode } from "react";

type Props = {
  snapshot: Snapshot;
};

export default function Result({ snapshot }: Props): ReactNode {
  if (!snapshot.submitted) {
    return null;
  }

  const correctItems = snapshot.filled.reduce(
    (acc, item) => acc + (item.position === item.wordPosition ? 1 : 0),
    0
  );

  return (
    <p>
      You got {correctItems} out of {snapshot.filled.length} correct
    </p>
  );
}
