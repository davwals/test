// Ethereum ETF Flow Data
// Data format matches Farside Investors structure
// All values in millions USD

const etfFlowData = [
    { date: '2026-01-22', ETHE: -45.2, ETHA: 89.5, FETH: 52.3, ETHW: 18.7, CETH: 12.4, ETHV: 8.9, QETH: 6.2, EZET: 4.8, ETH: 2.1 },
    { date: '2026-01-21', ETHE: -38.6, ETHA: 124.3, FETH: 67.2, ETHW: 22.1, CETH: 15.8, ETHV: 11.2, QETH: 7.5, EZET: 5.9, ETH: 3.2 },
    { date: '2026-01-20', ETHE: -52.1, ETHA: 98.7, FETH: 45.9, ETHW: 19.3, CETH: 13.6, ETHV: 9.8, QETH: 6.8, EZET: 4.5, ETH: 2.8 },
    { date: '2026-01-17', ETHE: -41.3, ETHA: 112.4, FETH: 58.6, ETHW: 20.9, CETH: 14.2, ETHV: 10.5, QETH: 7.1, EZET: 5.2, ETH: 2.9 },
    { date: '2026-01-16', ETHE: -48.9, ETHA: 105.8, FETH: 62.1, ETHW: 21.7, CETH: 16.3, ETHV: 11.8, QETH: 8.2, EZET: 6.1, ETH: 3.5 },
    { date: '2026-01-15', ETHE: -55.7, ETHA: 118.9, FETH: 69.4, ETHW: 24.3, CETH: 17.9, ETHV: 12.6, QETH: 8.9, EZET: 6.7, ETH: 3.8 },
    { date: '2026-01-14', ETHE: -42.4, ETHA: 95.2, FETH: 51.8, ETHW: 18.9, CETH: 13.7, ETHV: 9.4, QETH: 6.5, EZET: 4.9, ETH: 2.6 },
    { date: '2026-01-13', ETHE: -39.1, ETHA: 102.6, FETH: 56.3, ETHW: 20.1, CETH: 14.8, ETHV: 10.2, QETH: 7.3, EZET: 5.4, ETH: 3.1 },
    { date: '2026-01-10', ETHE: -46.8, ETHA: 108.3, FETH: 61.7, ETHW: 22.4, CETH: 15.9, ETHV: 11.3, QETH: 7.8, EZET: 5.8, ETH: 3.4 },
    { date: '2026-01-09', ETHE: -51.2, ETHA: 115.7, FETH: 65.8, ETHW: 23.6, CETH: 17.2, ETHV: 12.1, QETH: 8.4, EZET: 6.3, ETH: 3.7 },
    { date: '2026-01-08', ETHE: -44.5, ETHA: 92.4, FETH: 49.2, ETHW: 17.8, CETH: 12.9, ETHV: 8.7, QETH: 6.1, EZET: 4.6, ETH: 2.4 },
    { date: '2026-01-07', ETHE: -47.9, ETHA: 98.6, FETH: 53.4, ETHW: 19.2, CETH: 14.1, ETHV: 9.8, QETH: 6.7, EZET: 5.1, ETH: 2.9 },
    { date: '2026-01-06', ETHE: -53.6, ETHA: 121.2, FETH: 68.9, ETHW: 24.7, CETH: 18.3, ETHV: 13.2, QETH: 9.1, EZET: 6.8, ETH: 4.1 },
    { date: '2026-01-03', ETHE: -49.3, ETHA: 106.8, FETH: 59.3, ETHW: 21.3, CETH: 15.6, ETHV: 11.4, QETH: 7.9, EZET: 5.9, ETH: 3.6 },
    { date: '2026-01-02', ETHE: -41.7, ETHA: 94.5, FETH: 52.7, ETHW: 18.9, CETH: 13.8, ETHV: 9.9, QETH: 6.9, EZET: 5.2, ETH: 3.1 },
    { date: '2025-12-31', ETHE: -38.2, ETHA: 88.3, FETH: 47.6, ETHW: 17.2, CETH: 12.5, ETHV: 8.9, QETH: 6.2, EZET: 4.7, ETH: 2.8 },
    { date: '2025-12-30', ETHE: -45.8, ETHA: 112.7, FETH: 63.8, ETHW: 23.1, CETH: 16.7, ETHV: 12.3, QETH: 8.5, EZET: 6.4, ETH: 3.9 },
    { date: '2025-12-27', ETHE: -52.4, ETHA: 118.4, FETH: 67.2, ETHW: 24.5, CETH: 17.8, ETHV: 13.1, QETH: 9.2, EZET: 6.9, ETH: 4.2 },
    { date: '2025-12-26', ETHE: -48.1, ETHA: 103.6, FETH: 58.9, ETHW: 21.4, CETH: 15.7, ETHV: 11.5, QETH: 8.1, EZET: 6.1, ETH: 3.7 },
    { date: '2025-12-24', ETHE: -43.9, ETHA: 96.2, FETH: 53.5, ETHW: 19.6, CETH: 14.3, ETHV: 10.4, QETH: 7.3, EZET: 5.5, ETH: 3.3 },
    { date: '2025-12-23', ETHE: -50.7, ETHA: 125.8, FETH: 71.3, ETHW: 25.9, CETH: 18.9, ETHV: 13.8, QETH: 9.6, EZET: 7.2, ETH: 4.4 },
    { date: '2025-12-20', ETHE: -46.3, ETHA: 109.5, FETH: 62.4, ETHW: 22.7, CETH: 16.5, ETHV: 12.1, QETH: 8.4, EZET: 6.3, ETH: 3.8 },
    { date: '2025-12-19', ETHE: -42.1, ETHA: 101.3, FETH: 57.8, ETHW: 20.9, CETH: 15.2, ETHV: 11.1, QETH: 7.8, EZET: 5.8, ETH: 3.5 },
    { date: '2025-12-18', ETHE: -47.6, ETHA: 115.2, FETH: 65.7, ETHW: 23.8, CETH: 17.3, ETHV: 12.7, QETH: 8.9, EZET: 6.7, ETH: 4.1 },
    { date: '2025-12-17', ETHE: -54.2, ETHA: 121.9, FETH: 69.5, ETHW: 25.2, CETH: 18.4, ETHV: 13.5, QETH: 9.4, EZET: 7.1, ETH: 4.3 },
    { date: '2025-12-16', ETHE: -49.8, ETHA: 106.3, FETH: 60.2, ETHW: 21.8, CETH: 15.9, ETHV: 11.7, QETH: 8.2, EZET: 6.1, ETH: 3.7 },
    { date: '2025-12-13', ETHE: -44.5, ETHA: 98.7, FETH: 55.6, ETHW: 20.3, CETH: 14.8, ETHV: 10.9, QETH: 7.6, EZET: 5.7, ETH: 3.4 },
    { date: '2025-12-12', ETHE: -51.3, ETHA: 113.4, FETH: 64.3, ETHW: 23.4, CETH: 17.1, ETHV: 12.5, QETH: 8.8, EZET: 6.6, ETH: 4.0 },
    { date: '2025-12-11', ETHE: -46.9, ETHA: 107.8, FETH: 61.2, ETHW: 22.1, CETH: 16.2, ETHV: 11.9, QETH: 8.3, EZET: 6.2, ETH: 3.8 },
    { date: '2025-12-10', ETHE: -40.6, ETHA: 91.5, FETH: 51.9, ETHW: 18.7, CETH: 13.6, ETHV: 9.9, QETH: 6.9, EZET: 5.2, ETH: 3.1 }
];

