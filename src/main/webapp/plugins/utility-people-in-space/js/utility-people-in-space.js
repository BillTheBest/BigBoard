/**
 * The UtilityPeopleInSpace object
 * 
 * @author gturner
 * 
 * @constructor
 * @param {string}
 *          id - Id of the div to target for html replacement.
 * @param {int}
 *          interval - How often to run update() to refresh the content.
 */
function UtilityPeopleInSpace( id, interval ) {

  // Properties
  this.id = id;
  this.interval = interval;
  
  console.log( 'UtilityPeopleInSpace constructed with id: ' + this.id + ' interval: ' + this.interval );
  
  // Timer identifier
  this.intervalId = 0;
  
  // Path details
  this.applicationPath = "/BigBoard/"
  this.pluginPath = this.applicationPath + "plugins/utility-people-in-space";
  
  // Adding css for plugin to page.
  $( 'head' ).append(
      '<link rel="stylesheet" href="' + this.pluginPath + '/css/utility-people-in-space.css" type="text/css" />' );
}


/**
 * Start updates.
 */
UtilityPeopleInSpace.prototype.startUpdates = function() {

  console.log( 'startUpdates called' );
  
  intervalId = setInterval( $.proxy( this.update, this ), this.interval );
}


/**
 * Stop updates.
 */
UtilityPeopleInSpace.prototype.stopUpdates = function() {

  console.log( 'stopUpdates called' );
  
  clearInterval( intervalId );
}


/**
 * Request update method.
 */
UtilityPeopleInSpace.prototype.update = function() {

  console.log( 'update called' );
  
  $.getJSON( this.applicationPath + "./service/UtilityPeopleInSpace.json", $.proxy( this.receivedData, this ) );
}


/**
 * Callback method.
 */
UtilityPeopleInSpace.prototype.receivedData = function( data ) {

  console.log( 'receivedData called' );
  
  console.log(data);
  
  var html = "<div class='Label'>People In Space: <span class='Value'>"
      + data.number + "</span>" + "</div>";
  
  $( "#" + this.id + ".UtilityPeopleInSpaceContainer .UtilityPeopleInSpace" ).html( html );
}
