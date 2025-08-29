"use client";

import { Button } from "@/components/ui/button";

interface BondCertificateProps {
  offer: any;
  policyholder: any;
  beneficiary: any;
}

export function BondCertificate({ offer, policyholder, beneficiary }: BondCertificateProps) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">BOND CERTIFICATE</h1>
        <p className="text-gray-600">This is to certify that the following bond has been issued</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Bond Details</h2>
          <div className="space-y-3">
            <div>
              <label className="font-medium">Bond Amount:</label>
              <p className="text-lg font-bold">${offer.bondAmount}</p>
            </div>
            <div>
              <label className="font-medium">Premium:</label>
              <p>${offer.premium}</p>
            </div>
            <div>
              <label className="font-medium">Effective Date:</label>
              <p>{new Date(offer.effectiveDate).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="font-medium">Expiry Date:</label>
              <p>{new Date(offer.expiryDate).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="font-medium">Bond ID:</label>
              <p>{offer.id}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Parties</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900">Policyholder</h3>
              <p className="font-bold">{policyholder.companyName}</p>
              <p>{policyholder.contactName}</p>
              <p>{policyholder.email}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Beneficiary</h3>
              <p className="font-bold">{beneficiary.companyName}</p>
              <p>{beneficiary.contactName}</p>
              <p>{beneficiary.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Terms and Conditions</h2>
        <div className="bg-gray-50 p-4 rounded">
          <p className="whitespace-pre-wrap">{offer.terms}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">Issued by:</p>
            <p className="font-bold">ThinkBonds Wholesaler</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Date of Issue:</p>
            <p>{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button onClick={() => window.print()}>Print Certificate</Button>
      </div>
    </div>
  );
}