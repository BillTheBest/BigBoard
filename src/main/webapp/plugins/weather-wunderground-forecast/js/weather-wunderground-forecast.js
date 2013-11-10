/**
 * The weatherWundergroundForecast object
 * 
 * @author gturner
 * 
 * @constructor
 * @param {string}
 *          id - Id of the div to target for html replacement.
 * @param {int}
 *          interval - How often to run update() to refresh the content
 * 
 * NOTE: This is limited by Wunderground account level. Please see: http://www.wunderground.com/weather/api/
 * 
 * @param {string}
 *          apiKey - 16 character Wunderground API Key, eg '3c7ef32158d75bc8'.
 * @param {string}
 *          query - Wunderground API query string, eg '/Canada/Toronto.json'.
 */
function weatherWundergroundForecast( id, interval, apiKey, query ) {

  // Properties
  this.id = id;
  this.interval = interval;
  this.apiKey = apiKey;
  this.query = query;
  
  console.log( 'weatherWundergroundForecast constructed with id: ' + this.id + ' interval: ' + this.interval + ' apiKey: '
      + this.apiKey + ' query: ' + this.query );
  
  // Timer identifier
  this.intervalId = 0;
  
  // Path details
  this.applicationPath = "/BigBoard/"
  this.pluginPath = this.applicationPath + "plugins/weather-wunderground-forecast";
  
  // Adding css for plugin to page.
  $( 'head' ).append(
      '<link rel="stylesheet" href="' + this.pluginPath + '/css/weather-wunderground-forecast.css" type="text/css" />' );
}


/**
 * Start updates.
 */
weatherWundergroundForecast.prototype.startUpdates = function() {

  console.log( 'startUpdates called' );
  
  intervalId = setInterval( $.proxy( this.update, this ), this.interval );
}


/**
 * Stop updates.
 */
weatherWundergroundForecast.prototype.stopUpdates = function() {

  console.log( 'stopUpdates called' );
  
  clearInterval( intervalId );
}


/**
 * Request update method.
 */
weatherWundergroundForecast.prototype.update = function() {

  console.log( 'update called' );
  
  $.getJSON( 'http://api.wunderground.com/api/' + this.apiKey + '/forecast/q' + this.query + '?callback=?', $.proxy(
      this.receivedData, this ) );
}


/**
 * Callback method.
 */
weatherWundergroundForecast.prototype.receivedData = function( data ) {

  console.log( 'receivedData called' );
  
 
//  console.log( 'observation_time: ' + data.current_observation.observation_time );
//  console.log( 'weather: ' + data.current_observation.weather );
//  console.log( 'temp_c: ' + data.current_observation.temp_c );

  var forecastday = data.forecast.simpleforecast.forecastday
  
  var html = "";
    
  for( var i = 0; i < forecastday.length; i++ ) {

    var weatherUrl = this.translateCondition( forecastday[i].conditions ); 
    
    html += "<div class='day'>" +
    "  <div class='weekday'>" + forecastday[i].date.weekday + "</div>" +
    "  <div class='icon' style='background-image:url(" + weatherUrl + ")';></div>" +
    "  <div class='highlow'>" +  forecastday[i].low.celsius + "&deg;C - " +  forecastday[i].high.celsius + "&deg;C</div> " +
    "  <div class='condition'>" + forecastday[i].conditions + "</div>" +
    "</div>"

  }

  var thisId = this.id;
  
  //console.log( 'html: ' + html );
  
  $( "#" + thisId + " .weatherWundergroundForecast" ).fadeOut(

  function() {

    $( "#" + thisId + " .weatherWundergroundForecast" ).html( html );
    $( "#" + thisId + " .weatherWundergroundForecast" ).fadeIn();
  } );
}


/*
 * Utility methods
 */


/**
 * Translates the condition to a weather icon background-image url.
 * 
 * @param {String}
 *          condition
 * 
 * @return {String} Image asset path
 */
weatherWundergroundForecast.prototype.translateCondition = function( condition ) {

  condition = condition.trim();
  
  console.log( "translateCondition called with condition: '" + condition + "'" );
  

  if( condition == "Heavy Snowshower" ) {
    return this.pluginPath + "/images/snow-heavy.svg";
  }
  

  if( condition == "Drifting Snow" || condition == "Light Snowshower" || condition == "Light Snow"
      || condition == "Snowshower" || condition == "Chance of Snow" ) {
    
    return this.pluginPath + "/images/snow-day.svg";
  }
  

  if( condition == "Hail" ) {
    
    return this.pluginPath + "/images/hail-day.svg";
  }
  

  if( condition == "Freezing Rain" ) {
    
    return this.pluginPath + "/images/rain-freezing-day.svg";
  }
  

  if( condition == "Mainly Clear" || condition == "Clear" ) {
    
    return this.pluginPath + "/images/sun.svg";
  }
  

  if( condition == "Cloudy" || condition == "Overcast" || condition == "Haze" ) {
    
    return this.pluginPath + "/images/cloudy-day.svg";
  }
  

  if( condition == "Partly Cloudy" ||  condition == "Scattered Clouds") {
    
    return this.pluginPath + "/images/cloudy-day.svg";
  }
  

  if( condition == "Mostly Cloudy" ) {
    
    return this.pluginPath + "/images/cloudy-mostly-day.svg";
  }
  

  if( condition == "Fog" || condition == "Mist" ) {
    
    return this.pluginPath + "/images/fog.svg";
  }
  

  if( condition == "Rain" || condition == "Light Rain" || condition == "Chance of Rain") {

    return this.pluginPath + "/images/rainy-day.svg";
  }
  

  if( condition == "Mainly Sunny" || condition == "Sunny" ) {
    return this.pluginPath + "/images/sun.svg";
  }
  

  if( condition == "Thunderstorms and Rain" || condition == "Thunderstorm" || condition == "Chance of a Thunderstorm") {
    return this.pluginPath + "/images/thunderstorm.svg";
  }

  
  // Seen on Wunderground feed:
  // Overcast
  // Mist
  // Mostly Cloudy
  // Scattered Clouds
  // Light Rain
  // Haze
  // Thunderstorms and Rain
  // Chance of Snow

  // Chance of Rain
  // Chance of a Thunderstorm

  // cloud.svg
  // cloudy-mostly.svg
  // fog.svg
  // hail-heavy.svg
  // hail.svg
  // rain-freezing-heavy.svg
  // rain-freezing.svg
  // rain.svg
  // snow-icy-heavy.svg
  // snow-icy.svg
  // snow-rain-heavy.svg
  // snow-rain.svg
  // sun.svg
  // thunderstorm.svg
  
  return this.pluginPath + "/images/caution.svg";
}
