"use client";

import { useState, useEffect } from "react";
import { CreditsafeAPI } from "@/lib/creditsafe";
import type { CreditsafeReport } from "@/lib/creditsafe";

interface CreditsafeReportProps {
  companyId: string;
  companyName?: string;
}

export function CreditsafeReport({ companyId, companyName }: CreditsafeReportProps) {
  const [report, setReport] = useState<CreditsafeReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!companyId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const creditsafeAPI = new CreditsafeAPI(process.env.CREDITSafe_API_KEY || "");
        const reportData = await creditsafeAPI.getCompanyReport(companyId);
        setReport(reportData);
      } catch (err) {
        console.error("Error fetching Creditsafe report:", err);
        setError("Failed to load credit report. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [companyId]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-red-200 rounded p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
        <p className="text-yellow-700">No credit report available for this company.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        Credit Report for {companyName || report.companyName}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Company Information</h3>
          <div className="space-y-2">
            <div>
              <label className="font-medium">Company Name:</label>
              <p>{report.companyName}</p>
            </div>
            <div>
              <label className="font-medium">Registration Number:</label>
              <p>{report.registrationNumber}</p>
            </div>
            <div>
              <label className="font-medium">Status:</label>
              <p>{report.status}</p>
            </div>
            <div>
              <label className="font-medium">Legal Form:</label>
              <p>{report.legalForm}</p>
            </div>
            <div>
              <label className="font-medium">Incorporation Date:</label>
              <p>{new Date(report.incorporationDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Address</h3>
          <div className="space-y-2">
            <div>
              <label className="font-medium">Address:</label>
              <p>{report.address}</p>
            </div>
            <div>
              <label className="font-medium">City:</label>
              <p>{report.city}</p>
            </div>
            <div>
              <label className="font-medium">Postcode:</label>
              <p>{report.postcode}</p>
            </div>
            <div>
              <label className="font-medium">Country:</label>
              <p>{report.country}</p>
            </div>
          </div>
        </div>
        
        {report.financialSummary && (
          <div>
            <h3 className="text-lg font-medium mb-3">Financial Summary</h3>
            <div className="space-y-2">
              <div>
                <label className="font-medium">Currency:</label>
                <p>{report.financialSummary.currency}</p>
              </div>
              <div>
                <label className="font-medium">Revenue:</label>
                <p>{report.financialSummary.currency} {report.financialSummary.revenue.toLocaleString()}</p>
              </div>
              <div>
                <label className="font-medium">Profit:</label>
                <p>{report.financialSummary.currency} {report.financialSummary.profit.toLocaleString()}</p>
              </div>
              <div>
                <label className="font-medium">Equity:</label>
                <p>{report.financialSummary.currency} {report.financialSummary.equity.toLocaleString()}</p>
              </div>
              <div>
                <label className="font-medium">Employees:</label>
                <p>{report.financialSummary.employees.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
        
        {report.creditScore && (
          <div>
            <h3 className="text-lg font-medium mb-3">Credit Score</h3>
            <div className="space-y-2">
              <div>
                <label className="font-medium">Score:</label>
                <p>{report.creditScore.score}/100</p>
              </div>
              <div>
                <label className="font-medium">Rating:</label>
                <p>{report.creditScore.rating}</p>
              </div>
              <div>
                <label className="font-medium">Credit Limit:</label>
                <p>{report.financialSummary?.currency || 'USD'} {report.creditScore.limit.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}