# Article Cover Images

This folder contains the cover images for the blog articles.

## Image Files Needed

Upload these 5 images to this folder:

1. **globe-orange.jpg** - Figure writing on globe with orange background
   - For: J.P. Morgan MONY article (tokenization)

2. **eth-pink.jpg** - Figure with Ethereum logo on pink background
   - For: Standard Chartered ETH article (institutional-adoption)

3. **temple-blue.jpg** - Figure writing with temple and blue stripe
   - For: Morgan Stanley article (institutional-adoption)

4. **scroll-burgundy.jpg** - Figure with scroll, moon/eclipse and burgundy stripe
   - For: Understanding Stablecoins article (stablecoins)

5. **figures-green.jpg** - Three figures in togas with green tech background
   - For: Layer 2 Ecosystem article (l2s)

## How to Add Images

### Option 1: Use Imgur (Easiest)

1. Go to https://imgur.com/upload
2. Upload each image
3. Right-click the uploaded image → "Copy image address"
4. Update the URLs in `update-article-images.sql`
5. Run the SQL in Supabase SQL Editor

### Option 2: Use GitHub (Recommended for long-term)

1. Add the 5 images to this `assets/` folder with the names listed above
2. Commit and push to GitHub:
   ```bash
   git add assets/
   git commit -m "Add article cover images"
   git push
   ```
3. The images will be available at:
   - `https://raw.githubusercontent.com/davwals/test/main/assets/globe-orange.jpg`
   - `https://raw.githubusercontent.com/davwals/test/main/assets/eth-pink.jpg`
   - etc.
4. Run `update-article-images.sql` in Supabase SQL Editor

### Option 3: Use Your Own Hosting

1. Upload images to your preferred CDN or hosting service
2. Get the direct image URLs
3. Update the URLs in `update-article-images.sql`
4. Run the SQL in Supabase SQL Editor

## After Uploading

Run the SQL update script in your Supabase dashboard:
1. Open https://app.supabase.com
2. Go to SQL Editor
3. Copy the contents of `update-article-images.sql`
4. Paste and run it

The images will immediately appear on your articles page!
