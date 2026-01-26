-- Supabase Migration for Enterprise Onchain Blog
-- Run this in your Supabase SQL Editor: https://app.supabase.com (SQL Editor)

-- Create categories enum
CREATE TYPE article_category AS ENUM (
  'stablecoins',
  'tokenization',
  'defi',
  'l2s',
  'etf',
  'regulatory',
  'institutional-adoption'
);

-- Create articles table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category article_category NOT NULL,
  author_name TEXT NOT NULL DEFAULT 'Enterprise Onchain',
  author_avatar TEXT,
  cover_image TEXT,
  read_time_minutes INTEGER DEFAULT 5,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on slug for fast lookups
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read articles (even non-authenticated users)
CREATE POLICY "Articles are viewable by everyone"
  ON articles FOR SELECT
  USING (true);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed sample articles
INSERT INTO articles (title, slug, excerpt, content, category, cover_image, read_time_minutes) VALUES
(
  'J.P. Morgan Launches MONY Tokenized Money Market Fund',
  'jp-morgan-launches-mony-tokenized-fund',
  'The banking giant announces its first tokenized fund product on Ethereum, marking a major milestone in institutional crypto adoption.',
  E'# J.P. Morgan Launches MONY Tokenized Money Market Fund\n\nIn a groundbreaking move that signals the acceleration of traditional finance''s embrace of blockchain technology, J.P. Morgan has officially launched MONY, its first tokenized money market fund on the Ethereum blockchain.\n\n## What is MONY?\n\nMONY is a tokenized representation of J.P. Morgan''s flagship money market fund, allowing institutional investors to access traditional financial instruments through blockchain technology. Each MONY token represents a share in the underlying fund, providing all the benefits of a traditional money market fund with the added advantages of blockchain:\n\n- **24/7 Trading**: Unlike traditional funds that settle once daily, MONY tokens can be transferred and settled instantly, any time of day.\n- **Programmability**: Smart contracts enable automated compliance, instant dividend distribution, and seamless integration with DeFi protocols.\n- **Transparency**: All transactions are recorded on the Ethereum blockchain, providing unprecedented transparency.\n- **Lower Costs**: Blockchain settlement reduces intermediary costs and operational overhead.\n\n## Why This Matters\n\nThis launch represents a watershed moment for institutional crypto adoption:\n\n1. **Validation**: When the largest bank in the US tokenizes a traditional financial product, it validates blockchain technology for mainstream finance.\n2. **Precedent**: Other major banks are likely to follow suit, creating a wave of tokenized traditional assets.\n3. **Infrastructure**: The success of MONY demonstrates that blockchain infrastructure is ready for institutional-scale adoption.\n\n## Technical Details\n\nMONY is built on Ethereum using the ERC-20 token standard with additional compliance features:\n\n- **KYC/AML Integration**: Only verified institutional investors can hold MONY tokens.\n- **Transfer Restrictions**: Smart contracts enforce accredited investor requirements.\n- **Audit Trail**: All transactions are permanently recorded for regulatory compliance.\n\n## Market Impact\n\nThe launch of MONY has immediate implications for the broader crypto market:\n\n- **Institutional Inflows**: Easier access for traditional investors means potential billions in new capital.\n- **DeFi Integration**: Tokenized treasuries can serve as collateral in DeFi protocols.\n- **Regulatory Clarity**: J.P. Morgan''s compliance-first approach provides a blueprint for others.\n\n## What''s Next?\n\nIndustry analysts expect J.P. Morgan to expand its tokenization efforts:\n\n- Additional fund products (equity, bond, alternative)\n- Cross-border settlement solutions\n- Integration with other blockchain networks\n- Partnerships with DeFi protocols\n\nThe launch of MONY isn''t just another product release—it''s a signal that the tokenization of traditional finance is no longer a question of "if" but "when."',
  'tokenization',
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop',
  8
),
(
  'Standard Chartered Raises ETH Price Target to $40,000',
  'standard-chartered-eth-price-target-40000',
  'Analysts cite growing institutional adoption and ETF inflows as key drivers for the bullish outlook on Ethereum.',
  E'# Standard Chartered Raises ETH Price Target to $40,000\n\nStandard Chartered, one of the world''s leading international banks, has released a bombshell report projecting Ethereum''s price could reach $40,000 by 2025, driven by institutional adoption and the approval of spot Ethereum ETFs.\n\n## Key Drivers\n\nThe bank''s research team identified several catalysts:\n\n### 1. ETF Inflows\nFollowing the approval of spot Ethereum ETFs in the US, institutional capital has been flooding into ETH:\n\n- **Daily Inflows**: Averaging $124M per day\n- **Total AUM**: Over $8B across all ETH ETFs\n- **Institutional Interest**: 73% of flows from institutional investors\n\n### 2. Staking Yields\nWith 28.4% of all ETH now staked, the network offers compelling yields:\n\n- **Base Yield**: 3-4% APY from network rewards\n- **MEV Opportunities**: Additional 1-2% for sophisticated stakers\n- **Total Return**: Potential for 5-6% yield plus price appreciation\n\n### 3. DeFi Growth\nEthereum remains the dominant platform for decentralized finance:\n\n- **TVL**: $89.2B locked in Ethereum DeFi protocols\n- **Market Share**: 60% of total DeFi value\n- **Innovation**: Continued development of new protocols and use cases\n\n## The Path to $40K\n\nStandard Chartered''s model projects three phases:\n\n**Phase 1 (Q1 2025)**: ETF approval drives initial rally to $8,000-$10,000\n\n**Phase 2 (Q2-Q3 2025)**: Institutional adoption accelerates, pushing to $20,000-$25,000\n\n**Phase 3 (Q4 2025)**: Network effects and mainstream adoption drive final push to $40,000\n\n## Risks and Considerations\n\nThe report acknowledges several risks:\n\n- **Regulatory Changes**: Unexpected regulatory actions could slow adoption\n- **Technical Issues**: Smart contract bugs or network failures\n- **Competition**: Other Layer 1 blockchains gaining market share\n- **Macro Environment**: Broader economic conditions affecting risk assets\n\n## Market Reaction\n\nThe crypto market responded enthusiastically:\n\n- ETH up 12% in 24 hours following report release\n- ETF volumes spiked 300%\n- Options markets pricing in increased volatility\n\nWhether Ethereum reaches $40,000 remains to be seen, but Standard Chartered''s endorsement adds significant credibility to the bull case.',
  'institutional-adoption',
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=600&fit=crop',
  6
),
(
  'Morgan Stanley Goes All-In on Crypto',
  'morgan-stanley-goes-all-in-crypto',
  'The $1.8T wealth manager launches crypto ETFs and announces institutional tokenization wallet, signaling major shift in strategy.',
  E'# Morgan Stanley Goes All-In on Crypto\n\nIn a move that shocked the financial industry, Morgan Stanley announced a comprehensive crypto strategy including ETF offerings and a proprietary institutional wallet for tokenized assets.\n\n## The Announcement\n\nMorgan Stanley''s CEO revealed three major initiatives:\n\n### 1. Crypto ETF Platform\nLaunching access to Bitcoin and Ethereum ETFs for all wealth management clients:\n\n- **Eligible Clients**: All accredited investors\n- **Minimum Investment**: $25,000\n- **Available ETFs**: 10+ spot Bitcoin and Ethereum products\n- **Integration**: Direct access through existing Morgan Stanley accounts\n\n### 2. Tokenization Wallet\nA new institutional-grade wallet for tokenized traditional assets:\n\n- **Custody**: Bank-grade security with insurance\n- **Supported Assets**: Tokenized treasuries, money market funds, equities\n- **Compliance**: Built-in KYC/AML and regulatory reporting\n- **Integration**: Seamless connection to existing portfolio management systems\n\n### 3. Digital Asset Research\nExpanding research coverage of crypto assets:\n\n- **Team Size**: Hiring 20+ dedicated crypto analysts\n- **Coverage**: Bitcoin, Ethereum, DeFi protocols, tokenization trends\n- **Client Access**: All research available to wealth management clients\n\n## Why Now?\n\nMorgan Stanley''s timing reflects several market developments:\n\n1. **Client Demand**: Surveys show 80% of UHNW clients want crypto exposure\n2. **Regulatory Clarity**: Recent ETF approvals provide clear framework\n3. **Competitive Pressure**: Other banks moving aggressively into space\n4. **Revenue Opportunity**: Estimated $500M+ annual revenue potential\n\n## Industry Impact\n\nThe announcement triggered immediate responses:\n\n- **Competitor Banks**: Goldman Sachs, UBS accelerating crypto plans\n- **Crypto Markets**: Bitcoin up 8%, Ethereum up 12%\n- **Traditional Finance**: More banks expected to announce similar initiatives\n\n## Implementation Timeline\n\n**Q1 2025**: ETF platform launches\n\n**Q2 2025**: Tokenization wallet beta testing\n\n**Q3 2025**: Full wallet rollout\n\n**Q4 2025**: DeFi research and product expansion\n\n## Client Reaction\n\nEarly feedback from Morgan Stanley clients has been overwhelmingly positive:\n\n- 60% of surveyed clients plan to allocate to crypto ETFs\n- Average planned allocation: 3-5% of portfolio\n- Highest interest from clients under 50\n\nMorgan Stanley''s comprehensive crypto strategy marks a turning point for institutional adoption. When a $1.8 trillion wealth manager goes "all-in," the rest of Wall Street is likely to follow.',
  'institutional-adoption',
  'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&h=600&fit=crop',
  7
),
(
  'Understanding Stablecoins: USDC vs USDT in 2025',
  'understanding-stablecoins-usdc-vs-usdt-2025',
  'A comprehensive comparison of the two largest stablecoins and what institutional investors need to know.',
  E'# Understanding Stablecoins: USDC vs USDT in 2025\n\nStablecoins have become the backbone of crypto markets, with over $178B in total supply. For institutional investors, understanding the differences between major stablecoins is crucial.\n\n## What Are Stablecoins?\n\nStablecoins are cryptocurrencies designed to maintain a stable value, typically pegged 1:1 to the US dollar. They serve as:\n\n- **Trading Pairs**: Facilitating crypto trading\n- **Settlement Medium**: Enabling instant cross-border payments\n- **Yield Generation**: Earning returns through DeFi protocols\n- **Treasury Management**: Holding dollar-equivalent reserves on-chain\n\n## USDC (Circle)\n\n### Overview\n- **Issuer**: Circle (backed by BlackRock, Fidelity)\n- **Supply**: $45B\n- **Regulation**: Full US regulatory compliance\n- **Transparency**: Monthly attestations by Grant Thornton\n\n### Key Features\n- **Reserves**: 100% cash and short-term US Treasuries\n- **Redemption**: 1:1 redemption guaranteed\n- **Regulatory**: First stablecoin compliant with EU''s MiCA regulation\n- **Banking**: Direct relationships with major US banks\n\n### Best For\n- Institutional investors requiring regulatory compliance\n- Companies needing audited reserves\n- US-based entities\n- Integration with traditional finance\n\n## USDT (Tether)\n\n### Overview\n- **Issuer**: Tether Limited\n- **Supply**: $95B\n- **Market Position**: Largest stablecoin by market cap\n- **Liquidity**: Most liquid trading pairs globally\n\n### Key Features\n- **Reserves**: Mix of cash, treasuries, and other assets\n- **Availability**: Trading on 200+ exchanges\n- **Adoption**: Highest volume for international transactions\n- **History**: Longest-running major stablecoin (since 2014)\n\n### Best For\n- High-volume trading\n- International payments\n- Maximum liquidity\n- Asian market access\n\n## Head-to-Head Comparison\n\n| Feature | USDC | USDT |\n|---------|------|------|\n| **Transparency** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |\n| **Liquidity** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |\n| **Regulation** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |\n| **Adoption** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |\n| **Institutional** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |\n\n## 2025 Outlook\n\n### USDC Catalysts\n- MiCA compliance driving EU adoption\n- Traditional finance integrations\n- Central bank partnerships\n- US regulatory clarity\n\n### USDT Strengths\n- Unmatched global liquidity\n- Emerging market dominance\n- Trading pair ubiquity\n- Network effects\n\n## Institutional Recommendations\n\nFor most institutional use cases, we recommend:\n\n1. **Primary**: USDC for regulatory compliance and transparency\n2. **Secondary**: USDT for liquidity and trading\n3. **Diversification**: Hold both to minimize single-issuer risk\n4. **Strategy**: Use USDC for settlements, USDT for trading\n\n## Risk Considerations\n\nAll stablecoins carry risks:\n\n- **Depeg Risk**: Temporary price deviations during market stress\n- **Regulatory Risk**: Changing regulations affecting operations\n- **Counterparty Risk**: Dependence on issuer solvency\n- **Smart Contract Risk**: Protocol vulnerabilities\n\n## Conclusion\n\nBoth USDC and USDT have roles in institutional crypto portfolios. USDC offers superior transparency and regulatory compliance, while USDT provides unmatched liquidity and global reach. Understanding these differences enables better strategic decision-making.',
  'stablecoins',
  'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&h=600&fit=crop',
  10
),
(
  'Layer 2 Ecosystem Reaches $42B TVL Milestone',
  'layer-2-ecosystem-42b-tvl-milestone',
  'Ethereum Layer 2 solutions see explosive growth as institutions seek scalability and lower fees.',
  E'# Layer 2 Ecosystem Reaches $42B TVL Milestone\n\nEthereum Layer 2 solutions have crossed a major milestone, with Total Value Locked (TVL) reaching $42.1B, representing 5.2% monthly growth and signaling massive institutional interest in scalable blockchain infrastructure.\n\n## What Are Layer 2s?\n\nLayer 2 solutions are scaling technologies built on top of Ethereum that provide:\n\n- **Lower Fees**: Transactions cost 90-99% less than Ethereum mainnet\n- **Higher Speed**: Thousands of transactions per second\n- **Ethereum Security**: Inherit Ethereum''s security guarantees\n- **DeFi Access**: Full compatibility with Ethereum DeFi protocols\n\n## Leading L2 Solutions\n\n### Arbitrum ($15.2B TVL)\nThe largest L2 by total value locked:\n\n- **Optimistic Rollup**: Fraud-proof based security\n- **DeFi Ecosystem**: 200+ protocols deployed\n- **Institutional Adoption**: Partnerships with major exchanges\n- **Native Token**: ARB for governance\n\n### Optimism ($8.7B TVL)\nThe second-largest, known for developer-friendly approach:\n\n- **OP Stack**: Modular framework for building L2s\n- **Superchain**: Vision for interconnected L2 network\n- **Public Goods Funding**: Innovative retroactive funding model\n- **Base Partnership**: Coinbase''s Base built on OP Stack\n\n### Base ($12.1B TVL)\nCoinbase''s institutional-grade L2:\n\n- **Coinbase Backing**: Direct integration with largest US exchange\n- **Institutional Focus**: Built for institutional use cases\n- **Rapid Growth**: Fastest-growing L2 in 2024-2025\n- **Bridge Integration**: Seamless on/off ramps\n\n### zkSync ($3.8B TVL)\nZero-knowledge proof based scaling:\n\n- **ZK Rollups**: Mathematical proofs for security\n- **Privacy**: Enhanced transaction privacy\n- **Future-Proof**: Most advanced cryptographic approach\n- **Ecosystem**: Growing DeFi and NFT ecosystem\n\n### Polygon zkEVM ($2.3B TVL)\nPolygon''s zero-knowledge solution:\n\n- **EVM Compatibility**: Full Ethereum compatibility\n- **Enterprise Partnerships**: Disney, Starbucks, Reddit\n- **Hybrid Approach**: Combining PoS and zkEVM\n- **Developer Tooling**: Extensive infrastructure\n\n## Why Institutions Are Moving to L2\n\n### Cost Savings\nDramatic reduction in transaction costs:\n\n- **Ethereum Mainnet**: $5-50 per transaction\n- **Layer 2**: $0.01-0.50 per transaction\n- **Annual Savings**: Millions for high-volume users\n\n### Performance\nSignificantly higher throughput:\n\n- **Ethereum**: 15-30 TPS\n- **Layer 2**: 2,000-4,000 TPS\n- **Confirmation Time**: Under 2 seconds\n\n### User Experience\nImproved experience for end users:\n\n- **Instant Transactions**: Near-instant finality\n- **Lower Barriers**: Affordable for smaller transactions\n- **Mobile-Friendly**: Suitable for consumer applications\n\n## Institutional Use Cases\n\n### Payments\n- Cross-border remittances\n- Micropayments\n- Merchant settlements\n- Payroll processing\n\n### DeFi\n- High-frequency trading\n- Liquidity provision\n- Yield farming\n- Derivatives trading\n\n### NFTs and Gaming\n- NFT marketplaces\n- Gaming assets\n- Digital collectibles\n- Metaverse infrastructure\n\n### Enterprise\n- Supply chain tracking\n- Loyalty programs\n- Identity systems\n- Document management\n\n## Growth Projections\n\nAnalysts project continued explosive growth:\n\n**2025 EOY**: $100B+ TVL across all L2s\n\n**2026**: L2 TVL surpassing Ethereum mainnet\n\n**2027**: 80% of Ethereum activity on L2s\n\n## Risks and Challenges\n\n### Technical Risks\n- Smart contract vulnerabilities\n- Bridge security\n- Centralization concerns\n- Sequencer failures\n\n### Fragmentation\n- Liquidity split across chains\n- User experience complexity\n- Cross-L2 communication\n- Developer resource allocation\n\n### Regulatory\n- Unclear regulatory treatment\n- Compliance requirements\n- Geographic restrictions\n- AML/KYC challenges\n\n## Investment Opportunities\n\nFor institutional investors:\n\n1. **Direct L2 Tokens**: ARB, OP for governance exposure\n2. **L2-Native Protocols**: DeFi projects built on L2s\n3. **Infrastructure Providers**: Sequencers, bridges, oracles\n4. **Development Tools**: Tooling and infrastructure companies\n\n## Conclusion\n\nLayer 2 solutions represent the future of Ethereum scaling. With $42B in TVL and growing institutional adoption, L2s are transitioning from experimental technology to critical infrastructure. Institutions ignoring this shift risk being left behind as the ecosystem continues its rapid evolution.',
  'l2s',
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=600&fit=crop',
  12
);

-- Success message
SELECT 'Migration completed successfully! Articles table created and seeded with sample data.' as message;
