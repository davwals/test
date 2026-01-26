// StakingRewards API Integration for Terminal
const STAKING_REWARDS_API_KEY = 'ee8b4f23-152e-4734-a262-df7a5eb8b41d';
const STAKING_REWARDS_API_URL = 'https://api.stakingrewards.com/public/query';

// CoinGecko API for total crypto market cap
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

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
 * Update market cap chart with historical data
 */
async function updateMarketCapChart() {
  const historyData = await fetchEthereumMarketCapHistory();

  if (!historyData || !window.marketCapChartInstance) {
    return;
  }

  // Format dates and values
  const labels = historyData.map(point => {
    const date = new Date(point.x * 1000); // Convert Unix timestamp to milliseconds
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const values = historyData.map(point => point.y / 1000000000); // Convert to billions

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
  const headerChange = document.querySelector('#marketCapChart')?.closest('.bg-zinc-900')?.querySelector('.text-xs.text-emerald-500');

  if (headerValue) {
    headerValue.textContent = `$${currentValue.toFixed(2)}B`;
  }
  if (headerChange) {
    headerChange.textContent = `${percentChange > 0 ? '+' : ''}${percentChange}% (30d)`;
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

  // Update every 5 minutes (300000ms)
  setInterval(updateTerminalWithStakingData, 300000);
  setInterval(updateMarketCapChart, 300000);
  setInterval(updateTotalCryptoMarketCap, 300000);
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
    formatStakingDataForTerminal,
    updateTerminalWithStakingData,
    updateMarketCapChart,
    updateTotalCryptoMarketCap,
    initializeStakingData
  };
}
