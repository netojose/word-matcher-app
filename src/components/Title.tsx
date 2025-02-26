import { css } from "@/styled-system/css";

export default function Title({ text }: { text: string }) {
  return (
    <h3 className={css({ fontSize: "xx-large", textAlign: "center" })}>
      {text}
    </h3>
  );
}
