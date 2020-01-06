var arrCities = [];
var gCity = "";
localStorage.clear();


// parms: 0 = initial load, 1 = search btn, 2 = history btn, 3 - local storage
SourceDirector(0);

function SourceDirector(sourceRequest) {
    console.log("Current city is: " + gCity)

    if (sourceRequest == 0) // initial load
    {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
        }
        else {

            showError("Your browser does not support Geolocation!");
            //TODO: show local storage sourceRequest = 3 
        }
    }

}


function showError(msg) {
    alert(msg);
}

function geolocationSuccess(position) {

    // If the cache is old or nonexistent, issue a new AJAX request

    var APIKey = "e301853154037206540d2cdfc3543c87";
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var weatherAPI = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;


    $.getJSON(weatherAPI, function (response) {

        // Store the cache
        localStorage.weatherCacheUser = JSON.stringify({
            timestamp: (new Date()).getTime(),   // getTime() returns milliseconds
            data: response
        });

        // Call the function again
        //locationSuccess(position);
        populateCurrentUserCity(response);
    });
}

function geolocationError(error) {
    switch (error.code) {
        case error.TIMEOUT:
            showError("A timeout occured! Please try again!");
            break;
        case error.POSITION_UNAVAILABLE:
            showError('We can\'t detect your location. Sorry!');
            break;
        case error.PERMISSION_DENIED:
            showError('Please allow geolocation access for this to work.');
            break;
        case error.UNKNOWN_ERROR:
            showError('An unknown error occured!');
            break;
    }

}

function populateCurrentUserCity(response) {
    {


        
        gCity = response.name;
        console.log(response);
        

        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(".tempF").text("Temperature (Kelvin) " + tempF);

        function cutDecimals(tempF, decimals) {
            return tempF.toLocaleString('fullwide', { maximumFractionDigits: decimals })
        }

        console.log(
            cutDecimals(tempF, 0),

        )


        var name = response.name;
        var dt = moment().format('MMMM Do, YYYY');
        var icon = response.weather[0].icon;
        var speed = response.wind.speed;
        var humidity = response.main.humidity;
        var temp = cutDecimals(tempF, 0);



        localStorage.setItem("curr_name", name);
        localStorage.setItem("curr_dt", dt);
        localStorage.setItem("curr_icon", icon);
        localStorage.setItem("curr_speed", speed);
        localStorage.setItem("curr_humidity", humidity);
        localStorage.setItem("curr_temp", temp);

        var icon2 = '<img src="assets/img/icons/' + icon +
            '.png" />'
        $(".icon").empty;
        $(".city").html("<h3>" + name + "</h3>");
        $(".date").text(dt);
        $(".icon").prepend(icon2);
        $(".temp").text("Temperature: " + temp + '°' + "F");
        $(".humidity").text("Humidity: " + humidity + "%");
        $(".wind").text("Wind Speed: " + speed + " mph");
        




        console.log("Wind Speed: " + response.wind.speed);
        console.log("Humidity: " + response.main.humidity);
        console.log("Temperature: (F): " + cutDecimals(tempF, 0));

        fnForecast2(response.coord.lat, response.coord.lon);
        getUvindex(response.coord.lat, response.coord.lon);

    }

}

function renderButtons() {

    // Deleting the arrCities prior to adding new arrCities
    // (this is necessary otherwise you will have repeat buttons)
    $("#buttons-view").empty();

    // Looping through the array of arrCities
    for (var i = 0; i < arrCities.length; i++) {

        // Then dynamicaly generating buttons for each city in the array
        // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
        var myButt = $("<button>");
        // Adding a class of city-btn to our button
        myButt.addClass("city-btn");
        // Adding a data-attribute
        myButt.attr("data-btnname", arrCities[i]);
        // Providing the initial button text
        myButt.text(arrCities[i]);
        // Adding the button to the buttons-view div
        $("#buttons-view").prepend(myButt);
    }
}

// 2  city history btn
$(document).on("click", ".city-btn", function () {
    // alert("click bound to document listening for .city-btn");
    var currCity = $(this).data('btnname');
    gCity = currCity;
    fncurrentCit();
    console.log('currCity hist btn : ' + currCity + ' gCity: ' + gCity);

});


// 1.  This function handles events where a city button is clicked
$("#add-city").on("click", function (event) {

    event.preventDefault();
    // This line grabs the input from the textbox

    // // Adding city from the textbox to our array

    var cityName = $("#city-input").val().trim();

    arrCities.push(cityName);
    gCity = cityName;
    // Calling renderButtons which handles the processing of our  array
    renderButtons();
    fncurrentCit();
    console.log('currCity search : ' + cityName + ' gCity: ' + gCity);
});



