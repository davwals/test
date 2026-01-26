# Enterprise Onchain Blog Setup Guide

This guide will help you set up the blog system with Supabase authentication and database.

## Features

✅ **Authentication**
- Magic link email authentication
- Google OAuth sign-in
- Automatic session management

✅ **Blog System**
- Article listing with category filters
- Individual article pages
- Content gating (30% preview for non-authenticated users, full content for authenticated)
- Related articles suggestions

✅ **Categories**
- Stablecoins
- Tokenization
- DeFi
- L2s
- ETF
- Regulatory
- Institutional Adoption

## Setup Instructions

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if you don't have one)
4. Create a new project:
   - Enter project name: `enterprise-onchain`
   - Enter a strong database password (save this!)
   - Select a region close to your users
   - Click "Create new project"
5. Wait for the project to be created (~2 minutes)

### Step 2: Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Find and copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public** key (under "Project API keys")

### Step 3: Configure the Application

1. Open `supabase-config.js` in your project
2. Replace the placeholder values:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Paste your Project URL here
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Paste your anon key here
   ```

### Step 4: Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Open the file `supabase-migration.sql` from your project
3. Copy all the SQL code
4. Paste it into the SQL Editor
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. You should see: "Success. No rows returned"

This will:
- Create the `articles` table
- Set up row-level security policies
- Seed the database with 5 sample articles

### Step 5: Enable Google OAuth (Optional)

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find "Google" in the list
3. Toggle it to "Enabled"
4. You'll need to create a Google OAuth application:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project (or select existing)
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
5. Copy the Client ID and Client Secret
6. Paste them into Supabase Google provider settings
7. Click "Save"

### Step 6: Configure Email Templates (Optional)

1. In Supabase dashboard, go to **Authentication** → **Email Templates**
2. Customize the "Magic Link" template to match your branding
3. Edit variables like:
   - Sender name
   - Email subject
   - Email body content

### Step 7: Deploy Your Site

1. Commit all files to your GitHub repository:
   ```bash
   git add .
   git commit -m "Add blog system with Supabase authentication"
   git push
   ```

2. Enable GitHub Pages:
   - Go to your GitHub repo → Settings → Pages
   - Select your branch
   - Click Save

3. Your site will be live at: `https://yourusername.github.io/yourrepo/`

## File Structure

```
your-project/
├── index.html              # Landing page
├── terminal.html           # Terminal dashboard
├── articles.html           # Articles listing page
├── article.html            # Individual article page
├── login.html              # Authentication page
├── supabase-config.js      # Supabase configuration
├── supabase-migration.sql  # Database schema and seed data
└── BLOG-SETUP.md          # This file
```

## Usage

### For Visitors (Non-Authenticated)
- Browse all articles
- Filter by category
- Read 30% preview of each article
- Must sign in to read full articles

### For Authenticated Users
- All visitor features
- Read full articles (100% content)
- Personalized experience

## Adding New Articles

### Option 1: Via Supabase Dashboard

1. Go to **Table Editor** → **articles**
2. Click "Insert" → "Insert row"
3. Fill in the fields:
   - `title`: Article title
   - `slug`: URL-friendly version (e.g., `my-article-title`)
   - `excerpt`: Short description
   - `content`: Full article content in Markdown
   - `category`: Select from dropdown
   - `author_name`: Author name
   - `cover_image`: Image URL
   - `read_time_minutes`: Estimated reading time
4. Click "Save"

### Option 2: Via SQL

```sql
INSERT INTO articles (title, slug, excerpt, content, category, cover_image, read_time_minutes)
VALUES (
  'Your Article Title',
  'your-article-title',
  'Short description of the article',
  E'# Your Article Title\n\nYour markdown content here...',
  'tokenization',  -- Choose: stablecoins, tokenization, defi, l2s, etf, regulatory, institutional-adoption
  'https://example.com/image.jpg',
  5
);
```

## Troubleshooting

### "Error loading articles"
- Check that you've run the migration SQL
- Verify your Supabase credentials in `supabase-config.js`
- Check browser console for specific errors

### Magic link not sending
- Verify email template is configured
- Check Supabase logs: **Logs** → **Auth Logs**
- Ensure your site URL is added to redirect URLs in **Authentication** → **URL Configuration**

### Google OAuth not working
- Verify Client ID and Secret are correct
- Check authorized redirect URIs in Google Console
- Ensure Google provider is enabled in Supabase

### Content not displaying correctly
- Ensure your content is in Markdown format
- Check that the `marked.js` library is loading (check browser console)
- Verify article exists in database

## Security Notes

- Never commit your Supabase credentials to a public repository
- The `anon` key is safe to use in client-side code (it's public)
- Row Level Security (RLS) is enabled to protect your data
- Consider adding rate limiting for API calls in production

## Support

For issues with:
- **Supabase**: [Supabase Documentation](https://supabase.com/docs)
- **Deployment**: Check your GitHub Pages settings
- **This code**: Create an issue in your repository

## Next Steps

Consider adding:
- Admin dashboard for managing articles
- Comments system
- Search functionality
- Newsletter integration
- Analytics tracking
- SEO optimization

---

Built with ❤️ for Enterprise Onchain
