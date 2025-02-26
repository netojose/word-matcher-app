import { useDroppable } from "@dnd-kit/core";

type Props = {
  position: number;
  value?: string;
  isCorrect?: boolean;
  onRemove: (position: number) => void;
};

export default function Droppable({
  position,
  value,
  isCorrect,
  onRemove,
}: Props) {
  const disabled = !!value;
  const onRemoveDisabled = isCorrect !== undefined;
  const { isOver, setNodeRef } = useDroppable({ id: position, disabled });

  const style = {
    borderBottomColor: isOver ? "yellow" : disabled ? "red" : "green",
    color: isCorrect === undefined ? "#777" : isCorrect ? "green" : "red",
  };

  return (
    <span
      ref={setNodeRef}
      style={{
        display: "inline-block",
        width: 150,
        textAlign: "center",
        borderBottom: "1px solid green",
        transition: "border-color 0.3s linear",
        ...style,
      }}
    >
      {value ?? "\u00A0"}{" "}
      {value && (
        <button
          onClick={() => onRemove(position)}
          style={{
            height: 10,
            width: 10,
            padding: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: onRemoveDisabled ? "not-allowed" : "pointer",
          }}
          disabled={onRemoveDisabled}
        >
          x
        </button>
      )}
    </span>
  );
}
