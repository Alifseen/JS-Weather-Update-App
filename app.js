/*First, all the elements that I will be making interactive are saved as a constant variable*/
const weatherIcon = document.querySelector('.weather-icon')
const locationIcon = document.querySelector('.location-icon')
const tempValue = document.querySelector('.temp')
const weatherValue = document.querySelector('.weather')
const locationValue = document.querySelector('.location')
const notificationElement = document.querySelector('.notification')



let cityInput = document.getElementById('search') /*This saves the city name that is typed in the input bar*/
let city = '' /*The input value or city from api called data is then saved here*/
let lat = 0.0 /*this saves the lattitude*/
let lon = 0.0 /*this saves the longitude*/



/*function that executes the script upon pressing enter*/
cityInput.addEventListener('keyup'/*if a key is pressed*/, function(event){

    if(event.keyCode ===13 /*13 is enter key*/){
        event.preventDefault() /*Stops the page from being reloaded on pressing enter*/
        city=cityInput.value /*this saves the city name from input value to city variable*/
        getWeatherDetails(city) /*this function is created later to call the API*/
        console.log(city)/*to test if this conditional and function are working*/

    }
})


/*Now we define a few more variables that we will call*/
const weather = {} /*Object that stores the weather data we get from the API*/
weather.temprature = {unit: 'celsius'} /*to get the data in celsius (For details:API Documentation)*/ 
const KELVIN = 273 /*to the subtract from the API value to get celsius*/
const key = '70dd30f9a499cb9ffc1efd8aedc242cc' /*openweatherorg key*/


/*This conditional checks if location is accessible by browser or not */
if('geolocation' in navigator/*navigator is a browser object element*/) {
    navigator.geolocation.getCurrentPosition(setPosition,showError) /*this gets the lattitude and longitude values from the browser and saves them to setPosition, otherwise executes showError*/
} else /*Change the contents of notification section*/{
    notificationElement.style.display = 'block' /*sets the diplay to block*/
    notificationElement.innerHTML = '<p> Browser doesnt support geolocation or geolocation access is disabled </p>' /*sets HTML content*/
}


/*This function gets the latitude and longitude by location tracker from the browser*/
function setPosition(position){
    lat = position.coords.latitude
    lon = position.coords.longitude
    getWeather(lat,lon)
}


/*This function sets the latitude and longitude by location tracker from the browser upon clicking the location pin icon*/
locationIcon.addEventListener('click', function(event) {
    console.log('hello')
    getWeather(lat,lon)
})


/*This function changes the notificaiton section inside the HTML if there is an error*/
function showError(error){
    notificationElement.style.display = 'block'
    notificationElement.innerHTML = `<p>${error.message}</p>`
}


/*This function calls the API upon typing the city name in search bar*/
function getWeatherDetails(city){
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    fetch(api)
    .then /*once api call is successful, save json to data variable:*/ (function(response){
        let data = response.json() /*(For details:API Documentation)*/
        return data
    })
    .then /*once json is stored in data, save specific values to the main weather object defined in line 32:*/ (function(data){
        weather.temprature.value = Math.floor(data.main.temp -KELVIN) /*(For details:API Documentation)*/
        weather.description = data.weather[0].description /*(For details:API Documentation)*/
        weather.iconId = data.weather[0].icon /*(For details:API Documentation)*/
        weather.city = data.name /*(For details:API Documentation)*/
        weather.country = data.sys.country
    })
    .then /*once the values above are set, change the HTML file accordingly:*/ (function(){displayWeather()})
}


/*This function calls the API upon clicking the location icon*/
function getWeather(lat, lon) {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`
    fetch(api)
    .then /*once api call is successful, save json to data variable:*/ (function(response){
        let data = response.json()
        return data
    })
    .then /*once json is stored in data, save specific values to the main weather object defined in line 32:*/ (function(data){
        weather.temprature.value = Math.floor(data.main.temp -KELVIN)
        weather.description = data.weather[0].description
        weather.iconId = data.weather[0].icon
        weather.city = data.name
        weather.country = data.sys.country
    })
    .then /*once the values above are set, change the HTML file accordingly:*/ (function(){
        displayWeather()
    })
}


/*This function changes the HTML file the constant we defined at the start of our documentation*/
function displayWeather(){
    weather.iconId = `${weather.iconId[0]}${weather.iconId[1]}d` /*standardizes day and night ids to day(For details:API Documentation)*/
    weatherIcon.innerHTML =`<img src='img/weather icons/${weather.iconId}.png'/>`
    tempValue.innerHTML = `${weather.temprature.value} C°`
    weatherValue.innerHTML = weather.description
    locationValue.innerHTML = `${weather.city}, ${weather.country}`
}
