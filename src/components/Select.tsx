import { input } from "@/styled-system/patterns";

export default function Select({
  options = [],
  ...props
}: React.InputHTMLAttributes<HTMLSelectElement> & {
  options?: Array<{ label: string; value: string; disabled?: boolean }>;
}) {
  return (
    <select className={input()} {...props}>
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}
