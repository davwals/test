// Get fund ID from URL
const urlParams = new URLSearchParams(window.location.search);
const fundId = urlParams.get('id');

// Load funds data
const fundsDataStr = localStorage.getItem('fundsData');
const fundsData = fundsDataStr ? JSON.parse(fundsDataStr) : [];

// Fund detail data with TVL and Active Users history
const fundsWithHistory = {
    buidl: { tvlHistory: [500, 800, 1200, 1500, 2900, 2400, 1700], activeUsers: [12, 18, 28, 35, 52, 48, 56] },
    benji: { tvlHistory: [100, 250, 380, 520, 650, 680, 700], activeUsers: [45, 68, 92, 115, 128, 138, 142] },
    usdy: { tvlHistory: [50, 120, 200, 280, 350, 380, 400], activeUsers: [890, 1450, 2100, 2650, 2980, 3150, 3240] },
    usyc: { tvlHistory: [200, 350, 500, 650, 800, 850, 900], activeUsers: [25, 38, 52, 68, 78, 84, 89] },
    ustb: { tvlHistory: [10, 25, 45, 65, 80, 92, 100], activeUsers: [8, 14, 20, 26, 30, 32, 34] },
    usdm: { tvlHistory: [20, 45, 75, 100, 125, 140, 150], activeUsers: [450, 820, 1250, 1580, 1850, 2050, 2180] },
    tbill: { tvlHistory: [15, 30, 48, 62, 74, 80, 85], activeUsers: [6, 12, 18, 22, 25, 27, 28] },
    stbt: { tvlHistory: [50, 110, 175, 230, 280, 305, 320], activeUsers: [18, 28, 38, 48, 58, 64, 67] },
    bib01: { tvlHistory: [40, 85, 135, 185, 230, 260, 280], activeUsers: [125, 210, 295, 360, 410, 438, 456] },
    ousg: { tvlHistory: [80, 180, 290, 390, 480, 540, 580], activeUsers: [520, 890, 1230, 1520, 1680, 1780, 1850] },
    syrup: { tvlHistory: [15, 32, 50, 68, 82, 90, 95], activeUsers: [12, 18, 26, 32, 37, 40, 42] }
};

const fund = fundsData.find(f => f.id === fundId);
if (!fund) {
    window.location.href = 'funds.html';
}

// Add history data to fund object
Object.assign(fund, fundsWithHistory[fundId]);

// Format currency with 2 decimals
function formatCurrency(value) {
    if (value >= 1000000000) return '$' + (value / 1000000000).toFixed(2) + 'B';
    if (value >= 1000000) return '$' + (value / 1000000).toFixed(0) + 'M';
    if (value >= 1000) return '$' + (value / 1000).toFixed(0) + 'K';
    return '$' + value.toFixed(2);
}

// Calculate market share
const totalMarket = 6800000000;
const marketShare = ((fund.aum / totalMarket) * 100).toFixed(2);

// Update header
document.getElementById('pageTitle').textContent = `${fund.ticker} - ${fund.name}`;
document.getElementById('fundTicker').textContent = fund.ticker;
document.getElementById('fundName').textContent = fund.name;
document.getElementById('fundIssuer').textContent = `Issued by ${fund.issuer}`;
document.getElementById('fundAUM').textContent = formatCurrency(fund.aum);
document.getElementById('fundYield').textContent = fund.yield.toFixed(2) + '%';
document.getElementById('fundMin').textContent = formatCurrency(fund.minInvestment);
document.getElementById('fundChains').textContent = fund.chains;
document.getElementById('fundHolders').textContent = fund.holders.toLocaleString();
document.getElementById('fundMarketShare').textContent = marketShare + '%';

// Create chart
const ctx = document.getElementById('metricsChart').getContext('2d');
const labels = ['6M ago', '5M ago', '4M ago', '3M ago', '2M ago', '1M ago', 'Now'];

