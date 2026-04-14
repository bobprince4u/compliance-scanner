import React from "react";
import ComplianceScore from "./ComplianceScore";
import CheckResult from "./CheckResult";
import { Loader } from "lucide-react";

export default function ScanResults({ domain, checks, score, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader className="animate-spin text-primary-600 mb-4" size={32} />
        <p className="text-gray-600">Scanning {domain}...</p>
      </div>
    );
  }

  if (!checks) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <ComplianceScore score={score} domain={domain} />

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">
          Detailed Results
        </h3>
        {Object.entries(checks).map(([checkType, check]) => (
          <CheckResult key={checkType} checkType={checkType} check={check} />
        ))}
      </div>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Next Steps</h4>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>Review failed checks and follow the recommendations</li>
          <li>Update your DNS records as needed</li>
          <li>Implement List-Unsubscribe headers in your email client</li>
          <li>
            Test again after making changes (typically 24-48 hours for DNS
            propagation)
          </li>
        </ul>
      </div>
    </div>
  );
}
