import { Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InputFieldProps {
  label: string;
  name: string;
  control: Control<any>;
  type?: string;
}

export default function InputField({ label, name, control, type = 'text' }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} type={type} />
    </div>
  );
}