Utility App Figures Sales
=========================

Configuration
-------------

- Query App Figures instance to get app sales.


Features
--------

- List downloads of apps tracked by App Figures.


Notes
-----

- Need to setup a JSONP proxy.

- Use jQuery.ajax instead of $.getJSON.

- Reference:

    * http://api.jquery.com/jQuery.ajax/

https://api.appfigures.com/v1.1/sales/products/?products=

btoa(unescape(encodeURIComponent(str)))

https://api.appfigures.com/v1.1/sales/products/?products=395690

  
  var hash = btoa(unescape(encodeURIComponent( this.username + ':' + this.password )));
  var authorizationHeaderValue = "Basic " + hash;
  
  jQuery.ajax( {
    url : "https://api.appfigures.com/v1.1/sales/products/?products=" + this.appFiguresId + "&format=jsonp",
    type: 'GET',
    dataType: 'json',
    headers: {"Authorization": authorizationHeaderValue },
    sucess : $.proxy( this.receivedData, this )
  } );