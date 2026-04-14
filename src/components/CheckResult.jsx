import React from "react";
import {
  CircleCheck as CheckCircle2,
  TriangleAlert as AlertTriangle,
  CircleAlert as AlertCircle,
  Info,
} from "lucide-react";

export default function CheckResult({ checkType, check }) {
  const getIcon = (status) => {
    switch (status) {
      case "pass":
        return <CheckCircle2 size={20} className="text-success-600" />;
      case "warning":
        return <AlertTriangle size={20} className="text-warning-600" />;
      case "fail":
        return <AlertCircle size={20} className="text-error-600" />;
      default:
        return <Info size={20} className="text-primary-600" />;
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case "pass":
        return "bg-success-50 border-success-200";
      case "warning":
        return "bg-warning-50 border-warning-200";
      case "fail":
        return "bg-error-50 border-error-200";
      default:
        return "bg-primary-50 border-primary-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pass":
        return "text-success-900";
      case "warning":
        return "text-warning-900";
      case "fail":
        return "text-error-900";
      default:
        return "text-primary-900";
    }
  };

  const getCheckLabel = (type) => {
    const labels = {
      spf: "SPF Record",
      dkim: "DKIM Keys",
      dmarc: "DMARC Policy",
      mx: "MX Records",
      listUnsubscribe: "List-Unsubscribe Header",
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pass: "Pass",
      warning: "Warning",
      fail: "Failed",
      info: "Info",
    };
    return labels[status] || status;
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${getStatusBg(check.status)}`}>
      <div className="flex items-start gap-3 mb-2">
        <div className="mt-0.5">{getIcon(check.status)}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">
              {getCheckLabel(checkType)}
            </h4>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded ${getStatusText(check.status)}`}
            >
              {getStatusLabel(check.status)}
            </span>
          </div>
          {check.detail && (
            <p className="text-sm text-gray-700 mb-2">{check.detail}</p>
          )}
          {check.recommendation && (
            <p className="text-sm font-medium text-gray-700">
              Recommendation: {check.recommendation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
