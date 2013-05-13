/**
 * The UtilityAppFiguresSales object
 * 
 * @constructor
 * @param {string}
 *          id - Id of the div to target for html replacement.
 * @param {int}
 *          interval - How often to run update() to refresh the content.
 * @param {string}
 *          appName: Name of the app to be displayed.
 * @param {string}
 *          appFiguresId: Internal identifier used by appFigures.
 * @param {string}
 *          appFiguresAdjustment: If appFigures does not contain all the app history, the total sales will be incorrect.
 *          This value is added to the value returned from appFigures to adjust the sales value.
 */
function UtilityAppFiguresSales( id, interval, appName, appFiguresId, appFiguresAdjustment ) {

  // Properties
  this.id = id;
  this.interval = interval;
  this.appName = appName;
  this.appFiguresId = appFiguresId;
  this.appFiguresAdjustment = appFiguresAdjustment;
  
  console.log( 'UtilityAppFiguresSales constructed with id: ' + this.id + ' interval: ' + this.interval + ' appName: '
      + this.appName + ' appFiguresId: ' + this.appFiguresId + ' appFiguresAdjustment: ' + this.appFiguresAdjustment );
  
  // Timer identifier
  this.intervalId = 0;
  
  // Path details
  this.applicationPath = "/BigBoard/"
  this.pluginPath = this.applicationPath + "plugins/utility-app-figures-sales";
  
  // Adding css for plugin to page.
  $( 'head' ).append(
      '<link rel="stylesheet" href="' + this.pluginPath + '/css/utility-app-figures-sales.css" type="text/css" />' );
  
}


/**
 * Start updates
 */
UtilityAppFiguresSales.prototype.startUpdates = function() {

  console.log( 'startUpdates called' );
  
  intervalId = setInterval( $.proxy( this.update, this ), this.interval );
}


/**
 * Stop updates
 */
UtilityAppFiguresSales.prototype.stopUpdates = function() {

  console.log( 'stopUpdates called' );
  
  clearInterval( intervalId );
}


/**
 * Request update method.
 */
UtilityAppFiguresSales.prototype.update = function() {

  console.log( 'update called' );
  
  $.getJSON( this.applicationPath + "./service/UtilityAppFiguresSales.html", {
    id : this.id,
    appFiguresId : this.appFiguresId
  }, $.proxy( this.receivedData, this ) );
}


/**
 * Callback method.
 */
UtilityAppFiguresSales.prototype.receivedData = function( data ) {

  console.log( 'receivedData called' );
  

  var sales = parseInt( data.sales );
  var adjustedSales;
  
  if( !isNaN( sales ) ) {
    adjustedSales = this.appFiguresAdjustment + sales;
  }
  else {
    adjustedSales = "N/A";
  }
  
  var html = "<div class='UtilityAppFiguresSales'>" + "<div class='name'>" + this.appName + " Sales"
      + "<span class='details'>" + adjustedSales + "</span></div></div>";
    
  $( "#" + this.id + "" ).html( html );
}
