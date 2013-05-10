package ca.gordonturner.bigboard.web.twitter;

import java.util.Date;

import twitter4j.Annotations;
import twitter4j.GeoLocation;
import twitter4j.HashtagEntity;
import twitter4j.MediaEntity;
import twitter4j.Place;
import twitter4j.RateLimitStatus;
import twitter4j.Status;
import twitter4j.URLEntity;
import twitter4j.User;
import twitter4j.UserMentionEntity;


/**
 * @author gturner
 * 
 */
@SuppressWarnings("deprecation")
public class TwitterTestStatus implements Status
{

  private static final long serialVersionUID = -7780501405045278958L;

  private String text;

  private Date createdAt;


  /**
   * @param text
   * @param createdAt
   */
  public TwitterTestStatus( Date createdAt, String text )
  {
    super();
    this.text = text;
    this.createdAt = createdAt;
  }


  /**
   * @param text
   */
  public void setText( String text )
  {
    this.text = text;
  }


  /* (non-Javadoc)
   * @see twitter4j.Status#getText()
   */
  public String getText()
  {
    return this.text;
  }


  /**
   * @param createdAt
   */
  public void setCreatedAt( Date createdAt )
  {
    this.createdAt = createdAt;
  }


  /* (non-Javadoc)
   * @see twitter4j.Status#getCreatedAt()
   */
  public Date getCreatedAt()
  {
    return this.createdAt;
  }


  /*
   * 
   * 
   * 
   */


  public int compareTo( Status arg0 )
  {
    // TODO Auto-generated method stub
    return 0;
  }

  public RateLimitStatus getRateLimitStatus()
  {
    // TODO Auto-generated method stub
    return null;
  }

  public int getAccessLevel()
  {
    // TODO Auto-generated method stub
    return 0;
  }

  public UserMentionEntity[] getUserMentionEntities()
  {
    // TODO Auto-generated method stub
    return null;
  }

  public URLEntity[] getURLEntities()
  {
    // TODO Auto-generated method stub
    return null;
  }

  public HashtagEntity[] getHashtagEntities()
  {
    // TODO Auto-generated method stub
    return null;
  }

  public MediaEntity[] getMediaEntities()
  {
    // TODO Auto-generated method stub
    return null;
  }

  public long getId()
  {
    // TODO Auto-generated method stub
    return 0;
  }

  public String getSource()
  {
    // TODO Auto-generated method stub
    return null;
  }

  public boolean isTruncated()
  {
    // TODO Auto-generated method stub
    return false;
  }

  public long getInReplyToStatusId()
  {
    // TODO Auto-generated method stub
    return 0;
  }

  public long getInReplyToUserId()
  {
    // TODO Auto-generated method stub
    return 0;
  }

  public String getInReplyToScreenName()
  {
    // TODO Auto-generated method stub
    return null;
  }

  public GeoLocation getGeoLocation()
  {
    // TODO Auto-generated method stub
    return null;
  }

  public Place getPlace()
  {
    // TODO Auto-generated method stub
    return null;
  }

  public boolean isFavorited()
  {
    // TODO Auto-generated method stub
    return false;
  }

  public User getUser()
  {
    // TODO Auto-generated method stub
    return null;
  }

  public boolean isRetweet()
  {
    // TODO Auto-generated method stub
    return false;
  }

  public Status getRetweetedStatus()
  {
    // TODO Auto-generated method stub
    return null;
  }

  public long[] getContributors()
  {
    // TODO Auto-generated method stub
    return null;
  }

  public long getRetweetCount()
  {
    // TODO Auto-generated method stub
    return 0;
  }

  public boolean isRetweetedByMe()
  {
    // TODO Auto-generated method stub
    return false;
  }

  public Annotations getAnnotations()
  {
    // TODO Auto-generated method stub
    return null;
  }

}