function fnForecast2(lat, lon) {

    console.log("In forcast2 " + gCity + " lat " + lat + " lon " + lon)
    var weatherDiv = $('#weather'),
        location = $('p.location');

          
            let element = document.getElementById('scroller');
      
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
         

    locationSuccess();

    function locationSuccess() {
        try {
            // If the cache is old or nonexistent, issue a new AJAX request
            console.log(" forecast start" + gCity)
            var APIKey = "e301853154037206540d2cdfc3543c87";

            var weatherAPI = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&cnt=40" + "&appid=" + APIKey;
            $.getJSON(weatherAPI, function (response) {

                // Store the cache
                localStorage.ForecastweatherCache = JSON.stringify({
                    timestamp: (new Date()).getTime(), 
                    data: response
                });




                var dt_saved = "";
                $.each(response.list, function (i, val) {
               
                    var name = response.city.name;
                    var dt = cutDate(response.list[i].dt_txt);
                    
                    var icon = response.list[i].weather[0].icon;
                    var humidity = response.list[i].main.humidity;
                    var tempF = (response.list[i].main.temp - 273.15) * 1.80 + 32;
                    var temp = cutDecimals(tempF, 0);
                    var condition = "Temperature: " + temp + '°'+ "F";
                    var condition1 = " Humidity: " + humidity + "%";
                    if (dt  !==  dt_saved) {
                        addWeather(
                            icon,
                            dt,
                            condition,
                            condition1,
                            name

                        );
                    }
                    dt_saved = dt;

                });

                function cutDecimals(tempF, decimals) {
                    return tempF.toLocaleString('fullwide', { maximumFractionDigits: decimals })
                }
                function cutDate(dt) {

                    return dt.toString("yyyy-MM-dd").substr(0, 10);
                }
                


            });

        }
        catch (e) {
            showError("We can't find information about your city!");
            window.console && console.error(e);
        }

    }

    

    function addWeather(icon, day, condition, condition1, gCity) {

        
        var markup = '<li id="weather_li">' +
            ' <p class="day">' + day +
            '<p> <img src="assets/img/icons/' + icon + '.png" />' +
            '</p> <p class="cond">' + condition + '</p>' +
            '</p> <p class="cond">' + condition1 + '</p>' +
            //    '<img src="http://openweathermap.org/img/wn/'+ icon +'.png" />'+           
            '</li>';
        var li = document.createElement('li');
        li.innerHTML = markup;
        document.getElementById('scroller').appendChild(li);
        $(".5day").html("<h3>5-Day Forecast:</h3>");
    }


    /* Error handling functions */

    function locationError(error) {
        switch (error.code) {
            case error.TIMEOUT:
                showError("A timeout occured! Please try again!");
                break;
            case error.POSITION_UNAVAILABLE:
                showError('We can\'t detect your location. Sorry!');
                break;
            case error.PERMISSION_DENIED:
                showError('Please allow geolocation access for this to work.');
                break;
            case error.UNKNOWN_ERROR:
                showError('An unknown error occured!');
                break;
        }

    }

    function convertTemperature(kelvin) {
        // Convert the temperature to either Celsius or Fahrenheit:
        return Math.round(DEG == 'c' ? (kelvin - 273.15) : (kelvin * 9 / 5 - 459.67));
    }

    function showError(msg) {
        weatherDiv.addClass('error').html(msg);
    }

}



function fncurrentCit() {


    var APIKey = "e301853154037206540d2cdfc3543c87";

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + gCity + "&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {


        console.log(queryURL);


        console.log(response);

        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(".tempF").text("Temperature (Kelvin) " + tempF);

        function cutDecimals(tempF, decimals) {
            return tempF.toLocaleString('fullwide', { maximumFractionDigits: decimals })
        }

        console.log(
            cutDecimals(tempF, 0),

        )


        var name = response.name;
        var dt = moment().format('MMMM Do, YYYY');
        var icon = response.weather[0].icon;
        var speed = response.wind.speed;
        var humidity = response.main.humidity;
        var temp = cutDecimals(tempF, 0);



        localStorage.setItem("curr_name", name);
        localStorage.setItem("curr_dt", dt);
        localStorage.setItem("curr_icon", icon);
        localStorage.setItem("curr_speed", speed);
        localStorage.setItem("curr_humidity", humidity);
        localStorage.setItem("curr_temp", temp);

        var icon2 = '<img src="assets/img/icons/' + icon + '.png" />'
        $(".icon").empty();
        $(".city").html("<h3>" + name + "</h3>");
        $(".date").text(dt);
        $(".icon").prepend(icon2);
        $(".temp").text("Temperature: " + temp + '°' + "F");
        $(".humidity").text("Humidity: " + humidity + "%");
        $(".wind").text("Wind Speed: " + speed + " mph");
        

        console.log("Wind Speed: " + response.wind.speed);
        console.log("Humidity: " + response.main.humidity);
        console.log("Temperature (F): " + cutDecimals(tempF, 0));

        fnForecast2(response.coord.lat, response.coord.lon);
        getUvindex(response.coord.lat, response.coord.lon);

    }

    )
};


function getUvindex(vLat, vLon) {

    var APIKey = "e301853154037206540d2cdfc3543c87";


    var queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + vLat + "&lon=" + vLon + "&appid=" + APIKey;


    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {



        console.log(queryURL);


        console.log(response);

        $(".uv").text("UV Index: " + response.value);


        console.log("UV Index: " + response.value);


    })
}