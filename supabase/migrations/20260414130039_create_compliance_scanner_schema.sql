/*
  # Compliance Scanner Database Schema

  1. New Tables
    - `scan_targets` - Target companies (Klaviyo agencies, Shopify brands)
    - `domain_scans` - Results of email compliance checks
    - `compliance_checks` - Individual compliance checks (SPF, DKIM, DMARC, unsubscribe)
    - `scan_history` - Audit trail of scans

  2. Tables Description
    - `scan_targets`:
      - `id` (uuid, primary key)
      - `company_name` (text)
      - `domain` (text, unique)
      - `country` (text) - UK, US, Canada
      - `agency_type` (text) - 'klaviyo_agency', 'shopify_brand', 'shopify_plus'
      - `contact_email` (text)
      - `website` (text)
      - `notes` (text)
      - `created_at` (timestamp)

    - `domain_scans`:
      - `id` (uuid, primary key)
      - `target_id` (uuid, foreign key)
      - `domain` (text)
      - `status` (text) - 'scanning', 'complete', 'failed'
      - `overall_score` (integer, 0-100)
      - `scan_date` (timestamp)
      - `mx_records_valid` (boolean)
      - `dkim_count` (integer)
      - `spf_valid` (boolean)
      - `dmarc_configured` (boolean)
      - `one_click_unsubscribe` (boolean)
      - `raw_data` (jsonb)

    - `compliance_checks`:
      - `id` (uuid, primary key)
      - `scan_id` (uuid, foreign key)
      - `check_type` (text) - 'spf', 'dkim', 'dmarc', 'mx', 'cname', 'list-unsubscribe'
      - `status` (text) - 'pass', 'fail', 'warning', 'info'
      - `detail` (text)
      - `recommendation` (text)

    - `scan_history`:
      - `id` (uuid, primary key)
      - `target_id` (uuid, foreign key)
      - `action` (text)
      - `timestamp` (timestamp)

  3. Security
    - Enable RLS on all tables
    - Public read access for scan results (anyone can view publicly shared scans)
    - No authentication required for now (MVP phase)
*/

CREATE TABLE IF NOT EXISTS scan_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  domain text UNIQUE NOT NULL,
  country text NOT NULL CHECK (country IN ('UK', 'US', 'Canada')),
  agency_type text NOT NULL CHECK (agency_type IN ('klaviyo_agency', 'shopify_brand', 'shopify_plus')),
  contact_email text,
  website text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS domain_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_id uuid REFERENCES scan_targets(id) ON DELETE CASCADE,
  domain text NOT NULL,
  status text DEFAULT 'scanning' CHECK (status IN ('scanning', 'complete', 'failed')),
  overall_score integer DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
  scan_date timestamptz DEFAULT now(),
  mx_records_valid boolean DEFAULT false,
  dkim_count integer DEFAULT 0,
  spf_valid boolean DEFAULT false,
  dmarc_configured boolean DEFAULT false,
  one_click_unsubscribe boolean DEFAULT false,
  raw_data jsonb,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS compliance_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id uuid REFERENCES domain_scans(id) ON DELETE CASCADE,
  check_type text NOT NULL CHECK (check_type IN ('spf', 'dkim', 'dmarc', 'mx', 'cname', 'list-unsubscribe')),
  status text NOT NULL CHECK (status IN ('pass', 'fail', 'warning', 'info')),
  detail text,
  recommendation text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scan_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_id uuid REFERENCES scan_targets(id) ON DELETE CASCADE,
  action text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_domain_scans_target_id ON domain_scans(target_id);
CREATE INDEX idx_domain_scans_domain ON domain_scans(domain);
CREATE INDEX idx_compliance_checks_scan_id ON compliance_checks(scan_id);
CREATE INDEX idx_scan_history_target_id ON scan_history(target_id);
CREATE INDEX idx_scan_targets_country ON scan_targets(country);
CREATE INDEX idx_scan_targets_agency_type ON scan_targets(agency_type);

-- Enable RLS
ALTER TABLE scan_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow public read for now (MVP)
CREATE POLICY "Public can view scan targets"
  ON scan_targets FOR SELECT
  USING (true);

CREATE POLICY "Public can view domain scans"
  ON domain_scans FOR SELECT
  USING (true);

CREATE POLICY "Public can view compliance checks"
  ON compliance_checks FOR SELECT
  USING (true);

CREATE POLICY "Public can view scan history"
  ON scan_history FOR SELECT
  USING (true);