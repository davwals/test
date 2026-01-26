// StakingRewards API Integration for Terminal
const STAKING_REWARDS_API_KEY = 'ee8b4f23-152e-4734-a262-df7a5eb8b41d';
const STAKING_REWARDS_API_URL = 'https://api.stakingrewards.com/public/query';

// CoinGecko API for total crypto market cap
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

// GrowthePie API for Ethereum ecosystem TPS
const GROWTHEPIE_API_URL = 'https://api.growthepie.com/v1/fundamentals.json';

// DeFi Llama API for DeFi TVL
const DEFILLAMA_API_URL = 'https://api.llama.fi';

/**
 * GraphQL query to get Ethereum staking metrics
 */
const ETHEREUM_STAKING_QUERY = `
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
`;

/**
 * Fetch Ethereum staking data from StakingRewards API
 */
async function fetchEthereumStakingData() {
  try {
    const response = await fetch(STAKING_REWARDS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': STAKING_REWARDS_API_KEY
      },
      body: JSON.stringify({
        query: ETHEREUM_STAKING_QUERY
      })
    });

    if (!response.ok) {
      throw new Error(`StakingRewards API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return null;
    }

    // Validate response structure
    if (!data.data || !data.data.assets || data.data.assets.length === 0) {
      console.error('No Ethereum data in StakingRewards response');
      return null;
    }

    return data.data.assets[0];
  } catch (error) {
    console.error('Error fetching staking data:', error);
    return null;
  }
}

/**
 * Fetch total crypto market data from CoinGecko API
 */
async function fetchTotalCryptoMarketCap() {
  try {
    const response = await fetch(`${COINGECKO_API_URL}/global`);

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data) {
      console.error('No data in CoinGecko global response');
      return null;
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching total crypto market cap:', error);
    return null;
  }
}

/**
 * Fetch 7-day change data from CoinGecko
 */
async function fetch7DayChange(coinId) {
  try {
    const response = await fetch(`${COINGECKO_API_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=7`);

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.market_caps || data.market_caps.length < 2) {
      console.warn(`Insufficient market cap data for ${coinId}`);
      return null;
    }

    const firstValue = data.market_caps[0][1];
    const lastValue = data.market_caps[data.market_caps.length - 1][1];

    if (!firstValue || !lastValue || firstValue === 0) {
      console.warn(`Invalid market cap values for ${coinId}`);
      return null;
    }

    const percentChange = ((lastValue - firstValue) / firstValue) * 100;
    return percentChange;
  } catch (error) {
    console.error(`Error fetching 7-day change for ${coinId}:`, error);
    return null;
  }
}

/**
 * Format staking data for terminal display
 */
function formatStakingDataForTerminal(stakingData) {
  if (!stakingData || !stakingData.metrics) {
    return null;
  }

  const metrics = stakingData.metrics;
  const rewardOption = stakingData.rewardOptions?.find(r => r.type === 'staking') || stakingData.rewardOptions?.[0];

  return {
    marketCap: metrics.marketCap || 0,
    totalStakedETH: metrics.stakedTokens || 0,
    totalStakedUSD: metrics.totalStakedUSD || 0,
    stakingRatio: metrics.stakingRatio || 0,
    rewardRate: metrics.rewardRate || 0,
    apr: rewardOption?.apr || metrics.rewardRate || 0,
    apy: rewardOption?.apy || rewardOption?.apr || 0,
    activeValidators: metrics.activeValidators || 0,
    inflationRate: metrics.inflationRate || 0
  };
}

/**
 * Update terminal tiles with live staking data
 */
async function updateTerminalWithStakingData() {
  const stakingData = await fetchEthereumStakingData();
  const formattedData = formatStakingDataForTerminal(stakingData);

  if (!formattedData) {
    console.error('Failed to fetch staking data');
    return;
  }

  // Update Staked ETH USD tile
  const stakedUSDTile = document.querySelector('[data-metric="eth-staked-usd"]');
  if (stakedUSDTile && formattedData.totalStakedUSD > 0) {
    const valueEl = stakedUSDTile.querySelector('.metric-value');
    const changeEl = stakedUSDTile.querySelector('.metric-change');

    if (valueEl) {
      const stakedUSDInB = (formattedData.totalStakedUSD / 1000000000).toFixed(2);
      valueEl.textContent = `$${stakedUSDInB}B`;
    }

    if (changeEl && formattedData.totalStakedETH > 0) {
      const stakedInMillions = (formattedData.totalStakedETH / 1000000).toFixed(2);
      changeEl.textContent = `${stakedInMillions}M ETH`;
    }
  }

  // Update Staking Ratio tile
  const stakingRatioTile = document.querySelector('[data-metric="eth-staking-ratio"]');
  if (stakingRatioTile && formattedData.stakingRatio > 0) {
    const valueEl = stakingRatioTile.querySelector('.metric-value');
    if (valueEl) {
      valueEl.textContent = `${formattedData.stakingRatio.toFixed(2)}%`;
    }
  }

  // Update Staking APR tile
  const aprTile = document.querySelector('[data-metric="eth-staking-apr"]');
  if (aprTile && formattedData.apr > 0) {
    const valueEl = aprTile.querySelector('.metric-value');
    if (valueEl) {
      valueEl.textContent = `${formattedData.apr.toFixed(2)}%`;
    }
  }

  // Update last API pull timestamp
  if (typeof window.updateLastAPITime === 'function') {
    window.updateLastAPITime();
  }

  return formattedData;
}

/**
 * Update ETH Market Cap tile using CoinGecko API
 */
async function updateEthMarketCap() {
  try {
    const response = await fetch(`${COINGECKO_API_URL}/coins/ethereum`);

    if (!response.ok) {
      console.error('Failed to fetch ETH data from CoinGecko:', response.status);
      return;
    }

    const ethData = await response.json();

    if (!ethData.market_data || !ethData.market_data.market_cap) {
      console.error('Invalid ETH data structure from CoinGecko');
      return;
    }

    const marketCapTile = document.querySelector('[data-metric="eth-market-cap"]');
    if (!marketCapTile) return;

    const valueEl = marketCapTile.querySelector('.metric-value');
    const changeEl = marketCapTile.querySelector('.metric-change');

    if (valueEl && ethData.market_data.market_cap.usd) {
      const marketCapInB = (ethData.market_data.market_cap.usd / 1000000000).toFixed(2);
      valueEl.textContent = `$${marketCapInB}B`;
    }

    if (changeEl) {
      const change7d = ethData.market_data.market_cap_change_percentage_7d;
      if (change7d !== null && change7d !== undefined) {
        const isPositive = change7d > 0;
        const arrow = isPositive ? '↑' : '↓';
        changeEl.textContent = `${arrow} ${Math.abs(change7d).toFixed(2)}% (7d)`;
        changeEl.className = isPositive
          ? 'text-[10px] text-emerald-500/70 metric-change'
          : 'text-[10px] text-red-500/70 metric-change';
      }
    }
  } catch (error) {
    console.error('Error updating ETH market cap:', error);
  }
}

/**
 * Update total crypto market cap tile
 */
async function updateTotalCryptoMarketCap() {
  const globalData = await fetchTotalCryptoMarketCap();

  if (!globalData || !globalData.total_market_cap || !globalData.total_market_cap.usd) {
    console.error('Invalid global market cap data');
    return;
  }

  const marketCapTile = document.querySelector('[data-metric="total-crypto-market-cap"]');
  if (!marketCapTile) return;

  const valueEl = marketCapTile.querySelector('.metric-value');
  const changeEl = marketCapTile.querySelector('.metric-change');

  // Total market cap in trillions
  const totalMarketCap = globalData.total_market_cap.usd / 1000000000000;

  if (valueEl) {
    valueEl.textContent = `$${totalMarketCap.toFixed(2)}T`;
  }

  // Fetch 7-day change for Bitcoin as proxy for total market
  if (changeEl) {
    const change7d = await fetch7DayChange('bitcoin');
    if (change7d !== null) {
      const isPositive = change7d > 0;
      const arrow = isPositive ? '↑' : '↓';
      changeEl.textContent = `${arrow} ${Math.abs(change7d).toFixed(2)}% (7d)`;
      changeEl.className = isPositive
        ? 'text-[10px] text-emerald-500/70 metric-change'
        : 'text-[10px] text-red-500/70 metric-change';
    }
  }
}

/**
 * Update stablecoin supply tile with real data from CoinGecko
 * Using /coins/categories endpoint for accurate total market cap
 */
async function updateStablecoinSupply() {
  try {
    // Use categories endpoint to get accurate stablecoin market cap total
    const response = await fetch(`${COINGECKO_API_URL}/coins/categories`);

    if (!response.ok) {
      console.error('Failed to fetch categories data:', response.status);
      return;
    }

    const categories = await response.json();

    if (!Array.isArray(categories) || categories.length === 0) {
      console.error('Invalid categories data');
      return;
    }

    // Find the stablecoin category
    const stablecoinCategory = categories.find(cat =>
      cat.id === 'stablecoins' ||
      cat.name.toLowerCase().includes('stablecoin')
    );

    if (!stablecoinCategory) {
      console.error('Stablecoin category not found');
      return;
    }

    const stablecoinTile = document.querySelector('[data-metric="stablecoin-supply"]');
    if (!stablecoinTile) return;

    const valueEl = stablecoinTile.querySelector('.metric-value');
    const changeEl = stablecoinTile.querySelector('.metric-change');

    if (valueEl && stablecoinCategory.market_cap) {
      const marketCapInB = (stablecoinCategory.market_cap / 1000000000).toFixed(2);
      valueEl.textContent = `$${marketCapInB}B`;
    }

    if (changeEl && stablecoinCategory.market_cap_change_24h !== null && stablecoinCategory.market_cap_change_24h !== undefined) {
      const change24h = stablecoinCategory.market_cap_change_24h;
      const isPositive = change24h > 0;
      const arrow = isPositive ? '↑' : '↓';
      changeEl.textContent = `${arrow} ${Math.abs(change24h).toFixed(2)}% (24h)`;
      changeEl.className = isPositive
        ? 'text-[10px] text-emerald-500/70 metric-change'
        : 'text-[10px] text-red-500/70 metric-change';
    }
  } catch (error) {
    console.error('Error updating stablecoin supply:', error);
  }
}

/**
 * Fetch DeFi TVL from DeFi Llama API
 */
async function fetchDefiTVL() {
  try {
    const response = await fetch(`${DEFILLAMA_API_URL}/charts`);

    if (!response.ok) {
      throw new Error(`DeFi Llama API error: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.error('Invalid DeFi Llama data');
      return null;
    }

    const mostRecent = data[data.length - 1];

    if (!mostRecent.totalLiquidityUSD || !mostRecent.date) {
      console.error('Invalid DeFi Llama data structure');
      return null;
    }

    // Find the data point from 7 days ago (Unix timestamp in seconds)
    const currentTimestamp = mostRecent.date;
    const sevenDaysAgoTimestamp = currentTimestamp - (7 * 24 * 60 * 60);

    // Find closest data point to 7 days ago
    let sevenDaysAgo = data[0];
    let minDiff = Math.abs(sevenDaysAgo.date - sevenDaysAgoTimestamp);

    for (const point of data) {
      const diff = Math.abs(point.date - sevenDaysAgoTimestamp);
      if (diff < minDiff) {
        minDiff = diff;
        sevenDaysAgo = point;
      }
    }

    if (!sevenDaysAgo.totalLiquidityUSD) {
      console.error('Invalid historical TVL data');
      return null;
    }

    const currentTVL = mostRecent.totalLiquidityUSD;
    const previousTVL = sevenDaysAgo.totalLiquidityUSD;
    const change7d = ((currentTVL - previousTVL) / previousTVL) * 100;

    return {
      tvl: currentTVL,
      change7d: change7d
    };
  } catch (error) {
    console.error('Error fetching DeFi TVL:', error);
    return null;
  }
}