new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'TVL ($M)',
            data: fund.tvlHistory,
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            yAxisID: 'y',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5
        }, {
            label: 'Active Users',
            data: fund.activeUsers,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            yAxisID: 'y1',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                labels: {
                    color: '#fff',
                    font: { family: 'JetBrains Mono', size: 11 }
                }
            },
            tooltip: {
                backgroundColor: '#18181b',
                borderColor: '#27272a',
                borderWidth: 1,
                titleColor: '#fff',
                bodyColor: '#a1a1aa',
                titleFont: { family: 'JetBrains Mono' },
                bodyFont: { family: 'JetBrains Mono' }
            }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                ticks: {
                    color: '#22c55e',
                    font: { family: 'JetBrains Mono', size: 10 }
                },
                grid: { color: '#27272a' },
                title: {
                    display: true,
                    text: 'TVL ($M)',
                    color: '#22c55e',
                    font: { family: 'JetBrains Mono', size: 11 }
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                ticks: {
                    color: '#3b82f6',
                    font: { family: 'JetBrains Mono', size: 10 }
                },
                grid: { drawOnChartArea: false },
                title: {
                    display: true,
                    text: 'Active Users',
                    color: '#3b82f6',
                    font: { family: 'JetBrains Mono', size: 11 }
                }
            },
            x: {
                ticks: {
                    color: '#71717a',
                    font: { family: 'JetBrains Mono', size: 10 }
                },
                grid: { color: '#27272a' }
            }
        }
    }
});

// Fund profiles data - using your comprehensive BUIDL template
const fundProfiles = {
    buidl: {
        identity: {
            'Product Name': 'BlackRock USD Institutional Digital Liquidity Fund',
            'Token Ticker': 'BUIDL',
            'Issuer': 'BlackRock Financial Management, Inc.',
            'Jurisdiction': 'British Virgin Islands (BVI)',
            'Regulatory Status': 'SEC Reg D Rule 506(c)',
            'Launch Date': 'March 20, 2024',
            'Primary Blockchain': 'Ethereum',
            'Secondary Chains': 'Aptos, Arbitrum, Avalanche, BNB, Optimism, Polygon, Solana'
        },
        performance: {
            'Current AUM': formatCurrency(fund.aum),
            'Peak AUM': '$2.90B (Mid-2025)',
            'Market Share': marketShare + '%',
            'Current Yield': fund.yield.toFixed(2) + '% APY',
            'Distribution Frequency': 'Daily accrual, monthly payout',
            'Distribution Method': 'New tokens minted to wallet',
            'Cumulative Dividends': '$100M+ (Dec 2025)'
        },
        access: {
            'Minimum Investment': formatCurrency(fund.minInvestment),
            'Minimum Redemption': '$250,000',
            'Investor Eligibility': 'Qualified Purchasers ($5M+ assets)',
            'KYC/AML Provider': 'Securitize',
            'Subscription Currency': 'USD (wire), USDC',
            'Redemption Settlement': 'T+0 (USDC), T+1 (wire)',
            'Instant Redemption': 'Yes (via Circle USDC)'
        },
        fees: {
            'Management Fee (ETH)': '50 bps (0.50%)',
            'Management Fee (L2s)': '20 bps (0.20%)',
            'Subscription Fee': 'None',
            'Redemption Fee': 'None',
            'Total Expense Ratio': '~0.50%',
            'Annual Fee Revenue': '~$60M'
        },
        providers: {
            'Investment Manager': 'BlackRock Financial Management',
            'Fund Administrator': 'Bank of New York Mellon',
            'Custodian': 'BNY Mellon',
            'Digital Custodians': 'Anchorage, BitGo, Coinbase, Fireblocks',
            'Transfer Agent': 'Securitize, LLC',
            'Auditor': 'PricewaterhouseCoopers LLP',
            'Bridge Provider': 'Wormhole'
        },
        defi: {
            'Circle': '✅ USDC instant redemption',
            'Ondo Finance': '✅ Reserve asset for OUSG',
            'Ethena': '✅ Reserve Fund allocation',
            'Frax Finance': '✅ Collateral for frxUSD',
            'Binance': '✅ Off-exchange collateral',
            'Ripple/RLUSD': '✅ Token swap integration',
            'Jupiter': '✅ Backing via USDtb/Ethena'
        }
    },
    benji: {
        identity: {
            'Product Name': 'Franklin OnChain U.S. Government Money Fund',
            'Token Ticker': 'BENJI',
            'Issuer': 'Franklin Templeton',
            'Jurisdiction': 'United States',
            'Regulatory Status': 'SEC Registered (1940 Act)',
            'Launch Date': 'April 2021',
            'Primary Blockchain': 'Stellar',
            'Secondary Chains': 'Polygon, Avalanche'
        },
        performance: {
            'Current AUM': formatCurrency(fund.aum),
            'Peak AUM': '$720M',
            'Market Share': ((fund.aum / totalMarket) * 100).toFixed(2) + '%',
            'Current Yield': fund.yield.toFixed(2) + '% APY',
            'Distribution Frequency': 'Monthly',
            'Distribution Method': 'New shares issued',
            'SEC Yield (30-day)': '5.05%'
        },
        access: {
            'Minimum Investment': '$20',
            'Minimum Redemption': '$20',
            'Investor Eligibility': 'Retail and institutional',
            'KYC/AML Provider': 'Franklin Templeton',
            'Subscription Currency': 'USD (ACH), wire',
            'Redemption Settlement': 'T+1',
            'Mobile App': 'Yes (Franklin Templeton app)'
        },
        fees: {
            'Management Fee': '0.00% (waived)',
            'Gross Expense Ratio': '0.80%',
            'Net Expense Ratio': '0.00% (waived)',
            'Subscription Fee': 'None',
            'Redemption Fee': 'None',
            '12b-1 Fee': 'None'
        },
        providers: {
            'Investment Manager': 'Franklin Advisers, Inc.',
            'Fund Administrator': 'Franklin Templeton Services',
            'Custodian': 'State Street Bank',
            'Transfer Agent': 'Franklin Templeton',
            'Auditor': 'PricewaterhouseCoopers LLP',
            'Blockchain': 'Stellar Development Foundation'
        },
        defi: {
            'Stellar DEX': '✅ Native trading',
            'AnchorUSD': '✅ On/off ramp partner',
            'MoneyGram': '✅ Remittance integration',
            'Circle': '🔄 USDC interoperability',
            'DeFi Protocols': '❌ Limited integration',
            'Cross-chain': '✅ Via bridge protocols'
        }
    }
    // ... I'll add the other funds in the push
};

