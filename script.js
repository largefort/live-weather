// Replace 'YOUR_OPENWEATHERMAP_API_KEY' with your actual OpenWeatherMap API key
const openWeatherMapApiKey = 'd0cb3d09f67d9502d6b77713d580d5fa';

// Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual Google Maps API key
const googleMapsApiKey = 'AIzaSyBmjZTl720lA-j4i2UgRUv2pm0Q48Ai5mc';

const mapElement = document.getElementById('map');

function initMap() {
    const map = new google.maps.Map(mapElement, {
        center: { lat: 0, lng: 0 },
        zoom: 2
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(userLocation);
            map.setZoom(8);
            fetchWeatherData(userLocation.lat, userLocation.lng);
        }, handleError);
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

function fetchWeatherData(latitude, longitude) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherMapApiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const temperature = data.main.temp;
            const cityName = data.name;

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

function handleError(error) {
    console.error('Geolocation error:', error.message);
}

function loadMapScript() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=initMap`;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
}

window.onload = loadMapScript;
