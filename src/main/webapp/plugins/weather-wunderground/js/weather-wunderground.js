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
 *          NOTE: This is limited by Wunderground account level.
 *                Please see: http://www.wunderground.com/weather/api/
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
  
  $.getJSON( this.urlPrefix + '?cmd=history&limit=10&type=downloaded&callback=?', $.proxy( this.receivedData, this ) );
}


/**
 * Callback method.
 */
WeatherWunderground.prototype.receivedData = function( data ) {

  console.log( 'receivedData called' );
  
  var html = data.data[ this.historyCountCurrent ].show_name;
  var thisId = this.id;
  
  console.log('html: ' + html);
  
  //
  if( this.historyCountCurrent == ( this.historyCountMax - 1) )
  {
    console.log('Resetting historyCountCurrent to 0');
    this.historyCountCurrent = 0;
  }
  else
  {
    this.historyCountCurrent = this.historyCountCurrent + 1;
    console.log('bumping historyCountCurrent to ' + this.historyCountCurrent );
  }
  
  $( "#" + thisId + " .WeatherWunderground" ).fadeOut(

      function() {
        $( "#" + thisId + " .WeatherWunderground" ).html( html );
        $( "#" + thisId + " .WeatherWunderground" ).fadeIn();
      } );
}