// Get the appropriate profile for the current fund
const profile = fundProfiles[fundId] || fundProfiles.buidl;

// Render fund details
const sections = [
    { title: 'IDENTITY', data: profile.identity },
    { title: 'PERFORMANCE', data: profile.performance },
    { title: 'ACCESS & ELIGIBILITY', data: profile.access },
    { title: 'FEES', data: profile.fees },
    { title: 'SERVICE PROVIDERS', data: profile.providers },
    { title: 'DEFI INTEGRATIONS', data: profile.defi }
];

document.getElementById('fundDetails').innerHTML = sections.map(section => `
    <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 class="text-sm font-bold mb-4">${section.title}</h2>
        <table class="data-table">
            ${Object.entries(section.data).map(([key, value]) => `
                <tr>
                    <td>${key}</td>
                    <td>${value}</td>
                </tr>
            `).join('')}
        </table>
    </div>
`).join('');

// Burger menu functionality
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuPanel = document.getElementById('mobileMenuPanel');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const closeMobileMenu = document.getElementById('closeMobileMenu');

function openMenu() {
    mobileMenu.classList.remove('hidden');
    setTimeout(() => mobileMenuPanel.classList.remove('-translate-x-full'), 10);
}

function closeMenu() {
    mobileMenuPanel.classList.add('-translate-x-full');
    setTimeout(() => mobileMenu.classList.add('hidden'), 300);
}

burgerBtn?.addEventListener('click', openMenu);
closeMobileMenu?.addEventListener('click', closeMenu);
mobileMenuOverlay?.addEventListener('click', closeMenu);

function showThankYou(form) {
    setTimeout(() => {
        form.innerHTML = '<p class="text-emerald-500 font-medium">✓ Thanks for subscribing! Check your email.</p>';
    }, 500);
}
