package ca.gordonturner.bigboard.web.weather;

import java.util.Calendar;

import org.jdom2.Document;

public class Weather
{
  private String locationCode;

  private Calendar lastWeatherUpdate;

  private Document weatherDocument;


  public Weather( String location )
  {
    this.locationCode = location;
  }

  /**
   * @return the locationCode
   */
  public String getLocationCode()
  {
    return locationCode;
  }

  /**
   * @param locationCode the locationCode to set
   */
  public void setLocationCode( String locationCode )
  {
    this.locationCode = locationCode;
  }

  /**
   * @return the lastWeatherUpdate
   */
  public Calendar getLastWeatherUpdate()
  {
    return lastWeatherUpdate;
  }

  /**
   * @param lastWeatherUpdate the lastWeatherUpdate to set
   */
  public void setLastWeatherUpdate( Calendar lastWeatherUpdate )
  {
    this.lastWeatherUpdate = lastWeatherUpdate;
  }

  /**
   * @return the weather
   */
  public Document getWeatherDocument()
  {
    return weatherDocument;
  }

  /**
   * @param weather the weather to set
   */
  public void setWeatherDocument( Document weatherDocument )
  {
    this.weatherDocument = weatherDocument;
  }
}