// Calculate cumulative flows
let cumulativeFlows = {
    ETHE: 0, ETHA: 0, FETH: 0, ETHW: 0, CETH: 0, ETHV: 0, QETH: 0, EZET: 0, ETH: 0
};

etfFlowData.forEach(day => {
    Object.keys(cumulativeFlows).forEach(etf => {
        cumulativeFlows[etf] += day[etf];
    });
});

// Format currency
function formatFlow(value) {
    const sign = value >= 0 ? '+' : '';
    return sign + '$' + value.toFixed(2) + 'M';
}

function formatLarge(value) {
    if (value >= 1000) return '$' + (value / 1000).toFixed(2) + 'B';
    return '$' + value.toFixed(2) + 'M';
}

// Calculate totals
const totalNet = Object.values(cumulativeFlows).reduce((a, b) => a + b, 0);
const last7Days = etfFlowData.slice(0, 7).reduce((sum, day) => {
    return sum + Object.values(day).slice(1).reduce((a, b) => a + b, 0);
}, 0);
const last30Days = etfFlowData.reduce((sum, day) => {
    return sum + Object.values(day).slice(1).reduce((a, b) => a + b, 0);
}, 0);

// Update summary stats
document.getElementById('totalNetFlow').textContent = formatLarge(totalNet);
document.getElementById('totalFlowChange').innerHTML = totalNet >= 0
    ? `<span class="positive">↑ Net inflows</span>`
    : `<span class="negative">↓ Net outflows</span>`;

