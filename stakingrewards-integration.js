// StakingRewards API Integration for Terminal
const STAKING_REWARDS_API_KEY = 'ee8b4f23-152e-4734-a262-df7a5eb8b41d';
const STAKING_REWARDS_API_URL = 'https://api.stakingrewards.com/public/query';

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
 * Format staking data for terminal display
 */
function formatStakingDataForTerminal(stakingData) {
  if (!stakingData) return null;

  const metrics = stakingData.metrics;
  const rewardOption = stakingData.rewardOptions?.find(r => r.type === 'staking') || stakingData.rewardOptions?.[0];

  return {
    totalStakedETH: metrics.stakedTokens,
    totalStakedUSD: metrics.totalStakedUSD,
    stakingRatio: metrics.stakingRatio || ((metrics.stakedTokens / 120000000) * 100), // Approximate
    rewardRate: metrics.rewardRate,
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

  return formattedData;
}

/**
 * Initialize staking data updates
 * Call this when the page loads and optionally set up auto-refresh
 */
function initializeStakingData() {
  // Update immediately on page load
  updateTerminalWithStakingData();

  // Update every 5 minutes (300000ms)
  setInterval(updateTerminalWithStakingData, 300000);
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
    formatStakingDataForTerminal,
    updateTerminalWithStakingData,
    initializeStakingData
  };
}