/**
 * Update DeFi TVL tile
 */
async function updateDefiTVL() {
  const defiData = await fetchDefiTVL();

  if (!defiData) return;

  const defiTile = document.querySelector('[data-metric="defi-tvl"]');
  if (!defiTile) return;

  const valueEl = defiTile.querySelector('.metric-value');
  const changeEl = defiTile.querySelector('.metric-change');

  if (valueEl) {
    const tvlInB = (defiData.tvl / 1000000000).toFixed(2);
    valueEl.textContent = `$${tvlInB}B`;
  }

  if (changeEl) {
    const isPositive = defiData.change7d > 0;
    const arrow = isPositive ? '↑' : '↓';
    changeEl.textContent = `${arrow} ${Math.abs(defiData.change7d).toFixed(2)}% (7d)`;
    changeEl.className = isPositive
      ? 'text-[10px] text-emerald-500/70 metric-change'
      : 'text-[10px] text-red-500/70 metric-change';
  }
}

/**
 * Fetch L2 TVL from DeFi Llama API
 */
async function fetchL2TVL() {
  try {
    // DeFi Llama chains endpoint gives TVL per chain
    const response = await fetch(`${DEFILLAMA_API_URL}/v2/chains`);

    if (!response.ok) {
      throw new Error(`DeFi Llama API error: ${response.status}`);
    }

    const chains = await response.json();

    if (!Array.isArray(chains) || chains.length === 0) {
      console.error('Invalid DeFi Llama chains data');
      return null;
    }

    // Filter for L2 chains
    const l2Chains = chains.filter(chain => {
      const name = chain.name.toLowerCase();
      return name.includes('arbitrum') ||
             name.includes('optimism') ||
             name.includes('base') ||
             name.includes('polygon') ||
             name.includes('zksync') ||
             name.includes('starknet') ||
             name.includes('linea') ||
             name.includes('scroll') ||
             name.includes('mantle') ||
             name.includes('blast') ||
             name.includes('metis') ||
             name.includes('mode') ||
             name.includes('zora');
    });

    // Sum up TVL across all L2s
    const totalL2TVL = l2Chains.reduce((sum, chain) => sum + (chain.tvl || 0), 0);

    // Calculate 7-day change if available
    const currentTVL = totalL2TVL;
    const previousTVL = l2Chains.reduce((sum, chain) => {
      const change = chain.chainId && chain.change_7d ? currentTVL / (1 + (chain.change_7d / 100)) : chain.tvl;
      return sum + (change || 0);
    }, 0);

    const change7d = previousTVL > 0 ? ((currentTVL - previousTVL) / previousTVL) * 100 : 0;

    return {
      tvl: totalL2TVL,
      change7d: change7d,
      chainCount: l2Chains.length
    };
  } catch (error) {
    console.error('Error fetching L2 TVL:', error);
    return null;
  }
}

