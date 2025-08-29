import type { Control, FieldValues } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

interface FormFieldWrapperProps {
  name: string;
  label: string;
  control: Control<FieldValues>;
  children: React.ReactNode;
}

export default function FormFieldWrapper({
  name,
  label,
  control,
  children,
}: FormFieldWrapperProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        void field;
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>{children}</FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
