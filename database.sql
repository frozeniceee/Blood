-- Run this in the Supabase SQL Editor to set up your tables

-- Create a table for public donor profiles
create table public.donors (
  id uuid references auth.users on delete cascade not null primary key,
  name text not null,
  phone text not null,
  blood_group text not null,
  area text not null,
  latitude double precision,
  longitude double precision,
  last_donation_date date,
  is_available boolean default true not null,
  emergency_contact text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.donors enable row level security;

-- Create policies

-- 1. Anyone can view all donors (we might want to restrict this later, but for MVP it's fine)
create policy "Public profiles are viewable by everyone." on public.donors
  for select using (true);

-- 2. Users can insert their own profile
create policy "Users can insert their own profile." on public.donors
  for insert with check (auth.uid() = id);

-- 3. Users can update own profile
create policy "Users can update own profile." on public.donors
  for update using (auth.uid() = id);

-- Function to handle user creation and trigger profile insertion (Optional)
-- You can set up a trigger so when someone signs up via Auth, a blank profile is created
