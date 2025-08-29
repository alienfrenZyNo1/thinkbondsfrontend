"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { CreditsafeAPI } from "@/lib/creditsafe";
import type { CreditsafeCompany } from "@/lib/creditsafe";

interface CreditsafeSearchProps {
  onCompanySelect: (company: CreditsafeCompany) => void;
  placeholder?: string;
}

export function CreditsafeSearch({ onCompanySelect, placeholder = "Search for a company..." }: CreditsafeSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<CreditsafeCompany[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const creditsafeAPI = new CreditsafeAPI(process.env.CREDITSafe_API_KEY || "");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults([]);
      setShowResults(false);
      setError(null);
      return;
    }

    const debounceTimer = setTimeout(() => {
      searchCompanies();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const searchCompanies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const searchResults = await creditsafeAPI.searchCompanies(searchTerm);
      setResults(searchResults);
      setShowResults(true);
    } catch (error: any) {
      console.error("Error searching companies:", error);
      setError(error.message || "Failed to search companies. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (company: CreditsafeCompany) => {
    setSearchTerm(company.name);
    setShowResults(false);
    onCompanySelect(company);
  };

  return (
    <div ref={searchRef} className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
        className="w-full"
      />
      
      {showResults && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : results.length > 0 ? (
            results.map((company) => (
              <div
                key={company.id}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleSelect(company)}
              >
                <div className="font-medium">{company.name}</div>
                <div className="text-sm text-gray-500">{company.number} - {company.city}, {company.country}</div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No companies found</div>
          )}
        </div>
      )}
    </div>
  );
}