/**
 * Update L2 TVL tile
 */
async function updateL2TVL() {
  const l2Data = await fetchL2TVL();

  if (!l2Data || l2Data.tvl === 0) return;

  const l2Tile = document.querySelector('[data-metric="l2-tvl"]');
  if (!l2Tile) return;

  const valueEl = l2Tile.querySelector('.metric-value');
  const changeEl = l2Tile.querySelector('.metric-change');

  if (valueEl) {
    const tvlInB = (l2Data.tvl / 1000000000).toFixed(2);
    valueEl.textContent = `$${tvlInB}B`;
  }

  if (changeEl && l2Data.change7d !== 0) {
    const isPositive = l2Data.change7d > 0;
    const arrow = isPositive ? '↑' : '↓';
    changeEl.textContent = `${arrow} ${Math.abs(l2Data.change7d).toFixed(2)}% (7d)`;
    changeEl.className = isPositive
      ? 'text-[10px] text-emerald-500/70 metric-change'
      : 'text-[10px] text-red-500/70 metric-change';
  }
}

/**
 * Fetch Ethereum ecosystem TPS from GrowthePie API with cache busting
 */
async function fetchEthereumEcosystemTPS() {
  try {
    // Add cache busting parameter
    const cacheBuster = `?_=${Date.now()}`;
    const response = await fetch(GROWTHEPIE_API_URL + cacheBuster, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`GrowthePie API error: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.error('Invalid GrowthePie data');
      return null;
    }

    // Filter for throughput metric
    const throughputData = data.filter(item => item.metric_key === 'throughput' && item.value > 0);

    if (throughputData.length === 0) {
      console.warn('No throughput data found in GrowthePie API');
      return null;
    }

    // Get the most recent date
    const dates = [...new Set(throughputData.map(item => item.date))];
    dates.sort((a, b) => new Date(b) - new Date(a));
    const mostRecentDate = dates[0];

    // Get all throughput values for the most recent date, excluding aggregates
    const recentThroughput = throughputData
      .filter(item => item.date === mostRecentDate)
      .filter(item => item.origin_key !== 'ethereum' && item.origin_key !== 'all_l2s' && item.origin_key !== 'multiple_l2s');

    // Sum up TPS across all chains
    const totalTPS = recentThroughput.reduce((sum, item) => sum + (item.value || 0), 0);

    if (totalTPS === 0) {
      console.warn('Total TPS is 0, data may be stale');
      return null;
    }

    return {
      tps: totalTPS,
      date: mostRecentDate,
      chainCount: recentThroughput.length
    };
  } catch (error) {
    console.error('Error fetching Ethereum ecosystem TPS:', error);
    return null;
  }
}

/**
 * Update Ethereum ecosystem TPS tile
 */
async function updateEthereumEcosystemTPS() {
  const tpsData = await fetchEthereumEcosystemTPS();

  if (!tpsData || tpsData.tps === 0) return;

  const tpsTile = document.querySelector('[data-metric="eth-ecosystem-tps"]');
  if (!tpsTile) return;

  const valueEl = tpsTile.querySelector('.metric-value');
  const changeEl = tpsTile.querySelector('.metric-change');

  if (valueEl) {
    const formattedTPS = Math.round(tpsData.tps).toLocaleString('en-US');
    valueEl.textContent = `${formattedTPS}`;
  }

  if (changeEl) {
    changeEl.textContent = `${tpsData.chainCount} chains`;
  }
}

/**
 * Update market cap chart with 12-month total crypto market cap data
 * Optimized with parallel requests for faster loading
 */
async function updateMarketCapChart() {
  try {
    // Fetch Bitcoin data and global data in parallel for faster loading
    const [bitcoinResponse, globalResponse] = await Promise.all([
      fetch(`${COINGECKO_API_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=365&interval=daily`, {
        cache: 'no-cache'
      }),
      fetch(`${COINGECKO_API_URL}/global`, {
        cache: 'no-cache'
      })
    ]);

    if (!bitcoinResponse.ok) {
      throw new Error(`CoinGecko API error: ${bitcoinResponse.status}`);
    }

    if (!globalResponse.ok) {
      throw new Error(`CoinGecko global API error: ${globalResponse.status}`);
    }

    const [bitcoinData, globalDataWrapper] = await Promise.all([
      bitcoinResponse.json(),
      globalResponse.json()
    ]);

    if (!bitcoinData.market_caps || bitcoinData.market_caps.length === 0) {
      console.error('No Bitcoin market cap data');
      return;
    }

    const globalData = globalDataWrapper.data;

    if (!globalData || !globalData.market_cap_percentage || !globalData.market_cap_percentage.btc) {
      console.error('Invalid BTC dominance data');
      return;
    }

    const btcDominance = globalData.market_cap_percentage.btc / 100;

    if (btcDominance === 0) {
      console.error('BTC dominance is 0, cannot calculate total market cap');
      return;
    }

    // Calculate total market cap from Bitcoin market cap and dominance
    const historyData = bitcoinData.market_caps.map(point => ({
      x: point[0],
      y: point[1] / btcDominance
    }));

    if (!window.marketCapChartInstance) {
      console.error('Chart instance not found');
      return;
    }

    // Sample data to show roughly monthly points (every 30 days)
    const sampledData = historyData.filter((_, index) => index % 30 === 0 || index === historyData.length - 1);

    // Format dates and values
    const labels = sampledData.map(point => {
      const date = new Date(point.x);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const values = sampledData.map(point => point.y / 1000000000000); // Convert to trillions

    // Update chart data
    window.marketCapChartInstance.data.labels = labels;
    window.marketCapChartInstance.data.datasets[0].data = values;
    window.marketCapChartInstance.update('none'); // 'none' mode = no animation for faster update

    // Update the chart header with current value
    const currentValue = values[values.length - 1];
    const headerValue = document.querySelector('#marketCapChart')?.closest('.bg-zinc-900')?.querySelector('.text-lg.font-mono.font-bold');

    if (headerValue) {
      headerValue.textContent = `$${currentValue.toFixed(2)}T`;
    }
  } catch (error) {
    console.error('Error updating market cap chart:', error);
  }
}

/**
 * Initialize staking data updates with staggered loading to avoid rate limits
 * Optimized with parallel loading where safe
 */
async function initializeStakingData() {
  try {
    // Load critical tiles and chart in parallel for faster page load
    // These don't hit the same API endpoints so no rate limit concerns
    await Promise.all([
      updateTerminalWithStakingData(),
      updateTotalCryptoMarketCap(),
      updateMarketCapChart() // Chart loads in parallel for speed
    ]);

    // Stagger remaining CoinGecko calls to avoid rate limits
    setTimeout(() => updateEthMarketCap(), 500);
    setTimeout(() => updateStablecoinSupply(), 1000);

    // DeFi Llama calls (different API)
    setTimeout(() => updateDefiTVL(), 1500);
    setTimeout(() => updateL2TVL(), 2000);

    // GrowthePie call (different API)
    setTimeout(() => updateEthereumEcosystemTPS(), 2500);

    // Set up periodic updates with staggered intervals
    // StakingRewards: Every 30 minutes (slower changing data)
    setInterval(updateTerminalWithStakingData, 1800000); // 30 minutes

    // CoinGecko APIs: Every 5 minutes, staggered by 30 seconds
    setInterval(updateTotalCryptoMarketCap, 300000); // 5 minutes
    setTimeout(() => setInterval(updateEthMarketCap, 300000), 30000); // 5 min + 30sec
    setTimeout(() => setInterval(updateStablecoinSupply, 300000), 60000); // 5 min + 60sec
    setTimeout(() => setInterval(updateMarketCapChart, 300000), 90000); // 5 min + 90sec

    // DeFi Llama APIs: Every 5 minutes, staggered
    setTimeout(() => setInterval(updateDefiTVL, 300000), 120000); // 5 min + 120sec
    setTimeout(() => setInterval(updateL2TVL, 300000), 150000); // 5 min + 150sec

    // GrowthePie API: Every 5 minutes
    setTimeout(() => setInterval(updateEthereumEcosystemTPS, 300000), 180000); // 5 min + 180sec
  } catch (error) {
    console.error('Error initializing staking data:', error);
  }
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeStakingData);
  } else {
    initializeStakingData();
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchEthereumStakingData,
    fetchTotalCryptoMarketCap,
    fetchEthereumEcosystemTPS,
    fetchDefiTVL,
    fetchL2TVL,
    fetch7DayChange,
    formatStakingDataForTerminal,
    updateTerminalWithStakingData,
    updateMarketCapChart,
    updateTotalCryptoMarketCap,
    updateEthMarketCap,
    updateStablecoinSupply,
    updateDefiTVL,
    updateL2TVL,
    updateEthereumEcosystemTPS,
    initializeStakingData
  };
}
