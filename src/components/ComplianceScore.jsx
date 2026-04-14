import React from "react";
import {
  CircleAlert as AlertCircle,
  CircleCheck as CheckCircle2,
  TriangleAlert as AlertTriangle,
} from "lucide-react";

export default function ComplianceScore({ score, domain }) {
  const getScoreColor = (score) => {
    if (score >= 80) return "text-success-600";
    if (score >= 60) return "text-warning-600";
    return "text-error-600";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-success-50 border-success-200";
    if (score >= 60) return "bg-warning-50 border-warning-200";
    return "bg-error-50 border-error-200";
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return "Good compliance score";
    if (score >= 60) return "Moderate - needs improvement";
    return "Poor compliance score";
  };

  return (
    <div className={`border-2 rounded-lg p-6 ${getScoreBg(score)}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600">Domain: {domain}</p>
          <h3 className="text-lg font-semibold text-gray-900">
            Compliance Score
          </h3>
        </div>
        <div className="text-right">
          <div className={`text-5xl font-bold ${getScoreColor(score)}`}>
            {score}
          </div>
          <p className="text-sm text-gray-600">out of 100</p>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-700">
        {getScoreMessage(score)}
      </p>
    </div>
  );
}
