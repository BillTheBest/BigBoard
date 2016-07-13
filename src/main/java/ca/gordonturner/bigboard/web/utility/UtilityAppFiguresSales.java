package ca.gordonturner.bigboard.web.utility;

import java.io.IOException;
import java.util.HashMap;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
public class UtilityAppFiguresSales
{

  public static final String appFiguresEndPointUrl = "https://api.appfigures.com/v2/reports/sales?products=";

  public static final String appFiguresHost = "api.appfigures.com";

  @Value("${UtilityAppFiguresSales.clientKey}")
  private String clientKey;

  @Value("${UtilityAppFiguresSales.secretKey}")
  private String secretKey;

  @Value("${UtilityAppFiguresSales.oauthToken}")
  private String oauthToken;

  @Value("${UtilityAppFiguresSales.oauthTokenSecret}")
  private String oauthTokenSecret;


  Logger logger = Logger.getLogger( UtilityAppFiguresSales.class );

  public void init()
  {
  }


  /*
  *
  */
  @RequestMapping("/UtilityAppFiguresSales.json")
  @ResponseBody
  public HashMap<String, Object> handleUtilityAppFiguresSales( @RequestParam(value = "id", required = true) String id,
      @RequestParam(value = "appFiguresId", required = true) String appFiguresId )
  {
    logger.debug( "Called with id: '" + id + "' appFiguresId: '" + appFiguresId + "'" );

    String sales = "N/A";


    if( !StringUtils.isEmpty( clientKey ) || !StringUtils.isEmpty( secretKey ) || !StringUtils.isEmpty( oauthToken )
        || !StringUtils.isEmpty( oauthTokenSecret ) )
    {
      logger.debug( "Appears to be configured correctly, calling end point" );

      // Make request
      DefaultHttpClient httpclient = new DefaultHttpClient();
      try
      {
        HttpGet httpget = new HttpGet( appFiguresEndPointUrl + appFiguresId );

        String headerValue = "OAuth oauth_signature_method=PLAINTEXT, oauth_consumer_key=" + clientKey
            + ", oauth_token=" + oauthToken + ", oauth_signature=" + secretKey + "&" + oauthTokenSecret;

        httpget.setHeader( "Authorization", headerValue );

        HttpResponse response = httpclient.execute( httpget );
        HttpEntity entity = response.getEntity();

        JsonFactory jsonFactory = new JsonFactory();
        JsonParser jsonParser = jsonFactory.createJsonParser( EntityUtils.toString( entity ) );

        while( jsonParser.nextToken() != JsonToken.END_OBJECT )
        {
          String fieldname = jsonParser.getCurrentName();

          if( "downloads".equals( fieldname ) )
          {
            logger.debug( "found downloads: " + jsonParser.getText() );
            sales = jsonParser.getText();
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
    }
    else
    {
      logger.debug( "Required configuration properies are empty, please fix, calling NOT end point." );
    }


    logger.debug( "Returning sales: '" + sales + "'" );

    // Create response
    HashMap<String, Object> json = new HashMap<String, Object>();
    json.put( "id", id );
    json.put( "sales", sales );
    return json;
  }
}
