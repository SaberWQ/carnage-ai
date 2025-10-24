-- Create training sessions table for tracking model training
create table if not exists public.training_sessions (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references public.models(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending',
  epochs integer not null,
  batch_size integer not null,
  learning_rate float not null,
  metrics jsonb,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.training_sessions enable row level security;

-- RLS policies for training sessions
create policy "Users can view their own training sessions"
  on public.training_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own training sessions"
  on public.training_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own training sessions"
  on public.training_sessions for update
  using (auth.uid() = user_id);

-- Create indexes
create index training_sessions_model_id_idx on public.training_sessions(model_id);
create index training_sessions_user_id_idx on public.training_sessions(user_id);
