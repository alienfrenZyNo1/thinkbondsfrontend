"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { useAuthData } from "@/lib/auth-hooks";
import { UserRole } from "@/lib/roles";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

// Define types
interface DueDiligenceSettings {
  brokerReports: string[];
  policyholderReports: string[];
  beneficiaryReports: string[];
}

interface UnderwritingSettings {
  defaultRates: string[];
}

interface BondLimitsSettings {
  minAmount: string;
  maxAmount: string;
}

interface AutomationSettings {
  rules: string[];
}

interface WholesalerSettings {
  dueDiligence: DueDiligenceSettings;
  underwriting: UnderwritingSettings;
  bondLimits: BondLimitsSettings;
  automation: AutomationSettings;
}

// Mock data fetching function
async function fetchWholesalerSettings(): Promise<WholesalerSettings> {
  // In a real implementation, this would call an API
  await new Promise(resolve => setTimeout(resolve, 500));
  const response = await fetch('/api/settings/wholesaler');
  if (!response.ok) {
    throw new Error('Failed to fetch wholesaler settings');
  }
  return await response.json();
}

// Mock data updating function
async function updateWholesalerSettings(data: WholesalerSettings) {
  // In a real implementation, this would call an API
  await new Promise(resolve => setTimeout(resolve, 500));
  const response = await fetch('/api/settings/wholesaler', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update wholesaler settings');
  }
  return await response.json();
}

export default function WholesalerSettingsPage() {
  const { groups } = useAuthData();
  const queryClient = useQueryClient();
  
  // Check if user has access to view/edit wholesaler settings
  const canViewSettings = groups.includes(UserRole.ADMIN) || groups.includes(UserRole.WHOLESALE);
  const canEditSettings = groups.includes(UserRole.ADMIN) || (groups.includes(UserRole.WHOLESALE) && groups.includes('master')); // Assuming 'master' is a special role for master users
  
  // Fetch wholesaler settings
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['wholesalerSettings'],
    queryFn: fetchWholesalerSettings,
    enabled: canViewSettings,
  });

  // Mutation for updating settings
  const mutation = useMutation({
    mutationFn: updateWholesalerSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wholesalerSettings'] });
    },
  });

  // Form state
  const [dueDiligence, setDueDiligence] = useState<DueDiligenceSettings>({
    brokerReports: [],
    policyholderReports: [],
    beneficiaryReports: [],
  });
  
  const [underwriting, setUnderwriting] = useState<UnderwritingSettings>({
    defaultRates: [],
  });
  
  const [bondLimits, setBondLimits] = useState<BondLimitsSettings>({
    minAmount: '',
    maxAmount: '',
  });
  
  const [automation, setAutomation] = useState<AutomationSettings>({
    rules: [],
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: WholesalerSettings = {
      dueDiligence,
      underwriting,
      bondLimits,
      automation,
    };
    mutation.mutate(data);
  };

  if (!canViewSettings) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Wholesaler Settings</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-yellow-700">You don't have permission to view wholesaler settings.</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Wholesaler Settings</h1>
        
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
            <p className="text-red-700">Error loading settings: {(error as Error).message}</p>
          </div>
        )}
        
        {settings && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Due Diligence Configuration */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Due Diligence Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Broker Reports</Label>
                  <Input
                    placeholder="Enter broker reports (comma separated)"
                    value={dueDiligence.brokerReports.join(', ')}
                    onChange={(e) => setDueDiligence({
                      ...dueDiligence,
                      brokerReports: e.target.value.split(',').map(item => item.trim()).filter(item => item) as string[]
                    })}
                  />
                </div>
                
                <div>
                  <Label className="font-medium">Policyholder Reports</Label>
                  <Input
                    placeholder="Enter policyholder reports (comma separated)"
                    value={dueDiligence.policyholderReports.join(', ')}
                    onChange={(e) => setDueDiligence({
                      ...dueDiligence,
                      policyholderReports: e.target.value.split(',').map(item => item.trim()).filter(item => item) as string[]
                    })}
                  />
                </div>
                
                <div>
                  <Label className="font-medium">Beneficiary Reports</Label>
                  <Input
                    placeholder="Enter beneficiary reports (comma separated)"
                    value={dueDiligence.beneficiaryReports.join(', ')}
                    onChange={(e) => setDueDiligence({
                      ...dueDiligence,
                      beneficiaryReports: e.target.value.split(',').map(item => item.trim()).filter(item => item) as string[]
                    })}
                  />
                </div>
              </div>
            </div>
            
            {/* Underwriting Percentages */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Underwriting Percentages</h2>
              
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Default Rates</Label>
                  <Input
                    placeholder="Enter default rates (comma separated)"
                    value={underwriting.defaultRates.join(', ')}
                    onChange={(e) => setUnderwriting({
                      ...underwriting,
                      defaultRates: e.target.value.split(',').map(item => item.trim()).filter(item => item) as string[]
                    })}
                  />
                </div>
              </div>
            </div>
            
            {/* Bond Limits */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Bond Limits</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minAmount" className="font-medium">Minimum Amount</Label>
                  <Input
                    id="minAmount"
                    type="number"
                    placeholder="Enter minimum amount"
                    value={bondLimits.minAmount}
                    onChange={(e) => setBondLimits({
                      ...bondLimits,
                      minAmount: e.target.value
                    })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="maxAmount" className="font-medium">Maximum Amount</Label>
                  <Input
                    id="maxAmount"
                    type="number"
                    placeholder="Enter maximum amount"
                    value={bondLimits.maxAmount}
                    onChange={(e) => setBondLimits({
                      ...bondLimits,
                      maxAmount: e.target.value
                    })}
                  />
                </div>
              </div>
            </div>
            
            {/* Automation Rules Configuration */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Automation Rules Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Automation Rules</Label>
                  <Input
                    placeholder="Enter automation rules (comma separated)"
                    value={automation.rules.join(', ')}
                    onChange={(e) => setAutomation({
                      ...automation,
                      rules: e.target.value.split(',').map(item => item.trim()).filter(item => item) as string[]
                    })}
                  />
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            {canEditSettings && (
              <div className="flex justify-end">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            )}
            
            {mutation.isSuccess && (
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <p className="text-green-700">Settings saved successfully!</p>
              </div>
            )}
            
            {mutation.isError && (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <p className="text-red-700">Error saving settings: {(mutation.error as Error).message}</p>
              </div>
            )}
          </form>
        )}
      </div>
    </ProtectedRoute>
  );
}