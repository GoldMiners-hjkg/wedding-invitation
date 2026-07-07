-- Wedding RSVP table
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists public.rsvp_responses (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  attending boolean not null,
  num_guests integer not null default 1,
  hotel_needed boolean not null default false,
  hotel_check_in_time text,
  hotel_check_out_time text,
  hotel_num_guests integer,
  hotel_num_nights integer,
  arrival_time text,
  flight_number text,
  flight_arrival_time text,
  arriving_airport text,
  dietary_requirements text,
  note_to_couple text,
  created_at timestamptz not null default now()
);

alter table public.rsvp_responses enable row level security;

-- Allow anonymous guests to submit RSVPs
create policy "Anyone can insert RSVP"
  on public.rsvp_responses
  for insert
  to anon, authenticated
  with check (true);

-- Block public reads; admin uses the service role key server-side only
create policy "No public read"
  on public.rsvp_responses
  for select
  to anon, authenticated
  using (false);

create index if not exists rsvp_responses_created_at_idx
  on public.rsvp_responses (created_at desc);
