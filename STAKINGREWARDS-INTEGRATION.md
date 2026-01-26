# StakingRewards API Integration Guide

## Overview
Integration with StakingRewards API to display live Ethereum staking metrics on the terminal dashboard.

**API Key:** `ee8b4f23-152e-4734-a262-df7a5eb8b41d`

---

## 1. Available Ethereum Staking Data

### Core Metrics
The StakingRewards API provides the following real-time Ethereum staking metrics:

| Metric | Description | Example Value |
|--------|-------------|---------------|
| **Total Staked ETH** | Total amount of ETH currently staked | 34.2M ETH |
| **Total Staked USD** | USD value of all staked ETH | $109.44B |
| **Staking Ratio** | Percentage of total ETH supply staked | 28.40% |
| **Reward Rate / APY** | Annual percentage yield for stakers | 3.2% - 4.5% |
| **APR** | Annual percentage rate (before compounding) | 3.1% - 4.3% |
| **Active Validators** | Number of active Ethereum validators | 1.2M+ |
| **Market Cap** | Total market capitalization of ETH | $385B |
| **Inflation Rate** | Network inflation rate | 0.5% - 1.0% |

### Reward Options
Different staking types available:
- **Solo Staking** - Running your own validator (32 ETH minimum)
- **Staking Pools** - Pooled staking services
- **Liquid Staking** - Staking with liquidity tokens (Lido, Rocket Pool, etc.)

### Historical Data
- Last 30 days, 90 days, 1 year
- Staked tokens over time
- Reward rate trends
- Validator count growth

---

## 2. Current Integration

### Tiles Updated in Terminal

#### ETH Staked Tile
**Location:** 7th tile in the metrics grid

**Data Displayed:**
- **Main Value:** Staking Ratio (percentage of ETH staked)
- **Subtext:** Total staked in millions of ETH

**Data Source:** Live from StakingRewards API
**Update Frequency:** Every 5 minutes

**Example:**
```
ETH Staked
28.40%
34.20M ETH
```

---

## 3. Additional Metrics You Can Add

### Option 1: ETH Staking APY Tile
Add a new tile to show current staking yield:

```html
<div class="bg-zinc-900 border border-zinc-800 rounded-xl p-3" data-metric="eth-staking-apy">
    <div class="text-[10px] text-zinc-500 mb-1 uppercase tracking-wide">ETH Staking APY</div>
    <div class="text-lg font-mono font-bold text-emerald-500 metric-value">3.75%</div>
    <div class="text-[10px] text-zinc-500 metric-change">Annual Yield</div>
</div>
```

### Option 2: Active Validators Tile
Track the number of Ethereum validators:

```html
<div class="bg-zinc-900 border border-zinc-800 rounded-xl p-3" data-metric="eth-validators">
    <div class="text-[10px] text-zinc-500 mb-1 uppercase tracking-wide">ETH Validators</div>
    <div class="text-lg font-mono font-bold text-white metric-value">1,200K</div>
    <div class="text-[10px] text-emerald-500/70 metric-change">↑ 2.4%</div>
</div>
```

### Option 3: Staking Rewards Chart
Add a historical chart showing staking growth:

```javascript
// In terminal.html, add a new chart for staking history
const stakingHistoryQuery = `
  query {
    asset(slug: "ethereum") {
      name
      metricChart(metric: "staked_tokens", from: "30d", interval: "1d") {
        x
        y
      }
    }
  }
`;
```

---

## 4. API Query Examples

### Basic Ethereum Metrics Query
```graphql
query {
  assets(where: { slugs: ["ethereum"] }) {
    name
    slug
    symbol
    metrics {
      marketCap
      totalStaked
      totalStakedUSD
      stakedTokens
      rewardRate
      inflationRate
      activeValidators
      stakingRatio
    }
    rewardOptions {
      type
      rewardRate
      apr
      apy
    }
  }
}
```

### Historical Staking Data Query
```graphql
query {
  asset(slug: "ethereum") {
    name
    metricChart(
      metric: "staked_tokens"
      from: "30d"
      interval: "1d"
    ) {
      x  # Timestamp
      y  # Value
    }
  }
}
```