document.getElementById('weekFlow').textContent = formatLarge(last7Days);
document.getElementById('weekFlowChange').innerHTML = last7Days >= 0
    ? `<span class="positive">↑ ${formatFlow(last7Days)}</span>`
    : `<span class="negative">↓ ${formatFlow(Math.abs(last7Days))}</span>`;

document.getElementById('monthFlow').textContent = formatLarge(last30Days);
document.getElementById('monthFlowChange').innerHTML = last30Days >= 0
    ? `<span class="positive">↑ ${formatFlow(last30Days)}</span>`
    : `<span class="negative">↓ ${formatFlow(Math.abs(last30Days))}</span>`;

document.getElementById('totalAUM').textContent = '$12.80B';
document.getElementById('lastUpdated').textContent = new Date(etfFlowData[0].date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
});

// Update individual ETF stats
document.getElementById('ethaFlow').textContent = formatLarge(cumulativeFlows.ETHA);
document.getElementById('fethFlow').textContent = formatLarge(cumulativeFlows.FETH);
document.getElementById('etheFlow').textContent = formatLarge(cumulativeFlows.ETHE);

// Render table
const tableBody = document.getElementById('flowTableBody');
tableBody.innerHTML = etfFlowData.map(day => {
    const dailyTotal = Object.values(day).slice(1).reduce((a, b) => a + b, 0);
    return `
        <tr>
            <td>${new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
            <td class="${day.ETHE >= 0 ? 'positive' : 'negative'}">${formatFlow(day.ETHE)}</td>
            <td class="${day.ETHA >= 0 ? 'positive' : 'negative'}">${formatFlow(day.ETHA)}</td>
            <td class="${day.FETH >= 0 ? 'positive' : 'negative'}">${formatFlow(day.FETH)}</td>
            <td class="${day.ETHW >= 0 ? 'positive' : 'negative'}">${formatFlow(day.ETHW)}</td>
            <td class="${day.CETH >= 0 ? 'positive' : 'negative'}">${formatFlow(day.CETH)}</td>
            <td class="${day.ETHV >= 0 ? 'positive' : 'negative'}">${formatFlow(day.ETHV)}</td>
            <td class="${day.QETH >= 0 ? 'positive' : 'negative'}">${formatFlow(day.QETH)}</td>
            <td class="${day.EZET >= 0 ? 'positive' : 'negative'}">${formatFlow(day.EZET)}</td>
            <td class="${day.ETH >= 0 ? 'positive' : 'negative'}">${formatFlow(day.ETH)}</td>
            <td class="${dailyTotal >= 0 ? 'positive' : 'negative'} font-bold">${formatFlow(dailyTotal)}</td>
        </tr>
    `;
}).join('');

// Create cumulative flow chart
const ctx = document.getElementById('flowChart').getContext('2d');
const chartData = [...etfFlowData].reverse();
const cumulativeByDay = [];
let runningTotal = { ETHA: 0, FETH: 0, ETHW: 0, others: 0, ETHE: 0 };

chartData.forEach(day => {
    runningTotal.ETHA += day.ETHA;
    runningTotal.FETH += day.FETH;
    runningTotal.ETHW += day.ETHW;
    runningTotal.others += (day.CETH + day.ETHV + day.QETH + day.EZET + day.ETH);
    runningTotal.ETHE += day.ETHE;
    cumulativeByDay.push({ ...runningTotal });
});

new Chart(ctx, {
    type: 'line',
    data: {
        labels: chartData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [
            {
                label: 'BlackRock ETHA',
                data: cumulativeByDay.map(d => d.ETHA),
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0
            },
            {
                label: 'Fidelity FETH',
                data: cumulativeByDay.map(d => d.FETH),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0
            },
            {
                label: 'Grayscale ETHE',
                data: cumulativeByDay.map(d => d.ETHE),
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0
            },
            {
                label: 'Others',
                data: cumulativeByDay.map(d => d.others),
                borderColor: '#a855f7',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false
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
                bodyFont: { family: 'JetBrains Mono' },
                callbacks: {
                    label: function(context) {
                        return context.dataset.label + ': $' + context.parsed.y.toFixed(2) + 'M';
                    }
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    color: '#71717a',
                    font: { family: 'JetBrains Mono', size: 10 },
                    callback: value => '$' + value + 'M'
                },
                grid: { color: '#27272a' }
            },
            x: {
                ticks: {
                    color: '#71717a',
                    font: { family: 'JetBrains Mono', size: 9 },
                    maxRotation: 45,
                    minRotation: 45
                },
                grid: { color: '#27272a' }
            }
        }
    }
});

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
