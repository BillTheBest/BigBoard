/**
 * The TwitterTrendingTopics object
 * 
 * @constructor
 * @param {string}
 *          id - Id of the div to target for html replacement.
 * @param {int}
 *          interval - How often to run update() to refresh the content.
 * @param {string}
 *          woeid - The Where on Earth IDentifier for the location. Please see:
 *          http://engineering.twitter.com/2010/02/woeids-in-twitters-trends.html
 */
function TwitterTrendingTopics( id, interval, woeid ) {

  // Properties
  this.id = id;
  this.interval = interval;
  this.woeid = woeid;
  
  console.log( 'TwitterTrendingTopics constructed with id: ' + this.id + ' interval: ' + this.interval + ' woeid: '
      + this.woeid );
  
  // Timer identifier
  this.intervalId = 0;
  
  // Path details
  this.applicationPath = "/BigBoard/"
  this.pluginPath = this.applicationPath + "plugins/twitter-trending-topics";
  
  // Adding css for plugin to page.
  $( 'head' ).append(
      '<link rel="stylesheet" href="' + this.pluginPath + '/css/twitter-trending-topics.css" type="text/css" />' );
}


/**
 * Start updates
 */
TwitterTrendingTopics.prototype.startUpdates = function() {

  console.log( 'startUpdates called' );
  
  intervalId = setInterval( $.proxy( this.update, this ), this.interval );
}


/**
 * Stop updates
 */
TwitterTrendingTopics.prototype.stopUpdates = function() {

  console.log( 'stopUpdates called' );
  
  clearInterval( intervalId );
}


/**
 * Request update method.
 */
TwitterTrendingTopics.prototype.update = function() {

  console.log( 'update called' );
  
  $.getJSON( this.applicationPath + "./service/TwitterTrendingTopics.html", {
    woeid : this.woeid
  }, $.proxy( this.receivedData, this ) );
}


/**
 * Callback method.
 */
TwitterTrendingTopics.prototype.receivedData = function( data ) {

  console.log( 'receivedData called' );
  
  $( "#" + this.id + " .TwitterTrendingTopics" ).animate( {
    opacity : 0.0
  }, 1500, $.proxy( function() {

    var html = "";
    for( var i = 0; i < 10; i++ ) {
      
      html += "<div class='TwitterTrendingTopicsTopic'>" + data.trends[i] + "</div>";
    }
    
    $( "#" + this.id + " .TwitterTrendingTopics" ).html( html );
    $( "#" + this.id + " .TwitterTrendingTopics" ).slideUp( 0 );
    $( "#" + this.id + " .TwitterTrendingTopics" ).css( "opacity", "1.0" );
    $( "#" + this.id + " .TwitterTrendingTopics" ).slideDown( 300 );
    
  }, this ) );
}
