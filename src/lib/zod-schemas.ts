// All schemas for forms/documents
import { z } from 'zod';

// Status enum for all entities
export const entityStatusSchema = z.enum([
  'pending',
  'approved',
  'declined',
  'soft_deleted',
]);

// Edit History schema
export const editHistorySchema = z.object({
  id: z.string(),
  timestamp: z.string().datetime(),
  userId: z.string(),
  userName: z.string(),
  action: z.string(),
  changes: z.record(z.string(), z.unknown()).optional(),
});

// User schema
export const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'broker', 'policyholder', 'wholesale']),
});

// Broker schema
export const brokerSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  status: entityStatusSchema.default('pending'),
  editHistory: z.array(editHistorySchema).default([]),
});

// Policyholder schema
export const policyholderSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  status: entityStatusSchema.default('pending'),
  editHistory: z.array(editHistorySchema).default([]),
});

// Proposal schema
export const proposalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  brokerId: z.string().min(1, 'Broker ID is required'),
  policyholderId: z.string().min(1, 'Policyholder ID is required'),
  status: entityStatusSchema.default('pending'),
  editHistory: z.array(editHistorySchema).default([]),
});

// Access request schema
export const accessRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  country: z.string().min(1, 'Country is required'),
});

// PIN verification schema
export const pinVerificationSchema = z.object({
  email: z.string().email('Invalid email address'),
  pin: z
    .string()
    .length(6, 'PIN must be 6 digits')
    .regex(/^\d{6}$/, 'PIN must be 6 digits'),
});

// Broker registration schema
export const brokerRegistrationSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyNumber: z.string().min(1, 'Company number is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  country: z.string().min(1, 'Country is required'),
});

// Creditsafe company schema
export const creditsafeCompanySchema = z.object({
  id: z.string().min(1, 'Company ID is required'),
  name: z.string().min(1, 'Company name is required'),
  number: z.string().min(1, 'Company number is required'),
  country: z.string().min(1, 'Country is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  postcode: z.string().min(1, 'Postcode is required'),
});

// Creditsafe financial summary schema
export const creditsafeFinancialSummarySchema = z.object({
  currency: z.string().min(1, 'Currency is required'),
  revenue: z.number().min(0, 'Revenue must be a positive number'),
  profit: z.number(),
  equity: z.number().min(0, 'Equity must be a positive number'),
  employees: z.number().min(0, 'Employee count must be a positive number'),
});

// Creditsafe credit score schema
export const creditsafeCreditScoreSchema = z.object({
  score: z
    .number()
    .min(0, 'Score must be between 0 and 100')
    .max(100, 'Score must be between 0 and 100'),
  rating: z.string().min(1, 'Rating is required'),
  limit: z.number().min(0, 'Credit limit must be a positive number'),
});

// Creditsafe report schema
export const creditsafeReportSchema = z.object({
  companyId: z.string().min(1, 'Company ID is required'),
  companyName: z.string().min(1, 'Company name is required'),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  status: z.string().min(1, 'Status is required'),
  legalForm: z.string().min(1, 'Legal form is required'),
  incorporationDate: z.string().min(1, 'Incorporation date is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  country: z.string().min(1, 'Country is required'),
  financialSummary: creditsafeFinancialSummarySchema.optional(),
  creditScore: creditsafeCreditScoreSchema.optional(),
});

// Beneficiary schema
export const beneficiarySchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  status: entityStatusSchema.default('pending'),
  editHistory: z.array(editHistorySchema).default([]),
});

// Bond schema
export const bondSchema = z.object({
  bondAmount: z
    .string()
    .min(1, 'Bond amount is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount format'),
  premium: z
    .string()
    .min(1, 'Premium is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid premium format'),
  terms: z
    .string()
    .min(1, 'Terms are required')
    .max(1000, 'Terms must be less than 1000 characters'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  policyholderId: z.string().min(1, 'Policyholder ID is required'),
  beneficiaryId: z.string().min(1, 'Beneficiary ID is required'),
  status: entityStatusSchema.default('pending'),
  editHistory: z.array(editHistorySchema).default([]),
});

// Offer schema
export const offerSchema = z.object({
  bondAmount: z
    .string()
    .min(1, 'Bond amount is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount format'),
  premium: z
    .string()
    .min(1, 'Premium is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid premium format'),
  terms: z
    .string()
    .min(1, 'Terms are required')
    .max(1000, 'Terms must be less than 1000 characters'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  proposalId: z.string().min(1, 'Proposal ID is required'),
  status: entityStatusSchema.default('pending'),
  editHistory: z.array(editHistorySchema).default([]),
});
