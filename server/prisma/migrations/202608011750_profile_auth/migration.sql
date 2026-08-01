alter table public.profiles
  add column if not exists username text,
  add column if not exists password_hash text;

update public.profiles
set username = lower(regexp_replace(coalesce(nullif(username, ''), nullif(full_name, ''), split_part(email, '@', 1), id::text), '[^a-zA-Z0-9_]+', '_', 'g'))
where username is null or username = '';

alter table public.profiles
  drop constraint if exists profiles_id_fkey;

create unique index if not exists profiles_email_lower_unique
  on public.profiles (lower(email))
  where email is not null;

create unique index if not exists profiles_username_lower_unique
  on public.profiles (lower(username))
  where username is not null;

alter table public.expenses
  drop constraint if exists expenses_user_id_fkey;

alter table public.budgets
  drop constraint if exists budgets_user_id_fkey;

alter table public.monthly_reports
  drop constraint if exists monthly_reports_user_id_fkey;

alter table public.expenses
  add constraint expenses_user_id_fkey
  foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.budgets
  add constraint budgets_user_id_fkey
  foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.monthly_reports
  add constraint monthly_reports_user_id_fkey
  foreign key (user_id) references public.profiles(id) on delete cascade;

revoke all privileges on table
  public.profiles,
  public.plans,
  public.expenses,
  public.categories,
  public.budgets,
  public.monthly_reports
from anon, authenticated;

revoke all privileges on all sequences in schema public
from anon, authenticated;

drop policy if exists "Allow public insert to plans" on public.plans;
