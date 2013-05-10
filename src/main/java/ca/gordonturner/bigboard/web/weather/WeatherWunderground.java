package ca.gordonturner.bigboard.web.weather;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.GregorianCalendar;
import java.util.HashMap;

import org.apache.log4j.Logger;
import org.jdom2.Document;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class WeatherWunderground
{

  Logger logger = Logger.getLogger( WeatherWunderground.class );

  private HashMap<String, Weather> weatherCollection;

  // http://api.wunderground.com/api/3c7ef32158d75ba9/conditions/q/Canada/Toronto.json
  // http://api.wunderground.com/api/3c7ef32158d75ba9/geolookup/conditions/forecast/q/Canada/Toronto.json

  private String wundergroundUrlPrefix = "http://api.wunderground.com/api/";

  private int refreshPeriodInMinutes = 15;

  /*
   * 
   */
  public void init()
  {
    weatherCollection = new HashMap<String, Weather>();
  }


  /*
   *  http://www.weatheroffice.gc.ca/rss/city/on-143_e.xml
   */
  @RequestMapping("/WeatherWunderground.html")
  @ResponseBody
  public HashMap<String, Object> handleWeatherWunderground( @RequestParam(value = "locationCode", required = true)
  String locationCode )
  {
    logger.debug( "Called with location: '" + locationCode + "'" );

    Weather weather = weatherCollection.get( locationCode );

    // Check to see if the screen name exists in the HashMap, create it if it doesn't.   
    if( weather == null )
    {
      weather = new Weather( locationCode );
      weatherCollection.put( locationCode, weather );
    }


    // Check the last Weather update wrt the refresh period.
    GregorianCalendar now = new GregorianCalendar();

    if( weather.getLastWeatherUpdate() == null )
    {
      logger.debug( "lastWeatherUpdate not set, setting to now and updating weather." );
      weather.setLastWeatherUpdate( now );
      updateWeather( weather );
    }
    else
    {
      GregorianCalendar lastWeatherUpdatePlusRefresh = (GregorianCalendar) weather.getLastWeatherUpdate().clone();
      lastWeatherUpdatePlusRefresh.add( GregorianCalendar.MINUTE, refreshPeriodInMinutes );

      if( now.after( lastWeatherUpdatePlusRefresh ) )
      {
        logger.debug( "Cache has expired, updating weather." );
        weather.setLastWeatherUpdate( now );
        updateWeather( weather );
      }
      else
      {
        logger.debug( "Cache is still valid." );
      }
    }

    Document document = weather.getWeatherDocument();
    String documentContent = document.getContent( 0 ).getValue();

    logger.debug( documentContent );


    HashMap<String, Object> json = new HashMap<String, Object>();
    json.put( "locationCode", locationCode );
    json.put( "temperature", "" );
    json.put( "condition", "" );
    json.put( "wind", "" );
    json.put( "description", "" );
    json.put( "date", "" );
    return json;
  }


  /**
   * @param weather
   */
  private void updateWeather( Weather weather )
  {
    logger.info( "Updating weather" );

    String url = wundergroundUrlPrefix + weather.getLocationCode();

    logger.debug( "Environment Canada URL: " + url );

    SAXBuilder saxBuilder = new SAXBuilder();
    try
    {
      weather.setWeatherDocument( saxBuilder.build( new URL( url ) ) );
    }
    catch( MalformedURLException e )
    {
      logger.error( "Problem with url ", e );
    }
    catch( JDOMException e )
    {
      logger.error( "Problem with XML ", e );
    }
    catch( IOException e )
    {
      logger.error( "Problem with io ", e );
    }

  }


}
