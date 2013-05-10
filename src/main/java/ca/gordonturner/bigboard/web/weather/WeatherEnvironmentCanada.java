package ca.gordonturner.bigboard.web.weather;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Scanner;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.jdom2.Document;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class WeatherEnvironmentCanada
{

  Logger logger = Logger.getLogger( WeatherEnvironmentCanada.class );

  private HashMap<String, Weather> weatherCollection;

  private String environmentCanadaUrlPrefix = "http://www.weatheroffice.gc.ca/rss/city/";

  private String environmentCanadaUrlSuffix = ".xml";

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
  @RequestMapping("/WeatherEnvironmentCanada.html")
  @ResponseBody
  public HashMap<String, Object> handleWeatherEnvironmentCanada( @RequestParam(value = "locationCode", required = true)
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

    // Temperature
    String temperature = "N/A";
    Scanner temperatureScanner = new Scanner( documentContent );
    while( temperatureScanner.hasNextLine() )
    {
      String line = temperatureScanner.nextLine();
      if( line.startsWith( "<b>Temperature:</b> " ) )
      {
        temperature = line.replace( "<b>Temperature:</b> ", "" ).replace( " <br/>", "" );
        break;
      }
    }


    // Condition
    String condition = "N/A";
    Scanner conditionScanner = new Scanner( documentContent );
    while( conditionScanner.hasNextLine() )
    {
      String line = conditionScanner.nextLine();
      if( line.startsWith( "<b>Condition:</b> " ) )
      {
        condition = line.replace( "<b>Condition:</b> ", "" ).replace( " <br/>", "" );
        break;
      }
    }


    // Wind
    String wind = "N/A";
    Scanner windScanner = new Scanner( documentContent );
    while( windScanner.hasNextLine() )
    {
      String line = windScanner.nextLine();
      if( line.startsWith( "<b>Wind:</b> " ) )
      {
        wind = line.replace( "<b>Wind:</b> ", "" ).replace( " <br/>", "" );
        break;
      }
    }


    // Description
    // Some hackery b/c the watches and warning are on line 11.
    String description = "N/A";
    int lineDescriptionCount = 0;
    Scanner descriptionScanner = new Scanner( documentContent );
    while( descriptionScanner.hasNextLine() )
    {
      String line = descriptionScanner.nextLine();

      if( lineDescriptionCount == 11 )
      {
        description = StringUtils.split( line, ',' )[ 0 ];
        break;
      }

      lineDescriptionCount++;
    }


    // Date
    String date = "N/A";
    Scanner dateScanner = new Scanner( documentContent );
    while( dateScanner.hasNextLine() )
    {
      String line = dateScanner.nextLine();

      if( line.startsWith( " <b>Observed at:</b>" ) )
      {
        date = extractDateString( line );
        break;
      }
    }
    date = "Updated " + parseDate( date );

    HashMap<String, Object> json = new HashMap<String, Object>();
    json.put( "locationCode", locationCode );
    json.put( "temperature", temperature.trim() );
    json.put( "condition", condition.trim() );
    json.put( "wind", wind.trim() );
    json.put( "description", description.trim() );
    json.put( "date", date.trim() );
    return json;
  }


  private String extractDateString( String line )
  {
    line = line.replace( " <b>Observed at:</b>", "" ).replace( " <br/>", "" );

    String[] words = StringUtils.split( line );

    // Grab the last 7 words, they will compose the date.
    int length = words.length;
    String date = StringUtils.join( words, " ", length - 7, length );
    
    logger.debug( "extracted date: " + date );
    
    return date;
  }

  /**
   * @param inputDate
   * @return
   */
  private String parseDate( String inputDate )
  {
    // 6:00 PM EST Wednesday 02 January 2013
    SimpleDateFormat inputFormat = new SimpleDateFormat( "h:mm a zzz EEEE dd MMMM yyyy" );

    // 6:00 PM EST Wednesday
    SimpleDateFormat outputFormat = new SimpleDateFormat( "EEE h:mm a" );

    String outputDate = "N/A";

    try
    {
      Date date = inputFormat.parse( inputDate );
      outputDate = outputFormat.format( date );
    }
    catch( ParseException e )
    {
      logger.error( "Problem parsing the date for Enviroment Canada.", e );
    }

    return outputDate;
  }


  /**
   * @param weather
   */
  private void updateWeather( Weather weather )
  {
    logger.info( "Updating weather" );

    String url = environmentCanadaUrlPrefix + weather.getLocationCode() + environmentCanadaUrlSuffix;

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
