package ca.gordonturner.bigboard.web.twitter;

import java.util.GregorianCalendar;
import java.util.HashMap;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import twitter4j.Paging;
import twitter4j.Status;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;
import twitter4j.conf.ConfigurationBuilder;

/**
 * @author gturner
 * 
 */
@Controller
public class TwitterMultiUserSingleTweet
{

  Logger logger = Logger.getLogger( TwitterMultiUserSingleTweet.class );

  private HashMap<String, Tweets> tweetsCollection;

  private TwitterFactory twitterFactory;

  // The Twitter API will throttle you for more then 150 hits / hour.
  private int refreshPeriodInMinutes = 15;

  // Hard coding number of tweets to 25.
  private int numberOfTweets = 15;

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
    tweetsCollection = new HashMap<String, Tweets>();

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
  @RequestMapping("/TwitterMultiUserSingleTweetContents.html")
  @ResponseBody
  public String handleTwitterMultiUserSingleTweetContents()
  {
    StringBuffer returnString = new StringBuffer();

    int i;

    for( String key : tweetsCollection.keySet() )
    {

      returnString.append( "</br></br>" + key + "</br>" );

      i = 0;

      for( Status status : tweetsCollection.get( key ).getTwitterStatuses() )
      {
        i++;
        returnString.append( i + " " + status.getText() + "</br>" );
      }
    }

    return returnString.toString();
  }


  /*
   *
   */
  @RequestMapping("/TwitterMultiUserSingleTweet.json")
  public @ResponseBody
  HashMap<String, String> handleTwitterMultiUserSingleTweet( @RequestParam(value = "screenName", required = true)
  String screenName, @RequestParam(value = "currentTweetIndex", required = false)
  String stringCurrentTweetIndex )
  {
    logger.debug( "Called with screenName: '" + screenName + "' index: '" + stringCurrentTweetIndex + "'" );

    Tweets tweets = tweetsCollection.get( screenName );

    // Check to see if the screen name exists in the HashMap, create it if it doesn't.   
    if( tweets == null )
    {
      logger.info( "No cached tweeets for '" + screenName + "'." );

      tweets = new Tweets( screenName );
      tweetsCollection.put( screenName, tweets );
    }


    // Set id, 0 if blank or null
    int index;
    if( StringUtils.isBlank( stringCurrentTweetIndex ) )
    {
      index = 0;
    }
    else
    {
      try
      {
        index = Integer.parseInt( stringCurrentTweetIndex );
      }
      catch( NumberFormatException nfe )
      {
        index = 0;
      }
    }


    // Set nextId, if last one reset to 1.
    int nextIndex;
    if( index == numberOfTweets - 1 )
    {
      nextIndex = 0;
    }
    else
    {
      nextIndex = index + 1;
    }


    // Check the last twitter update wrt the refresh period.
    GregorianCalendar now = new GregorianCalendar();

    if( tweets.getLastTwitterUpdate() == null )
    {
      logger.info( "lastTwitterUpdate not set, setting to now and updating statuses and picture." );
      tweets.setLastTwitterUpdate( now );
      updateTwitterStatuses( tweets, numberOfTweets );
      updateTwitterPicture( tweets );
    }
    else
    {
      GregorianCalendar lastTwitterUpdatePlusRefresh = (GregorianCalendar) tweets.getLastTwitterUpdate().clone();
      lastTwitterUpdatePlusRefresh.add( GregorianCalendar.MINUTE, refreshPeriodInMinutes );

      if( now.after( lastTwitterUpdatePlusRefresh ) )
      {
        logger.info( "Cache has expired, calling twitter api." );
        tweets.setLastTwitterUpdate( now );
        updateTwitterStatuses( tweets, numberOfTweets );
      }
      else
      {
        logger.info( "Cache is still valid." );
      }
    }

    logger.debug( "tweet:  " + tweets.getTwitterStatuses().get( index ).getText() );
    logger.debug( "nextId: " + nextIndex );

    HashMap<String, String> json = new HashMap<String, String>();
    json.put( "screenName", screenName );
    json.put( "profileImageUrl", tweets.getProfileImageUrl() );
    json.put( "tweet", tweets.getTwitterStatuses().get( index ).getText() );
    json.put( "currentTweetIndex", "" + nextIndex );
    return json;
  }


  /**
   * @param screenName
   * @param numberOfTweets
   */
  private void updateTwitterStatuses( Tweets tweets, int numberOfTweets )
  {
    logger.info( "Updating twitter statuses" );

    Paging paging = new Paging( 1, numberOfTweets );

    Twitter twitter = twitterFactory.getInstance();
    
    try
    {
      tweets.setTwitterStatuses( twitter.getUserTimeline( tweets.getScreenName(), paging ) );
    }
    catch( TwitterException te )
    {
      logger.error( "Problem with twitter status request", te );
    }

  }


  /**
   * @param tweets
   */
  private void updateTwitterPicture( Tweets tweets )
  {
    logger.info( "Updating twitter profile image" );
        
    tweets.setProfileImageUrl( tweets.getTwitterStatuses().get( 0 ).getUser().getProfileImageURLHttps() );

    logger.debug( "Updating twitter profile image to: " + tweets.getProfileImageUrl() );

  }

}
