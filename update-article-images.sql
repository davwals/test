-- Update Article Cover Images
-- Run this in your Supabase SQL Editor to update the cover images
--
-- INSTRUCTIONS:
-- 1. Go to https://app.supabase.com
-- 2. Open your project
-- 3. Click "SQL Editor" in the left sidebar
-- 4. Copy and paste this entire file
-- 5. Click "Run" or press Cmd/Ctrl + Enter
--
-- NOTE: Replace these URLs with your actual hosted image URLs
-- You can upload the images to:
-- - Imgur: https://imgur.com/upload
-- - Cloudinary: https://cloudinary.com
-- - Your own hosting
-- Then replace the URLs below with the direct image links

-- 1. J.P. Morgan MONY (tokenization) - Globe with orange background
UPDATE articles
SET cover_image = 'https://raw.githubusercontent.com/davwals/test/main/assets/globe-orange.jpg'
WHERE slug = 'jp-morgan-launches-mony-tokenized-fund';

-- 2. Standard Chartered ETH (institutional-adoption) - Ethereum logo on pink
UPDATE articles
SET cover_image = 'https://raw.githubusercontent.com/davwals/test/main/assets/eth-pink.jpg'
WHERE slug = 'standard-chartered-eth-price-target-40000';

-- 3. Morgan Stanley (institutional-adoption) - Temple with blue stripe
UPDATE articles
SET cover_image = 'https://raw.githubusercontent.com/davwals/test/main/assets/temple-blue.jpg'
WHERE slug = 'morgan-stanley-goes-all-in-crypto';

-- 4. Understanding Stablecoins - Scroll with moon and burgundy stripe
UPDATE articles
SET cover_image = 'https://raw.githubusercontent.com/davwals/test/main/assets/scroll-burgundy.jpg'
WHERE slug = 'understanding-stablecoins-usdc-vs-usdt-2025';

-- 5. Layer 2 Ecosystem - Three figures with green tech background
UPDATE articles
SET cover_image = 'https://raw.githubusercontent.com/davwals/test/main/assets/figures-green.jpg'
WHERE slug = 'layer-2-ecosystem-42b-tvl-milestone';
