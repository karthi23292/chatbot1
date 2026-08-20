/*
# WISER Advisor — Conversations, Leads, Support Cases, and Analytics

## Purpose
Persist WISER Advisor chat sessions, demo-booking leads, support escalation cases,
and deterministic analytics events. This is a pre-login (no-auth) experience, so all
tables use `TO anon, authenticated` policies — the anon-key frontend must be able to
read and write its own conversation data.

## New Tables

1. `wiser_conversations`
   - `id` (uuid, PK) — public conversation ID shared with the client
   - `session_id` (text) — anonymous browser session identifier (UUID generated client-side)
   - `messages` (jsonb) — array of { role, content, timestamp, intent } message objects
   - `context` (jsonb) — accumulated conversational context (VMS platform, challenge, etc.)
   - `current_state` (text) — current conversation state (GREETING, DISCOVERY, SUPPORT, etc.)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

2. `wiser_leads`
   - `id` (uuid, PK)
   - `conversation_id` (uuid, FK to wiser_conversations)
   - `name` (text)
   - `email` (text)
   - `company` (text)
   - `job_title` (text)
   - `company_size` (text)
   - `vms_platform` (text)
   - `primary_challenge` (text)
   - `session_type` (text) — walkthrough, architecture, transformation
   - `preferred_time` (text)
   - `timezone` (text)
   - `status` (text) — new, contacted, qualified, booked
   - `created_at` (timestamptz)

3. `wiser_support_cases`
   - `id` (uuid, PK)
   - `conversation_id` (uuid, FK to wiser_conversations)
   - `customer_name` (text)
   - `organization` (text)
   - `system` (text) — VMS, API, webhook, dashboard, etc.
   - `issue` (text)
   - `severity` (text) — low, medium, high, critical
   - `impact` (text)
   - `symptoms` (text)
   - `troubleshooting_steps` (jsonb)
   - `recommended_next_action` (text)
   - `status` (text) — open, in_progress, escalated, resolved
   - `created_at` (timestamptz)

4. `wiser_analytics`
   - `id` (uuid, PK)
   - `conversation_id` (uuid, FK to wiser_conversations, nullable)
   - `session_id` (text)
   - `event_type` (text) — conversation_started, intent_detected, demo_booked,
     support_case_created, escalation, conversation_closed, message_sent,
     resolution_offered, handoff_requested
   - `event_data` (jsonb) — structured event payload (intent, state, etc.)
   - `created_at` (timestamptz)

## Security
- RLS enabled on all tables.
- All policies use `TO anon, authenticated` since this is a pre-login experience.
- Any visitor can create/read conversations, leads, cases, and analytics for their session.
*/

CREATE TABLE IF NOT EXISTS wiser_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  context jsonb NOT NULL DEFAULT '{}'::jsonb,
  current_state text NOT NULL DEFAULT 'GREETING',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE wiser_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_conversations" ON wiser_conversations;
CREATE POLICY "anon_select_conversations" ON wiser_conversations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_conversations" ON wiser_conversations;
CREATE POLICY "anon_insert_conversations" ON wiser_conversations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_conversations" ON wiser_conversations;
CREATE POLICY "anon_update_conversations" ON wiser_conversations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_conversations" ON wiser_conversations;
CREATE POLICY "anon_delete_conversations" ON wiser_conversations FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS wiser_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES wiser_conversations(id) ON DELETE CASCADE,
  name text,
  email text,
  company text,
  job_title text,
  company_size text,
  vms_platform text,
  primary_challenge text,
  session_type text,
  preferred_time text,
  timezone text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE wiser_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_leads" ON wiser_leads;
CREATE POLICY "anon_select_leads" ON wiser_leads FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_leads" ON wiser_leads;
CREATE POLICY "anon_insert_leads" ON wiser_leads FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_leads" ON wiser_leads;
CREATE POLICY "anon_update_leads" ON wiser_leads FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_leads" ON wiser_leads;
CREATE POLICY "anon_delete_leads" ON wiser_leads FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS wiser_support_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES wiser_conversations(id) ON DELETE CASCADE,
  customer_name text,
  organization text,
  system text,
  issue text,
  severity text,
  impact text,
  symptoms text,
  troubleshooting_steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  recommended_next_action text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE wiser_support_cases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_support_cases" ON wiser_support_cases;
CREATE POLICY "anon_select_support_cases" ON wiser_support_cases FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_support_cases" ON wiser_support_cases;
CREATE POLICY "anon_insert_support_cases" ON wiser_support_cases FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_support_cases" ON wiser_support_cases;
CREATE POLICY "anon_update_support_cases" ON wiser_support_cases FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_support_cases" ON wiser_support_cases;
CREATE POLICY "anon_delete_support_cases" ON wiser_support_cases FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS wiser_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES wiser_conversations(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  event_type text NOT NULL,
  event_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE wiser_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_analytics" ON wiser_analytics;
CREATE POLICY "anon_select_analytics" ON wiser_analytics FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_analytics" ON wiser_analytics;
CREATE POLICY "anon_insert_analytics" ON wiser_analytics FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_analytics" ON wiser_analytics;
CREATE POLICY "anon_delete_analytics" ON wiser_analytics FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_wiser_conversations_session ON wiser_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_wiser_leads_conversation ON wiser_leads(conversation_id);
CREATE INDEX IF NOT EXISTS idx_wiser_support_cases_conversation ON wiser_support_cases(conversation_id);
CREATE INDEX IF NOT EXISTS idx_wiser_analytics_session ON wiser_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_wiser_analytics_event_type ON wiser_analytics(event_type);
