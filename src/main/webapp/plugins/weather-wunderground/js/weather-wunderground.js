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
  
  console.log( 'WeatherWunderground constructed with id: ' + this.id + ' interval: ' + this.interval 
      + ' apiKey: ' + this.apiKey
      + ' query: ' + this.query);
  
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
  
  $.getJSON( 'http://api.wunderground.com/api/' + this.apiKey + '/conditions/q' + this.query + '?callback=?', $.proxy( this.receivedData, this ) );
}


/**
 * Callback method.
 */
WeatherWunderground.prototype.receivedData = function( data ) {

  console.log( 'receivedData called' );
  
  console.log('station_id: ' + data.current_observation.station_id);
  console.log('observation_time: ' + data.current_observation.observation_time);
  console.log('weather: ' + data.current_observation.weather);
  console.log('temp_c: ' + data.current_observation.temp_c);
  console.log('relative_humidity: ' + data.current_observation.relative_humidity);
  console.log('wind_dir: ' + data.current_observation.wind_dir);
  console.log('wind_kph: ' + data.current_observation.wind_kph);
  console.log('wind_gust_kph: ' + data.current_observation.wind_gust_kph);
  console.log('feelslike_c: ' + data.current_observation.feelslike_c);
  console.log('precip_today_metric: ' + data.current_observation.precip_today_metric);

  var html = '';
  var html = html + '<div id="station_id">' + data.current_observation.station_id + '</div>';
  var html = html + '<div id="observation_time">' + data.current_observation.observation_time + '</div>';
  var html = html + '<div id="weather">' + data.current_observation.weather + '</div>';
  var html = html + '<div id="temp_c">' + data.current_observation.temp_c + '</div>';
  var html = html + '<div id="relative_humidity">' + data.current_observation.relative_humidity + '</div>';
  var html = html + '<div id="wind_dir">' + data.current_observation.wind_dir + '</div>';
  var html = html + '<div id="wind_kph">' + data.current_observation.wind_kph + '</div>';
  var html = html + '<div id="wind_gust_kph">' + data.current_observation.wind_gust_kph + '</div>';
  var html = html + '<div id="feelslike_c">' + data.current_observation.feelslike_c + '</div>';
  var html = html + '<div id="precip_today_metric">' + data.current_observation.precip_today_metric + '</div>';
  
  var thisId = this.id;
  
  console.log('html: ' + html);
  
  $( "#" + thisId + " .WeatherWunderground" ).fadeOut(

      function() {
        $( "#" + thisId + " .WeatherWunderground" ).html( html );
        $( "#" + thisId + " .WeatherWunderground" ).fadeIn();
      } );
}
