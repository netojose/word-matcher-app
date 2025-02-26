import { css } from "@/styled-system/css";

export default function Loader() {
  return (
    <div
      className={css({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "xl",
        fontWeight: "medium",
      })}
    >
      Loading...
    </div>
  );
}
