-- Run this in the Supabase SQL Editor to set up your tables

-- Create a table for public donor profiles
create table public.donors (
  id uuid references auth.users on delete cascade not null primary key,
  name text not null,
  phone text not null,
  blood_group text not null,
  area text not null,
  age integer,
  latitude double precision,
  longitude double precision,
  last_donation_date date,
  total_donations integer default 0 not null,
  is_available boolean default true not null,
  status text default 'pending' not null,
  emergency_contact text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.donors enable row level security;

-- Create policies

-- 1. Anyone can view all donors
create policy "Public profiles are viewable by everyone." on public.donors
  for select using (true);

-- 2. Users can insert their own profile
create policy "Users can insert their own profile." on public.donors
  for insert with check (true);

-- 3. Anyone can update profiles (allows admin status changes and user edits)
create policy "Anyone can update profiles." on public.donors
  for update using (true);

-- Create a table for admins
create table public.admins (
  id uuid default gen_random_uuid() primary key,
  username text not null unique,
  password text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for admins
alter table public.admins enable row level security;

-- Anyone can read/verify admins
create policy "Admins are viewable by everyone." on public.admins
  for select using (true);

-- Create policy to insert admins (simple access for MVP)
create policy "Admins can insert other admins." on public.admins
  for insert with check (true);