### Validator Data Query
```graphql
query {
  asset(slug: "ethereum") {
    name
    metrics {
      activeValidators
      totalValidators
    }
    metricChart(
      metric: "active_validators"
      from: "90d"
      interval: "1d"
    ) {
      x
      y
    }
  }
}
```

---

## 5. Implementation Details

### Files
- **`stakingrewards-integration.js`** - Main integration script
- **`terminal.html`** - Updated with data attributes and script import
- **`STAKINGREWARDS-INTEGRATION.md`** - This documentation

### How It Works

1. **Page Load**
   - Script loads and calls `initializeStakingData()`
   - Makes GraphQL query to StakingRewards API
   - Updates tiles with live data

2. **Auto-Refresh**
   - Updates every 5 minutes (300,000ms)
   - Only updates visible metrics to reduce API calls

3. **Data Flow**
   ```
   StakingRewards API
         ↓
   fetchEthereumStakingData()
         ↓
   formatStakingDataForTerminal()
         ↓
   Update DOM elements
   ```

### Error Handling
- API failures log to console but don't break the page
- Shows placeholder data if API is unavailable
- Handles rate limiting gracefully

---

## 6. Testing the Integration

### 1. Check API Access
Open browser console and run:
```javascript
fetch('https://api.stakingrewards.com/public/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'ee8b4f23-152e-4734-a262-df7a5eb8b41d'
  },
  body: JSON.stringify({
    query: '{ assets(where: { slugs: ["ethereum"] }) { name } }'
  })
})
.then(r => r.json())
.then(d => console.log(d));
```

### 2. Verify Tile Updates
- Load terminal.html
- Open browser console
- Look for console logs from stakingrewards-integration.js
- Check that ETH Staked tile shows live data

### 3. Monitor Network Tab
- Open DevTools → Network tab
- Filter for "stakingrewards.com"
- Verify API requests are successful (200 status)

---

## 7. Customization Options

### Change Update Frequency
In `stakingrewards-integration.js`:
```javascript
// Update every 10 minutes instead of 5
setInterval(updateTerminalWithStakingData, 600000);
```

### Add More Metrics
To add a new metric:

1. Add HTML tile with `data-metric` attribute
2. Update `updateTerminalWithStakingData()` function
3. Query additional fields from API if needed

### Format Numbers Differently
Customize in `formatStakingDataForTerminal()`:
```javascript
// Example: Show staking ratio with 2 decimals
const stakingRatio = formattedData.stakingRatio.toFixed(2);
```

---

## 8. API Documentation Links

- **Main Docs:** https://api-docs.stakingrewards.com/
- **Quick Start:** https://api-docs.stakingrewards.com/api-docs/get-started/quick-start-guide
- **Schema Reference:** https://api-docs.stakingrewards.com/api-docs/schema
- **Query Samples:** https://api-docs.stakingrewards.com/api-docs/get-started/samples

---

## 9. Next Steps

### Recommended Additions:

1. **Add APY Tile**
   - Show current staking yield prominently
   - Help users understand staking returns

2. **Add Validator Count**
   - Track network growth
   - Show validator participation trends

3. **Add Historical Chart**
   - 30-day staking growth chart
   - Visual representation of adoption

4. **Add Staking Sidebar Widget**
   - Detailed staking breakdown
   - Solo vs Pool vs Liquid staking stats

5. **Add Real-time Updates Badge**
   - Show "Updated X seconds ago"
   - Indicate data freshness

---

## 10. Troubleshooting

### Issue: No data showing
- Check browser console for errors
- Verify API key is valid
- Check network requests in DevTools
- Ensure CORS isn't blocking requests

### Issue: Stale data
- Check `setInterval` is running
- Verify API isn't rate limiting
- Check for JavaScript errors preventing updates

### Issue: Wrong numbers
- Verify GraphQL query returns expected data
- Check data formatting in `formatStakingDataForTerminal()`
- Compare with StakingRewards.com website

---

## Support

For API issues, contact StakingRewards support or check their documentation at https://api-docs.stakingrewards.com/
