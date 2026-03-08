// Live Data Dashboard JavaScript

// State Management
const dashboardState = {
    weatherData: [],
    cryptoData: [],
    autoRefresh: true,
    refreshInterval: null,
    refreshRate: 30000, // 30 seconds
    lastUpdate: null,
    chart: null,
    selectedCurrency: 'USD',
    selectedCities: ['New York', 'London', 'Tokyo'],
    selectedCryptos: ['BTC', 'ETH', 'BNB']
};

// API Configuration
const API_CONFIG = {
    weather: {
        baseUrl: 'https://api.openweathermap.org/data/2.5',
        apiKey: 'demo_key', // In production, use a real API key
        units: 'metric'
    },
    crypto: {
        baseUrl: 'https://api.coingecko.com/api/v3',
        vsCurrency: 'usd'
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Load saved preferences
    loadPreferences();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Load initial data
    loadInitialData();
    
    // Start auto-refresh
    startAutoRefresh();
    
    // Initialize chart
    initializeChart();
}

function initializeEventListeners() {
    // City selector
    document.getElementById('city-select').addEventListener('change', function() {
        const city = this.value;
        if (city && !dashboardState.selectedCities.includes(city)) {
            addWeatherCityToList(city);
        }
    });
    
    // Crypto currency selector
    document.getElementById('crypto-currency').addEventListener('change', function() {
        dashboardState.selectedCurrency = this.value;
        refreshAllData();
    });
    
    // Table search
    document.getElementById('table-search').addEventListener('input', function() {
        filterTable(this.value);
    });
    
    // Form submissions
    document.getElementById('add-city-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveNewCity();
    });
    
    document.getElementById('add-crypto-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveNewCrypto();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + R to refresh
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            refreshAllData();
        }
        
        // Space to toggle auto-refresh
        if (e.key === ' ' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            toggleAutoRefresh();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Data Loading Functions
async function loadInitialData() {
    showLoading();
    
    try {
        // Load weather data
        await loadWeatherData();
        
        // Load crypto data
        await loadCryptoData();
        
        // Update UI
        updateDashboard();
        
    } catch (error) {
        console.error('Error loading initial data:', error);
        showError('Failed to load initial data');
    } finally {
        hideLoading();
    }
}

async function loadWeatherData() {
    const promises = dashboardState.selectedCities.map(city => fetchWeatherData(city));
    
    try {
        const results = await Promise.allSettled(promises);
        dashboardState.weatherData = results
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value);
    } catch (error) {
        console.error('Error loading weather data:', error);
        // Use demo data if API fails
        dashboardState.weatherData = getDemoWeatherData();
    }
}

async function fetchWeatherData(city) {
    // In a real implementation, this would call the OpenWeatherMap API
    // For demo purposes, we'll simulate API responses
    
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                city: city,
                country: getCountryCode(city),
                temperature: Math.round(Math.random() * 30 + 10),
                description: getWeatherDescription(),
                humidity: Math.round(Math.random() * 40 + 40),
                windSpeed: Math.round(Math.random() * 20 + 5),
                pressure: Math.round(Math.random() * 50 + 980),
                visibility: Math.round(Math.random() * 10 + 5),
                feelsLike: Math.round(Math.random() * 30 + 10),
                icon: getWeatherIcon(),
                timestamp: new Date().toISOString()
            });
        }, Math.random() * 1000 + 500); // Random delay to simulate API
    });
}

async function loadCryptoData() {
    const promises = dashboardState.selectedCryptos.map(symbol => fetchCryptoData(symbol));
    
    try {
        const results = await Promise.allSettled(promises);
        dashboardState.cryptoData = results
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value);
    } catch (error) {
        console.error('Error loading crypto data:', error);
        // Use demo data if API fails
        dashboardState.cryptoData = getDemoCryptoData();
    }
}

