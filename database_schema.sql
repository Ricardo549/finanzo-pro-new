-- USERS PROFILE (Supabase Auth Extension)
-- Creates this table to store extra data linked to auth.users
create table public.profiles (
  id uuid references auth.users not null primary key,
  name text,
  email text,
  avatar_url text,
  is_pro boolean default false,
  cpf text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.profiles enable row level security;

-- PROJECTS TABLE
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  target_amount numeric not null,
  current_amount numeric default 0,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.projects enable row level security;

-- TRANSACTIONS TABLE
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  description text not null,
  amount numeric not null,
  date date not null,
  category text not null,
  establishment text,
  recurrence text, -- 'none' | 'monthly' | 'yearly'
  adjustment_rate numeric, -- Percentage
  type text check (type in ('expense', 'income', 'transfer')), -- Added type column
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.transactions enable row level security;

-- ACHIEVEMENTS TABLE
create table public.achievements (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  name text not null,
  description text not null,
  icon text not null,
  xp_reward integer default 0
);

-- USER ACHIEVEMENTS TABLE (Join Table)
create table public.user_achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  achievement_id uuid references public.achievements not null,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, achievement_id)
);

-- Enable RLS for Achievements
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;

-- POLICIES (Security Rules)

-- Profiles
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Projects
create policy "Users can view own projects" on projects for select using (auth.uid() = user_id);
create policy "Users can insert own projects" on projects for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on projects for update using (auth.uid() = user_id);
create policy "Users can delete own projects" on projects for delete using (auth.uid() = user_id);

-- Transactions
create policy "Users can view own transactions" on transactions for select using (auth.uid() = user_id);
create policy "Users can insert own transactions" on transactions for insert with check (auth.uid() = user_id);
create policy "Users can delete own transactions" on transactions for delete using (auth.uid() = user_id);

-- Achievements
create policy "Everyone can view achievements" on achievements for select using (true);
create policy "Users can view own unlocked achievements" on user_achievements for select using (auth.uid() = user_id);

-- TRIGGER for New User
-- Automatically creates a profile when a user signs up via Auth
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, is_pro)
  values (new.id, new.email, new.raw_user_meta_data->>'name', (new.raw_user_meta_data->>'is_pro')::boolean);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- INITIAL DATA: ACHIEVEMENTS
insert into public.achievements (code, name, description, icon, xp_reward) values
('FIRST_LOGIN', 'Primeiro Passo', 'Fez o primeiro login no sistema.', '🚀', 100),
('SAVER_Level_1', 'Poupador Iniciante', 'Guardou dinheiro pela primeira vez.', '💰', 200),
('STREAK_7', 'Consistência', 'Acessou o app por 7 dias seguidos.', '🔥', 500)
on conflict (code) do nothing;
