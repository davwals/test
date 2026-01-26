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
 * Update API status indicator
 */
function updateAPIStatus(apiName, status, message = '') {
  const statusEl = document.getElementById(`status-${apiName.toLowerCase()}`);
  if (statusEl) {
    const statusSpan = statusEl.querySelector('span');
    if (statusSpan) {
      if (status === 'success') {
        statusSpan.textContent = '✅ Working';
        statusSpan.className = 'text-emerald-500';
      } else if (status === 'error') {
        statusSpan.textContent = `❌ Failed${message ? ': ' + message : ''}`;
        statusSpan.className = 'text-red-500';
      } else {
        statusSpan.textContent = '⏳ Loading...';
        statusSpan.className = 'text-yellow-500';
      }
    }
  }
}

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
 * GraphQL query to get Ethereum historical market cap
 */
const ETHEREUM_MARKET_CAP_HISTORY_QUERY = `
  query {
    asset(slug: "ethereum") {
      name
      metricChart(metric: "market_cap", from: "30d", interval: "1d") {
        x
        y
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
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return null;
    }

    return data.data.assets[0];
  } catch (error) {
    console.error('Error fetching staking data:', error);
    return null;
  }
}

/**
 * Fetch Ethereum historical market cap data from StakingRewards API
 */
async function fetchEthereumMarketCapHistory() {
  try {
    const response = await fetch(STAKING_REWARDS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': STAKING_REWARDS_API_KEY
      },
      body: JSON.stringify({
        query: ETHEREUM_MARKET_CAP_HISTORY_QUERY
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return null;
    }

    return data.data.asset.metricChart;
  } catch (error) {
    console.error('Error fetching market cap history:', error);
    return null;
  }
}

/**
 * Fetch total crypto market data from CoinGecko API
 */
async function fetchTotalCryptoMarketCap() {
  try {
    console.log('Fetching from:', `${COINGECKO_API_URL}/global`);
    const response = await fetch(`${COINGECKO_API_URL}/global`);

    console.log('CoinGecko global response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CoinGecko API error response:', errorText);
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('CoinGecko global data received:', data.data ? 'Success' : 'No data');
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

    if (data.market_caps && data.market_caps.length > 0) {
      const firstValue = data.market_caps[0][1];
      const lastValue = data.market_caps[data.market_caps.length - 1][1];
      const percentChange = ((lastValue - firstValue) / firstValue) * 100;
      return percentChange;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching 7-day change for ${coinId}:`, error);
    return null;
  }
}

/**
 * Format staking data for terminal display
 */
function formatStakingDataForTerminal(stakingData) {
  if (!stakingData) return null;

  const metrics = stakingData.metrics;
  const rewardOption = stakingData.rewardOptions?.find(r => r.type === 'staking') || stakingData.rewardOptions?.[0];

  return {
    marketCap: metrics.marketCap,
    totalStakedETH: metrics.stakedTokens,
    totalStakedUSD: metrics.totalStakedUSD,
    stakingRatio: metrics.stakingRatio || ((metrics.stakedTokens / 120000000) * 100), // Approximate
    rewardRate: metrics.rewardRate,
    apr: rewardOption?.apr || metrics.rewardRate,
    apy: rewardOption?.apy || rewardOption?.apr,
    activeValidators: metrics.activeValidators,
    inflationRate: metrics.inflationRate
  };
}

/**
 * Update terminal tiles with live staking data
 */
