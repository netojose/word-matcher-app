import { input } from "@/styled-system/patterns";

export default function Input({
  type = "text",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={input()} type={type} {...props} />;
}
