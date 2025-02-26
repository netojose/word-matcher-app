import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useState, useEffect, createElement } from "react";
import hash from "object-hash";
import { toInt } from "radash";

import Draggable from "@/components/Draggable";
import Droppable from "@/components/Droppable";

// ==== FROM SERVER START ====
const serverText = `
Em uma {0}, o capital mais importante é o {1}. São pessoas de várias culturas, tradições, formações, naturezas e educações convivendo e vivendo juntas. A {2}, portanto, é fundamental para o relacionamento e o desenvolvimento das atividades. Nesse cenário, então, devemos respeitar as diferenças existentes, já que muitas vezes passamos mais tempo com nossos colegas de trabalho do que com nossos {3}.
É muito comum, também, encontrarmos {4} que fazem o funcionário ser menos produtivo por se preocupar mais com o outro do que com o seu {5}. Em relação à segurança e meio ambiente é de suma importância que, além do respeito das normas e padrões da empresa, saibamos respeitar o {6}.
`;

type Word = {
  word: string;
  position: number;
};

type ParagraphItems = Array<
  { type: "text"; text: string } | { type: "placeholder"; position: number }
>;

const serverWords: Word[] = [
  { word: "organização", position: 0 },
  { word: "ser humano", position: 1 },
  { word: "comunicação", position: 2 },
  { word: "familiares", position: 3 },
  { word: "divergências", position: 4 },
  { word: "trabalho", position: 5 },
  { word: "próximo", position: 6 },
];
// ==== FROM SERVER END ====

export default function Challenge() {
  const [submitted, setSubmitted] = useState(false);
  const [paragraphs, setParagraphs] = useState<Array<ParagraphItems>>([]);
  const [filledWords, setFilledWords] = useState<
    Array<{ position: number; word: Word }>
  >([]);
  const [words, setWords] = useState<Word[]>([]);

  useEffect(function loadData() {
    setWords(serverWords);

    const textLines = serverText.split("\n").filter((p) => p.trim() !== "");
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
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    if (!event.over || event.over.disabled || !event.active) {
      return;
    }

    const wordPosition = event.active.id;
    const position = toInt(event.over.id);

    const word = words.find((word) => word.position === wordPosition);
    if (!word) {
      return;
    }

    setFilledWords((state) => [...state, { position, word: word }]);
  };

  const handleRemove = (position: number) => {
    setFilledWords((state) => state.filter((fw) => fw.position !== position));
  };

  const getFilledWord = (position: number) => {
    return filledWords.find((fw) => fw.position === position)?.word;
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const remainingWords = words.length - filledWords.length;
  const submitDisabled = remainingWords > 0 || submitted || words.length < 1;
  const submitLabel =
    words.length < 1
      ? "Loading challenge..."
      : remainingWords === 1
        ? "1 word remaining"
        : remainingWords > 0
          ? `${remainingWords} words remaining`
          : "Submit";

  return (
    <div>
      <DndContext onDragEnd={handleDragEnd}>
        <div style={{ margin: 35 }}>
          {paragraphs.map((paragraph) =>
            createElement(
              "p",
              { key: hash(paragraph), style: { marginBottom: 10 } },
              paragraph.map((item) => {
                if (item.type === "text") {
                  return item.text;
                }

                const word = getFilledWord(item.position);
                return (
                  <Droppable
                    key={item.position}
                    position={item.position}
                    value={word?.word}
                    onRemove={handleRemove}
                    isCorrect={
                      !submitted ? undefined : word?.position === item.position
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
          {words.map((word) => (
            <Draggable
              key={word.word}
              text={word.word}
              id={word.position}
              disabled={
                !!filledWords.find((fw) => fw.word.position === word.position)
              }
            />
          ))}
        </ul>
      </DndContext>
      <input
        type="button"
        disabled={submitDisabled}
        style={{ cursor: submitDisabled ? "not-allowed" : "pointer" }}
        value={submitLabel}
        onClick={handleSubmit}
      />
    </div>
  );
}
