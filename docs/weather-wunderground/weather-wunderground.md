weather-wunderground
====================

Configuration
-------------

- Must create Wunderground API account:

    http://www.wunderground.com/weather/api
    
- Account type determines frequency of updates.


Notes
-----

- Example webpage for Toronto ON:

    http://www.wunderground.com/global/stations/71265.html

- Understand airport city codes, Toronto Island Airport (Billy Bishop) CYTZ

- API:

    http://www.wunderground.com/weather/api/
    http://www.wunderground.com/weather/api/d/docs

- Requires id.

- JSON forcast:

    http://api.wunderground.com/api/XXXXXXXXXXXXXXXX/forecast/q/Canada/Toronto.json

- JSON conditions:

    http://api.wunderground.com/api/XXXXXXXXXXXXXXXX/conditions/q/Canada/Toronto.json

- JSON sun rise and sun set:

    http://api.wunderground.com/api/XXXXXXXXXXXXXXXX/astronomy/q/Canada/Toronto.json

- Configuation points:
  - API key
  - Location query: Country/City, Airport Code etc.
  
- Use sun rise, sun set to determine day and night weather icons.


High Level Requirements
-----------------------

- Current temperature
- Forecast
- Sun rise, sun set
- Allow multiple locations
- Evaluate direct call to Wunderground, no Big Board server side call
- Use weather icons
  
