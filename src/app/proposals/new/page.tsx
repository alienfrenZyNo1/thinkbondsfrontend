"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { useAuthData } from "@/lib/auth-hooks";
import { UserRole } from "@/lib/roles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { proposalSchema } from "@/lib/zod-schemas";
import { CompanySearch } from "@/components/ui/company-search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

// Define form types
type PolicyholderFormData = {
  companyName: string;
  companyNumber: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
};

type ContractFormData = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  amount: string;
};

type BeneficiaryFormData = {
  companyName: string;
  companyNumber: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
};

// Define wizard steps
type Step = 'policyholder' | 'contract' | 'beneficiary';

export default function NewProposalPage() {
 const { groups } = useAuthData();
  
  // Check if user has access to create proposals
  const canCreateProposal = groups.includes(UserRole.ADMIN) ||
                          groups.includes(UserRole.WHOLESALE) ||
                          groups.includes(UserRole.BROKER);
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState<Step>('policyholder');
  const [policyholderData, setPolicyholderData] = useState<PolicyholderFormData | null>(null);
  const [contractData, setContractData] = useState<ContractFormData | null>(null);
  const [beneficiaryData, setBeneficiaryData] = useState<BeneficiaryFormData | null>(null);
  
  // Policyholder form
  const policyholderForm = useForm<PolicyholderFormData>({
    resolver: zodResolver(z.object({
      companyName: z.string().min(1, 'Company name is required'),
      companyNumber: z.string().min(1, 'Company number is required'),
      contactName: z.string().min(1, 'Contact name is required'),
      email: z.string().email('Invalid email address'),
      phone: z.string().min(1, 'Phone number is required'),
      address: z.string().min(1, 'Address is required'),
      city: z.string().min(1, 'City is required'),
      postcode: z.string().min(1, 'Postcode is required'),
      country: z.string().min(1, 'Country is required'),
    })),
    defaultValues: {
      companyName: '',
      companyNumber: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postcode: '',
      country: '',
    },
  });
  
  // Contract form
  const contractForm = useForm<ContractFormData>({
    resolver: zodResolver(z.object({
      title: z.string().min(1, 'Title is required'),
      description: z.string().min(1, 'Description is required'),
      startDate: z.string().min(1, 'Start date is required'),
      endDate: z.string().min(1, 'End date is required'),
      amount: z.string().min(1, 'Amount is required'),
    })),
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      amount: '',
    },
  });
  
  // Beneficiary form
  const beneficiaryForm = useForm<BeneficiaryFormData>({
    resolver: zodResolver(z.object({
      companyName: z.string().min(1, 'Company name is required'),
      companyNumber: z.string().min(1, 'Company number is required'),
      contactName: z.string().min(1, 'Contact name is required'),
      email: z.string().email('Invalid email address'),
      phone: z.string().min(1, 'Phone number is required'),
      address: z.string().min(1, 'Address is required'),
      city: z.string().min(1, 'City is required'),
      postcode: z.string().min(1, 'Postcode is required'),
      country: z.string().min(1, 'Country is required'),
    })),
    defaultValues: {
      companyName: '',
      companyNumber: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postcode: '',
      country: '',
    },
  });
  
  // Load draft from localStorage on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('newProposalDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        if (draft.policyholder) {
          policyholderForm.reset(draft.policyholder);
          setPolicyholderData(draft.policyholder);
        }
        if (draft.contract) {
          contractForm.reset(draft.contract);
          setContractData(draft.contract);
        }
        if (draft.beneficiary) {
          beneficiaryForm.reset(draft.beneficiary);
          setBeneficiaryData(draft.beneficiary);
        }
        if (draft.step) {
          setCurrentStep(draft.step);
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);
  
  // Save draft to localStorage
  const saveDraft = () => {
    const draft = {
      step: currentStep,
      policyholder: policyholderData,
      contract: contractData,
      beneficiary: beneficiaryData,
    };
    localStorage.setItem('newProposalDraft', JSON.stringify(draft));
  };
  
  // Handle policyholder company selection from Creditsafe
  const handlePolicyholderCompanySelect = (company: any) => {
    policyholderForm.setValue('companyName', company.name);
    policyholderForm.setValue('companyNumber', company.number);
    policyholderForm.setValue('address', company.address);
    policyholderForm.setValue('city', company.city);
    policyholderForm.setValue('postcode', company.postcode);
    policyholderForm.setValue('country', company.country);
  };
  
  // Handle beneficiary company selection from Creditsafe
  const handleBeneficiaryCompanySelect = (company: any) => {
    beneficiaryForm.setValue('companyName', company.name);
    beneficiaryForm.setValue('companyNumber', company.number);
    beneficiaryForm.setValue('address', company.address);
    beneficiaryForm.setValue('city', company.city);
    beneficiaryForm.setValue('postcode', company.postcode);
    beneficiaryForm.setValue('country', company.country);
  };
  
  // Handle form submissions
  const handlePolicyholderSubmit = (data: PolicyholderFormData) => {
    setPolicyholderData(data);
    saveDraft();
    setCurrentStep('contract');
  };
  
  const handleContractSubmit = (data: ContractFormData) => {
    setContractData(data);
    saveDraft();
    setCurrentStep('beneficiary');
  };
  
  const handleBeneficiarySubmit = (data: BeneficiaryFormData) => {
    setBeneficiaryData(data);
    saveDraft();
    // Submit the complete proposal
    submitProposal();
  };
  
  // Submit the complete proposal
  const submitProposal = () => {
    // In a real implementation, this would call an API
    console.log('Submitting proposal:', { policyholderData, contractData, beneficiaryData });
    
    // Clear the draft
    localStorage.removeItem('newProposalDraft');
    
    // Redirect to proposals page or show success message
    window.location.href = '/proposals';
  };
  
  if (!canCreateProposal) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">New Proposal</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-yellow-700">You don't have permission to create proposals.</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }
  
  return (
    <ProtectedRoute>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">New Proposal</h1>
        
        {/* Wizard Progress */}
        <div className="mb-8">
          <div className="flex justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0"></div>
            <div
              className="absolute top-4 left-0 h-1 bg-blue-500 z-10 transition-all duration-300"
              style={{
                width: currentStep === 'policyholder' ? '0%' :
                       currentStep === 'contract' ? '50%' :
                       '100%'
              }}
            ></div>
            
            <div className="relative z-20 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'policyholder' ? 'bg-blue-500 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <span className="mt-2 text-sm font-medium">Policyholder</span>
            </div>
            
            <div className="relative z-20 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'contract' ? 'bg-blue-500 text-white' :
                currentStep === 'policyholder' ? 'bg-gray-200 text-gray-500' :
                'bg-blue-500 text-white'
              }`}>
                2
              </div>
              <span className="mt-2 text-sm font-medium">Contract</span>
            </div>
            
            <div className="relative z-20 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'beneficiary' ? 'bg-blue-500 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
              <span className="mt-2 text-sm font-medium">Beneficiary</span>
            </div>
          </div>
        </div>
        
        {/* Policyholder Form */}
        {currentStep === 'policyholder' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Policyholder Information</h2>
            <form onSubmit={policyholderForm.handleSubmit(handlePolicyholderSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="policyholder-company-search">Search Company</Label>
                <CompanySearch
                  onCompanySelect={handlePolicyholderCompanySelect}
                  placeholder="Search for a company..."
                />
              </div>
              
              <div>
                <Label htmlFor="policyholder-companyName">Company Name</Label>
                <Input
                  id="policyholder-companyName"
                  {...policyholderForm.register('companyName')}
                  className={policyholderForm.formState.errors.companyName ? 'border-red-500' : ''}
                />
                {policyholderForm.formState.errors.companyName && (
                  <p className="text-red-500 text-sm mt-1">{policyholderForm.formState.errors.companyName.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="policyholder-companyNumber">Company Number</Label>
                <Input
                  id="policyholder-companyNumber"
                  {...policyholderForm.register('companyNumber')}
                  className={policyholderForm.formState.errors.companyNumber ? 'border-red-500' : ''}
                />
                {policyholderForm.formState.errors.companyNumber && (
                  <p className="text-red-500 text-sm mt-1">{policyholderForm.formState.errors.companyNumber.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="policyholder-contactName">Contact Name</Label>
                  <Input
                    id="policyholder-contactName"
                    {...policyholderForm.register('contactName')}
                    className={policyholderForm.formState.errors.contactName ? 'border-red-500' : ''}
                  />
                  {policyholderForm.formState.errors.contactName && (
                    <p className="text-red-500 text-sm mt-1">{policyholderForm.formState.errors.contactName.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="policyholder-email">Email</Label>
                  <Input
                    id="policyholder-email"
                    type="email"
                    {...policyholderForm.register('email')}
                    className={policyholderForm.formState.errors.email ? 'border-red-500' : ''}
                  />
                  {policyholderForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">{policyholderForm.formState.errors.email.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="policyholder-phone">Phone</Label>
                <Input
                  id="policyholder-phone"
                  {...policyholderForm.register('phone')}
                  className={policyholderForm.formState.errors.phone ? 'border-red-500' : ''}
                />
                {policyholderForm.formState.errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{policyholderForm.formState.errors.phone.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="policyholder-address">Address</Label>
                <Input
                  id="policyholder-address"
                  {...policyholderForm.register('address')}
                  className={policyholderForm.formState.errors.address ? 'border-red-500' : ''}
                />
                {policyholderForm.formState.errors.address && (
                  <p className="text-red-500 text-sm mt-1">{policyholderForm.formState.errors.address.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="policyholder-city">City</Label>
                  <Input
                    id="policyholder-city"
                    {...policyholderForm.register('city')}
                    className={policyholderForm.formState.errors.city ? 'border-red-500' : ''}
                  />
                  {policyholderForm.formState.errors.city && (
                    <p className="text-red-500 text-sm mt-1">{policyholderForm.formState.errors.city.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="policyholder-postcode">Postcode</Label>
                  <Input
                    id="policyholder-postcode"
                    {...policyholderForm.register('postcode')}
                    className={policyholderForm.formState.errors.postcode ? 'border-red-500' : ''}
                  />
                  {policyholderForm.formState.errors.postcode && (
                    <p className="text-red-500 text-sm mt-1">{policyholderForm.formState.errors.postcode.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="policyholder-country">Country</Label>
                  <Input
                    id="policyholder-country"
                    {...policyholderForm.register('country')}
                    className={policyholderForm.formState.errors.country ? 'border-red-500' : ''}
                  />
                  {policyholderForm.formState.errors.country && (
                    <p className="text-red-500 text-sm mt-1">{policyholderForm.formState.errors.country.message}</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between mt-8">
                <Button type="button" variant="outline" onClick={saveDraft}>
                  Save Draft
                </Button>
                <Button type="submit">Next: Contract Information</Button>
              </div>
            </form>
          </div>
        )}
        
        {/* Contract Form */}
        {currentStep === 'contract' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Contract Information</h2>
            <form onSubmit={contractForm.handleSubmit(handleContractSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="contract-title">Proposal Title</Label>
                <Input
                  id="contract-title"
                  {...contractForm.register('title')}
                  className={contractForm.formState.errors.title ? 'border-red-500' : ''}
                />
                {contractForm.formState.errors.title && (
                  <p className="text-red-500 text-sm mt-1">{contractForm.formState.errors.title.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="contract-description">Description</Label>
                <textarea
                  id="contract-description"
                  {...contractForm.register('description')}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md ${
                    contractForm.formState.errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {contractForm.formState.errors.description && (
                  <p className="text-red-500 text-sm mt-1">{contractForm.formState.errors.description.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contract-startDate">Start Date</Label>
                  <Input
                    id="contract-startDate"
                    type="date"
                    {...contractForm.register('startDate')}
                    className={contractForm.formState.errors.startDate ? 'border-red-500' : ''}
                  />
                  {contractForm.formState.errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">{contractForm.formState.errors.startDate.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="contract-endDate">End Date</Label>
                  <Input
                    id="contract-endDate"
                    type="date"
                    {...contractForm.register('endDate')}
                    className={contractForm.formState.errors.endDate ? 'border-red-500' : ''}
                  />
                  {contractForm.formState.errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">{contractForm.formState.errors.endDate.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="contract-amount">Amount</Label>
                <Input
                  id="contract-amount"
                  type="number"
                  step="0.01"
                  {...contractForm.register('amount')}
                  className={contractForm.formState.errors.amount ? 'border-red-500' : ''}
                />
                {contractForm.formState.errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{contractForm.formState.errors.amount.message}</p>
                )}
              </div>
              
              <div className="flex justify-between mt-8">
                <Button type="button" variant="outline" onClick={() => setCurrentStep('policyholder')}>
                  Previous
                </Button>
                <div className="space-x-2">
                  <Button type="button" variant="outline" onClick={saveDraft}>
                    Save Draft
                  </Button>
                  <Button type="submit">Next: Beneficiary Information</Button>
                </div>
              </div>
            </form>
          </div>
        )}
        
        {/* Beneficiary Form */}
        {currentStep === 'beneficiary' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Beneficiary Information</h2>
            <form onSubmit={beneficiaryForm.handleSubmit(handleBeneficiarySubmit)} className="space-y-4">
              <div>
                <Label htmlFor="beneficiary-company-search">Search Company</Label>
                <CompanySearch
                  onCompanySelect={handleBeneficiaryCompanySelect}
                  placeholder="Search for a company..."
                />
              </div>
              
              <div>
                <Label htmlFor="beneficiary-companyName">Company Name</Label>
                <Input
                  id="beneficiary-companyName"
                  {...beneficiaryForm.register('companyName')}
                  className={beneficiaryForm.formState.errors.companyName ? 'border-red-500' : ''}
                />
                {beneficiaryForm.formState.errors.companyName && (
                  <p className="text-red-500 text-sm mt-1">{beneficiaryForm.formState.errors.companyName.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="beneficiary-companyNumber">Company Number</Label>
                <Input
                  id="beneficiary-companyNumber"
                  {...beneficiaryForm.register('companyNumber')}
                  className={beneficiaryForm.formState.errors.companyNumber ? 'border-red-500' : ''}
                />
                {beneficiaryForm.formState.errors.companyNumber && (
                  <p className="text-red-500 text-sm mt-1">{beneficiaryForm.formState.errors.companyNumber.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="beneficiary-contactName">Contact Name</Label>
                  <Input
                    id="beneficiary-contactName"
                    {...beneficiaryForm.register('contactName')}
                    className={beneficiaryForm.formState.errors.contactName ? 'border-red-500' : ''}
                  />
                  {beneficiaryForm.formState.errors.contactName && (
                    <p className="text-red-500 text-sm mt-1">{beneficiaryForm.formState.errors.contactName.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="beneficiary-email">Email</Label>
                  <Input
                    id="beneficiary-email"
                    type="email"
                    {...beneficiaryForm.register('email')}
                    className={beneficiaryForm.formState.errors.email ? 'border-red-500' : ''}
                  />
                  {beneficiaryForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">{beneficiaryForm.formState.errors.email.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="beneficiary-phone">Phone</Label>
                <Input
                  id="beneficiary-phone"
                  {...beneficiaryForm.register('phone')}
                  className={beneficiaryForm.formState.errors.phone ? 'border-red-500' : ''}
                />
                {beneficiaryForm.formState.errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{beneficiaryForm.formState.errors.phone.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="beneficiary-address">Address</Label>
                <Input
                  id="beneficiary-address"
                  {...beneficiaryForm.register('address')}
                  className={beneficiaryForm.formState.errors.address ? 'border-red-500' : ''}
                />
                {beneficiaryForm.formState.errors.address && (
                  <p className="text-red-500 text-sm mt-1">{beneficiaryForm.formState.errors.address.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="beneficiary-city">City</Label>
                  <Input
                    id="beneficiary-city"
                    {...beneficiaryForm.register('city')}
                    className={beneficiaryForm.formState.errors.city ? 'border-red-500' : ''}
                  />
                  {beneficiaryForm.formState.errors.city && (
                    <p className="text-red-500 text-sm mt-1">{beneficiaryForm.formState.errors.city.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="beneficiary-postcode">Postcode</Label>
                  <Input
                    id="beneficiary-postcode"
                    {...beneficiaryForm.register('postcode')}
                    className={beneficiaryForm.formState.errors.postcode ? 'border-red-500' : ''}
                  />
                  {beneficiaryForm.formState.errors.postcode && (
                    <p className="text-red-500 text-sm mt-1">{beneficiaryForm.formState.errors.postcode.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="beneficiary-country">Country</Label>
                  <Input
                    id="beneficiary-country"
                    {...beneficiaryForm.register('country')}
                    className={beneficiaryForm.formState.errors.country ? 'border-red-500' : ''}
                  />
                  {beneficiaryForm.formState.errors.country && (
                    <p className="text-red-500 text-sm mt-1">{beneficiaryForm.formState.errors.country.message}</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between mt-8">
                <Button type="button" variant="outline" onClick={() => setCurrentStep('contract')}>
                  Previous
                </Button>
                <div className="space-x-2">
                  <Button type="button" variant="outline" onClick={saveDraft}>
                    Save Draft
                  </Button>
                  <Button type="submit">Submit Proposal</Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}