-- ============================================================
-- MIGRATION 001 — PILLWAY INITIAL SCHEMA
-- ============================================================

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: profiles
-- ============================================================
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  full_name       TEXT,
  avatar_url      TEXT,
  doctor_email    TEXT,
  notifications   BOOLEAN DEFAULT true,
  alert_minutes   INTEGER DEFAULT 5,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: subscriptions
-- ============================================================
CREATE TABLE subscriptions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan                  TEXT DEFAULT 'premium',
  status                TEXT DEFAULT 'active',
  trial_start           TIMESTAMPTZ DEFAULT NOW(),
  trial_end             TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  current_period_start  TIMESTAMPTZ,
  current_period_end    TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: medications
-- ============================================================
CREATE TABLE medications (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  dosage        TEXT,
  form          TEXT,
  color         TEXT DEFAULT '#F59E0B',
  notes         TEXT,
  notice_summary TEXT,
  interactions  JSONB DEFAULT '[]',
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: reminders
-- ============================================================
CREATE TABLE reminders (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  medication_id   UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  scheduled_time  TIME NOT NULL,
  days_of_week    INTEGER[] DEFAULT '{1,2,3,4,5,6,7}',
  start_date      DATE DEFAULT CURRENT_DATE,
  end_date        DATE,
  is_active       BOOLEAN DEFAULT true,
  alert_minutes   INTEGER DEFAULT 5,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: medication_logs
-- ============================================================
CREATE TABLE medication_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reminder_id   UUID REFERENCES reminders(id) ON DELETE SET NULL,
  medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  scheduled_at  TIMESTAMPTZ NOT NULL,
  taken_at      TIMESTAMPTZ,
  status        TEXT DEFAULT 'pending',
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: monthly_reports
-- ============================================================
CREATE TABLE monthly_reports (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  month         INTEGER NOT NULL,
  year          INTEGER NOT NULL,
  pdf_url       TEXT,
  sent_to_email TEXT,
  sent_at       TIMESTAMPTZ,
  stats         JSONB,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month, year)
);

-- ============================================================
-- TABLE: ocr_scans
-- ============================================================
CREATE TABLE ocr_scans (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  image_url     TEXT,
  raw_text      TEXT,
  parsed_data   JSONB,
  status        TEXT DEFAULT 'pending',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: recommendations
-- ============================================================
CREATE TABLE recommendations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type            TEXT NOT NULL,
  severity        TEXT DEFAULT 'info',
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,
  medication_ids  UUID[] DEFAULT '{}',
  source          TEXT,
  is_read         BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_medications_user ON medications(user_id);
CREATE INDEX idx_reminders_user ON reminders(user_id);
CREATE INDEX idx_reminders_medication ON reminders(medication_id);
CREATE INDEX idx_logs_user_date ON medication_logs(user_id, scheduled_at);
CREATE INDEX idx_logs_status ON medication_logs(status);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_recommendations_user ON recommendations(user_id, is_read);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ocr_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Policies: chaque user ne voit que SES données
CREATE POLICY "users_own_profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "users_own_subscription" ON subscriptions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_medications" ON medications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_reminders" ON reminders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_logs" ON medication_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_reports" ON monthly_reports FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_scans" ON ocr_scans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_recommendations" ON recommendations FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: Création profil + abonnement premium auto à l'inscription
-- (Pas de Stripe: tout le monde est premium par défaut)
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');

  INSERT INTO subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'premium', 'active');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- FUNCTION: Génération automatique des logs quotidiens
-- ============================================================
CREATE OR REPLACE FUNCTION generate_daily_logs()
RETURNS void AS $$
DECLARE
  r RECORD;
  today DATE := CURRENT_DATE;
  dow INTEGER := EXTRACT(DOW FROM today);
  scheduled TIMESTAMPTZ;
BEGIN
  IF dow = 0 THEN dow := 7; END IF;

  FOR r IN
    SELECT rem.*, med.user_id
    FROM reminders rem
    JOIN medications med ON med.id = rem.medication_id
    WHERE rem.is_active = true
      AND (rem.start_date IS NULL OR rem.start_date <= today)
      AND (rem.end_date IS NULL OR rem.end_date >= today)
      AND dow = ANY(rem.days_of_week)
  LOOP
    scheduled := (today || ' ' || r.scheduled_time)::TIMESTAMPTZ;

    INSERT INTO medication_logs (user_id, reminder_id, medication_id, scheduled_at, status)
    VALUES (r.user_id, r.id, r.medication_id, scheduled, 'pending')
    ON CONFLICT DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
