package ca.gordonturner.bigboard.web.twitter;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;

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

@Controller
public class TwitterSingleUserMultiTweet
{

  Logger logger = Logger.getLogger( TwitterSingleUserMultiTweet.class );

  private HashMap<String, Tweets> tweetsCollection;

  // The Twitter API will throttle you for more then 150 hits / hour.
  private int refreshPeriodInMinutes = 15;

  // Hard coding number of tweets to 10.
  private int numberOfTweets = 5;

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
  @RequestMapping("/TwitterSingleUserMultiTweetContents.html")
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
  @RequestMapping("/TwitterSingleUserMultiTweet.html")
  @ResponseBody
  public HashMap<String, Object> handleTwitterSingleUserMultiTweet(
      @RequestParam(value = "screenName", required = true)
      String screenName )
  {
    logger.debug( "Called with screenName: '" + screenName + "'" );

    if( "PROD".equals( mode ) )
    {
      return handleTwitterSingleUserMultiTweetProd( screenName );
    }
    else
    {
      return handleTwitterSingleUserMultiTweetTest( screenName );
    }
  }


  /*
   *
   */
  private HashMap<String, Object> handleTwitterSingleUserMultiTweetProd( String screenName )
  {
    Tweets tweets = tweetsCollection.get( screenName );

    // Check to see if the screen name exists in the HashMap, create it if it doesn't.   
    if( tweets == null )
    {
      tweets = new Tweets( screenName );
      tweetsCollection.put( screenName, tweets );
    }


    logger.debug( "Using refreshInMinutes: " + refreshPeriodInMinutes );


    // Check the last twitter update wrt the refresh period.
    GregorianCalendar now = new GregorianCalendar();

    if( tweets.getLastTwitterUpdate() == null )
    {
      logger.debug( "lastTwitterUpdate not set, setting to now and updating statuses and picture." );
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
        logger.debug( "Cache has expired, calling twitter api." );
        tweets.setLastTwitterUpdate( now );
        updateTwitterStatuses( tweets, numberOfTweets );
      }
      else
      {
        logger.debug( "Cache is still valid." );
      }
    }

    HashMap<String, Object> json = new HashMap<String, Object>();
    json.put( "screenName", screenName );
    json.put( "profileImageUrl", tweets.getProfileImage().getURL() );
    json.put( "tweet", tweets.getTwitterStatuses() );
    return json;
  }


  /*
   *
   */
  private HashMap<String, Object> handleTwitterSingleUserMultiTweetTest( String screenName )
  {

    List<Status> statuses = new ArrayList<Status>();
    statuses
        .add( new TwitterTestStatus(
            new Date(),
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." ) );
    statuses
        .add( new TwitterTestStatus( new Date(),
            "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." ) );
    statuses.add( new TwitterTestStatus( new Date(),
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." ) );
    statuses
        .add( new TwitterTestStatus( new Date(),
            "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." ) );

    Calendar oldDate = Calendar.getInstance();
    oldDate.add( Calendar.HOUR, -6 );

    statuses
        .add( new TwitterTestStatus(
            oldDate.getTime(),
            "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae no." ) );

    HashMap<String, Object> json = new HashMap<String, Object>();
    json.put( "screenName", screenName );
    json.put( "profileImageUrl", "./images/twitter-placeholder.jpeg" );
    json.put( "tweet", statuses );
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
  @Value("${TwitterSingleUserMultiTweet.mode}")
  public void setMode( String mode )
  {
    this.mode = mode;
  }
}
