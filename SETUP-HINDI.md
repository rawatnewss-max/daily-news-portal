# Daily News Portal — आसान सेटअप

## A. पहले GitHub में project डालें
1. ZIP को Windows में **Extract All** करें।
2. अपनी GitHub repository `daily-news-portal` खोलें।
3. **uploading an existing file** पर क्लिक करें।
4. Extract किए हुए `daily-news-portal` folder के अंदर की सभी files/folders upload area में drag करें।
5. नीचे **Commit changes** दबाएँ।

> `.env.local` कभी GitHub पर upload न करें। Project में केवल `.env.local.example` दिया गया है।

## B. Supabase तैयार करें
1. Supabase में नया project बनाएँ।
2. **SQL Editor > New query** खोलें।
3. इस project की `supabase/schema.sql` file का पूरा code paste करके **Run** करें।
4. **Authentication > Users > Add user** में अपना Admin email/password बनाएँ।
5. SQL Editor में यह चलाएँ (अपना email डालकर):

```sql
insert into public.profiles (id, full_name, role)
select id, 'Admin', 'admin'
from auth.users
where email = 'YOUR_EMAIL@example.com'
on conflict (id) do update
set full_name = excluded.full_name,
    role = 'admin';
```

## C. Supabase keys लें
Supabase में **Project Settings > API** से:
- Project URL
- anon/public key

इनकी जरूरत Vercel में पड़ेगी। `service_role` key इस्तेमाल नहीं करनी है।

## D. Vercel पर Live करें
1. Vercel में GitHub से login करें।
2. **Add New > Project** और `daily-news-portal` import करें।
3. Environment Variables जोड़ें:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy दबाएँ।

Deploy होने के बाद:
- Public website: Vercel द्वारा दिया URL
- Admin: `/admin/login`

## E. Website में पहली खबर डालें
Admin login के बाद:
1. Settings में website name/tagline भरें।
2. Categories और Locations देखें/जोड़ें।
3. News > Add News खोलें।
4. Headline, summary, full news, category, location और photo भरें।
5. Status = Published चुनें।
6. जरूरत हो तो Breaking News / Featured News tick करें।
7. Save News दबाएँ।

खबर public homepage पर दिखाई देगी।
