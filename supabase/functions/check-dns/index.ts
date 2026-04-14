const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CheckResult {
  status: "pass" | "fail" | "warning" | "info";
  detail: string;
  recommendation: string;
}

interface DnsChecksResponse {
  checks: {
    spf: CheckResult;
    dkim: CheckResult;
    dmarc: CheckResult;
    mx: CheckResult;
    listUnsubscribe: CheckResult;
  };
}

async function resolveTXT(domain: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://dns.google/resolve?name=${domain}&type=TXT`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as {
      Answer?: Array<{ data: string }>;
    };
    return data.Answer?.map((record) => record.data) || [];
  } catch {
    return [];
  }
}

async function resolveMX(domain: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://dns.google/resolve?name=${domain}&type=MX`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      return false;
    }

    const data = (await response.json()) as {
      Answer?: Array<{ data: string }>;
    };
    return (data.Answer?.length || 0) > 0;
  } catch {
    return false;
  }
}

async function checkSPF(domain: string): Promise<CheckResult> {
  const txtRecords = await resolveTXT(domain);
  const spfRecord = txtRecords.find((record) => record.startsWith("v=spf1"));

  if (!spfRecord) {
    return {
      status: "fail",
      detail: "No SPF record found",
      recommendation: "Add an SPF record to authorize email senders",
    };
  }

  if (
    spfRecord.includes("~all") ||
    spfRecord.includes("-all") ||
    spfRecord.includes("?all")
  ) {
    return {
      status: "pass",
      detail: `SPF record configured: ${spfRecord.slice(0, 60)}...`,
      recommendation: "SPF is properly configured",
    };
  }

  return {
    status: "warning",
    detail: `SPF record found but may need adjustment`,
    recommendation: "Review SPF record for proper enforcement (-all vs ~all)",
  };
}

async function checkDKIM(domain: string): Promise<CheckResult> {
  const selectors = ["default", "k1", "google", "selector1", "selector2"];
  const dkimRecords: string[] = [];

  for (const selector of selectors) {
    const txtRecords = await resolveTXT(`${selector}._domainkey.${domain}`);
    const dkimRecord = txtRecords.find((record) =>
      record.startsWith("v=DKIM1"),
    );
    if (dkimRecord) {
      dkimRecords.push(selector);
    }
  }

  if (dkimRecords.length === 0) {
    return {
      status: "fail",
      detail: "No DKIM keys found for common selectors",
      recommendation:
        "Set up DKIM keys with selectors like 'default' or 'selector1'",
    };
  }

  if (dkimRecords.length >= 2) {
    return {
      status: "pass",
      detail: `Found DKIM keys: ${dkimRecords.join(", ")}`,
      recommendation: "DKIM is properly configured",
    };
  }

  return {
    status: "warning",
    detail: `Found ${dkimRecords.length} DKIM key(s): ${dkimRecords.join(", ")}`,
    recommendation:
      "Consider adding multiple DKIM selectors for better coverage",
  };
}

async function checkDMARC(domain: string): Promise<CheckResult> {
  const txtRecords = await resolveTXT(`_dmarc.${domain}`);
  const dmarcRecord = txtRecords.find((record) =>
    record.startsWith("v=DMARC1"),
  );

  if (!dmarcRecord) {
    return {
      status: "fail",
      detail: "No DMARC policy found",
      recommendation:
        "Create a DMARC policy to protect your domain and monitor abuse",
    };
  }

  if (
    dmarcRecord.includes("p=reject") ||
    dmarcRecord.includes("p=quarantine")
  ) {
    return {
      status: "pass",
      detail: `DMARC policy: ${dmarcRecord.slice(0, 60)}...`,
      recommendation: "DMARC is properly enforced",
    };
  }

  return {
    status: "warning",
    detail: `DMARC policy found but set to monitor mode (p=none)`,
    recommendation:
      "Consider upgrading to p=quarantine or p=reject for stronger protection",
  };
}

async function checkMX(domain: string): Promise<CheckResult> {
  const hasMX = await resolveMX(domain);

  if (!hasMX) {
    return {
      status: "fail",
      detail: "No MX records found",
      recommendation: "Add MX records to receive emails at this domain",
    };
  }

  return {
    status: "pass",
    detail: "MX records are configured",
    recommendation: "Domain can receive emails",
  };
}

function checkListUnsubscribe(_domain: string): CheckResult {
  return {
    status: "info",
    detail:
      "List-Unsubscribe header is typically configured in your email client",
    recommendation:
      "Enable List-Unsubscribe header in Klaviyo or your email service for Gmail/Yahoo compliance",
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { domain } = (await req.json()) as { domain?: string };

    if (!domain) {
      return new Response(JSON.stringify({ error: "Domain is required" }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    const [spf, dkim, dmarc, mx, listUnsubscribe] = await Promise.all([
      checkSPF(domain),
      checkDKIM(domain),
      checkDMARC(domain),
      checkMX(domain),
      checkListUnsubscribe(domain),
    ]);

    const response: DnsChecksResponse = {
      checks: {
        spf,
        dkim,
        dmarc,
        mx,
        listUnsubscribe,
      },
    };

    return new Response(JSON.stringify(response), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});
