create type user_role as enum ('admin', 'customer');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role default 'customer',
  avatar_url text,
  created_at timestamp default now()
);

alter table public.profiles enable row level security;

grant select, update on public.profiles to authenticated;

create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'customer');

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- insert into public.profiles (id, role)
-- values ('USER_UUID_HERE', 'admin');

-- update public.profiles
-- set role = 'admin'
-- where id = 'YOUR_REAL_USER_UUID';

-- revoke all on public.profiles from anon;