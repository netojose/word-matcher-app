import { css } from "@/styled-system/css";

export default function Button({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={css({
        backgroundColor: "blue",
        color: "white",
        padding: 2,
        borderRadius: 4,
        _disabled: {
          backgroundColor: "gray",
          cursor: "not-allowed",
        },
      })}
      {...props}
    >
      {children}
    </button>
  );
}
