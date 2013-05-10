/**
 * The UtilityTimeDate object
 * 
 * @constructor
 * @param {string}
 *          id - Id of the div to target for html replacement.
 * @param {int}
 *          interval - How often to run update() to refresh the content.
 */
function UtilityTimeDate( id, interval ) {

  // Properties
  this.id = id;
  this.interval = interval;
  
  console.log( 'UtilityTimeDate constructed with id: ' + this.id + ' interval: ' + this.interval
      + ' exampleParameter: ' + this.exampleParameter );
  
  // Timer identifier
  this.intervalId = 0;
  
  // Path details
  this.pathname = window.location.pathname;
  this.applicationPath = this.pathname.substring( 0, this.pathname.lastIndexOf( 'plugins' ) );
  this.pluginPath = this.applicationPath + "plugins/utility-time-date";
  
  // Adding css for plugin to page.
  $( 'head' ).append(
      '<link rel="stylesheet" href="' + this.pluginPath + '/css/utility-time-date.css" type="text/css" />' );
  
}


/**
 * Start updates
 */
UtilityTimeDate.prototype.startUpdates = function() {

  console.log( 'startUpdates called' );
  
  intervalId = setInterval( $.proxy( this.update, this ), this.interval );
}


/**
 * Stop updates
 */
UtilityTimeDate.prototype.stopUpdates = function() {

  console.log( 'stopUpdates called' );
  
  clearInterval( intervalId );
}


/**
 * Request update method.
 */
UtilityTimeDate.prototype.update = function() {

  console.log( 'update called' );
  
  var date = new Date();
  
  var html = "<div class='Time'>" + this.getFormated12hrTimeString( date ) + "</div>" + "<div class='Date'>"
      + this.getFormatedDateString( date ) + "</div>";
  
  $( "#" + this.id + ".UtilityTimeDateContainer .UtilityTimeDate" ).html( html );
}


/*
 * Utility methods
 */


/**
 * Returns hours 24hr formated as string from date object.
 * 
 * @param {Date}
 *          Date
 * 
 * @return {String} Formatted string
 */
UtilityTimeDate.prototype.getFormated24hrTimeString = function( date ) {

  minutes = date.getMinutes();
  if( minutes < 10 ) {
    
    minutes = '0' + minutes
  }
  
  return date.getHours() + ':' + minutes;
}


/**
 * Returns hours 12hr formated as string from date object.
 * 
 * @param {Date}
 *          Date
 * 
 * @return {String} Formatted string
 */
UtilityTimeDate.prototype.getFormated12hrTimeString = function( date ) {

  minutes = date.getMinutes();
  if( minutes < 10 ) {
    
    minutes = '0' + minutes
  }
  
  if( date.getHours() > 12 ) {
    
    return ( date.getHours() - 12 ) + ':' + minutes + ' PM';
  }
  else if( date.getHours() == 0 ) {
    
    return '12:' + minutes + ' AM';
  }
  else {
    
    return date.getHours() + ':' + minutes + ' AM';
  }
  
}


/**
 * Returns formatd date string from date object.
 * 
 * @param {Date}
 *          Date
 * 
 * @return {String} Formatted string
 */
UtilityTimeDate.prototype.getFormatedDateString = function( date ) {

  var weekday = new Array( 7 );
  weekday[0] = "SUN";
  weekday[1] = "MON";
  weekday[2] = "TUE";
  weekday[3] = "WED";
  weekday[4] = "THU";
  weekday[5] = "FRI";
  weekday[6] = "SAT";
  
  var month = new Array( 12 );
  month[0] = "JAN";
  month[1] = "FEB";
  month[2] = "MAR";
  month[3] = "APR";
  month[4] = "MAY";
  month[5] = "JUN";
  month[6] = "JUL";
  month[7] = "AUG";
  month[8] = "SEP";
  month[9] = "OCT";
  month[10] = "NOV";
  month[11] = "DEC";
  
  return weekday[date.getDay()] + ', ' + month[date.getMonth()] + ' ' + date.getDate();
}