async function updateTerminalWithStakingData() {
  updateAPIStatus('stakingrewards', 'loading');

  const stakingData = await fetchEthereumStakingData();
  const formattedData = formatStakingDataForTerminal(stakingData);

  if (!formattedData) {
    console.error('Failed to fetch staking data');
    updateAPIStatus('stakingrewards', 'error', 'Failed to fetch data');
    return;
  }

  updateAPIStatus('stakingrewards', 'success');

  // Update ETH Staked tile
  const ethStakedTile = document.querySelector('[data-metric="eth-staked"]');
  if (ethStakedTile) {
    const valueEl = ethStakedTile.querySelector('.metric-value');
    const changeEl = ethStakedTile.querySelector('.metric-change');

    const stakedInMillions = (formattedData.totalStakedETH / 1000000).toFixed(2);
    const stakingRatio = formattedData.stakingRatio.toFixed(1);

    if (valueEl) valueEl.textContent = `${stakingRatio}%`;
    if (changeEl) changeEl.textContent = `${stakedInMillions}M ETH`;
  }

  // Update ETH Staking APY tile (if you want to add a new one)
  const apyTile = document.querySelector('[data-metric="eth-staking-apy"]');
  if (apyTile) {
    const valueEl = apyTile.querySelector('.metric-value');
    const changeEl = apyTile.querySelector('.metric-change');

    if (valueEl) valueEl.textContent = `${formattedData.apy.toFixed(2)}%`;
    if (changeEl) changeEl.textContent = `APY`;
  }

  // Update Active Validators tile (if you want to add a new one)
  const validatorsTile = document.querySelector('[data-metric="eth-validators"]');
  if (validatorsTile) {
    const valueEl = validatorsTile.querySelector('.metric-value');

    const validatorsInK = (formattedData.activeValidators / 1000).toFixed(1);
    if (valueEl) valueEl.textContent = `${validatorsInK}K`;
  }

  // Update ETH Market Cap tile - Now using CoinGecko
  await updateEthMarketCap();

  // Update Staked ETH USD tile
  const stakedUSDTile = document.querySelector('[data-metric="eth-staked-usd"]');
  if (stakedUSDTile) {
    const valueEl = stakedUSDTile.querySelector('.metric-value');
    const changeEl = stakedUSDTile.querySelector('.metric-change');

    if (formattedData.totalStakedUSD && valueEl) {
      const stakedUSDInB = (formattedData.totalStakedUSD / 1000000000).toFixed(2);
      valueEl.textContent = `$${stakedUSDInB}B`;
    }

    if (formattedData.totalStakedETH && changeEl) {
      const stakedInMillions = (formattedData.totalStakedETH / 1000000).toFixed(2);
      changeEl.textContent = `${stakedInMillions}M ETH`;
    }
  }

  // Update Staking Ratio tile
  const stakingRatioTile = document.querySelector('[data-metric="eth-staking-ratio"]');
  if (stakingRatioTile) {
    const valueEl = stakingRatioTile.querySelector('.metric-value');

    if (formattedData.stakingRatio && valueEl) {
      valueEl.textContent = `${formattedData.stakingRatio.toFixed(2)}%`;
    }
  }

  // Update Staking APR tile
  const aprTile = document.querySelector('[data-metric="eth-staking-apr"]');
  if (aprTile) {
    const valueEl = aprTile.querySelector('.metric-value');

    if (formattedData.apr && valueEl) {
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
    console.log('Fetching ETH data from CoinGecko...');
    const response = await fetch(`${COINGECKO_API_URL}/coins/ethereum`);

    console.log('ETH response status:', response.status);

    if (!response.ok) {
      console.error('Failed to fetch ETH data from CoinGecko:', response.status);
      return;
    }

    const ethData = await response.json();
    console.log('ETH data received');

    const marketCapTile = document.querySelector('[data-metric="eth-market-cap"]');
    if (marketCapTile) {
      const valueEl = marketCapTile.querySelector('.metric-value');
      const changeEl = marketCapTile.querySelector('.metric-change');

      if (valueEl && ethData.market_data) {
        const marketCapInB = (ethData.market_data.market_cap.usd / 1000000000).toFixed(2);
        valueEl.textContent = `$${marketCapInB}B`;
        console.log('Updated ETH market cap to:', valueEl.textContent);
      }

      if (changeEl && ethData.market_data) {
        const change7d = ethData.market_data.market_cap_change_percentage_7d || 0;
        const isPositive = change7d > 0;
        const arrow = isPositive ? '↑' : '↓';
        changeEl.textContent = `${arrow} ${Math.abs(change7d).toFixed(2)}% (7d)`;
        changeEl.className = isPositive
          ? 'text-[10px] text-emerald-500/70 metric-change'
          : 'text-[10px] text-red-500/70 metric-change';
        console.log('Updated ETH change to:', changeEl.textContent);
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
  updateAPIStatus('coingecko', 'loading');

  const globalData = await fetchTotalCryptoMarketCap();

  if (!globalData) {
    updateAPIStatus('coingecko', 'error', 'Failed to fetch global data');
    return;
  }

  const marketCapTile = document.querySelector('[data-metric="total-crypto-market-cap"]');
  if (marketCapTile) {
    const valueEl = marketCapTile.querySelector('.metric-value');
    const changeEl = marketCapTile.querySelector('.metric-change');

    // Total market cap in trillions
    const totalMarketCap = globalData.total_market_cap.usd / 1000000000000;

    if (valueEl) {
      valueEl.textContent = `$${totalMarketCap.toFixed(2)}T`;
    }

    // Fetch 7-day change for Bitcoin as proxy for total market
    const change7d = await fetch7DayChange('bitcoin');

    if (changeEl && change7d !== null) {
      const isPositive = change7d > 0;
      const arrow = isPositive ? '↑' : '↓';
      changeEl.textContent = `${arrow} ${Math.abs(change7d).toFixed(2)}% (7d)`;
      changeEl.className = isPositive
        ? 'text-[10px] text-emerald-500/70 metric-change'
        : 'text-[10px] text-red-500/70 metric-change';
    }

    updateAPIStatus('coingecko', 'success');
  }
}

/**
 * Update stablecoin supply tile with real data from CoinGecko
 */
async function updateStablecoinSupply() {
  try {
    console.log('Fetching stablecoin data from CoinGecko...');

    // Fetch top 100 stablecoins to ensure we get all major ones
    const response = await fetch(`${COINGECKO_API_URL}/coins/markets?vs_currency=usd&category=stablecoins&order=market_cap_desc&per_page=100&page=1&price_change_percentage=7d`);

    console.log('Stablecoin response status:', response.status);

    if (!response.ok) {
      console.error('Failed to fetch stablecoin data:', response.status);
      return;
    }

    const stablecoins = await response.json();
    console.log('Stablecoins fetched:', stablecoins.length);

    // Sum up total stablecoin market cap
    const totalStablecoinMcap = stablecoins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
    console.log('Total stablecoin market cap:', (totalStablecoinMcap / 1000000000).toFixed(2) + 'B');

    // Calculate 7-day change - use price_change_percentage_7d_in_currency field
    const totalMcap7dAgo = stablecoins.reduce((sum, coin) => {
      if (coin.price_change_percentage_7d_in_currency !== null && coin.price_change_percentage_7d_in_currency !== undefined) {
        const price7dAgo = coin.current_price / (1 + (coin.price_change_percentage_7d_in_currency / 100));
        const mcap7dAgo = price7dAgo * (coin.circulating_supply || 0);
        return sum + mcap7dAgo;
      }
      return sum + (coin.market_cap || 0); // Fallback if no 7d data
    }, 0);

    const change7d = ((totalStablecoinMcap - totalMcap7dAgo) / totalMcap7dAgo) * 100;
    console.log('Stablecoin 7d change:', change7d.toFixed(2) + '%');

    const stablecoinTile = document.querySelector('[data-metric="stablecoin-supply"]');
    if (stablecoinTile) {
      const valueEl = stablecoinTile.querySelector('.metric-value');
      const changeEl = stablecoinTile.querySelector('.metric-change');

      if (valueEl) {
        valueEl.textContent = `$${(totalStablecoinMcap / 1000000000).toFixed(2)}B`;
        console.log('Updated stablecoin tile to:', valueEl.textContent);
      }

      if (changeEl) {
        const isPositive = change7d > 0;
        const arrow = isPositive ? '↑' : '↓';
        changeEl.textContent = `${arrow} ${Math.abs(change7d).toFixed(2)}% (7d)`;
        changeEl.className = isPositive
          ? 'text-[10px] text-emerald-500/70 metric-change'
          : 'text-[10px] text-red-500/70 metric-change';
      }
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
    console.log('Fetching DeFi TVL from DeFi Llama...');
    const response = await fetch(`${DEFILLAMA_API_URL}/charts`);

    console.log('DeFi Llama response status:', response.status);

    if (!response.ok) {
      throw new Error(`DeFi Llama API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('DeFi Llama data points:', data.length);

    // Get the most recent TVL data point
    if (data && data.length > 0) {
      const mostRecent = data[data.length - 1];
      console.log('Most recent TVL:', mostRecent);

      // Find the data point from 7 days ago (Unix timestamp)
      const currentTimestamp = mostRecent.date;
      const sevenDaysAgoTimestamp = currentTimestamp - (7 * 24 * 60 * 60); // 7 days in seconds

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

      console.log('Seven days ago TVL:', sevenDaysAgo);

      const currentTVL = mostRecent.totalLiquidityUSD;
      const previousTVL = sevenDaysAgo.totalLiquidityUSD;
      const change7d = ((currentTVL - previousTVL) / previousTVL) * 100;

      console.log('Current TVL:', (currentTVL / 1000000000).toFixed(2) + 'B');
      console.log('TVL 7d change:', change7d.toFixed(2) + '%');

      return {
        tvl: currentTVL,
        change7d: change7d
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching DeFi TVL:', error);
    return null;
  }
}

/**
 * Update DeFi TVL tile
 */
async function updateDefiTVL() {
  updateAPIStatus('defillama', 'loading');

  const defiData = await fetchDefiTVL();

  if (!defiData) {
    updateAPIStatus('defillama', 'error', 'Failed to fetch TVL');
    return;
  }

  const defiTile = document.querySelector('[data-metric="defi-tvl"]');
  if (defiTile) {
    const valueEl = defiTile.querySelector('.metric-value') || defiTile.querySelector('.text-lg');
    const changeEl = defiTile.querySelector('.metric-change') || defiTile.querySelector('.text-\\[10px\\]');

    if (valueEl) {
      const tvlInB = (defiData.tvl / 1000000000).toFixed(2);
      valueEl.textContent = `$${tvlInB}B`;
      console.log('Updated DeFi TVL tile to:', valueEl.textContent);
    }

    if (changeEl) {
      const isPositive = defiData.change7d > 0;
      const arrow = isPositive ? '↑' : '↓';
      changeEl.textContent = `${arrow} ${Math.abs(defiData.change7d).toFixed(2)}% (7d)`;
      changeEl.className = isPositive
        ? 'text-[10px] text-emerald-500/70 metric-change'
        : 'text-[10px] text-red-500/70 metric-change';
      console.log('Updated DeFi TVL change to:', changeEl.textContent);
    }

    updateAPIStatus('defillama', 'success');
  }
}

/**
 * Fetch total crypto market cap history (12 months) from CoinGecko
 */
async function fetchTotalCryptoMarketCapHistory() {
  try {
    // Get 365 days of market cap data
    const response = await fetch(`${COINGECKO_API_URL}/global/market_cap_chart?days=365`);

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    return data.market_cap_chart;
  } catch (error) {
    console.error('Error fetching crypto market cap history:', error);
    return null;
  }
}

/**
 * Fetch Ethereum ecosystem TPS from GrowthePie API
 */
async function fetchEthereumEcosystemTPS() {
  try {
    const response = await fetch(GROWTHEPIE_API_URL);

    if (!response.ok) {
      throw new Error(`GrowthePie API error: ${response.status}`);
    }

    const data = await response.json();

    // Filter for throughput metric
    const throughputData = data.filter(item => item.metric_key === 'throughput');

    if (throughputData.length === 0) {
      console.warn('No throughput data found in GrowthePie API');
      return null;
    }

    // Get the most recent date
    const dates = [...new Set(throughputData.map(item => item.date))];
    dates.sort((a, b) => new Date(b) - new Date(a));
    const mostRecentDate = dates[0];

    // Get all throughput values for the most recent date
    const recentThroughput = throughputData
      .filter(item => item.date === mostRecentDate)
      .filter(item => item.origin_key !== 'ethereum' && item.origin_key !== 'all_l2s'); // Exclude aggregates

    // Sum up TPS across all chains
    const totalTPS = recentThroughput.reduce((sum, item) => sum + (item.value || 0), 0);

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
  updateAPIStatus('growthepie', 'loading');

  const tpsData = await fetchEthereumEcosystemTPS();

  if (!tpsData) {
    updateAPIStatus('growthepie', 'error', 'Failed to fetch TPS');
    return;
  }

  const tpsTile = document.querySelector('[data-metric="eth-ecosystem-tps"]');
  if (tpsTile) {
    const valueEl = tpsTile.querySelector('.metric-value');
    const changeEl = tpsTile.querySelector('.metric-change');

    if (valueEl) {
      // Format TPS with comma separators
      const formattedTPS = Math.round(tpsData.tps).toLocaleString('en-US');
      valueEl.textContent = `${formattedTPS}`;
    }

    if (changeEl) {
      changeEl.textContent = `${tpsData.chainCount} chains`;
    }

    updateAPIStatus('growthepie', 'success');
  }
}

/**
 * Update market cap chart with 12-month total crypto market cap data
 */
async function updateMarketCapChart() {
  // Fetch 12-month total crypto market cap from CoinGecko
  let historyData;

  try {
    console.log('Fetching Bitcoin market chart data...');
    const response = await fetch(`${COINGECKO_API_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=365&interval=daily`);

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const bitcoinData = await response.json();
    console.log('Bitcoin data fetched:', bitcoinData.market_caps?.length, 'data points');

    // Get global market data to calculate total market cap from BTC data
    console.log('Fetching global market data...');
    const globalResponse = await fetch(`${COINGECKO_API_URL}/global`);

    if (!globalResponse.ok) {
      throw new Error(`CoinGecko global API error: ${globalResponse.status}`);
    }

    const globalData = await globalResponse.json();
    const btcDominance = globalData.data.market_cap_percentage.btc / 100;
    console.log('BTC Dominance:', (btcDominance * 100).toFixed(2) + '%');

    // Calculate total market cap from Bitcoin market cap and dominance
    historyData = bitcoinData.market_caps.map(point => ({
      x: point[0], // Keep in milliseconds for now
      y: point[1] / btcDominance // Calculate total market cap from BTC market cap
    }));

    console.log('History data calculated:', historyData.length, 'points');
  } catch (error) {
    console.error('Error fetching market cap history:', error);
    return;
  }

  if (!historyData || historyData.length === 0) {
    console.error('No history data available');
    return;
  }

  if (!window.marketCapChartInstance) {
    console.error('Chart instance not found');
    return;
  }

  // Sample data to show roughly monthly points (every 30 days)
  const sampledData = historyData.filter((_, index) => index % 30 === 0 || index === historyData.length - 1);
  console.log('Sampled to', sampledData.length, 'data points');

  // Format dates and values
  const labels = sampledData.map(point => {
    const date = new Date(point.x);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const values = sampledData.map(point => point.y / 1000000000000); // Convert to trillions

  console.log('Chart labels:', labels);
  console.log('Chart values (in T):', values.map(v => v.toFixed(2)));

  // Update chart data
  window.marketCapChartInstance.data.labels = labels;
  window.marketCapChartInstance.data.datasets[0].data = values;
  window.marketCapChartInstance.update();

  console.log('Chart updated successfully');

  // Update the chart header with current value only (no percentage change)
  const currentValue = values[values.length - 1];

  // Update header if elements exist
  const headerValue = document.querySelector('#marketCapChart')?.closest('.bg-zinc-900')?.querySelector('.text-lg.font-mono.font-bold');

  if (headerValue) {
    headerValue.textContent = `$${currentValue.toFixed(2)}T`;
    console.log('Header updated to:', headerValue.textContent);
  }
}

/**
 * Initialize staking data updates with staggered loading to avoid rate limits
 * Call this when the page loads and optionally set up auto-refresh
 */
async function initializeStakingData() {
  console.log('Initializing staking data...');

  try {
    // Update immediately on page load with staggered delays to avoid rate limiting
    console.log('Starting StakingRewards data...');
    updateTerminalWithStakingData();

    setTimeout(async () => {
      console.log('Starting CoinGecko total market cap...');
      await updateTotalCryptoMarketCap();
    }, 500);

    setTimeout(async () => {
      console.log('Starting CoinGecko ETH market cap...');
      await updateEthMarketCap();
    }, 1000);

    setTimeout(async () => {
      console.log('Starting CoinGecko stablecoins...');
      await updateStablecoinSupply();
    }, 1500);

    setTimeout(async () => {
      console.log('Starting DeFi Llama TVL...');
      await updateDefiTVL();
    }, 2000);

    setTimeout(async () => {
      console.log('Starting GrowthePie TPS...');
      await updateEthereumEcosystemTPS();
    }, 2500);

    setTimeout(async () => {
      console.log('Starting market cap chart...');
      await updateMarketCapChart();
    }, 3000);

    // Update intervals:
    // StakingRewards: Every 30 minutes (1800000ms) - less frequent to reduce API load
    // Other APIs: Every 5 minutes (300000ms)
    setInterval(updateTerminalWithStakingData, 1800000); // 30 minutes
    setInterval(updateMarketCapChart, 300000); // 5 minutes
    setInterval(updateTotalCryptoMarketCap, 300000); // 5 minutes
    setInterval(updateEthMarketCap, 300000); // 5 minutes
    setInterval(updateStablecoinSupply, 300000); // 5 minutes
    setInterval(updateDefiTVL, 300000); // 5 minutes
    setInterval(updateEthereumEcosystemTPS, 300000); // 5 minutes

    console.log('All updates scheduled (StakingRewards: 30min, Others: 5min)');
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
    fetchEthereumMarketCapHistory,
    fetchTotalCryptoMarketCap,
    fetchEthereumEcosystemTPS,
    fetchDefiTVL,
    fetch7DayChange,
    formatStakingDataForTerminal,
    updateTerminalWithStakingData,
    updateMarketCapChart,
    updateTotalCryptoMarketCap,
    updateEthMarketCap,
    updateStablecoinSupply,
    updateDefiTVL,
    updateEthereumEcosystemTPS,
    initializeStakingData
  };
}
