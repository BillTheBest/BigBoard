/**
 * The UtilitySavings object
 * 
 * @constructor
 * @param {string}
 *          inputId - Id of the div to target for html replacement.
 * @param {int}
 *          inputInterval - How often to run update() to refresh the content.
 * @param {string}
 *          inputKey - Key to lookup to find value object in the data.json map.
 */
function UtilitySavings( id, interval, key ) {

  // Properties
  this.id = id;
  this.interval = interval;
  this.key = key;
  
  console
      .log( 'UtilitySavings constructed with id: ' + this.id + ' interval: ' + this.interval + ' key: ' + this.key );
  
  // Timer identifier
  this.intervalId = 0;
  
  // Path details
  this.applicationPath = "/BigBoard/"
  this.pluginPath = this.applicationPath + "plugins/utility-savings";
  
  // Adding css for plugin to page.
  $( 'head' ).append(
      '<link rel="stylesheet" href="' + this.pluginPath + '/css/utility-savings.css" type="text/css" />' );
}

/**
 * Start updates
 */
UtilitySavings.prototype.startUpdates = function() {

  console.log( 'startUpdates called' );
  
  intervalId = setInterval( $.proxy( this.update, this ), this.interval );
}


/**
 * Stop updates
 */
UtilitySavings.prototype.stopUpdates = function() {

  console.log( 'stopUpdates called' );
  
  clearInterval( intervalId );
}


/**
 * Request update method.
 */
UtilitySavings.prototype.update = function() {

  console.log( 'update called' );
  
  $.getJSON( this.pluginPath + "/js/data.json", $.proxy( this.receivedData, this ) );
}


/**
 * Callback method.
 */
UtilitySavings.prototype.receivedData = function( data ) {

  console.log( 'receivedData called' );
  
  var label = data[this.key].label;
  var savings = data[this.key].savings;
  
  console.log( 'label: ' + label );
  console.log( 'savings: ' + savings );

  var html = "<div class='Label'>" + label + "</div>" + "<div class='Value'>" + savings + "</div>";
  
  $( "#" + this.id + ".UtilitySavingsContainer .UtilitySavings" ).html( html );
}


