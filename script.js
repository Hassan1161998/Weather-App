$(document).ready(function() {
	String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};
  getLocation();

  function getLocation() {
    $.get("http://ipinfo.io", function(data) {
      console.log(data);
			$('#ip').append("Your IP :<br>"+data.ip);
      $('#location')
        .append(data.city + ",<br>")
        .append(data.region + ", ")
        .append(data.country);

      var units = getUnits(data.country);
      getWeather(data.loc, units);

      //return weather;

    }, "jsonp");

  }

  function getWeather(loc, units) {
    lat = loc.split(",")[0]
    lon = loc.split(",")[1]

    var weatherApiUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + "&units=" + units + '&appid=56139876131194dbfd0d4ea4abece1d4';

    console.log(weatherApiUrl);

    $.get(weatherApiUrl, function(weather) {
      var windDir = convertWindDirection(weather.wind.deg);
      var temperature = weather.main.temp;
      var unitLabel;

      //label based in imperial vs metric units
      if (units === "imperial") {
        unitLabel = "F";
      } else {
        unitLabel = "C";
      }

      temperature = parseFloat((temperature).toFixed(1));

      console.log(weather);
			var time = weather.weather[0].icon.split("").splice(2,1)[0];
      console.log(time);
      $('#icon')
        .append("<i class='owf owf-"+weather.cod+"-"+time[0]+" owf-5x'></i>");
			$('#but').append(unitLabel);
      $('#temptext').append(temperature + " " + unitLabel);
      $('#conditions').append(weather.weather[0].description.capitalize());
      $('#wind').append(windDir + " " + weather.wind.speed + " knots");
      $('#postal').append(postal);

    }, "jsonp");

  };

  function convertWindDirection(dir) {
    var rose = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    var eightPoint = Math.floor(dir / 45);
    return rose[eightPoint];
  }

  function getUnits(country) {
    var imperialCountries = ['US', 'BS', 'BZ', 'KY', 'PW'];

    if (imperialCountries.indexOf(country) === -1) {
      var units = 'metric';
    } else {
      units = 'imperial';
    }

    console.log(country, units);

    return units;
  }

});
$("#but").click(function() {
  var temps = $("#temptext").text();
  var string = temps.split("")
  var units = string.pop();
  var temp = string.splice(0, 4).join("");

  if (units === 'F') {
    units = 'C';
    temp = (temp - 32) / 1.8;
    temp = parseFloat((temp).toFixed(1));

    $('#temptext').text(temp + " " + units);
    $('#but').text(units);
  } else if (units === 'C') {
    units = 'F';
    temp = (temp * 1.8) + 32;
    temp = parseFloat((temp).toFixed(1));
    $('#temptext').text(temp + " " + units);
    $('#but').text(units);
  } else {
    alert("error in conversion")
  }
});
