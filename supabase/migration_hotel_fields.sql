-- Migration: update hotel fields (run if you already created the table with old columns)

alter table public.rsvp_responses
  drop column if exists hotel_check_in,
  drop column if exists hotel_check_out,
  drop column if exists hotel_room_type;

alter table public.rsvp_responses
  add column if not exists hotel_check_in_time text,
  add column if not exists hotel_check_out_time text,
  add column if not exists hotel_num_guests integer,
  add column if not exists hotel_num_nights integer;
