package ca.gordonturner.bigboard.web.twitter;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import twitter4j.Trend;
import twitter4j.Trends;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;
import twitter4j.conf.ConfigurationBuilder;

/**
 * @author gturner
 * 
 */
@Controller
public class TwitterTrendingTopics
{

  Logger logger = Logger.getLogger( TwitterTrendingTopics.class );


  private HashMap<String, Trends> trendsCollection;

  private HashMap<String, Calendar> lastUpdateCollections;

  private TwitterFactory twitterFactory;

  // The Twitter API will throttle you for more then 150 hits / hour.
  private int refreshPeriodInMinutes = 15;

  @Value("${twitter.oauth.consumerKey}")
  private String consumerKey;

  @Value("${twitter.oauth.consumerSecret}")
  private String consumerSecret;

  @Value("${twitter.oauth.accessToken}")
  private String accessToken;

  @Value("${twitter.oauth.accessTokenSecret}")
  private String accessTokenSecret;


  /*
   * 
   */
  public void init()
  {
    trendsCollection = new HashMap<String, Trends>();
    lastUpdateCollections = new HashMap<String, Calendar>();

    ConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
    configurationBuilder.setDebugEnabled( true );
    configurationBuilder.setOAuthConsumerKey( consumerKey );
    configurationBuilder.setOAuthConsumerSecret( consumerSecret );
    configurationBuilder.setOAuthAccessToken( accessToken );
    configurationBuilder.setOAuthAccessTokenSecret( accessTokenSecret );
    twitterFactory = new TwitterFactory( configurationBuilder.build() );
  }

  /*
   * This method handles printing out the current contents of the tweets collection in memory.
   */
  @RequestMapping("/TwitterTrendingTopicsContents.html")
  @ResponseBody
  public String handleTwitterTrendingTopicsContents()
  {
    StringBuffer returnString = new StringBuffer();

    int i;

    for( String key : trendsCollection.keySet() )
    {

      returnString.append( "</br></br>" + key + "</br>" );

      i = 0;

      for( Trend trend : trendsCollection.get( key ).getTrends() )
      {
        i++;
        returnString.append( i + " " + trend.getName() + "</br>" );
      }
    }

    return returnString.toString();
  }


  /*
   * https://api.twitter.com/1/trends/daily.json
   */
  @RequestMapping("/TwitterTrendingTopics.html")
  public @ResponseBody
  HashMap<String, String[]> handleTwitterTrendingTopics( @RequestParam(value = "woeid", required = true)
  String woeid )
  {
    logger.debug( "Called, with woeid: '" + woeid + "'" );

    if( !trendsCollection.containsKey( woeid ) )
    {
      logger.info( "No cached trending tweets." );
      updateTwitterTrendingTopics( woeid );
    }
    else
    {
      GregorianCalendar now = new GregorianCalendar();
      GregorianCalendar lastUpdatePlusRefresh = (GregorianCalendar) lastUpdateCollections.get( woeid ).clone();
      lastUpdatePlusRefresh.add( GregorianCalendar.MINUTE, refreshPeriodInMinutes );

      if( now.after( lastUpdatePlusRefresh ) )
      {
        logger.info( "Cache has expired, calling twitter api." );
        updateTwitterTrendingTopics( woeid );
      }
      else
      {
        logger.info( "Cache is still valid." );
      }
    }

    HashMap<String, String[]> json = new HashMap<String, String[]>();

    Trend[] trends = trendsCollection.get( woeid ).getTrends();
    String[] trendsName = new String[ trends.length ];

    int i = 0;
    for( Trend trend : trends )
    {
      logger.info( trend.getName() );
      trendsName[ i ] = trend.getName();
      i++;
    }

    json.put( "trends", trendsName );
    return json;
  }


  /**
   * @param screenName
   * @param numberOfTweets
   */
  private void updateTwitterTrendingTopics( String woeid )
  {
    logger.info( "Updating twitter trending topics, called with woeid: '" + woeid + "'" );

    Twitter twitter = twitterFactory.getInstance();

    try
    {
      trendsCollection.put( woeid, twitter.getPlaceTrends( Integer.parseInt( woeid ) ) );
    }
    catch( TwitterException e )
    {
      logger.error( "Error retrieving daily trendsList.", e );
    }

    lastUpdateCollections.put( woeid, new GregorianCalendar() );
  }

}
