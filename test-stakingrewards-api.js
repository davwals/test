// Test StakingRewards API for Ethereum data
const API_KEY = 'ee8b4f23-152e-4734-a262-df7a5eb8b41d';
const API_URL = 'https://api.stakingrewards.com/public/query';

// Query 1: Get Ethereum asset details
const query1 = `
  query {
    asset(slug: "ethereum") {
      name
      slug
      symbol
      metrics {
        marketCap
        stakedTokens
        totalStaked
        totalStakedUSD
        rewardRate
        avgStakingDuration
        inflationRate
        activeValidators
      }
    }
  }
`;

// Query 2: Get Ethereum staking metrics
const query2 = `
  query {
    assets(where: { slugs: ["ethereum"] }) {
      name
      slug
      metrics {
        marketCap
        totalStaked
        totalStakedUSD
        stakedTokens
        rewardRate
        inflationRate
        activeValidators
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

// Query 3: Get historical staking data
const query3 = `
  query {
    asset(slug: "ethereum") {
      name
      metricChart(metric: "staked_tokens", from: "30d") {
        x
        y
      }
    }
  }
`;

async function testQuery(query, description) {
  console.log(`\n========== ${description} ==========`);
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run tests
(async () => {
  await testQuery(query1, 'Ethereum Asset Details');
  await testQuery(query2, 'Ethereum Staking Metrics');
  await testQuery(query3, 'Historical Staked Tokens (30 days)');
})();
