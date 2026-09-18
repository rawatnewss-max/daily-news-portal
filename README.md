# Daily News Portal

A production-style Hindi local news portal built with **Next.js App Router + TypeScript + Tailwind CSS + Supabase**.

## Features

- Public Hindi news homepage
- Breaking News ticker
- Featured News hero
- Category and Location pages
- Search
- Individual SEO-friendly news pages
- Secure Supabase email/password Admin Login
- Admin Dashboard
- Create / Edit / Delete news
- Draft / Published workflow
- Breaking / Featured flags
- News photo upload to Supabase Storage
- Category management
- Location management
- Site name, tagline and contact settings
- Row Level Security (RLS)
- Mobile / tablet / desktop responsive layout
- Sitemap and robots.txt
- Vercel-ready

## 1) Create Supabase project

Open Supabase and create a project.

In **SQL Editor**, run the entire file:

`supabase/schema.sql`

## 2) Create Admin user

In Supabase:

**Authentication > Users > Add user**

Create your email and password.

Then run this in SQL Editor (replace your email):

```sql
insert into public.profiles (id, full_name, role)
select id, 'Admin', 'admin'
from auth.users
where email = 'YOUR_EMAIL@example.com'
on conflict (id) do update
set full_name = excluded.full_name,
    role = 'admin';
```

For a closed newsroom, keep public sign-up disabled.

## 3) Environment variables

Copy `.env.local.example` to `.env.local` and fill:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Find URL and anon key in **Supabase > Project Settings > API**.

Never put a Supabase `service_role` key in this project or in browser-visible environment variables.

## 4) Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Admin login: `http://localhost:3000/admin/login`

## 5) Deploy to Vercel

1. Push this project to your GitHub repository `daily-news-portal`.
2. Open Vercel and choose **Add New > Project**.
3. Import the GitHub repository.
4. Add these Environment Variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your final domain, e.g. `https://www.example.in`)
5. Deploy.

## 6) Add your custom domain

In Vercel: **Project > Settings > Domains** and add your domain. Vercel will show the DNS records to add at your domain provider.

## Security notes

- Public visitors can read only `published` articles.
- Drafts are protected by Supabase RLS.
- Only users whose `profiles.role = 'admin'` can create/edit/delete news, categories, locations, settings or images.
- The browser uses only the Supabase anon key; authorization comes from RLS.
- Image uploads are limited to 5MB and common image MIME types.

## Suggested first setup after login

1. Open **Settings** and enter your website name/tagline/contact.
2. Add required **Categories**.
3. Add reporting **Locations**.
4. Open **News > Add News** and publish the first story.

---

Built for a professional local Hindi newsroom workflow.
