// Digital Clock JavaScript - Real-time Time Zone Updates

// Time zones configuration
const timeZones = {
    'ny': { name: 'New York', tz: 'America/New_York' },
    'london': { name: 'London', tz: 'Europe/London' },
    'paris': { name: 'Paris', tz: 'Europe/Paris' },
    'dubai': { name: 'Dubai', tz: 'Asia/Dubai' },
    'tokyo': { name: 'Tokyo', tz: 'Asia/Tokyo' },
    'sydney': { name: 'Sydney', tz: 'Australia/Sydney' },
    'singapore': { name: 'Singapore', tz: 'Asia/Singapore' },
    'hongkong': { name: 'Hong Kong', tz: 'Asia/Hong_Kong' },
    'la': { name: 'Los Angeles', tz: 'America/Los_Angeles' }
};

// Format time with leading zeros
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

// Format date
function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Get timezone offset
function getTimezoneOffset(tz) {
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: tz });
    const parts = formatter.formatToParts(new Date());
    const tzDate = new Date(formatter.format(new Date()));
    const utcDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    const offset = Math.round((tzDate - utcDate) / 60000);
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset >= 0 ? '+' : '-';
    return `UTC ${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

// Update single clock
function updateClock(key, timezone) {
    const timeId = `time-${key}`;
    const dateId = `date-${key}`;
    const offsetId = `offset-${key}`;
    
    // Get current time in specific timezone
    const now = new Date();
    const tzTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    
    // Update DOM
    document.getElementById(timeId).textContent = formatTime(tzTime);
    document.getElementById(dateId).textContent = formatDate(tzTime);
    document.getElementById(offsetId).textContent = getTimezoneOffset(timezone);
}

// Update local time
function updateLocalTime() {
    const now = new Date();
    document.getElementById('local-time').textContent = formatTime(now);
    document.getElementById('local-date').textContent = formatDate(now);
}

// Update all clocks
function updateAllClocks() {
    // Update local time
    updateLocalTime();
    
    // Update all time zones
    for (const [key, data] of Object.entries(timeZones)) {
        updateClock(key, data.tz);
    }
}

// Initialize clocks
document.addEventListener('DOMContentLoaded', function() {
    // Initial update
    updateAllClocks();
    
    // Update every second
    setInterval(updateAllClocks, 1000);
    
    // Add smooth transitions
    const cards = document.querySelectorAll('.clock-card');
    cards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s forwards`;
        card.style.opacity = '0';
    });
});

// Animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Optional: Add keyboard shortcut to refresh
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        updateAllClocks();
    }
});

// Handle visibility change - update when tab becomes visible again
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        updateAllClocks();
    }
});

// Prevent memory leaks - ensure intervals are properly managed
window.addEventListener('beforeunload', function() {
    // Cleanup if needed
    console.log('Clock page unloading');
});