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
import { accessRequestSchema } from '@/lib/zod-schemas';

interface AccessRequestFormProps {
  onSuccess?: (data: { email: string; pin6: string; link: string }) => void;
}

export function AccessRequestForm({ onSuccess }: AccessRequestFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof accessRequestSchema>>({
    resolver: zodResolver(accessRequestSchema),
    defaultValues: {
      email: '',
      country: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof accessRequestSchema>) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await fetch('/api/registration/access-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to request access');
      }

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to request access. Please try again.';
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={e => {
          e.preventDefault();
          form.handleSubmit(handleSubmit)(e);
        }}
        className="space-y-6"
      >
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
              <FormLabel>Broker Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="Enter your country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Requesting Access...' : 'Request Access'}
        </Button>
      </form>
    </Form>
  );
}
