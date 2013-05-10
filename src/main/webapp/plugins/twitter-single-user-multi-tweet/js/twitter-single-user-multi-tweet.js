/**
 * The TwitterSingleUserMultiTweet object
 * 
 * @constructor
 * @param {string}
 *          id - Id of the div to target for html replacement.
 * @param {int}
 *          interval - How often to run update() to refresh the content.
 * @param {string}
 *          screenName - Twitter screenName.
 */
function TwitterSingleUserMultiTweet( id, interval, screenName ) {

  // Properties
  this.id = id;
  this.interval = interval;
  this.screenName = screenName;
  
  console.log( 'TwitterSingleUserMultiTweet constructed with id: ' + this.id + ' interval: ' + this.interval
      + ' screenName: ' + this.screenName );
  
  // Timer identifier
  this.intervalId = 0;
  
  // Path details
  this.pathname = window.location.pathname;
  this.applicationPath = this.pathname.substring( 0, this.pathname.lastIndexOf( 'plugins' ) );
  this.pluginPath = this.applicationPath + "plugins/twitter-single-user-multi-tweet";
  
  // Adding css for plugin to page.
  $( 'head' ).append(
      '<link rel="stylesheet" href="' + this.pluginPath
          + '/css/twitter-single-user-multi-tweet.css" type="text/css" />' );
}


/**
 * Start updates
 */
TwitterSingleUserMultiTweet.prototype.startUpdates = function() {

  console.log( 'startUpdates called' );
  
  intervalId = setInterval( $.proxy( this.update, this ), this.interval );
}


/**
 * Stop updates
 */
TwitterSingleUserMultiTweet.prototype.stopUpdates = function() {

  console.log( 'stopUpdates called' );
  
  clearInterval( intervalId );
}


/**
 * Request update method.
 */
TwitterSingleUserMultiTweet.prototype.update = function() {

  console.log( 'update called' );
  
  $.getJSON( this.applicationPath + "./service/TwitterSingleUserMultiTweet.html", {
    screenName : this.screenName
  }, $.proxy( this.receivedData, this ) );
}


/**
 * Callback method.
 */
TwitterSingleUserMultiTweet.prototype.receivedData = function( data ) {

  console.log( 'receivedData called' );
  
  $( "#" + this.id + " .TwitterSingleUserMultiTweet" ).animate(
      {
        opacity : 0.0
      },
      1500,
      function() {

        var html = "<div class='TwitterSingleUserMultiTweetImage'>" + "<img src='" + data.profileImageUrl + "' />"
            + "</div>";
        
        for( var i = 0; i < 5; i++ ) {
          
          var createdAt = new Date( data.tweet[i].createdAt );
          var oldDate = new Date();
          oldDate.setHours( oldDate.getHours() - 2 );
          
          var TwitterSingleUserMultiTweetTweetClass = "";
          
          if( createdAt < oldDate ) {
            
            TwitterSingleUserMultiTweetTweetClass += " old";
          }
          
          html += "<div class='TwitterSingleUserMultiTweetTweet" + TwitterSingleUserMultiTweetTweetClass + "'>"
              + data.tweet[i].text + "<div class='TwitterSingleUserMultiTweetCreatedAt'>" + createdAt + "</div>"
              + "</div>";
        }
        
        $( "#" + data.screenName + " .TwitterSingleUserMultiTweet" ).html( html );
        $( "#" + data.screenName + " .TwitterSingleUserMultiTweet" ).slideUp( 0 );
        $( "#" + data.screenName + " .TwitterSingleUserMultiTweet" ).css( "opacity", "1.0" );
        $( "#" + data.screenName + " .TwitterSingleUserMultiTweet" ).slideDown( 300 );
        
      } );
}
