-- Quote requests from the public form (src/actions/lead.ts → src/lib/lead-delivery.ts).
-- Only the site's server writes here, with the service-role key. Row-level security
-- without policies, plus revoked grants, keeps the table closed to the public keys;
-- staff read and update rows in the Supabase dashboard.
create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 80),
  phone text not null check (char_length(phone) <= 20),
  service text check (char_length(service) <= 60),
  route_from text check (char_length(route_from) <= 120),
  route_to text check (char_length(route_to) <= 120),
  cargo text check (char_length(cargo) <= 200),
  note text check (char_length(note) <= 1000),
  source_path text check (char_length(source_path) <= 200),
  status text not null default 'new'
);

alter table public.contact_leads enable row level security;
revoke all on table public.contact_leads from anon, authenticated;

create index if not exists contact_leads_created_at_idx on public.contact_leads (created_at desc);
