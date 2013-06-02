/**
 * The WeatherWunderground object
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
 *          apiKey - 16 character Wunderground API Key, eg '3c7ef32158d75bc9'.
 * @param {string}
 *          query - Wunderground API query string, eg '/Canada/Toronto.json'.
 */
function WeatherWunderground( id, interval, apiKey, query ) {

  // Properties
  this.id = id;
  this.interval = interval;
  this.apiKey = apiKey;
  this.query = query;
  
  console.log( 'WeatherWunderground constructed with id: ' + this.id + ' interval: ' + this.interval + ' apiKey: '
      + this.apiKey + ' query: ' + this.query );
  
  // Timer identifier
  this.intervalId = 0;
  
  // Path details
  this.applicationPath = "/BigBoard/"
  this.pluginPath = this.applicationPath + "plugins/weather-wunderground";
  
  // Adding css for plugin to page.
  $( 'head' ).append(
      '<link rel="stylesheet" href="' + this.pluginPath + '/css/weather-wunderground.css" type="text/css" />' );
}


/**
 * Start updates.
 */
WeatherWunderground.prototype.startUpdates = function() {

  console.log( 'startUpdates called' );
  
  intervalId = setInterval( $.proxy( this.update, this ), this.interval );
}


/**
 * Stop updates.
 */
WeatherWunderground.prototype.stopUpdates = function() {

  console.log( 'stopUpdates called' );
  
  clearInterval( intervalId );
}


/**
 * Request update method.
 */
WeatherWunderground.prototype.update = function() {

  console.log( 'update called' );
  
  $.getJSON( 'http://api.wunderground.com/api/' + this.apiKey + '/conditions/q' + this.query + '?callback=?', $.proxy(
      this.receivedData, this ) );
}


/**
 * Callback method.
 */
WeatherWunderground.prototype.receivedData = function( data ) {

  console.log( 'receivedData called' );
  
  // console.log( 'station_id: ' + data.current_observation.station_id );
  // console.log( 'observation_time: ' + data.current_observation.observation_time );
  // console.log( 'weather: ' + data.current_observation.weather );
  // console.log( 'temp_c: ' + data.current_observation.temp_c );
  // console.log( 'relative_humidity: ' + data.current_observation.relative_humidity );
  // console.log( 'wind_dir: ' + data.current_observation.wind_dir );
  // console.log( 'wind_kph: ' + data.current_observation.wind_kph );
  // console.log( 'wind_gust_kph: ' + data.current_observation.wind_gust_kph );
  // console.log( 'feelslike_c: ' + data.current_observation.feelslike_c );
  // console.log( 'precip_today_metric: ' + data.current_observation.precip_today_metric );
  
  var html = "<div class='conditionIcon'>" + 
    
    "<div class='icon'></div>" +
    "<div class='condition'>" + data.current_observation.weather + "</div>" +
    
  "</div>" + 
  
  "<div class='highlights'>" + 
    "<div class='temperature'>" + data.current_observation.temp_c.toFixed(1) + "&deg;C</div>" + 
    "<div class='city'>" + data.current_observation.display_location.city + "</div>" + 
  "</div>" +
      
      
      "<div class='details'>" + "<div class='wind'>" + data.current_observation.wind_dir + " "
      + data.current_observation.wind_kph + " km/h gust " + data.current_observation.wind_gust_kph + " km/h</div>"
      + "<div class='description'>" + data.current_observation.relative_humidity + " humidity</div>" + "<div class='date'>"
      + data.current_observation.observation_time + "</div>" + "</div>";

  var weatherUrl = this.translateCondition( data.current_observation.weather );
  
  var thisId = this.id;
  
  console.log( 'html: ' + html );
  
  $( "#" + thisId + " .WeatherWunderground" ).fadeOut(

  function() {

    $( "#" + thisId + " .WeatherWunderground" ).html( html );
    $( "#" + thisId + " .WeatherWunderground .icon" ).css( 'background-image', 'url(' + weatherUrl + ')' );
    $( "#" + thisId + " .WeatherWunderground" ).fadeIn();
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
WeatherWunderground.prototype.translateCondition = function( condition ) {

  condition = condition.trim();
  
  console.log( "translateCondition called with condition: '" + condition + "'" );
  

  if( condition == "Heavy Snowshower" ) {
    return this.pluginPath + "/images/snow-heavy.svg";
  }
  

  if( condition == "Drifting Snow" || condition == "Light Snowshower" || condition == "Light Snow"
      || condition == "Snowshower" ) {
    
    if( this.isDayTime() ) {
      
      return this.pluginPath + "/images/snow-day.svg";
    }
    else {
      
      return this.pluginPath + "/images/snow-night.svg";
    }
  }
  

  if( condition == "Hail" ) {
    
    if( this.isDayTime() ) {
      
      return this.pluginPath + "/images/hail-day.svg";
    }
    else {
      
      return this.pluginPath + "/images/hail-night.svg";
    }
  }
  

  if( condition == "Freezing Rain" ) {
    
    if( this.isDayTime() ) {
      
      return this.pluginPath + "/images/rain-freezing-day.svg";
    }
    else {
      
      return this.pluginPath + "/images/rain-freezing-night.svg";
    }
  }
  

  if( condition == "Mainly Clear" || condition == "Clear" ) {
    
    if( this.isDayTime() ) {
      
      return this.pluginPath + "/images/sun.svg";
    }
    else {
      
      return this.pluginPath + "/images/moon.svg";
    }
  }
  

  if( condition == "Cloudy" || condition == "Overcast") {
    
    if( this.isDayTime() ) {
      
      return this.pluginPath + "/images/cloudy-day.svg";
    }
    else {
      
      return this.pluginPath + "/images/cloudy-night.svg";
    }
  }
  

  if( condition == "Partly Cloudy" ||  condition == "Scattered Clouds") {
    
    if( this.isDayTime() ) {
      
      return this.pluginPath + "/images/cloudy-day.svg";
    }
    else {
      
      return this.pluginPath + "/images/cloudy-night.svg";
    }
  }
  

  if( condition == "Mostly Cloudy" ) {
    
    if( this.isDayTime() ) {
      
      return this.pluginPath + "/images/cloudy-mostly-day.svg";
    }
    else {
      
      return this.pluginPath + "/images/cloudy-mostly-night.svg";
    }
  }
  

  if( condition == "Fog" || condition == "Mist" ) {
    
    return this.pluginPath + "/images/fog.svg";
  }
  

  if( condition == "Rain" || condition == "Light Rain" ) {
    
    if( this.isDayTime() ) {
      
      return this.pluginPath + "/images/rainy-day.svg";
    }
    else {
      
      return this.pluginPath + "/images/rainy-night.svg";
    }
  }
  

  if( condition == "Mainly Sunny" || condition == "Sunny" ) {
    return this.pluginPath + "/images/sun.svg";
  }

  
  // Seen on Wunderground feed:
  // Overcast
  // Mist
  // Mostly Cloudy
  // Scattered Clouds
  // Light Rain

 

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


/**
 * Returns formatd date string from date object.
 * 
 * @return {boolean} Is it day time?
 */
WeatherWunderground.prototype.isDayTime = function() {

  var hour = ( new Date() ).getHours();
  
  // Somewhat arbitraily setting day.
  if( hour > 7 && hour < 19 ) {
    
    return true;
  }
  else {
    
    return false;
  }
}
