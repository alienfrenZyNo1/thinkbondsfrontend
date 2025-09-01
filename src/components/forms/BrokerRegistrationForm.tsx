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
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CompanySearch } from '@/components/ui/company-search';
import { brokerRegistrationSchema } from '@/lib/zod-schemas';
import type { CreditsafeCompany } from '@/lib/creditsafe';

interface BrokerRegistrationFormProps {
  onSuccess: () => void;
  email: string;
}

export function BrokerRegistrationForm({
  onSuccess,
  email
}: BrokerRegistrationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof brokerRegistrationSchema>>({
    resolver: zodResolver(brokerRegistrationSchema),
    defaultValues: {
      companyName: '',
      companyNumber: '',
      contactName: '',
      email: email,
      phone: '',
      address: '',
      city: '',
      postcode: '',
      country: ''
    }
  });

  const handleCompanySelect = (company: CreditsafeCompany) => {
    form.setValue('companyName', company.name, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
    form.clearErrors('companyName');
    form.setValue('companyNumber', company.number, { shouldDirty: true });
    form.setValue('address', company.address, { shouldDirty: true });
    form.setValue('city', company.city, { shouldDirty: true });
    form.setValue('postcode', company.postcode, { shouldDirty: true });
    form.setValue('country', company.country, { shouldDirty: true });
  };

  async function onSubmit(values: z.infer<typeof brokerRegistrationSchema>) {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await fetch('/api/registration/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit registration');
      }

      onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to submit registration. Please try again.';
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => {
              void field;
              return (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <CompanySearch
                      onCompanySelect={handleCompanySelect}
                      onInputChange={value => {
                        form.setValue('companyName', value, {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true
                        });
                        if (value && value.trim().length > 0) {
                          form.clearErrors('companyName');
                        }
                      }}
                      placeholder="Search for a company..."
                    />
                  </FormControl>
                  {/* Ensure RHF registers the value and validation clears visually */}
                  <input type="hidden" {...form.register('companyName')} />
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="companyNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter company number (optional if selected above)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter contact name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
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
                  <Input placeholder="Enter country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Enter city" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postcode</FormLabel>
                <FormControl>
                  <Input placeholder="Enter postcode" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Registration'}
        </Button>
      </form>
    </Form>
  );
}
