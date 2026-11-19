-- Enquiries from the website form (/enquire), stored in Cloudflare D1.
CREATE TABLE IF NOT EXISTS leads (
  id          TEXT PRIMARY KEY,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  email       TEXT,
  location    TEXT NOT NULL,
  plot        TEXT,
  start_when  TEXT,
  model       TEXT,
  message     TEXT,
  whatsapp    INTEGER NOT NULL DEFAULT 1,
  -- where the lead came from
  page        TEXT,
  referrer    TEXT,
  utm_source  TEXT,
  utm_medium  TEXT,
  utm_campaign TEXT,
  country     TEXT,
  city        TEXT,
  -- for spam control and follow-up
  ip_hash     TEXT,
  status      TEXT NOT NULL DEFAULT 'new'  -- new | contacted | closed
);
CREATE INDEX IF NOT EXISTS leads_created ON leads (created_at);
CREATE INDEX IF NOT EXISTS leads_ip ON leads (ip_hash, created_at);
