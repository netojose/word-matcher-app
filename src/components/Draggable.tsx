import { css } from "@/styled-system/css";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { toInt } from "radash";

type Props = {
  text: string;
  wordPosition: number;
  position: number;
  disabled?: boolean;
  delta?: { x: number; y: number };
};

export default function Draggable({
  text,
  wordPosition,
  position,
  disabled,
  delta,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: wordPosition, disabled, data: { position } });

  const cssTransform = delta
    ? `translate3d(${toInt(delta.x)}px, ${toInt(delta.y)}px, 0)`
    : transform
      ? CSS.Translate.toString(transform)
      : undefined;

  return (
    <li
      ref={setNodeRef}
      className={css({
        borderColor: "green.400",
        backgroundColor: "white",
        borderWidth: 1,
        borderStyle: "solid",
        paddingX: 2,
      })}
      style={{
        transform: cssTransform,
        cursor: disabled ? "not-allowed" : isDragging ? "grabbing" : "grab",
        opacity: disabled ? 0.3 : 1,
      }}
      {...listeners}
      {...attributes}
    >
      {text}
    </li>
  );
}
