// StakingRewards API Integration for Terminal
const STAKING_REWARDS_API_KEY = 'ee8b4f23-152e-4734-a262-df7a5eb8b41d';
const STAKING_REWARDS_API_URL = 'https://api.stakingrewards.com/public/query';

// CoinGecko API for total crypto market cap
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

// GrowthePie API for Ethereum ecosystem TPS
const GROWTHEPIE_API_URL = 'https://api.growthepie.com/v1/fundamentals.json';

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
    const response = await fetch(`${COINGECKO_API_URL}/global`);

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching total crypto market cap:', error);
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
  const stakingData = await fetchEthereumStakingData();
  const formattedData = formatStakingDataForTerminal(stakingData);

  if (!formattedData) {
    console.error('Failed to fetch staking data');
    return;
  }

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

  // Update ETH Market Cap tile
  const marketCapTile = document.querySelector('[data-metric="eth-market-cap"]');
  if (marketCapTile) {
    const valueEl = marketCapTile.querySelector('.metric-value');
    const changeEl = marketCapTile.querySelector('.metric-change');

    if (formattedData.marketCap && valueEl) {
      const marketCapInB = (formattedData.marketCap / 1000000000).toFixed(2);
      valueEl.textContent = `$${marketCapInB}B`;
    }

    // Fetch ETH price data for 24h change (from CoinGecko)
    fetch(`${COINGECKO_API_URL}/simple/price?ids=ethereum&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`)
      .then(r => r.json())
      .then(data => {
        if (data.ethereum && changeEl) {
          const change24h = data.ethereum.usd_24h_change || 0;
          const isPositive = change24h > 0;
          const arrow = isPositive ? '↑' : '↓';
          changeEl.textContent = `${arrow} ${Math.abs(change24h).toFixed(2)}% (24h)`;
          changeEl.className = isPositive ? 'text-[10px] text-emerald-500/70 metric-change' : 'text-[10px] text-red-500/70 metric-change';
        }
      })
      .catch(err => console.error('Error fetching ETH price change:', err));
  }

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
 * Update total crypto market cap tile
 */
async function updateTotalCryptoMarketCap() {
  const globalData = await fetchTotalCryptoMarketCap();

  if (!globalData) {
    return;
  }

  const marketCapTile = document.querySelector('[data-metric="total-crypto-market-cap"]');
  if (marketCapTile) {
    const valueEl = marketCapTile.querySelector('.metric-value');
    const changeEl = marketCapTile.querySelector('.metric-change');

    // Total market cap in trillions
    const totalMarketCap = globalData.total_market_cap.usd / 1000000000000;

    // 24h market cap percentage change
    const marketCapChange24h = globalData.market_cap_change_percentage_24h_usd;

    if (valueEl) {
      valueEl.textContent = `$${totalMarketCap.toFixed(2)}T`;
    }

    if (changeEl && marketCapChange24h !== undefined) {
      const isPositive = marketCapChange24h > 0;
      const arrow = isPositive ? '↑' : '↓';
      changeEl.textContent = `${arrow} ${Math.abs(marketCapChange24h).toFixed(2)}%`;
      changeEl.className = isPositive
        ? 'text-[10px] text-emerald-500/70 metric-change'
        : 'text-[10px] text-red-500/70 metric-change';
    }
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
  const tpsData = await fetchEthereumEcosystemTPS();

  if (!tpsData) {
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
  }
}

/**
 * Update market cap chart with 12-month total crypto market cap data
 */
async function updateMarketCapChart() {
  // Fetch 12-month total crypto market cap from CoinGecko
  let historyData;

  try {
    const response = await fetch(`${COINGECKO_API_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=365&interval=daily`);
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    const bitcoinData = await response.json();

    // Get global market data to calculate total market cap from BTC data
    const globalResponse = await fetch(`${COINGECKO_API_URL}/global`);
    const globalData = await globalResponse.json();
    const btcDominance = globalData.data.market_cap_percentage.btc / 100;

    // Calculate total market cap from Bitcoin market cap and dominance
    historyData = bitcoinData.market_caps.map(point => ({
      x: point[0] / 1000, // Convert to seconds
      y: point[1] / btcDominance // Calculate total market cap from BTC market cap
    }));
  } catch (error) {
    console.error('Error fetching market cap history:', error);
    return;
  }

  if (!historyData || !window.marketCapChartInstance) {
    return;
  }

  // Sample data to show roughly monthly points (every 30 days)
  const sampledData = historyData.filter((_, index) => index % 30 === 0 || index === historyData.length - 1);

  // Format dates and values
  const labels = sampledData.map(point => {
    const date = new Date(point.x * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const values = sampledData.map(point => point.y / 1000000000000); // Convert to trillions

  // Update chart data
  window.marketCapChartInstance.data.labels = labels;
  window.marketCapChartInstance.data.datasets[0].data = values;
  window.marketCapChartInstance.update();

  // Update the chart header with current value and change
  const currentValue = values[values.length - 1];
  const firstValue = values[0];
  const percentChange = ((currentValue - firstValue) / firstValue * 100).toFixed(2);

  // Update header if elements exist
  const headerValue = document.querySelector('#marketCapChart')?.closest('.bg-zinc-900')?.querySelector('.text-lg.font-mono.font-bold');
  const headerChange = document.querySelector('#marketCapChart')?.closest('.bg-zinc-900')?.querySelector('.text-xs');

  if (headerValue) {
    headerValue.textContent = `$${currentValue.toFixed(2)}T`;
  }
  if (headerChange) {
    headerChange.textContent = `${percentChange > 0 ? '+' : ''}${percentChange}% (12mo)`;
    headerChange.className = percentChange > 0 ? 'text-xs text-emerald-500' : 'text-xs text-red-500';
  }
}

/**
 * Initialize staking data updates
 * Call this when the page loads and optionally set up auto-refresh
 */
function initializeStakingData() {
  // Update immediately on page load
  updateTerminalWithStakingData();
  updateMarketCapChart();
  updateTotalCryptoMarketCap();
  updateEthereumEcosystemTPS();

  // Update every 5 minutes (300000ms)
  setInterval(updateTerminalWithStakingData, 300000);
  setInterval(updateMarketCapChart, 300000);
  setInterval(updateTotalCryptoMarketCap, 300000);
  setInterval(updateEthereumEcosystemTPS, 300000);
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
    formatStakingDataForTerminal,
    updateTerminalWithStakingData,
    updateMarketCapChart,
    updateTotalCryptoMarketCap,
    updateEthereumEcosystemTPS,
    initializeStakingData
  };
}
