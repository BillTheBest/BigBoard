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
import twitter4j.ProfileImage;
import twitter4j.Status;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;

/**
 * @author gturner
 * 
 */
@Controller
public class TwitterMultiUserSingleTweet
{

  Logger logger = Logger.getLogger( TwitterMultiUserSingleTweet.class );

  private HashMap<String, Tweets> tweetsCollection;

  // The Twitter API will throttle you for more then 150 hits / hour.
  private int refreshPeriodInMinutes = 15;

  // Hard coding number of tweets to 25.
  private int numberOfTweets = 15;

  private String mode;


  /*
   * 
   */
  public void init()
  {
    tweetsCollection = new HashMap<String, Tweets>();
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
  @RequestMapping("/TwitterMultiUserSingleTweet.html")
  public @ResponseBody
  HashMap<String, String> handleTwitterMultiUserSingleTweet( @RequestParam(value = "screenName", required = true)
  String screenName, @RequestParam(value = "currentTweetIndex", required = false)
  String stringCurrentTweetIndex )
  {
    logger.debug( "Called with screenName: '" + screenName + "' index: '" + stringCurrentTweetIndex + "'" );

    if( "PROD".equals( mode ) )
    {
      return handleTwitterMultiUserSingleTweetProd( screenName, stringCurrentTweetIndex );
    }
    else
    {
      return handleTwitterMultiUserSingleTweetTest( screenName, stringCurrentTweetIndex );
    }
  }


  /**
   * @param screenName
   * @param stringCurrentTweetIndex
   * @return
   */
  private HashMap<String, String> handleTwitterMultiUserSingleTweetProd( String screenName, String stringCurrentTweetIndex )
  {
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
    json.put( "profileImageUrl", tweets.getProfileImage().getURL() );
    json.put( "tweet", tweets.getTwitterStatuses().get( index ).getText() );
    json.put( "currentTweetIndex", "" + nextIndex );
    return json;
  }


  /**
   * @param screenName
   * @param stringCurrentTweetIndex
   * @return
   */
  private HashMap<String, String> handleTwitterMultiUserSingleTweetTest( String screenName, String stringCurrentTweetIndex )
  {

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
    if( index == 5 - 1 )
    {
      nextIndex = 0;
    }
    else
    {
      nextIndex = index + 1;
    }


    String tweet = "";

    switch( index )
    {
      case 0:
        tweet = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
        break;
      case 1:
        tweet = "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
        break;
      case 2:
        tweet = "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
        break;
      case 3:
        tweet = "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
        break;
      case 4:
        tweet = "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae no.";
        break;

    }

    HashMap<String, String> json = new HashMap<String, String>();
    json.put( "screenName", screenName );
    json.put( "profileImageUrl", "./images/twitter-placeholder.jpeg" );
    json.put( "tweet", tweet );
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
    Twitter twitter = new TwitterFactory().getInstance();

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

    Twitter twitter = new TwitterFactory().getInstance();

    try
    {
      tweets.setProfileImage( twitter.getProfileImage( tweets.getScreenName(), ProfileImage.NORMAL ) );
    }
    catch( TwitterException te )
    {
      logger.error( "Problem with twitter profile image request", te );
    }

    logger.debug( "Updating twitter profile image to: " + tweets.getProfileImage().getURL() );

  }


  /**
   * @param mode the mode to set
   */
  @Value("${TwitterMultiUserSingleTweet.mode}")
  public void setMode( String mode )
  {
    this.mode = mode;
  }
}
