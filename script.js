// OpenWeatherMap API configuration
        const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual API key
        const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

        // Demo data for simulation
        const demoWeatherData = {
            'london': {
                name: 'London',
                main: {
                    temp: 15,
                    feels_like: 13,
                    humidity: 78,
                    pressure: 1013
                },
                weather: [{ main: 'Clouds', description: 'overcast clouds' }],
                wind: { speed: 3.2 }
            },
            'new york': {
                name: 'New York',
                main: {
                    temp: 22,
                    feels_like: 24,
                    humidity: 65,
                    pressure: 1015
                },
                weather: [{ main: 'Clear', description: 'clear sky' }],
                wind: { speed: 2.8 }
            },
            'tokyo': {
                name: 'Tokyo',
                main: {
                    temp: 28,
                    feels_like: 31,
                    humidity: 82,
                    pressure: 1008
                },
                weather: [{ main: 'Rain', description: 'light rain' }],
                wind: { speed: 1.5 }
            },
            'paris': {
                name: 'Paris',
                main: {
                    temp: 18,
                    feels_like: 16,
                    humidity: 70,
                    pressure: 1020
                },
                weather: [{ main: 'Clear', description: 'sunny' }],
                wind: { speed: 2.1 }
            },
            'mumbai': {
                name: 'Mumbai',
                main: {
                    temp: 32,
                    feels_like: 38,
                    humidity: 88,
                    pressure: 1005
                },
                weather: [{ main: 'Thunderstorm', description: 'heavy rain' }],
                wind: { speed: 4.2 }
            }
        };

        // Weather icons mapping
        const weatherIcons = {
            'Clear': '☀️',
            'Clouds': '☁️',
            'Rain': '🌧️',
            'Thunderstorm': '⛈️',
            'Snow': '❄️',
            'Mist': '🌫️',
            'Fog': '🌫️',
            'Haze': '🌫️'
        };

        // DOM elements
        const weatherForm = document.getElementById('weatherForm');
        const cityInput = document.getElementById('cityInput');
        const loading = document.getElementById('loading');
        const errorMessage = document.getElementById('errorMessage');
        const weatherCard = document.getElementById('weatherCard');

        // Form submission handler
        weatherForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const city = cityInput.value.trim();
            if (city) {
                await fetchWeather(city);
            }
        });

        // Fetch weather data
        async function fetchWeather(city) {
            showLoading();
            hideError();
            hideWeatherCard();

            try {
                let weatherData;

                // Check if we should use demo data or real API
                if (API_KEY === 'YOUR_API_KEY_HERE') {
                    // Use demo data
                    weatherData = await getDemoWeatherData(city);
                } else {
                    // Use real API
                    weatherData = await getRealWeatherData(city);
                }

                displayWeather(weatherData);
            } catch (error) {
                showError(error.message);
            } finally {
                hideLoading();
            }
        }

        // Get demo weather data
        async function getDemoWeatherData(city) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const cityKey = city.toLowerCase();
                    const data = demoWeatherData[cityKey];

                    if (data) {
                        resolve(data);
                    } else {
                        // Generate random data for unknown cities
                        const randomData = {
                            name: city,
                            main: {
                                temp: Math.floor(Math.random() * 35) + 5,
                                feels_like: Math.floor(Math.random() * 35) + 5,
                                humidity: Math.floor(Math.random() * 40) + 40,
                                pressure: Math.floor(Math.random() * 50) + 1000
                            },
                            weather: [{
                                main: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
                                description: 'partly cloudy'
                            }],
                            wind: { speed: Math.floor(Math.random() * 10) + 1 }
                        };
                        resolve(randomData);
                    }
                }, 1000);
            });
        }

        // Get real weather data from API
        async function getRealWeatherData(city) {
            const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('City not found. Please check the spelling and try again.');
                } else if (response.status === 401) {
                    throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
                } else {
                    throw new Error('Failed to fetch weather data. Please try again later.');
                }
            }

            return await response.json();
        }

        // Display weather data
        function displayWeather(data) {
            document.getElementById('cityName').textContent = data.name;
            document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
            document.getElementById('description').textContent = data.weather[0].description;
            document.getElementById('humidity').textContent = `${data.main.humidity}%`;
            document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
            document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
            document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;

            // Set weather icon
            const weatherMain = data.weather[0].main;
            const icon = weatherIcons[weatherMain] || '🌤️';
            document.getElementById('weatherIcon').textContent = icon;

            showWeatherCard();
        }

        // UI helper functions
        function showLoading() {
            loading.style.display = 'block';
        }

        function hideLoading() {
            loading.style.display = 'none';
        }

        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }

        function hideError() {
            errorMessage.style.display = 'none';
        }

        function showWeatherCard() {
            weatherCard.classList.add('show');
        }

        function hideWeatherCard() {
            weatherCard.classList.remove('show');
        }

        // Load a default city on page load
        window.addEventListener('load', () => {
            cityInput.value = 'London';
            fetchWeather('London');
        });