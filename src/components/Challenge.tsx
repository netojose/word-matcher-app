import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { useState, useEffect, createElement } from "react";
import hash from "object-hash";
import { toInt } from "radash";
import { Snapshot } from "@/utils/types";

import Draggable from "@/components/Draggable";
import Droppable from "@/components/Droppable";
import Result from "./Result";

type FilledWords = Array<{
  position: number;
  wordPosition: number;
}>;

type ParagraphItems = Array<
  { type: "text"; text: string } | { type: "placeholder"; position: number }
>;

export type EventPayload = {
  position: number;
  wordPosition: UniqueIdentifier;
};

type FnEvent = (data: EventPayload) => void;

type Props = {
  snapshot: Snapshot;
  text: string;
  placeholders: Array<{
    word: string;
    position: number;
  }>;
  team: number;
  setFilledWords: (items: FilledWords) => void;
  onDragStart: FnEvent;
  onDragCancel: FnEvent;
  onDragEnd: FnEvent;
  onRemoveItem: FnEvent;
  onSubmit: VoidFunction;
};

export default function Challenge({
  snapshot,
  text,
  team,
  placeholders,
  onDragStart,
  onDragCancel,
  onDragEnd,
  onRemoveItem,
  onSubmit,
}: Props) {
  const [paragraphs, setParagraphs] = useState<Array<ParagraphItems>>([]);

  useEffect(
    function loadData() {
      const textLines = text
        .split("\n")
        .map((p) => p.trim())
        .filter((p) => p !== "");
      const allContent: ParagraphItems[] = [];

      for (const textLine of textLines) {
        const auxItems: ParagraphItems = [];

        const regex = /\{\d+\}/g;

        let found: RegExpExecArray | null = null;
        let start = 0;
        do {
          found = regex.exec(textLine);

          if (found === null) {
            continue;
          }

          const text = textLine.slice(start, found.index);
          start = found.index + found[0].length;
          const position = toInt(found[0].match(/\d+/)?.[0] ?? "");

          auxItems.push({ type: "text", text });
          auxItems.push({ type: "placeholder", position });
        } while (found !== null);

        const endText = textLine.substring(start);
        if (endText) {
          auxItems.push({ type: "text", text: endText });
        }

        allContent.push(auxItems);
      }

      setParagraphs(allContent);
    },
    [text]
  );
  const handleDragStart = ({ active }: DragStartEvent) => {
    const position = active.data.current?.position;
    const wordPosition = active.id;
    onDragStart({ position, wordPosition });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const position = event.over?.data.current?.position;
    const wordPosition = event.active.id;

    if (!event.over || event.over.disabled || !event.active) {
      onDragCancel({ position, wordPosition });
      return;
    }

    const word = placeholders.find(
      (placeholder) => placeholder.position === wordPosition
    );
    if (!word) {
      return;
    }

    onDragEnd({ position, wordPosition });
  };

  const handleRemove = (data: { position: number; wordPosition: number }) => {
    onRemoveItem(data);
  };

  const remainingWords = placeholders.length - snapshot.filled.length;
  const submitDisabled =
    remainingWords > 0 || snapshot.submitted || placeholders.length < 1;
  const submitLabel =
    placeholders.length < 1
      ? "Loading challenge..."
      : remainingWords === 1
        ? "1 word remaining"
        : remainingWords > 0
          ? `${remainingWords} words remaining`
          : "Submit";

  const color = ["#f33", "#3f3", "#dca", "#aa3", "#933"][team - 1];

  return (
    <div style={{ border: `solid 1px ${color}` }}>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div style={{ margin: 35 }}>
          {paragraphs.map((paragraph) =>
            createElement(
              "p",
              { key: hash(paragraph), style: { marginBottom: 10 } },
              paragraph.map((item) => {
                if (item.type === "text") {
                  return item.text;
                }

                const filled = snapshot.filled.find(
                  (filled) => filled.position === item.position
                );

                const word = placeholders.find(
                  (placeholder) => placeholder.position === filled?.wordPosition
                );

                return (
                  <Droppable
                    key={item.position}
                    position={item.position}
                    wordPosition={word?.position}
                    value={word?.word}
                    onRemove={handleRemove}
                    isCorrect={
                      !snapshot.submitted
                        ? undefined
                        : word?.position === item.position
                    }
                  />
                );
              })
            )
          )}
        </div>

        <ul
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            listStyle: "none",
            margin: 40,
            padding: 0,
          }}
        >
          {placeholders.map((placeholder, index) => (
            <Draggable
              key={placeholder.word}
              text={placeholder.word}
              wordPosition={placeholder.position}
              position={index + 1}
              disabled={snapshot.locks.includes(placeholder.position)}
            />
          ))}
        </ul>
      </DndContext>
      <input
        type="button"
        disabled={submitDisabled}
        style={{ cursor: submitDisabled ? "not-allowed" : "pointer" }}
        value={submitLabel}
        onClick={onSubmit}
      />
      <Result snapshot={snapshot} />
    </div>
  );
}
