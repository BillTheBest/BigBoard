/**
 * The ReferencePlugin object
 * 
 * @author gturner
 * 
 * @constructor
 * @param {string}
 *          id - Id of the div to target for html replacement.
 * @param {int}
 *          interval - How often to run update() to refresh the content.
 * @param {string}
 *          exampleParameter - Parameter that will be printed out later in a method.
 */
function ReferencePlugin( id, interval, exampleParameter ) {

  // Properties
  this.id = id;
  this.interval = interval;
  this.exampleParameter = exampleParameter;
  
  console.log( 'ReferencePlugin constructed with id: ' + this.id + ' interval: ' + this.interval
      + ' exampleParameter: ' + this.exampleParameter );
  
  // Timer identifier
  this.intervalId = 0;
  
  // Path details
  this.pathname = window.location.pathname;
  this.applicationPath = this.pathname.substring( 0, this.pathname.lastIndexOf( 'plugins' ) );
  this.pluginPath = this.applicationPath + "plugins/reference-plugin";
  
  // Adding css for plugin to page.
  $( 'head' ).append(
      '<link rel="stylesheet" href="' + this.pluginPath + '/css/reference-plugin.css" type="text/css" />' );
}


/**
 * Start updates.
 */
ReferencePlugin.prototype.startUpdates = function() {

  console.log( 'startUpdates called' );
  
  intervalId = setInterval( $.proxy( this.update, this ), this.interval );
}


/**
 * Stop updates.
 */
ReferencePlugin.prototype.stopUpdates = function() {

  console.log( 'stopUpdates called' );
  
  clearInterval( intervalId );
}


// /**
// * Request update method.
// */
// ReferencePlugin.prototype.update = function() {
//
// console.log( 'update called' );
//  
// var html = "<div class='Label'>Parameter:<span class='Value'>" + this.exampleParameter + "</span>" + "</div>";
//  
// console.log( 'this.id: ' + this.id );
//  
// $( "#" + this.id + ".ReferencePluginContainer .ReferencePlugin" ).html( html );
// }


/**
 * Request update method.
 */
ReferencePlugin.prototype.update = function() {

  console.log( 'update called' );
  
  $.getJSON( this.pluginPath + "/js/data.json", $.proxy( this.receivedData, this ) );
}


/**
 * Callback method.
 */
ReferencePlugin.prototype.receivedData = function( data ) {

  console.log( 'receivedData called' );
  
  var html = "<div class='Label'>" + data.instanceReferencePlugin.label + "<span class='Value'>"
      + data.instanceReferencePlugin.value + "</span>" + "</div>";
  
  $( "#" + this.id + ".ReferencePluginContainer .ReferencePlugin" ).html( html );
}
