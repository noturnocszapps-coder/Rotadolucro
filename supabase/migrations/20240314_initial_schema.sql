-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('passenger', 'driver', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE request_status AS ENUM ('open', 'filled', 'cancelled');

-- 2. TABLES
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role user_role DEFAULT 'passenger',
  full_name text,
  phone text,
  avatar_url text,
  accepted_terms_at timestamptz,
  subscription_tier text DEFAULT 'free', -- Future-ready
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.drivers (
  id uuid REFERENCES public.profiles ON DELETE CASCADE PRIMARY KEY,
  status verification_status DEFAULT 'pending',
  driverdash_id text,
  is_available boolean DEFAULT false,
  documents_json jsonb, -- Securely store doc metadata
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.transport_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  passenger_id uuid REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  event_id text NOT NULL, -- Roxou Main Event ID
  event_name text,
  event_location text,
  event_date timestamptz,
  status request_status DEFAULT 'open',
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.connections (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id uuid REFERENCES public.transport_requests ON DELETE CASCADE NOT NULL,
  passenger_id uuid REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  driver_id uuid REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(request_id, driver_id)
);

CREATE TABLE public.messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id uuid REFERENCES public.connections ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 3. RLS ENABLEMENT
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 4. BASIC POLICIES (SAMPLES)
CREATE POLICY "Profiles are viewable by authenticated users" 
ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Drivers can view open requests" 
ON public.transport_requests FOR SELECT 
USING (status = 'open' OR passenger_id = auth.uid());
