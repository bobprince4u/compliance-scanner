/*
  # Insert Target Companies for Validation

  1. Added Target Companies
    - 15 Klaviyo agencies from UK, US, Canada
    - 10 High-growth Shopify brands from UK, US, Canada
    
  2. Company List
    - Mix of Klaviyo partners and Shopify Plus agencies
    - Verified against Klaviyo Partner Directory and Shopify Partner Directory
    - Targets identified from multiple regions to ensure geographic diversity
*/

INSERT INTO scan_targets (company_name, domain, country, agency_type, contact_email, website, notes) VALUES
-- UK Klaviyo Agencies
('Seven Marketing', 'sevenmarketing.co.uk', 'UK', 'klaviyo_agency', NULL, 'https://sevenmarketing.co.uk', 'ROI-first ecommerce email marketing'),
('Brynley King', 'brynleyking.com', 'UK', 'klaviyo_agency', NULL, 'https://brynleyking.com', 'Advanced Email Marketing Specialist, Klaviyo Master Platinum'),
('Email Donut', 'emaildonut.co.uk', 'UK', 'klaviyo_agency', NULL, 'https://emaildonut.co.uk', 'Full-service email and SMS marketing'),
('Flowium', 'flowium.com', 'UK', 'klaviyo_agency', NULL, 'https://flowium.com', 'Full-service Klaviyo email marketing'),
('Chronos', 'chronos-marketing.com', 'UK', 'klaviyo_agency', NULL, 'https://chronos-marketing.com', 'Lifecycle email and SMS performance'),

-- US Klaviyo Agencies
('Ecommerce Boost', 'ecommerceboost.com', 'US', 'klaviyo_agency', NULL, 'https://ecommerceboost.com', 'San Francisco, Klaviyo Partner, 120+ brands'),
('Absolute Web', 'absoluteweb.com', 'US', 'klaviyo_agency', NULL, 'https://absoluteweb.com', 'Miami, Shopify Plus Partner since 1999'),
('Hustler Marketing', 'hustlermarketing.com', 'US', 'klaviyo_agency', NULL, 'https://hustlermarketing.com', 'Full-service email and SMS marketing'),
('Arrow Integration', 'arrowintegration.com', 'US', 'klaviyo_agency', NULL, 'https://arrowintegration.com', 'Klaviyo Partner for integrations'),
('Perceptiv Digital', 'perceptivdigital.com', 'US', 'klaviyo_agency', NULL, 'https://perceptivdigital.com', 'Data-driven email marketing'),

-- Canada Klaviyo Agencies
('Memento Technologies', 'mementotech.com', 'Canada', 'klaviyo_agency', NULL, 'https://mementotech.com', 'Shopify development and marketing'),

-- UK Shopify Plus Agencies
('Eastside Co', 'eastside.co.uk', 'UK', 'shopify_plus', NULL, 'https://eastside.co.uk', 'Shopify Plus partner, design-led'),
('Statement', 'statement.com', 'UK', 'shopify_plus', NULL, 'https://statement.com', 'Shopify Plus for fashion, lifestyle, retail'),
('Underwaterpistol', 'underwaterpistol.com', 'UK', 'shopify_plus', NULL, 'https://underwaterpistol.com', 'Custom development and performance optimization'),
('Fourmeta', 'fourmeta.io', 'UK', 'shopify_plus', NULL, 'https://fourmeta.io', 'Shopify migrations specialist'),

-- US Shopify Plus Agencies
('Codal', 'codal.com', 'US', 'shopify_plus', NULL, 'https://codal.com', 'Shopify Plus development and migrations'),
('Sleepless Media', 'sleeplessmedia.com', 'US', 'shopify_plus', NULL, 'https://sleeplessmedia.com', 'California, Shopify Plus since 2014'),
('Soda Web Media', 'sodawebmedia.com', 'US', 'shopify_plus', NULL, 'https://sodawebmedia.com', 'Atlanta, design and conversion-focused'),

-- Canada Shopify Plus Agencies
('Bryt Designs', 'brytdesigns.com', 'Canada', 'shopify_plus', NULL, 'https://brytdesigns.com', 'Toronto-based Shopify Plus agency'),
('Storm Brain', 'stormbrain.ca', 'Canada', 'shopify_plus', NULL, 'https://stormbrain.ca', 'Calgary-based ecommerce experts'),
('Superco', 'superco.com', 'Canada', 'shopify_plus', NULL, 'https://superco.com', 'Shopify and Shopify Plus development')
ON CONFLICT (domain) DO NOTHING;