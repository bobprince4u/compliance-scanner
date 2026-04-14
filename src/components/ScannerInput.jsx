import React, { useState } from "react";
import { Search } from "lucide-react";

export default function ScannerInput({ onScan, isLoading }) {
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!domain.trim()) {
      setError("Please enter a domain");
      return;
    }

    const cleanDomain = domain
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, "")
      .split("/")[0];

    if (!/^[a-z0-9]([a-z0-9-]*\.)+[a-z]{2,}$/i.test(cleanDomain)) {
      setError("Please enter a valid domain (e.g., example.com)");
      return;
    }

    onScan(cleanDomain);
    setDomain("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Enter domain (e.g., example.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          disabled={isLoading}
          className="w-full px-6 py-4 text-lg border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-500 transition-colors disabled:bg-gray-50"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary-600 hover:text-primary-700 disabled:opacity-50 transition-opacity"
        >
          <Search size={24} />
        </button>
      </div>
      {error && <p className="text-error-600 text-sm mt-2">{error}</p>}
    </form>
  );
}
