/**
 * The WeatherEnvironmentCanada object
 * 
 * @constructor
 * @param {string}
 *          id - Id of the div to target for html replacement.
 * @param {int}
 *          interval - How often to run update() to refresh the content.
 * @param {string}
 *          locationCode - Environment Canada location code.
 */
function WeatherEnvironmentCanada( id, interval, locationCode ) {

  // Properties
  this.id = id;
  this.interval = interval;
  this.locationCode = locationCode;
  
  console.log( 'WeatherEnvironmentCanada constructed with id: ' + this.id + ' interval: ' + this.interval
      + ' exampleParameter: ' + this.exampleParameter );
  
  // Timer identifier
  this.intervalId = 0;
  
  // Path details
  this.pathname = window.location.pathname;
  this.applicationPath = this.pathname.substring( 0, this.pathname.lastIndexOf( 'plugins' ) );
  this.pluginPath = this.applicationPath + "plugins/weather-environment-canada";
  
  // Adding css for plugin to page.
  $( 'head' ).append(
      '<link rel="stylesheet" href="' + this.pluginPath + '/css/weather-environment-canada.css" type="text/css" />' );
}


/**
 * Start updates
 */
WeatherEnvironmentCanada.prototype.startUpdates = function() {

  console.log( 'startUpdates called' );
  
  intervalId = setInterval( $.proxy( this.update, this ), this.interval );
}


/**
 * Stop updates
 */
WeatherEnvironmentCanada.prototype.stopUpdates = function() {

  console.log( 'stopUpdates called' );
  
  clearInterval( intervalId );
}


/**
 * Request update method.
 */
WeatherEnvironmentCanada.prototype.update = function() {

  console.log( 'update called' );
  
  $.getJSON( this.applicationPath + "./service/WeatherEnvironmentCanada.html", {
    locationCode : this.locationCode
  }, $.proxy( this.receivedData, this ) );
}


/**
 * Callback method.
 */
WeatherEnvironmentCanada.prototype.receivedData = function( data ) {

  console.log( 'receivedData called' );
  
  var descriptionClass = "";
  
  if( data.description != "No watches or warnings in effect" ) {
    
    descriptionClass = " alert";
  }
  
  var html = "<div class='icon'></div>" + "<div class='highlights'>" + "<div class='temperature'>" + data.temperature
      + "</div>" + "<div class='condition'>" + data.condition + "</div>" + "</div>" + "<div class='details'>"
      + "<div class='wind'>" + data.wind + "</div>" + "<div class='description" + descriptionClass + "'>"
      + data.description + "</div>" + "<div class='date'>" + data.date + "</div>" + "</div>";
  
  $( "#" + this.id + " .WeatherEnvironmentCanada" ).html( html );
  
  var weatherUrl = this.translateCondition( data.condition );
  
  $( "#" + this.id + " .WeatherEnvironmentCanada .icon" ).css( 'background-image',
      'url(' + weatherUrl + ')' );
}


/*
 * Utility methods
 */


  /**
   * Translates the condition to a weather icon background-image url.
   * 
   * @param {String}
   *          condition
   * 
   * @return {String} Image asset path
   */
WeatherEnvironmentCanada.prototype.translateCondition = function( condition ) {

  condition = condition.trim();
  
  console.log( "translateCondition called with condition: '" + condition + "'" );
  

  if( condition == "Heavy Snowshower" ) {
    return this.pluginPath + "/images/snow-heavy.svg";
  }
  

  if( condition == "Drifting Snow" || condition == "Light Snowshower" || condition == "Light Snow"
      || condition == "Snowshower" ) {
    
    if( this.isDayTime() ) {
      
      return this.pluginPath + "/images/snow-day.svg";
    }
    else {
      
      return this.pluginPath + "/images/snow-night.svg";
    }
  }
  

  if( condition == "Ice Pellets" || condition == "Hail" || condition == "Snow Grains" ) {
    
    if( this.isDayTime() ) {
      
      return this.pluginPath + "/images/hail-day.svg";
    }
    else {
      
      return this.pluginPath + "/images/hail-night.svg";
    }
  }
  

  if( condition == "Light Freezing Rain" || condition == "Light Freezing Drizzle" ) {
    
    if( this.isDayTime() ) {
      
      return this.pluginPath + "/images/rain-freezing-day.svg";
    }
    else {
      
      return this.pluginPath + "/images/rain-freezing-night.svg";
    }
  }
  

  if( condition == "Mainly Clear" || condition == "Clear" ) {
    
    if( this.isDayTime() ) {
      
      return this.pluginPath + "/images/sun.svg";
    }
    else {
      
      return this.pluginPath + "/images/moon.svg";
    }
  }
  

  if( condition == "Cloudy" ) {
    
    if( this.isDayTime() ) {
      
      return this.pluginPath + "/images/cloudy-day.svg";
    }
    else {
      
      return this.pluginPath + "/images/cloudy-night.svg";
    }
  }
  

  if( condition == "Partly Cloudy" ) {
    
    if( this.isDayTime() ) {
      
      return this.pluginPath + "/images/cloudy-day.svg";
    }
    else {
      
      return this.pluginPath + "/images/cloudy-night.svg";
    }
  }
  

  if( condition == "Mostly Cloudy" ) {
    
    if( this.isDayTime() ) {
      
      return this.pluginPath + "/images/cloudy-mostly-day.svg";
    }
    else {
      
      return this.pluginPath + "/images/cloudy-mostly-night.svg";
    }
  }
  

  if( condition == "Fog" ) {
    
    return this.pluginPath + "/images/fog.svg";
  }
  

  if( condition == "Rain" || condition == "Light Rain" || condition == "Light Rainshower"
      || condition == "Light Drizzle" || condition == "Thunderstorm with light rainshowers"
      || condition == "Thunderstorm with rainshowers" || condition == "Thunderstorm with heavy rainshowers"
      || condition == "Thunderstorm" ) {
    
    if( this.isDayTime() ) {
      
      return this.pluginPath + "/images/rainy-day.svg";
    }
    else {
      
      return this.pluginPath + "/images/rainy-night.svg";
    }
  }
  

  if( condition == "Mainly Sunny" || condition == "Sunny" ) {
    return this.pluginPath + "/images/sun.svg";
  }
  

  // cloud.svg
  // cloudy-mostly.svg
  // fog.svg
  // hail-heavy.svg
  // hail.svg
  // rain-freezing-heavy.svg
  // rain-freezing.svg
  // rain.svg
  // snow-icy-heavy.svg
  // snow-icy.svg
  // snow-rain-heavy.svg
  // snow-rain.svg
  // sun.svg
  // thunderstorm.svg
  
  return this.pluginPath + "/images/caution.svg";
}


/**
 * Returns formatd date string from date object.
 * 
 * @return {boolean} Is it day time?
 */
WeatherEnvironmentCanada.prototype.isDayTime = function() {

  var hour = ( new Date() ).getHours();
  
  // Somewhat arbitraily setting day.
  if( hour > 7 && hour < 19 ) {
    
    return true;
  }
  else {
    
    return false;
  }
}
