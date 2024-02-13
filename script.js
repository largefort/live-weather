// Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
const apiKey = 'd0cb3d09f67d9502d6b77713d580d5fa';
const mapElement = document.getElementById('map');

// Function to initialize the map
function initMap() {
    // Set the initial map coordinates
    const map = new google.maps.Map(mapElement, {
        center: { lat: 0, lng: 0 },
        zoom: 2
    });

    // Request user's location (optional)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(userLocation);
            map.setZoom(8);

            // Call the function to fetch and display weather data
            fetchWeatherData(userLocation.lat, userLocation.lng);
        }, handleError);
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

// Function to fetch and display weather data
function fetchWeatherData(latitude, longitude) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Extract relevant weather information from the API response
            const temperature = data.main.temp;
            const cityName = data.name;

            // Display the weather information on the map
            const infowindow = new google.maps.InfoWindow({
                content: `City: ${cityName}<br>Temperature: ${temperature}°C`
            });

            const marker = new google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map: map,
                title: 'Current Location'
            });

            marker.addListener('click', () => {
                infowindow.open(map, marker);
            });
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

// Handle geolocation errors
function handleError(error) {
    console.error('Geolocation error:', error.message);
}

// Load the Google Maps API and initialize the map
function loadMapScript() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
}

// Load the map script when the page is loaded
window.onload = loadMapScript;
