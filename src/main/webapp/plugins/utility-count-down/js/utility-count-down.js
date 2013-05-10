/**
 * The UtilityCountDown object
 * 
 * @constructor
 * @param {string}
 *          inputId - Id of the div to target for html replacement.
 * @param {int}
 *          inputInterval - How often to run update() to refresh the content.
 * @param {string}
 *          inputKey - Key to lookup to find value object in the data.json map.
 */
function UtilityCountDown( id, interval, key ) {

  // Properties
  this.id = id;
  this.interval = interval;
  this.key = key;
  
  console
      .log( 'UtilityCountDown constructed with id: ' + this.id + ' interval: ' + this.interval + ' key: ' + this.key );
  
  // Timer identifier
  this.intervalId = 0;
  
  // Path details
  this.pathname = window.location.pathname;
  this.applicationPath = this.pathname.substring( 0, this.pathname.lastIndexOf( 'plugins' ) );
  this.pluginPath = this.applicationPath + "plugins/utility-count-down";
  
  // Adding css for plugin to page.
  $( 'head' ).append(
      '<link rel="stylesheet" href="' + this.pluginPath + '/css/utility-count-down.css" type="text/css" />' );
}

/**
 * Start updates
 */
UtilityCountDown.prototype.startUpdates = function() {

  console.log( 'startUpdates called' );
  
  intervalId = setInterval( $.proxy( this.update, this ), this.interval );
}


/**
 * Stop updates
 */
UtilityCountDown.prototype.stopUpdates = function() {

  console.log( 'stopUpdates called' );
  
  clearInterval( intervalId );
}


/**
 * Request update method.
 */
UtilityCountDown.prototype.update = function() {

  console.log( 'update called' );
  
  $.getJSON( this.pluginPath + "/js/data.json", $.proxy( this.receivedData, this ) );
}


/**
 * Callback method.
 */
UtilityCountDown.prototype.receivedData = function( data ) {

  console.log( 'receivedData called' );
  
  var label = data[this.key].label;
  var dateString = data[this.key].date;
  
  console.log( 'label: ' + label );
  console.log( 'dateString: ' + dateString );
  
  var days = UtilityCountDown.prototype.getDifferenceBetweenDatesInDays( new Date(), UtilityCountDown.prototype
      .parseDate( dateString ) )

  var html = "<div class='Label'>" + label + "<span class='Value'>" + days + "</span>" + "</div>";
  
  $( "#" + this.id + ".UtilityCountDownContainer .UtilityCountDown" ).html( html );
}


/**
 * Convert a date string of the format YYYY-MM-DD to a date object.
 * 
 * @param {String}
 *          date - Input date string.
 * 
 * @return {Date}
 */
UtilityCountDown.prototype.parseDate = function( dateString ) {

  var year = parseInt( dateString.substring( 0, 4 ) );
  var month = parseInt( dateString.substring( 5, 7 ) );
  var day = parseInt( dateString.substring( 8, 10 ) );
  
  // console.log( "year: '" + year + "'" );
  // console.log( "month: '" + month + "'" );
  // console.log( "day: '" + day + "'" );
  
  return new Date( year, month - 1, day );
}


/**
 * Difference in days between to Date objects.
 * 
 * @param {Date}
 *          date1
 * @param {Date}
 *          date2
 * 
 * @return {Number} difference in days
 */
UtilityCountDown.prototype.getDifferenceBetweenDatesInDays = function( date1, date2 ) {

  // console.log( "date1: '" + date1 + "'" );
  // console.log( "date2: '" + date2 + "'" );
  
  // Milliseconds per day constant.
  MS_PER_DAY = 1000 * 60 * 60 * 24;
  
  // Convert the Dates to UTC, eliminates time change and day light savings issues.
  utcDate1 = Date.UTC( date1.getFullYear(), date1.getMonth(), date1.getDate() );
  utcDate2 = Date.UTC( date2.getFullYear(), date2.getMonth(), date2.getDate() );
  
  return Math.floor( ( utcDate2 - utcDate1 ) / MS_PER_DAY );
}
