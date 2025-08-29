'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { pinVerificationSchema } from '@/lib/zod-schemas';

interface PinVerificationFormProps {
  onSuccess: () => void;
  email: string;
}

export function PinVerificationForm({
  onSuccess,
  email,
}: PinVerificationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof pinVerificationSchema>>({
    resolver: zodResolver(pinVerificationSchema),
    defaultValues: {
      email: email,
      pin: '',
    },
  });

  async function onSubmit(values: z.infer<typeof pinVerificationSchema>) {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await fetch('/api/registration/verify-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid PIN');
      }

      onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Invalid PIN. Please try again.';
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {apiError && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">
            {apiError}
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>6-Digit PIN</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter 6-digit PIN"
                  {...field}
                  maxLength={6}
                  onChange={e => {
                    // Only allow digits
                    const value = e.target.value.replace(/\D/g, '');
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify PIN'}
        </Button>
      </form>
    </Form>
  );
}
