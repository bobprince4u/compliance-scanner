import React, { useState } from "react";
import { Mail } from "lucide-react";
import ScannerInput from "./components/ScannerInput";
import ScanResults from "./components/ScanResults";
import {
  checkDomainCompliance,
  calculateComplianceScore,
} from "./utils/dnsChecker";

export default function App() {
  const [domain, setDomain] = useState("");
  const [checks, setChecks] = useState(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);

  const handleScan = async (domainToScan) => {
    setDomain(domainToScan);
    setIsLoading(true);
    setChecks(null);

    const result = await checkDomainCompliance(domainToScan);
    const calculatedScore = calculateComplianceScore(result);

    setChecks(result);
    setScore(calculatedScore);
    setIsLoading(false);

    setScanHistory((prev) =>
      [
        {
          domain: domainToScan,
          score: calculatedScore,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev,
      ].slice(0, 5),
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail className="text-primary-600" size={32} />
            <h1 className="text-4xl font-bold text-gray-900">
              Email Compliance Scanner
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Check SPF, DKIM, DMARC, and List-Unsubscribe compliance in 60
            seconds
          </p>
        </div>

        <div className="mb-12">
          <ScannerInput onScan={handleScan} isLoading={isLoading} />
        </div>

        {domain && (
          <ScanResults
            domain={domain}
            checks={checks}
            score={score}
            isLoading={isLoading}
          />
        )}

        {scanHistory.length > 0 && (
          <div className="mt-12 w-full max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Scans
            </h3>
            <div className="space-y-2">
              {scanHistory.map((scan, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 transition-colors cursor-pointer"
                  onClick={() => handleScan(scan.domain)}
                >
                  <div>
                    <p className="font-medium text-gray-900">{scan.domain}</p>
                    <p className="text-xs text-gray-500">{scan.timestamp}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold text-lg ${scan.score >= 80 ? "text-success-600" : scan.score >= 60 ? "text-warning-600" : "text-error-600"}`}
                    >
                      {scan.score}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Why This Matters
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Gmail & Yahoo Enforcement
              </h4>
              <p className="text-sm text-gray-600">
                Gmail and Yahoo require SPF/DKIM alignment and List-Unsubscribe
                headers for bulk senders. Non-compliance risks your emails
                landing in spam.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Deliverability</h4>
              <p className="text-sm text-gray-600">
                Proper authentication records improve inbox placement rates and
                reduce bounce rates for your email campaigns.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Trust & Compliance
              </h4>
              <p className="text-sm text-gray-600">
                DMARC policies protect your domain from spoofing and phishing
                attempts while demonstrating security to recipients.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
