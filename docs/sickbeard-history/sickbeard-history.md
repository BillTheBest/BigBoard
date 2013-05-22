Sickbeard history
=================

Configuration
-------------

- Query SickBeard instance to get history.
- Must configure urlPrefix to set hostname, port, and API key.


Notes
-----

- Request:

    http://SickBeard:8081/api/XXXX/?cmd=history&limit=2&type=downloaded&callback=?

  - SickBeard is the hostname
  - 8081 is the port
  - XXXX is API key

- Response:

?({
    "data": [
        {
            "date": "2013-05-13 15:43", 
            "episode": 5, 
            "provider": "2HD.nzb", 
            "quality": "HD TV", 
            "resource": "anthony.bourdain.parts.unknown.s01e05.720p.hdtv.x264-2hd.mkv", 
            "resource_path": "/media/data/sabnzbd/downloads-complete/Anthony.Bourdain.Parts.Unknown.S01E05.720p.HDTV.x264-2HD.nzb", 
            "season": 1, 
            "show_name": "Anthony Bourdain: Parts Unknown", 
            "status": "Downloaded", 
            "tvdbid": 264108
        }, 
        {
            "date": "2013-05-12 20:37", 
            "episode": 20, 
            "provider": "DIMENSION", 
            "quality": "HD TV", 
            "resource": "The.Simpsons.S24E20.720p.HDTV.X264-DIMENSION.mkv", 
            "resource_path": "/media/data/sabnzbd/downloads-complete/The.Simpsons.S24E20.720p.HDTV.X264-DIMENSION", 
            "season": 24, 
            "show_name": "The Simpsons", 
            "status": "Downloaded", 
            "tvdbid": 71663
        }
    ], 
    "message": "", 
    "result": "success"
});

- Reference:

    http://sickbeard.com/api/#history
