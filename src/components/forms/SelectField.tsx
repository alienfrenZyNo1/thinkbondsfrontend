import { Label } from '@/components/ui/label';

interface SelectFieldProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
}

export default function SelectField({
  label,
  name,
  options,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <select id={name} className="w-full rounded-md border p-2">
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
