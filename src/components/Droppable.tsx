import { useDroppable } from "@dnd-kit/core";

type Props = {
  position: number;
  wordPosition?: number;
  value?: string;
  isCorrect?: boolean;
  onRemove: (data: { position: number; wordPosition: number }) => void;
};

export default function Droppable({
  position,
  wordPosition,
  value,
  isCorrect,
  onRemove,
}: Props) {
  const disabled = !!value;
  const onRemoveDisabled = isCorrect !== undefined;
  const { isOver, setNodeRef } = useDroppable({
    id: position,
    disabled,
    data: { position },
  });

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
          onClick={() =>
            wordPosition ? onRemove({ position, wordPosition }) : undefined
          }
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
