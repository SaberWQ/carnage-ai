-- Create models table for storing neural network configurations
create table if not exists public.models (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  architecture jsonb not null,
  status text not null default 'draft',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.models enable row level security;

-- RLS policies for models
create policy "Users can view their own models"
  on public.models for select
  using (auth.uid() = user_id);

create policy "Users can insert their own models"
  on public.models for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own models"
  on public.models for update
  using (auth.uid() = user_id);

create policy "Users can delete their own models"
  on public.models for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index models_user_id_idx on public.models(user_id);
