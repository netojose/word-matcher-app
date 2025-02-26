import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  text: string;
  id: number;
  disabled?: boolean;
};

export default function Draggable({ text, id, disabled }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id, disabled });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: transform ? CSS.Translate.toString(transform) : undefined,
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
