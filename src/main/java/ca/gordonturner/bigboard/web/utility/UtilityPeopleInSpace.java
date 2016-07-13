package ca.gordonturner.bigboard.web.utility;

import java.io.IOException;
import java.util.HashMap;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;

/**
 * @author gturner
 * 
 */
@Controller
public class UtilityPeopleInSpace
{

  public static final String targetUrl = "http://api.open-notify.org/astros/v1/";

  Logger logger = Logger.getLogger( UtilityPeopleInSpace.class );

  public void init()
  {}


  /*
  *
  */
  @RequestMapping("/UtilityPeopleInSpace.json")
  @ResponseBody
  public HashMap<String, Object> handleUtilityPeopleInSpace()
  {
    logger.debug( "Called" );

      String number = "N/A";

      // Make request
      DefaultHttpClient httpclient = new DefaultHttpClient();
      try
      {
        HttpGet httpget = new HttpGet( targetUrl );

        HttpResponse response = httpclient.execute( httpget );
        HttpEntity entity = response.getEntity();

        JsonFactory jsonFactory = new JsonFactory();
        JsonParser jsonParser = jsonFactory.createJsonParser( EntityUtils.toString( entity ) );

        while( jsonParser.nextToken() != JsonToken.END_OBJECT )
        {
          String fieldname = jsonParser.getCurrentName();

          if( "number".equals( fieldname ) )
          {
            logger.debug( "found number: " + jsonParser.getText() );
            number = jsonParser.getText();
            break;
          }

          jsonParser.nextToken();
        }

      }
      catch( ClientProtocolException e )
      {
        logger.error( "", e );
      }
      catch( JsonParseException e )
      {
        logger.error( "", e );
      }
      catch( IOException e )
      {
        logger.error( "", e );
      }
      finally
      {
        httpclient.getConnectionManager().shutdown();
        logger.error( "finally shutdown" );
      }


    logger.debug( "Returning number: '" + number + "'" );

    // Create response
    HashMap<String, Object> json = new HashMap<String, Object>();
    json.put( "number", number );
    return json;
  }

}
