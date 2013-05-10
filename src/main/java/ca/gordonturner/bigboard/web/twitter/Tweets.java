package ca.gordonturner.bigboard.web.twitter;

import java.util.Calendar;
import java.util.List;

import twitter4j.ProfileImage;
import twitter4j.Status;

/**
 * This class represents a group of tweets for a twitter user.
 * 
 * @author gturner
 *
 */
public class Tweets
{
  private String screenName;

  private Calendar lastTwitterUpdate;

  private List<Status> twitterStatuses;

  private ProfileImage profileImage;

  
  /**
   * @param screenName
   */
  public Tweets( String screenName )
  {
    this.screenName = screenName;
  }

  /**
   * @return the screenName
   */
  public String getScreenName()
  {
    return screenName;
  }

  /**
   * @param screenName the screenName to set
   */
  public void setScreenName( String screenName )
  {
    this.screenName = screenName;
  }

  /**
   * @return the lastTwitterUpdate
   */
  public Calendar getLastTwitterUpdate()
  {
    return lastTwitterUpdate;
  }

  /**
   * @param lastTwitterUpdate the lastTwitterUpdate to set
   */
  public void setLastTwitterUpdate( Calendar lastTwitterUpdate )
  {
    this.lastTwitterUpdate = lastTwitterUpdate;
  }

  /**
   * @return the twitterStatuses
   */
  public List<Status> getTwitterStatuses()
  {
    return twitterStatuses;
  }

  /**
   * @param twitterStatuses the twitterStatuses to set
   */
  public void setTwitterStatuses( List<Status> twitterStatuses )
  {
    this.twitterStatuses = twitterStatuses;
  }

  /**
   * @return the profileImage
   */
  public ProfileImage getProfileImage()
  {
    return profileImage;
  }

  /**
   * @param profileImage the profileImage to set
   */
  public void setProfileImage( ProfileImage profileImage )
  {
    this.profileImage = profileImage;
  }

}
