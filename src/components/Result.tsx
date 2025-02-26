import { css } from "@/styled-system/css";
import { Snapshot } from "@/utils/types";
import { Link } from "@tanstack/react-router";
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
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      <p>
        You got {correctItems} out of {snapshot.filled.length} correct
      </p>
      <p>
        <Link to="/" className={css({ color: "blue" })}>
          Start a new challenge
        </Link>
      </p>
    </div>
  );
}
