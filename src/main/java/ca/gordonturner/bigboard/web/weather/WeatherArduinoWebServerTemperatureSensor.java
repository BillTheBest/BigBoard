package ca.gordonturner.bigboard.web.weather;

import java.util.HashMap;

import org.apache.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Node;
import org.dom4j.io.SAXReader;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 
 * @author gturner
 */
@Controller
public class WeatherArduinoWebServerTemperatureSensor
{

  Logger logger = Logger.getLogger( WeatherArduinoWebServerTemperatureSensor.class );

  /*
   * 
   */
  public void init()
  {
  }


  /*
   *  
   */
  @RequestMapping("/WeatherArduinoWebServerTemperatureSensor.html")
  @ResponseBody
  public HashMap<String, Object> handleWeatherArduinoWebServerTemperatureSensorGetRequest( @RequestParam(value = "id", required = true)
  String id, @RequestParam(value = "url", required = true)
  String url )
  {
    logger.debug( "Called with idName " + id );

    String temperatureString = "N/A";

    SAXReader reader = new SAXReader();
    try
    {
      Document document = reader.read( url );
      Node node = document.selectSingleNode( "//temperature/celcius" );

      float temperatureFloat = Float.parseFloat( node.getText() );
      temperatureString = String.format( "%.1f", temperatureFloat ) + "&deg;C";
    }
    catch( DocumentException e )
    {
      logger.error( "Major problem getting thermometer reading, not reachable." );
    }

    HashMap<String, Object> json = new HashMap<String, Object>();
    json.put( "id", id );
    json.put( "temperature", temperatureString );
    return json;
  }


}
