document.addEventListener('DOMContentLoaded', () => {
    // Mock Data unused variables removed for simplicity

    // Charts Configuration
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Outfit', sans-serif";

    let tempChart, rainChart, uvChart;

    const citiesData = {
        Pune: {
            temp: 28, condition: 'Clear', wind: 12, humidity: 45, uv: 7, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], temps: [26, 27, 28, 29, 28, 30, 31], rain: [5, 0, 0, 10, 5, 0, 0], forecast: [
                { day: 'Mon', icon: 'fa-sun', temp: '26° / 18°' },
                { day: 'Tue', icon: 'fa-sun', temp: '27° / 19°' },
                { day: 'Wed', icon: 'fa-cloud-sun', temp: '28° / 20°' },
                { day: 'Thu', icon: 'fa-cloud-rain', temp: '29° / 21°' },
                { day: 'Fri', icon: 'fa-cloud', temp: '28° / 20°' },
                { day: 'Sat', icon: 'fa-sun', temp: '30° / 22°' },
                { day: 'Sun', icon: 'fa-sun', temp: '31° / 23°' }
            ]
        },
        Mumbai: {
            temp: 32, condition: 'Humid', wind: 15, humidity: 75, uv: 8, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], temps: [30, 31, 32, 32, 33, 31, 32], rain: [20, 30, 40, 50, 20, 10, 5], forecast: [
                { day: 'Mon', icon: 'fa-cloud-sun', temp: '30° / 26°' },
                { day: 'Tue', icon: 'fa-cloud-rain', temp: '31° / 27°' },
                { day: 'Wed', icon: 'fa-bolt', temp: '32° / 27°' },
                { day: 'Thu', icon: 'fa-cloud-rain', temp: '32° / 26°' },
                { day: 'Fri', icon: 'fa-cloud-sun', temp: '33° / 27°' },
                { day: 'Sat', icon: 'fa-sun', temp: '31° / 26°' },
                { day: 'Sun', icon: 'fa-sun', temp: '32° / 26°' }
            ]
        },
        Delhi: {
            temp: 35, condition: 'Sunny', wind: 10, humidity: 40, uv: 9, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], temps: [33, 35, 36, 38, 37, 39, 40], rain: [0, 0, 5, 0, 0, 0, 0], forecast: [
                { day: 'Mon', icon: 'fa-sun', temp: '33° / 22°' },
                { day: 'Tue', icon: 'fa-sun', temp: '35° / 24°' },
                { day: 'Wed', icon: 'fa-sun', temp: '36° / 25°' },
                { day: 'Thu', icon: 'fa-sun', temp: '38° / 26°' },
                { day: 'Fri', icon: 'fa-sun', temp: '37° / 25°' },
                { day: 'Sat', icon: 'fa-sun', temp: '39° / 27°' },
                { day: 'Sun', icon: 'fa-sun', temp: '40° / 28°' }
            ]
        },
        Bangalore: {
            temp: 24, condition: 'Cloudy', wind: 18, humidity: 60, uv: 6, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], temps: [22, 23, 24, 25, 23, 22, 24], rain: [40, 30, 20, 10, 20, 30, 40], forecast: [
                { day: 'Mon', icon: 'fa-cloud-rain', temp: '22° / 18°' },
                { day: 'Tue', icon: 'fa-cloud', temp: '23° / 18°' },
                { day: 'Wed', icon: 'fa-cloud-sun', temp: '24° / 19°' },
                { day: 'Thu', icon: 'fa-sun', temp: '25° / 19°' },
                { day: 'Fri', icon: 'fa-cloud-sun', temp: '23° / 19°' },
                { day: 'Sat', icon: 'fa-cloud-rain', temp: '22° / 18°' },
                { day: 'Sun', icon: 'fa-cloud-sun', temp: '24° / 19°' }
            ]
        }
    };

    function updateDashboard(city) {
        const data = citiesData[city];
        const citySelect = document.getElementById('citySelect');
        const selectedOption = citySelect.options[citySelect.selectedIndex];

        // Update Locations
        document.querySelector('.location h2').innerText = city;
        document.querySelector('.location p').innerText = selectedOption.text.split(', ')[1] || 'India';

        // Update Main Weather
        document.querySelector('.temp').innerText = `${data.temp}°`;
        document.querySelector('.condition span').innerText = data.condition;

        // Update Details
        const details = document.querySelectorAll('.detail span');
        details[0].innerText = `${data.wind} km/h`;
        details[1].innerText = `${data.humidity}%`;
        details[2].innerText = city === 'Pune' ? '10 km' : '8 km'; // Mock visibility

        // Update UV Index
        document.getElementById('uvValue').innerText = data.uv;
        const uvText = data.uv > 8 ? 'Very High' : data.uv > 5 ? 'Moderate' : 'Low';
        document.querySelector('.uv-value small').innerText = uvText;

        // Update Forecast
        const forecastList = document.querySelector('.forecast-list');
        forecastList.innerHTML = '';
        data.forecast.forEach(item => {
            const li = document.createElement('li');
            li.className = 'forecast-item';
            li.innerHTML = `
                <span class="forecast-day">${item.day}</span>
                <i class="fa-solid ${item.icon} forecast-icon"></i>
                <span class="forecast-temp">${item.temp}</span>
            `;
            forecastList.appendChild(li);
        });

        // Update Charts
        tempChart.data.datasets[0].data = data.temps;
        tempChart.update();

        rainChart.data.datasets[0].data = data.rain;
        rainChart.update();

        uvChart.data.datasets[0].data = [data.uv, 12 - data.uv];
        uvChart.data.datasets[0].backgroundColor[0] = data.uv > 8 ? '#ef4444' : data.uv > 5 ? '#eab308' : '#22c55e';
        uvChart.update();
    }

    // Chart Helper Function
    function createChart(id, type, labels, label, color, bgColor, fill = false) {
        return new Chart(document.getElementById(id).getContext('2d'), {
            type: type,
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: [],
                    borderColor: color,
                    backgroundColor: bgColor,
                    borderWidth: type === 'doughnut' ? 0 : (type === 'line' ? 3 : 0),
                    borderRadius: type === 'bar' ? 4 : 0,
                    tension: 0.4,
                    fill: fill,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: color,
                    pointRadius: type === 'line' ? 4 : 0,
                    pointHoverRadius: type === 'line' ? 6 : 0,
                    cutout: type === 'doughnut' ? '80%' : undefined,
                    barThickness: type === 'bar' ? 12 : undefined
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: type !== 'doughnut' }
                },
                scales: {
                    y: type !== 'doughnut' ? {
                        grid: { display: type === 'line', color: 'rgba(255, 255, 255, 0.05)' },
                        display: type === 'line',
                        suggestedMin: type === 'line' ? 15 : 0,
                        suggestedMax: type === 'line' ? 45 : 100
                    } : { display: false },
                    x: { grid: { display: false }, display: type !== 'doughnut' }
                },
                rotation: type === 'doughnut' ? -90 : 0,
                circumference: type === 'doughnut' ? 180 : 360
            }
        });
    }

    // Initialize Charts using Helper
    tempChart = createChart('tempChart', 'line', citiesData.Pune.days, 'Temperature (°C)', '#38bdf8', 'rgba(56, 189, 248, 0.1)', true);
    rainChart = createChart('rainChart', 'bar', citiesData.Pune.days, 'Chance of Rain (%)', undefined, '#0ea5e9');

    // UV Chart
    const uvCtx = document.getElementById('uvChart').getContext('2d');
    uvChart = new Chart(uvCtx, {
        type: 'doughnut',
        data: {
            labels: ['UV Index', 'Remaining'],
            datasets: [{
                data: [0, 12],
                backgroundColor: ['#22c55e', 'rgba(255, 255, 255, 0.1)'],
                borderWidth: 0,
                cutout: '80%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            rotation: -90,
            circumference: 180
        }
    });


    // Initial Load
    updateDashboard('Pune');

    // City select
    document.getElementById('citySelect').addEventListener('change', (e) => {
        updateDashboard(e.target.value);
    });

    // Sidebar nav filtering
    const navLinks = Array.from(document.querySelectorAll('.sidebar nav a'));
    const allCards = Array.from(document.querySelectorAll('.card'));

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.dataset.target;
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            allCards.forEach(card => {
                if (target === 'all') card.style.display = '';
                else card.style.display = (card.dataset.tab === target) ? '' : 'none';
            });
        });
    });

    // Theme Toggle Functionality
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', () => {
        const icon = themeToggle.querySelector('i');
        if (icon.classList.contains('fa-moon')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
});
