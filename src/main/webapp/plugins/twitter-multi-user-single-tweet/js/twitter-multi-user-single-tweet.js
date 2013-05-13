/**
 * The TwitterMultiUserSingleTweet object
 * 
 * @constructor
 * @param {int}
 *          interval - How often to run update() to refresh the content.
 * @param {string}
 *          exampleParameter - Parameter that will be printed out later in a method.
 */
function TwitterMultiUserSingleTweet( model, interval ) {

  // Properties
  this.interval = interval;
  this.model = model;
  
  console.log( 'TwitterMultiUserSingleTweet constructed with interval: ' + this.interval + ' and screen names: ' );
  for( var i = 0; i < this.model.screenNames.length; i++ ) {
    
    console.log( this.model.screenNames[i].screenName );
  }
  
  // Timer identifier
  this.intervalId = 0;
  
  // Path details
  this.applicationPath = "/BigBoard/"
  this.pluginPath = this.applicationPath + "plugins/twitter-multi-user-single-tweet";
  
  // Adding css for plugin to page.
  $( 'head' ).append(
      '<link rel="stylesheet" href="' + this.pluginPath
          + '/css/twitter-multi-user-single-tweet.css" type="text/css" />' );
}


/**
 * Start updates
 */
TwitterMultiUserSingleTweet.prototype.startUpdates = function() {

  console.log( 'startUpdates called' );
  
  intervalId = setInterval( $.proxy( this.update, this ), this.interval );
}


/**
 * Stop updates
 */
TwitterMultiUserSingleTweet.prototype.stopUpdates = function() {

  console.log( 'stopUpdates called' );
  
  clearInterval( intervalId );
}


/**
 * Request update method.
 */
TwitterMultiUserSingleTweet.prototype.update = function() {

  console.log( 'update called' );
  
  currentScreenNamesIndex = this.model.currentScreenNamesIndex;
  screenName = this.model.screenNames[currentScreenNamesIndex].screenName;
  currentTweetIndex = this.model.screenNames[currentScreenNamesIndex].currentTweetIndex;
  // console.log( 'Requesting screenName: ' + screenName + ' currentTweetIndex: ' + currentTweetIndex );
  
  $.getJSON( this.applicationPath + "./service/TwitterMultiUserSingleTweet.html", {
    screenName : screenName,
    currentTweetIndex : currentTweetIndex
  }, $.proxy( this.receivedData, this ) );
}


/**
 * Callback method.
 */
TwitterMultiUserSingleTweet.prototype.receivedData = function( data ) {

  console.log( 'receivedData called' );
  
  // Update model to reflect changes.
  var currentScreenNamesIndex = this.model.currentScreenNamesIndex;
  

  // Update model.screenNames[].currentTweetIndex to value from service.
  this.model.screenNames[currentScreenNamesIndex].currentTweetIndex = data.currentTweetIndex;
  

  // Update model.currentScreenNamesIndex, make sure to roll over to 0 on last screen name.
  proposedNextScreenNameIndex = this.model.currentScreenNamesIndex + 1;
  
  if( proposedNextScreenNameIndex >= this.model.screenNames.length ) {
    
    this.model.currentScreenNamesIndex = 0;
  }
  else {
    
    this.model.currentScreenNamesIndex = proposedNextScreenNameIndex;
  }
  

  $( "#" + data.screenName + " .TwitterMultiUserSingleTweet" ).animate(
      {
        opacity : 0.0
      },
      1500,
      function() {

        var html = "<div class='TwitterMultiUserSingleTweetImage'>" + "<img src='" + data.profileImageUrl + "' />"
            + "</div>" + "<div class='TwitterMultiUserSingleTweetTweet'>" + data.tweet + "</div>";
        
        $( "#" + data.screenName + " .TwitterMultiUserSingleTweet" ).html( html );
        $( "#" + data.screenName + " .TwitterMultiUserSingleTweet" ).slideUp( 0 );
        $( "#" + data.screenName + " .TwitterMultiUserSingleTweet" ).css( "opacity", "1.0" );
        $( "#" + data.screenName + " .TwitterMultiUserSingleTweet" ).slideDown( 300 );
        
      } );
  
}
