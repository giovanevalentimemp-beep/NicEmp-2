create extension if not exists "pgcrypto";

create or replace function public.is_valid_cpf(cpf_input text)
returns boolean
language plpgsql
immutable
as $$
declare
  cpf text := regexp_replace(coalesce(cpf_input, ''), '\D', '', 'g');
  sum1 int := 0;
  sum2 int := 0;
  d1 int;
  d2 int;
  i int;
begin
  if length(cpf) <> 11 or cpf ~ '^(\d)\1{10}$' then
    return false;
  end if;

  for i in 1..9 loop
    sum1 := sum1 + substring(cpf, i, 1)::int * (11 - i);
  end loop;
  d1 := (sum1 * 10) % 11;
  if d1 = 10 then d1 := 0; end if;

  for i in 1..10 loop
    sum2 := sum2 + substring(cpf, i, 1)::int * (12 - i);
  end loop;
  d2 := (sum2 * 10) % 11;
  if d2 = 10 then d2 := 0; end if;

  return d1 = substring(cpf, 10, 1)::int and d2 = substring(cpf, 11, 1)::int;
end;
$$;

create or replace function public.format_cpf(cpf_input text)
returns text
language sql
immutable
as $$
  select regexp_replace(regexp_replace(coalesce(cpf_input, ''), '\D', '', 'g'), '(\d{3})(\d{3})(\d{3})(\d{2})', '\1.\2.\3-\4');
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.role is distinct from new.role and not public.current_user_is_admin() then
    raise exception 'Only admins can change user roles.';
  end if;
  return new;
end;
$$;

create type public.user_role as enum ('user', 'admin');
create type public.post_status as enum ('draft', 'published', 'scheduled');
create type public.entry_type as enum ('inflow', 'outflow');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  nome text not null,
  cpf text unique,
  avatar_url text,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_cpf_format check (cpf is null or cpf = public.format_cpf(cpf)),
  constraint users_cpf_valid check (cpf is null or public.is_valid_cpf(cpf))
);

create table public.profiles (
  id uuid primary key references public.users(id) on delete cascade,
  bio text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.users(id) on delete restrict,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  subtitle text,
  slug text not null unique,
  cover_image_path text,
  content jsonb not null default '{}'::jsonb,
  youtube_url text,
  meta_title text,
  meta_description text,
  tags text[] not null default '{}',
  status public.post_status not null default 'draft',
  published_at timestamptz,
  scheduled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.post_images (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.videos (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  title text not null,
  youtube_url text not null,
  thumbnail_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  document text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.dre_entries (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  period date not null,
  group_name text not null,
  description text not null,
  amount numeric(14,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cashflow_entries (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  entry_date date not null,
  type public.entry_type not null,
  category text not null,
  cost_center text,
  description text,
  amount numeric(14,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.indicators (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  period date not null,
  roi numeric(10,4),
  margin numeric(10,4),
  markup numeric(10,4),
  working_capital numeric(14,2),
  average_ticket numeric(14,2),
  break_even numeric(14,2),
  revenue numeric(14,2),
  net_profit numeric(14,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index companies_owner_id_idx on public.companies(owner_id);
create index dre_entries_company_period_idx on public.dre_entries(company_id, period);
create index cashflow_entries_company_date_idx on public.cashflow_entries(company_id, entry_date);
create index indicators_company_period_idx on public.indicators(company_id, period);

create trigger users_touch_updated_at before update on public.users for each row execute function public.touch_updated_at();
create trigger users_prevent_role_escalation before update on public.users for each row execute function public.prevent_role_escalation();
create trigger profiles_touch_updated_at before update on public.profiles for each row execute function public.touch_updated_at();
create trigger posts_touch_updated_at before update on public.posts for each row execute function public.touch_updated_at();
create trigger companies_touch_updated_at before update on public.companies for each row execute function public.touch_updated_at();
create trigger dre_entries_touch_updated_at before update on public.dre_entries for each row execute function public.touch_updated_at();
create trigger cashflow_entries_touch_updated_at before update on public.cashflow_entries for each row execute function public.touch_updated_at();
create trigger indicators_touch_updated_at before update on public.indicators for each row execute function public.touch_updated_at();

alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.posts enable row level security;
alter table public.post_images enable row level security;
alter table public.videos enable row level security;
alter table public.companies enable row level security;
alter table public.dre_entries enable row level security;
alter table public.cashflow_entries enable row level security;
alter table public.indicators enable row level security;

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.users where id = auth.uid() and role = 'admin');
$$;

create policy "users read own or admin" on public.users for select using (id = auth.uid() or public.current_user_is_admin());
create policy "users insert self" on public.users for insert with check (id = auth.uid());
create policy "users update own limited" on public.users for update using (id = auth.uid()) with check (id = auth.uid());
create policy "users admin all" on public.users for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());

create policy "profiles own or admin" on public.profiles for all using (id = auth.uid() or public.current_user_is_admin()) with check (id = auth.uid() or public.current_user_is_admin());

create policy "published posts public read" on public.posts for select using (status = 'published' or author_id = auth.uid() or public.current_user_is_admin());
create policy "posts admin manage" on public.posts for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());
create policy "categories public read" on public.categories for select using (true);
create policy "categories admin manage" on public.categories for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());
create policy "post_images public read" on public.post_images for select using (true);
create policy "post_images admin manage" on public.post_images for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());
create policy "videos public read" on public.videos for select using (true);
create policy "videos admin manage" on public.videos for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());

create policy "companies owner or admin" on public.companies for all using (owner_id = auth.uid() or public.current_user_is_admin()) with check (owner_id = auth.uid() or public.current_user_is_admin());
create policy "dre company owner or admin" on public.dre_entries for all using (exists (select 1 from public.companies c where c.id = company_id and (c.owner_id = auth.uid() or public.current_user_is_admin()))) with check (exists (select 1 from public.companies c where c.id = company_id and (c.owner_id = auth.uid() or public.current_user_is_admin())));
create policy "cashflow company owner or admin" on public.cashflow_entries for all using (exists (select 1 from public.companies c where c.id = company_id and (c.owner_id = auth.uid() or public.current_user_is_admin()))) with check (exists (select 1 from public.companies c where c.id = company_id and (c.owner_id = auth.uid() or public.current_user_is_admin())));
create policy "indicators company owner or admin" on public.indicators for all using (exists (select 1 from public.companies c where c.id = company_id and (c.owner_id = auth.uid() or public.current_user_is_admin()))) with check (exists (select 1 from public.companies c where c.id = company_id and (c.owner_id = auth.uid() or public.current_user_is_admin())));

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media public read" on storage.objects for select using (bucket_id = 'media');
create policy "media authenticated upload" on storage.objects for insert to authenticated with check (bucket_id = 'media');
create policy "media owner or admin delete" on storage.objects for delete to authenticated using (bucket_id = 'media' and (owner = auth.uid() or public.current_user_is_admin()));
