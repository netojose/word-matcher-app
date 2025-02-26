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
      style={{
        // transform: transform ? CSS.Translate.toString(transform) : undefined,
        transform: cssTransform,
        cursor: disabled ? "not-allowed" : isDragging ? "grabbing" : "grab",
        opacity: disabled ? 0.5 : 1,
      }}
      {...listeners}
      {...attributes}
    >
      {text}
    </li>
  );
}
