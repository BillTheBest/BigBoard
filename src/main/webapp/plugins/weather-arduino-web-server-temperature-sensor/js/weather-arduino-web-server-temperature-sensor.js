/**
 * The WeatherArduinoWebServerTemperatureSensor object
 * 
 * @constructor
 * @param {string}
 *          id - Id of the div to target for html replacement.
 * @param {int}
 *          interval - How often to run update() to refresh the content.
 * @param {string}
 *          url - The url to call for sensor data.
 */
function WeatherArduinoWebServerTemperatureSensor( id, interval, url ) {

  // Properties
  this.id = id;
  this.interval = interval;
  this.url = url;
  
  console.log( 'WeatherArduinoWebServerTemperatureSensor constructed with id: ' + this.id + ' interval: ' + this.interval + ' url: ' + this.url );
  
  // Timer identifier
  this.intervalId = 0;
  
  // Path details
  this.applicationPath = "/BigBoard/"
  this.pluginPath = this.applicationPath + "plugins/weather-arduino-web-server-temperature-sensor";
  
  // Adding css for plugin to page.
  $( 'head' ).append(
      '<link rel="stylesheet" href="' + this.pluginPath
          + '/css/weather-arduino-web-server-temperature-sensor.css" type="text/css" />' );
}


/**
 * Start updates
 */
WeatherArduinoWebServerTemperatureSensor.prototype.startUpdates = function() {

  console.log( 'startUpdates called' );
  
  intervalId = setInterval( $.proxy( this.update, this ), this.interval );
}


/**
 * Stop updates
 */
WeatherArduinoWebServerTemperatureSensor.prototype.stopUpdates = function() {

  console.log( 'stopUpdates called' );
  
  clearInterval( intervalId );
}


/**
 * Request update method.
 */
WeatherArduinoWebServerTemperatureSensor.prototype.update = function() {

  console.log( 'update called' );
  
  $.getJSON( this.applicationPath + "service/WeatherArduinoWebServerTemperatureSensor.html", {
    id : this.id,
    url : this.url
  }, $.proxy( this.receivedData, this ) );
}


/**
 * Callback method.
 */
WeatherArduinoWebServerTemperatureSensor.prototype.receivedData = function( data ) {

  console.log( 'receivedData called' );
  
  var html = "<div class='temperature'>" + data.temperature + "</div>";
  
  $( "#" + data.id + " .WeatherArduinoWebServerTemperatureSensor" ).html( html );
}
