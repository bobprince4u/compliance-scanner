export const checkDomainCompliance = async (domain) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-dns`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ domain }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to check domain");
    }

    const data = await response.json();
    return data.checks;
  } catch (error) {
    console.error("DNS check error:", error);
    return {
      spf: {
        status: "error",
        detail: "Unable to check SPF",
        recommendation: "Verify domain is valid",
      },
      dkim: {
        status: "error",
        detail: "Unable to check DKIM",
        recommendation: "Verify domain is valid",
      },
      dmarc: {
        status: "error",
        detail: "Unable to check DMARC",
        recommendation: "Verify domain is valid",
      },
      mx: {
        status: "error",
        detail: "Unable to check MX records",
        recommendation: "Verify domain is valid",
      },
      listUnsubscribe: {
        status: "error",
        detail: "Unable to check List-Unsubscribe",
        recommendation: "Verify domain is valid",
      },
    };
  }
};

export const calculateComplianceScore = (checks) => {
  const weights = {
    spf: 0.2,
    dkim: 0.2,
    dmarc: 0.2,
    mx: 0.2,
    listUnsubscribe: 0.2,
  };

  let score = 0;
  let totalWeight = 0;

  Object.entries(checks).forEach(([key, check]) => {
    const weight = weights[key] || 0;
    if (check.status === "pass") {
      score += 100 * weight;
    } else if (check.status === "warning") {
      score += 50 * weight;
    }
    totalWeight += weight;
  });

  return Math.round(score / totalWeight);
};