async function fetchCryptoData(symbol) {
    // In a real implementation, this would call the CoinGecko API
    // For demo purposes, we'll simulate API responses
    
    return new Promise((resolve) => {
        setTimeout(() => {
            const basePrice = getCryptoBasePrice(symbol);
            const change = (Math.random() - 0.5) * 20; // -10% to +10%
            
            resolve({
                symbol: symbol,
                name: getCryptoName(symbol),
                price: basePrice * (1 + change / 100),
                change24h: change,
                changePercent24h: change,
                marketCap: Math.round(basePrice * Math.random() * 1000000000),
                volume24h: Math.round(basePrice * Math.random() * 100000000),
                circulatingSupply: Math.round(Math.random() * 1000000000),
                allTimeHigh: basePrice * (1 + Math.random() * 2),
                timestamp: new Date().toISOString()
            });
        }, Math.random() * 1500 + 500); // Random delay to simulate API
    });
}

// UI Update Functions
function updateDashboard() {
    updateWeatherCards();
    updateCryptoCards();
    updateDataTable();
    updateMarketStats();
    updateChart();
    updateLastUpdateTime();
}

function updateWeatherCards() {
    const container = document.getElementById('weather-cards');
    
    if (dashboardState.weatherData.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    No weather data available. Please check your connection.
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = dashboardState.weatherData.map(weather => `
        <div class="col-lg-4 col-md-6 mb-3">
            <div class="weather-card fade-in">
                <div class="weather-status ${getDataStatus(weather.timestamp)}">
                    ${getDataStatusText(weather.timestamp)}
                </div>
                <div class="weather-header">
                    <div>
                        <div class="weather-city">${weather.city}</div>
                        <div class="weather-country">${weather.country}</div>
                    </div>
                    <div class="weather-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="refreshWeather('${weather.city}')">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="removeWeatherCity('${weather.city}')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="weather-main">
                    <div class="weather-icon">
                        <i class="fas fa-${weather.icon}"></i>
                    </div>
                    <div>
                        <div class="weather-temp">${weather.temperature}°C</div>
                        <div class="weather-description">${weather.description}</div>
                        <div class="text-muted">Feels like ${weather.feelsLike}°C</div>
                    </div>
                </div>
                <div class="weather-details">
                    <div class="weather-detail">
                        <i class="fas fa-tint"></i>
                        <div>
                            <div class="weather-detail-label">Humidity</div>
                            <div class="weather-detail-value">${weather.humidity}%</div>
                        </div>
                    </div>
                    <div class="weather-detail">
                        <i class="fas fa-wind"></i>
                        <div>
                            <div class="weather-detail-label">Wind</div>
                            <div class="weather-detail-value">${weather.windSpeed} km/h</div>
                        </div>
                    </div>
                    <div class="weather-detail">
                        <i class="fas fa-compress-arrows-alt"></i>
                        <div>
                            <div class="weather-detail-label">Pressure</div>
                            <div class="weather-detail-value">${weather.pressure} hPa</div>
                        </div>
                    </div>
                    <div class="weather-detail">
                        <i class="fas fa-eye"></i>
                        <div>
                            <div class="weather-detail-label">Visibility</div>
                            <div class="weather-detail-value">${weather.visibility} km</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function updateCryptoCards() {
    const container = document.getElementById('crypto-cards');
    
    if (dashboardState.cryptoData.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    No cryptocurrency data available. Please check your connection.
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = dashboardState.cryptoData.map(crypto => `
        <div class="col-lg-4 col-md-6 mb-3">
            <div class="crypto-card fade-in">
                <div class="crypto-status ${getDataStatus(crypto.timestamp)}">
                    ${getDataStatusText(crypto.timestamp)}
                </div>
                <div class="crypto-header">
                    <div class="crypto-info">
                        <div class="crypto-icon">${crypto.symbol.substring(0, 2).toUpperCase()}</div>
                        <div>
                            <div class="crypto-name">${crypto.name}</div>
                            <div class="crypto-symbol">${crypto.symbol}</div>
                        </div>
                    </div>
                    <div class="crypto-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="refreshCrypto('${crypto.symbol}')">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="removeCrypto('${crypto.symbol}')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="crypto-price">
                    ${formatCurrency(crypto.price, dashboardState.selectedCurrency)}
                </div>
                <div class="crypto-change ${crypto.change24h >= 0 ? 'positive' : 'negative'}">
                    <i class="fas fa-${crypto.change24h >= 0 ? 'arrow-up' : 'arrow-down'} crypto-change-icon"></i>
                    <span class="crypto-change-value">${formatCurrency(Math.abs(crypto.change24h), dashboardState.selectedCurrency)}</span>
                    <span class="crypto-change-percent">(${Math.abs(crypto.changePercent24h).toFixed(2)}%)</span>
                </div>
                <div class="crypto-stats">
                    <div class="crypto-stat">
                        <div class="crypto-stat-label">Market Cap</div>
                        <div class="crypto-stat-value">${formatLargeNumber(crypto.marketCap)}</div>
                    </div>
                    <div class="crypto-stat">
                        <div class="crypto-stat-label">Volume (24h)</div>
                        <div class="crypto-stat-value">${formatLargeNumber(crypto.volume24h)}</div>
                    </div>
                    <div class="crypto-stat">
                        <div class="crypto-stat-label">Circulating Supply</div>
                        <div class="crypto-stat-value">${formatLargeNumber(crypto.circulatingSupply)}</div>
                    </div>
                    <div class="crypto-stat">
                        <div class="crypto-stat-label">All Time High</div>
                        <div class="crypto-stat-value">${formatCurrency(crypto.allTimeHigh, dashboardState.selectedCurrency)}</div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function updateDataTable() {
    const tbody = document.getElementById('data-table-body');
    const allData = [
        ...dashboardState.weatherData.map(w => ({
            type: 'weather',
            name: `${w.city}, ${w.country}`,
            value: `${w.temperature}°C`,
            change: `${w.feelsLike - w.temperature}°C`,
            status: getDataStatus(w.timestamp)
        })),
        ...dashboardState.cryptoData.map(c => ({
            type: 'crypto',
            name: `${c.name} (${c.symbol})`,
            value: formatCurrency(c.price, dashboardState.selectedCurrency),
            change: `${c.change24h >= 0 ? '+' : ''}${c.changePercent24h.toFixed(2)}%`,
            status: getDataStatus(c.timestamp)
        }))
    ];
    
    tbody.innerHTML = allData.map(item => `
        <tr>
            <td>
                <span class="data-type-badge ${item.type}">${item.type}</span>
            </td>
            <td>${item.name}</td>
            <td><strong>${item.value}</strong></td>
            <td class="${item.change.startsWith('+') || item.change.startsWith('-') ? 
                (item.change.startsWith('+') ? 'change-positive' : 'change-negative') : ''}">
                ${item.change}
            </td>
            <td>
                <span class="status-badge ${item.status}">${item.status}</span>
            </td>
            <td>${formatRelativeTime(item.timestamp)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="refreshItem('${item.type}', '${item.name}')">
                    <i class="fas fa-sync-alt"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function updateMarketStats() {
    const container = document.getElementById('market-stats');
    
    const totalCryptoValue = dashboardState.cryptoData.reduce((sum, crypto) => sum + crypto.price, 0);
    const avgTemp = dashboardState.weatherData.reduce((sum, weather) => sum + weather.temperature, 0) / dashboardState.weatherData.length;
    const totalMarketCap = dashboardState.cryptoData.reduce((sum, crypto) => sum + crypto.marketCap, 0);
    const totalVolume = dashboardState.cryptoData.reduce((sum, crypto) => sum + crypto.volume24h, 0);
    
    container.innerHTML = `
        <div class="market-stat">
            <span class="market-stat-label">Total Crypto Value</span>
            <span class="market-stat-value">${formatCurrency(totalCryptoValue, dashboardState.selectedCurrency)}</span>
        </div>
        <div class="market-stat">
            <span class="market-stat-label">Average Temperature</span>
            <span class="market-stat-value">${avgTemp.toFixed(1)}°C</span>
        </div>
        <div class="market-stat">
            <span class="market-stat-label">Total Market Cap</span>
            <span class="market-stat-value">${formatLargeNumber(totalMarketCap)}</span>
        </div>
        <div class="market-stat">
            <span class="market-stat-label">Total Volume (24h)</span>
            <span class="market-stat-value">${formatLargeNumber(totalVolume)}</span>
        </div>
        <div class="market-stat">
            <span class="market-stat-label">Data Points</span>
            <span class="market-stat-value">${dashboardState.weatherData.length + dashboardState.cryptoData.length}</span>
        </div>
        <div class="market-stat">
            <span class="market-stat-label">Update Rate</span>
            <span class="market-stat-value">${(dashboardState.refreshRate / 1000).toFixed(0)}s</span>
        </div>
    `;
}

function updateChart() {
    const ctx = document.getElementById('price-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (dashboardState.chart) {
        dashboardState.chart.destroy();
    }
    
    // Prepare data
    const labels = dashboardState.cryptoData.map(c => c.symbol);
    const data = dashboardState.cryptoData.map(c => c.price);
    const changes = dashboardState.cryptoData.map(c => c.change24h);
    
    // Create new chart
    dashboardState.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Price',
                data: data,
                borderColor: 'rgb(102, 126, 234)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return formatCurrency(context.parsed.y, dashboardState.selectedCurrency);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value, dashboardState.selectedCurrency);
                        }
                    }
                }
            }
        }
    });
}

// Refresh Functions
async function refreshAllData() {
    showLoading();
    
    try {
        await loadWeatherData();
        await loadCryptoData();
        updateDashboard();
        showSuccess('All data refreshed successfully!');
    } catch (error) {
        console.error('Error refreshing data:', error);
        showError('Failed to refresh data');
    } finally {
        hideLoading();
    }
}

async function refreshWeather(city) {
    const card = event.target.closest('.weather-card');
    const loadingOverlay = createLoadingOverlay(card);
    
    try {
        const weather = await fetchWeatherData(city);
        const index = dashboardState.weatherData.findIndex(w => w.city === city);
        if (index > -1) {
            dashboardState.weatherData[index] = weather;
        } else {
            dashboardState.weatherData.push(weather);
        }
        
        updateWeatherCards();
        updateDataTable();
        showSuccess(`${city} weather refreshed!`);
    } catch (error) {
        console.error('Error refreshing weather:', error);
        showError(`Failed to refresh ${city} weather`);
    } finally {
        loadingOverlay.remove();
    }
}

async function refreshCrypto(symbol) {
    const card = event.target.closest('.crypto-card');
    const loadingOverlay = createLoadingOverlay(card);
    
    try {
        const crypto = await fetchCryptoData(symbol);
        const index = dashboardState.cryptoData.findIndex(c => c.symbol === symbol);
        if (index > -1) {
            dashboardState.cryptoData[index] = crypto;
        } else {
            dashboardState.cryptoData.push(crypto);
        }
        
        updateCryptoCards();
        updateDataTable();
        updateChart();
        showSuccess(`${symbol} data refreshed!`);
    } catch (error) {
        console.error('Error refreshing crypto:', error);
        showError(`Failed to refresh ${symbol} data`);
    } finally {
        loadingOverlay.remove();
    }
}

async function refreshItem(type, name) {
    if (type === 'weather') {
        const city = name.split(',')[0];
        await refreshWeather(city);
    } else if (type === 'crypto') {
        const symbol = name.match(/\(([^)]+)\)/)[1];
        await refreshCrypto(symbol);
    }
}

// Auto-refresh Functions
function startAutoRefresh() {
    if (dashboardState.autoRefresh) {
        dashboardState.refreshInterval = setInterval(() => {
            refreshAllData();
        }, dashboardState.refreshRate);
    }
}

function stopAutoRefresh() {
    if (dashboardState.refreshInterval) {
        clearInterval(dashboardState.refreshInterval);
        dashboardState.refreshInterval = null;
    }
}

function toggleAutoRefresh() {
    dashboardState.autoRefresh = !dashboardState.autoRefresh;
    
    const button = event.target.closest('button');
    const statusSpan = document.getElementById('refresh-status');
    
    if (dashboardState.autoRefresh) {
        startAutoRefresh();
        button.innerHTML = '<i class="fas fa-pause me-1"></i>Pause';
        statusSpan.textContent = 'ON';
        showSuccess('Auto-refresh enabled');
    } else {
        stopAutoRefresh();
        button.innerHTML = '<i class="fas fa-play me-1"></i>Resume';
        statusSpan.textContent = 'OFF';
        showInfo('Auto-refresh paused');
    }
}

// Management Functions
function addWeatherCity() {
    const modal = new bootstrap.Modal(document.getElementById('addCityModal'));
    document.getElementById('add-city-form').reset();
    modal.show();
}

function saveNewCity() {
    const cityName = document.getElementById('new-city-name').value.trim();
    const countryCode = document.getElementById('new-city-country').value.trim().toUpperCase();
    
    if (cityName && countryCode) {
        const cityKey = `${cityName},${countryCode}`;
        if (!dashboardState.selectedCities.includes(cityKey)) {
            dashboardState.selectedCities.push(cityKey);
            addWeatherCityToList(cityKey);
            savePreferences();
            bootstrap.Modal.getInstance(document.getElementById('addCityModal')).hide();
            showSuccess(`${cityName} added to weather tracking!`);
        } else {
            showError('This city is already being tracked');
        }
    }
}

function addWeatherCityToList(city) {
    if (!dashboardState.selectedCities.includes(city)) {
        dashboardState.selectedCities.push(city);
        refreshAllData();
        savePreferences();
    }
}

function removeWeatherCity(city) {
    if (confirm(`Remove ${city} from weather tracking?`)) {
        dashboardState.selectedCities = dashboardState.selectedCities.filter(c => c !== city);
        dashboardState.weatherData = dashboardState.weatherData.filter(w => w.city !== city);
        updateWeatherCards();
        updateDataTable();
        savePreferences();
        showSuccess(`${city} removed from tracking`);
    }
}

function addCrypto() {
    const modal = new bootstrap.Modal(document.getElementById('addCryptoModal'));
    document.getElementById('add-crypto-form').reset();
    modal.show();
}

function saveNewCrypto() {
    const symbol = document.getElementById('new-crypto-symbol').value.trim().toUpperCase();
    const name = document.getElementById('new-crypto-name').value.trim();
    
    if (symbol) {
        if (!dashboardState.selectedCryptos.includes(symbol)) {
            dashboardState.selectedCryptos.push(symbol);
            refreshAllData();
            savePreferences();
            bootstrap.Modal.getInstance(document.getElementById('addCryptoModal')).hide();
            showSuccess(`${symbol} added to crypto tracking!`);
        } else {
            showError('This cryptocurrency is already being tracked');
        }
    }
}

function removeCrypto(symbol) {
    if (confirm(`Remove ${symbol} from crypto tracking?`)) {
        dashboardState.selectedCryptos = dashboardState.selectedCryptos.filter(c => c !== symbol);
        dashboardState.cryptoData = dashboardState.cryptoData.filter(c => c.symbol !== symbol);
        updateCryptoCards();
        updateDataTable();
        updateChart();
        savePreferences();
        showSuccess(`${symbol} removed from tracking`);
    }
}

// Utility Functions
function formatCurrency(value, currency = 'USD') {
    const symbols = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£'
    };
    
    const symbol = symbols[currency] || '$';
    return `${symbol}${value.toFixed(2)}`;
}

function formatLargeNumber(value) {
    if (value >= 1e12) return (value / 1e12).toFixed(2) + 'T';
    if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
    if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
    if (value >= 1e3) return (value / 1e3).toFixed(2) + 'K';
    return value.toFixed(2);
}

function formatRelativeTime(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return time.toLocaleDateString();
}

function getDataStatus(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 5) return 'live';
    if (diffMins < 30) return 'stale';
    return 'error';
}

function getDataStatusText(timestamp) {
    const status = getDataStatus(timestamp);
    return status.charAt(0).toUpperCase() + status.slice(1);
}

function updateLastUpdateTime() {
    dashboardState.lastUpdate = new Date();
    document.getElementById('last-update').textContent = 'Just now';
}

// Demo Data Functions
function getDemoWeatherData() {
    return dashboardState.selectedCities.map(city => ({
        city: city.split(',')[0],
        country: city.split(',')[1] || 'US',
        temperature: Math.round(Math.random() * 30 + 10),
        description: getWeatherDescription(),
        humidity: Math.round(Math.random() * 40 + 40),
        windSpeed: Math.round(Math.random() * 20 + 5),
        pressure: Math.round(Math.random() * 50 + 980),
        visibility: Math.round(Math.random() * 10 + 5),
        feelsLike: Math.round(Math.random() * 30 + 10),
        icon: getWeatherIcon(),
        timestamp: new Date().toISOString()
    }));
}

function getDemoCryptoData() {
    return dashboardState.selectedCryptos.map(symbol => ({
        symbol: symbol,
        name: getCryptoName(symbol),
        price: getCryptoBasePrice(symbol) * (1 + (Math.random() - 0.5) * 0.2),
        change24h: (Math.random() - 0.5) * 20,
        changePercent24h: (Math.random() - 0.5) * 20,
        marketCap: getCryptoBasePrice(symbol) * Math.random() * 1000000000,
        volume24h: getCryptoBasePrice(symbol) * Math.random() * 100000000,
        circulatingSupply: Math.random() * 1000000000,
        allTimeHigh: getCryptoBasePrice(symbol) * (1 + Math.random() * 2),
        timestamp: new Date().toISOString()
    }));
}

// Helper Functions for Demo Data
function getCountryCode(city) {
    const codes = {
        'New York': 'US',
        'London': 'GB',
        'Tokyo': 'JP',
        'Paris': 'FR',
        'Sydney': 'AU'
    };
    return codes[city] || 'US';
}

function getWeatherDescription() {
    const descriptions = [
        'Clear sky', 'Few clouds', 'Scattered clouds', 'Broken clouds',
        'Shower rain', 'Rain', 'Thunderstorm', 'Snow', 'Mist'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function getWeatherIcon() {
    const icons = [
        'sun', 'cloud-sun', 'cloud', 'cloud-rain', 'cloud-showers-heavy',
        'bolt', 'snowflake', 'smog'
    ];
    return icons[Math.floor(Math.random() * icons.length)];
}

function getCryptoName(symbol) {
    const names = {
        'BTC': 'Bitcoin',
        'ETH': 'Ethereum',
        'BNB': 'Binance Coin',
        'ADA': 'Cardano',
        'SOL': 'Solana',
        'XRP': 'Ripple',
        'DOT': 'Polkadot',
        'DOGE': 'Dogecoin'
    };
    return names[symbol] || symbol;
}

function getCryptoBasePrice(symbol) {
    const prices = {
        'BTC': 45000,
        'ETH': 3000,
        'BNB': 400,
        'ADA': 1.2,
        'SOL': 120,
        'XRP': 0.6,
        'DOT': 25,
        'DOGE': 0.2
    };
    return prices[symbol] || 100;
}

// UI Helper Functions
function showLoading() {
    // Add loading overlay to main content
    const mainContent = document.querySelector('main');
    if (!mainContent.querySelector('.loading-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = '<div class="loading loading-dark"></div>';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255,255,255,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        mainContent.appendChild(overlay);
    }
}

function hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.remove();
    }
}

function createLoadingOverlay(card) {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = '<div class="loading"></div>';
    card.appendChild(overlay);
    return overlay;
}

function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1050;
        `;
        document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove after hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

function showSuccess(message) {
    showToast(message, 'success');
}

function showError(message) {
    showToast(message, 'error');
}

function showInfo(message) {
    showToast(message, 'info');
}

function filterTable(searchTerm) {
    const tbody = document.getElementById('data-table-body');
    const rows = tbody.getElementsByTagName('tr');
    
    Array.from(rows).forEach(row => {
        const text = row.textContent.toLowerCase();
        const matches = text.includes(searchTerm.toLowerCase());
        row.style.display = matches ? '' : 'none';
    });
}

function closeAllModals() {
    document.querySelectorAll('.modal.show').forEach(modal => {
        bootstrap.Modal.getInstance(modal).hide();
    });
}

function exportData() {
    const allData = [
        ...dashboardState.weatherData.map(w => ({
            Type: 'Weather',
            Name: `${w.city}, ${w.country}`,
            Temperature: `${w.temperature}°C`,
            Description: w.description,
            Humidity: `${w.humidity}%`,
            'Wind Speed': `${w.windSpeed} km/h`,
            Timestamp: w.timestamp
        })),
        ...dashboardState.cryptoData.map(c => ({
            Type: 'Cryptocurrency',
            Name: `${c.name} (${c.symbol})`,
            Price: formatCurrency(c.price, dashboardState.selectedCurrency),
            'Change 24h': `${c.changePercent24h.toFixed(2)}%`,
            'Market Cap': formatLargeNumber(c.marketCap),
            'Volume 24h': formatLargeNumber(c.volume24h),
            Timestamp: c.timestamp
        }))
    ];
    
    // Convert to CSV
    const headers = Object.keys(allData[0]);
    const csvContent = [
        headers.join(','),
        ...allData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    showSuccess('Data exported successfully!');
}

// State Management
function savePreferences() {
    const preferences = {
        selectedCities: dashboardState.selectedCities,
        selectedCryptos: dashboardState.selectedCryptos,
        selectedCurrency: dashboardState.selectedCurrency,
        autoRefresh: dashboardState.autoRefresh,
        refreshRate: dashboardState.refreshRate
    };
    localStorage.setItem('dashboard_preferences', JSON.stringify(preferences));
}

function loadPreferences() {
    const saved = localStorage.getItem('dashboard_preferences');
    if (saved) {
        const preferences = JSON.parse(saved);
        dashboardState.selectedCities = preferences.selectedCities || ['New York', 'London', 'Tokyo'];
        dashboardState.selectedCryptos = preferences.selectedCryptos || ['BTC', 'ETH', 'BNB'];
        dashboardState.selectedCurrency = preferences.selectedCurrency || 'USD';
        dashboardState.autoRefresh = preferences.autoRefresh !== false;
        dashboardState.refreshRate = preferences.refreshRate || 30000;
        
        // Update UI
        document.getElementById('crypto-currency').value = dashboardState.selectedCurrency;
        document.getElementById('refresh-status').textContent = dashboardState.autoRefresh ? 'ON' : 'OFF';
    }
}

// Export functions for global access
window.refreshAllData = refreshAllData;
window.refreshWeather = refreshWeather;
window.refreshCrypto = refreshCrypto;
window.refreshItem = refreshItem;
window.toggleAutoRefresh = toggleAutoRefresh;
window.addWeatherCity = addWeatherCity;
window.saveNewCity = saveNewCity;
window.removeWeatherCity = removeWeatherCity;
window.addCrypto = addCrypto;
window.saveNewCrypto = saveNewCrypto;
window.removeCrypto = removeCrypto;
window.exportData = exportData;

// Auto-save preferences periodically
setInterval(savePreferences, 60000); // Save every minute

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopAutoRefresh();
    } else if (dashboardState.autoRefresh) {
        startAutoRefresh();
        refreshAllData();
    }
});

// Handle before unload
window.addEventListener('beforeunload', function() {
    savePreferences();
});
