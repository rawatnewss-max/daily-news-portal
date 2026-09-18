-- Daily News Portal - Supabase schema
-- Run this entire file once in Supabase > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'reader' check (role in ('reader','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  sort_order integer not null default 100,
  created_at timestamptz not null default now()
);

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  image_url text,
  category_id uuid references public.categories(id) on delete set null,
  location_id uuid references public.locations(id) on delete set null,
  author_id uuid references auth.users(id) on delete set null,
  status text not null default 'draft' check (status in ('draft','published')),
  is_breaking boolean not null default false,
  is_featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_status_published_idx on public.articles(status, published_at desc);
create index if not exists articles_category_idx on public.articles(category_id);
create index if not exists articles_location_idx on public.articles(location_id);
create index if not exists articles_featured_idx on public.articles(is_featured) where is_featured = true;
create index if not exists articles_breaking_idx on public.articles(is_breaking) where is_breaking = true;

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  site_name text not null default 'Daily News Portal',
  tagline text not null default 'अजमेर और राजस्थान की भरोसेमंद स्थानीय खबरें',
  contact_phone text default '',
  contact_email text default '',
  facebook_url text default '',
  youtube_url text default '',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

insert into public.categories (name, slug, sort_order) values
  ('अजमेर', 'ajmer', 10),
  ('राजस्थान', 'rajasthan', 20),
  ('राजनीति', 'politics', 30),
  ('जनहित', 'public-issues', 40),
  ('अपराध', 'crime', 50),
  ('शिक्षा', 'education', 60),
  ('बिजनेस', 'business', 70),
  ('कृषि', 'agriculture', 80),
  ('सरकारी योजनाएं', 'government-schemes', 90)
on conflict (name) do nothing;

insert into public.locations (name, slug) values
  ('अजमेर', 'ajmer'),
  ('पुष्कर', 'pushkar'),
  ('मुहामी', 'muhami'),
  ('केकड़ी', 'kekri'),
  ('सरवाड़', 'sarwar'),
  ('बूबानी', 'bubani')
on conflict (name) do nothing;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.locations enable row level security;
alter table public.articles enable row level security;
alter table public.site_settings enable row level security;

-- Profiles
create policy "Users can read own profile" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "Admins can update profiles" on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Categories and locations: public read, admin write
create policy "Public can read categories" on public.categories for select to anon, authenticated using (true);
create policy "Admins manage categories" on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Public can read locations" on public.locations for select to anon, authenticated using (true);
create policy "Admins manage locations" on public.locations for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Articles: public can only read published; admins can manage all
create policy "Public can read published articles" on public.articles for select to anon, authenticated using (status = 'published' or public.is_admin());
create policy "Admins insert articles" on public.articles for insert to authenticated with check (public.is_admin());
create policy "Admins update articles" on public.articles for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete articles" on public.articles for delete to authenticated using (public.is_admin());

-- Site settings
create policy "Public can read settings" on public.site_settings for select to anon, authenticated using (true);
create policy "Admins manage settings" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Public image bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('news-images', 'news-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true, file_size_limit = 5242880;

create policy "Public can view news images" on storage.objects for select to public using (bucket_id = 'news-images');
create policy "Admins upload news images" on storage.objects for insert to authenticated with check (bucket_id = 'news-images' and public.is_admin());
create policy "Admins update news images" on storage.objects for update to authenticated using (bucket_id = 'news-images' and public.is_admin()) with check (bucket_id = 'news-images' and public.is_admin());
create policy "Admins delete news images" on storage.objects for delete to authenticated using (bucket_id = 'news-images' and public.is_admin());

-- IMPORTANT: After creating your Admin user in Authentication > Users,
-- run the following, replacing the email:
-- insert into public.profiles (id, full_name, role)
-- select id, 'Admin', 'admin' from auth.users where email = 'YOUR_EMAIL@example.com'
-- on conflict (id) do update set full_name = excluded.full_name, role = 'admin';
