// ========== Global Variables ==========

// Get the theme toggle button and icon
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

// ========== Functions ==========

// Function to toggle between light and dark mode
function toggleTheme() {
    // Get the current theme CSS file
    const themeCss = document.getElementById("theme-css");

    // Toggle between light and dark mode by switching CSS file
    if (themeCss.getAttribute("href") === "css/main-dark.css") {
        themeCss.setAttribute("href", "css/main-light.css");
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
    } else {
        themeCss.setAttribute("href", "css/main-dark.css");
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
    }
}

// Function to fetch weather data based on city name or geolocation
async function getData(location) {
    const apiKey = "25769ed9b2e54b0d989120937252610";
    var apiUrl;

    if (location === "current_location") {
        // Fetch weather data based on geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=7&lang=en`;

                    try {
                        const response = await fetch(apiUrl);
                        const data = await response.json();
                        displayHighlights(data);
                        displayHourlyForecast(data);
                        displaySevenDayForecast(data);
                        displayAirConditions(data);
                    } catch (error) {
                        console.error("Error fetching weather data:", error);
                        displayError();
                        document.querySelector(
                            ".weather-info .highlights"
                        ).style.margin = "50px auto";
                        const spinner = document.querySelectorAll(".spinner");
                        spinner[0].style.display = "none";
                        for (let i = 0; i < spinner.length; i++) {
                            spinner[i].style.visibility = "hidden";
                        }
                    }
                },
                (error) => {
                    console.error("Error getting geolocation:", error);
                    getData("alexandria");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
            getData("alexandria");
        }
    } else {
        // Fetch weather data based on city name
        apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7&lang=en`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            displayHighlights(data);
            displayHourlyForecast(data);
            displaySevenDayForecast(data);
            displayAirConditions(data);
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }
}

// Function to display current weather highlights
function displayHighlights(data) {
    var content = `
        <div class="text text-lg-start text-center mb-lg-0 mb-3">
            <h1 class="city-name mb-2">${data.location.name}</h1>
            <p class="country-name text-off m-0">${data.location.country}</p>
        </div>
        <div class="d-flex align-items-center">
            <span class="display-1 mb-lg-0 mb-4">${data.current.temp_c} °C</span>
        </div>
        <div class="d-flex flex-column align-items-center justify-content-center">
            <div class="icon mb-2">
                <img class="w-100" src="${data.current.condition.icon}" alt="">
            </div>
            <p class="text-off m-0">${data.current.condition.text}</p>
        </div>`;
    document.getElementById("highlights").innerHTML = content;
}

// Function to display error message
function displayError() {
    document.querySelector(".weather-info .highlights").style.margin =
        "50px auto";
    var content = `<h2 class="text-center display-1">Error fetching weather data</h2>`;
    document.querySelector(".weather-info").innerHTML = content;
}
// Function to display hourly forecast
function displayHourlyForecast(data) {
    var content = ``;
    var currentHour = new Date().getHours();
    var forecastHours = data.forecast.forecastday[0].hour;

    // Find the starting index for the current hour
    var startIndex = forecastHours.findIndex((hour) => {
        var hourTime = new Date(hour.time).getHours();
        return hourTime === currentHour;
    });

    // If the current hour is not found, start from the beginning
    if (startIndex === -1) {
        startIndex = 0;
    }

    // Display the next 6 hours of forecast data
    for (var i = startIndex; i < startIndex + 6; i++) {
        var forecastIndex = i % 24;
        var dateTime = forecastHours[forecastIndex].time;
        var time = dateTime.split(" ")[1];
        content += `
            <div class="box col-lg-2 col-md-4 col-sm-6 col-6 d-flex flex-column justify-content-center align-items-center">
                <span class="mb-2 text-off">${time}</span>
                <div class="icon mb-2">
                    <img class="w-100" src="${forecastHours[forecastIndex].condition.icon}" alt="">
                </div>
                <span class="fs-4 fw-bold">${forecastHours[forecastIndex].temp_c}°</span>
            </div>`;
    }
    document.getElementById("hourlyData").innerHTML = content;
}

// Function to display air conditions
function displayAirConditions(data) {
    var content = `
        <div class="col-md-6 d-flex align-items-start ms-lg-0 ms-4">
            <i class="fa-solid fa-temperature-three-quarters text-off mt-1"></i>
            <div class="text d-flex flex-column ms-2">
                <span class="ms-2 text-off">Real Feel</span>
                <span class="ms-2 fs-4 fw-bold">${data.current.temp_c}°</span>
            </div>
        </div>
        <div class="col-md-6 d-flex align-items-start ms-lg-0 ms-4">
            <i class="fa-solid fa-wind text-off mt-1"></i>
            <div class="text d-flex flex-column ms-2">
                <span class="ms-2 text-off">Wind</span>
                <span class="ms-2 fs-4 fw-bold">${data.current.wind_kph} km/h</span>
            </div>
        </div>
        <div class="col-md-6 d-flex align-items-start ms-lg-0 ms-4">
            <i class="fa-solid fa-droplet text-off mt-1"></i>
            <div class="text d-flex flex-column ms-2">
                <span class="ms-2 text-off">Precipitation</span>
                <span class="ms-2 fs-4 fw-bold">${data.current.precip_mm} mm</span>
            </div>
        </div>
        <div class="col-md-6 d-flex align-items-start ms-lg-0 ms-4">
            <i class="fa-solid fa-sun text-off mt-1"></i>
            <div class="text d-flex flex-column ms-2">
                <span class="ms-2 text-off">UV Index</span>
                <span class="ms-2 fs-4 fw-bold">${data.current.uv}</span>
            </div>
        </div>`;

    document.getElementById("airConditionsData").innerHTML = content;
}

// Function to display 7-day forecast
function displaySevenDayForecast(data) {
    var content = ``;
    var forecastDays = data.forecast.forecastday;

    // Array to convert day index to day name
    var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

    for (var i = 0; i < 7; i++) {
        var forecastDay = forecastDays[i];
        var date = new Date(forecastDay.date);
        var dayName = dayNames[date.getDay()]; // Get the day name

        content += `
            <div class="box d-flex align-items-center w-100 p-4 justify-content-between">
                <span class="day-name d-block text-off">${dayName}</span>
                <div class="icon"><img class="w-100" src="${forecastDay.day.condition.icon}" alt=""></div>
                <span class="d-block fw-bold">
                    <span class="high fs-5">${forecastDay.day.maxtemp_c}°</span>
                    <span class="low text-off"> / ${forecastDay.day.mintemp_c}°</span>
                </span>
            </div>`;
    }
    document.getElementById("sevenDayData").innerHTML = content;
}
// ========== Main ==========

// Add click event listener to theme toggle button
themeToggle.addEventListener("click", toggleTheme);

// Event listener for search input
var searchInput = document.getElementById("search");
searchInput.addEventListener("input", function () {
    var city = searchInput.value;
    if (city) {
        getData(city);
    }
});

getData("current_location");
