"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { offerSchema } from "@/lib/zod-schemas";

export type OfferFormData = z.infer<typeof offerSchema>;

interface OfferFormProps {
  onSubmit: (data: OfferFormData) => void;
  isSubmitting: boolean;
  proposal?: any;
}

export function OfferForm({ onSubmit, isSubmitting, proposal }: OfferFormProps) {
  const form = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      bondAmount: "",
      premium: "",
      terms: "",
      effectiveDate: "",
      expiryDate: "",
      proposalId: proposal?.id || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="bondAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bond Amount</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter bond amount" 
                    {...field} 
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="premium"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Premium</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter premium amount" 
                    {...field} 
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="effectiveDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Effective Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Terms and Conditions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter terms and conditions for the bond offer"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Hidden field for proposalId */}
        <FormField
          control={form.control}
          name="proposalId"
          render={({ field }) => (
            <input type="hidden" {...field} />
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating Offer..." : "Create Offer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}