/**
 * The SickbeardHistory object
 * 
 * @author gturner
 * 
 * @constructor
 * @param {string}
 *          id - Id of the div to target for html replacement.
 * @param {int}
 *          interval - How often to run update() to refresh the content.
 * @param {int}
 *          historyRefreshInterval - How often to request a refresh of the history content.
 * @param {int}
 *          historyCountMax - How far back in the history to request.
 * @param {string}
 *          urlPrefix
 */
function SickbeardHistory( id, interval, historyRefreshInterval, historyCount, urlPrefix ) {

  // Properties
  this.id = id;
  this.interval = interval;
  this.historyRefreshInterval = historyRefreshInterval;
  this.historyCountMax = historyCount;
  this.urlPrefix = urlPrefix;
  this.historyCountCurrent = 0;
  
  console.log( 'SickbeardHistory constructed with id: ' + this.id + ' interval: ' + this.interval
      + ' historyRefreshInterval: ' + this.historyRefreshInterval
      + ' historyCount: ' + this.historyCount);
  
  // Timer identifier
  this.intervalId = 0;
  
  // Path details
  this.applicationPath = "/BigBoard/"
  this.pluginPath = this.applicationPath + "plugins/sickbeard-history";
  
  // Adding css for plugin to page.
  $( 'head' ).append(
      '<link rel="stylesheet" href="' + this.pluginPath + '/css/sickbeard-history.css" type="text/css" />' );
}


/**
 * Start updates.
 */
SickbeardHistory.prototype.startUpdates = function() {

  console.log( 'startUpdates called' );
  
  intervalId = setInterval( $.proxy( this.update, this ), this.interval );
}


/**
 * Stop updates.
 */
SickbeardHistory.prototype.stopUpdates = function() {

  console.log( 'stopUpdates called' );
  
  clearInterval( intervalId );
}


/**
 * Request update method.
 */
SickbeardHistory.prototype.update = function() {

  console.log( 'update called' );
  
  $.getJSON( this.urlPrefix + '?cmd=history&limit=10&type=downloaded&callback=?', $.proxy( this.receivedData, this ) );
}


/**
 * Callback method.
 */
SickbeardHistory.prototype.receivedData = function( data ) {

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
  
  $( "#" + thisId + " .SickbeardHistory" ).fadeOut(

      function() {
        $( "#" + thisId + " .SickbeardHistory" ).html( html );
        $( "#" + thisId + " .SickbeardHistory" ).fadeIn();
      } );
  
//  $( "#" + this.id + " .TwitterSingleUserMultiTweet" ).animate(
//      {
//        opacity : 0.0
//      },
//      1500,
//      $.proxy(  function() {
//        
//        $( "#" + thisId + " .SickbeardHistory" ).html( html );
//        $( "#" + thisId + " .SickbeardHistory" ).slideUp( 0 );
//        $( "#" + thisId + " .SickbeardHistory" ).css( "opacity", "1.0" );
//        $( "#" + thisId + " .SickbeardHistory" ).slideDown( 300 );
//        
//      } ) );
}
