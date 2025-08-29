import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

interface FormFieldWrapperProps {
  name: string;
  label: string;
  control: Control<any>;
  children: React.ReactNode;
}

export default function FormFieldWrapper({ name, label, control, children }: FormFieldWrapperProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {children}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}