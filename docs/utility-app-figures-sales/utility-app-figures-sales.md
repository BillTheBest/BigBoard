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

- The new oauth authentication is complex, an example is outlined below.

- NOTE: I suggest copying the following into a text editor and doing a search and replace of the keys with the real 
        values as you go.  At the end of the document you will have the properties to past into the override file.

- Login and get your Client key and Secret key.
- For purposes of this example, they are defined below:

Client key
XXXX-CLIENT-KEY-XXXX

Secret key
XXXX-SECRET-KEY-XXXX


Step 1 Request Authorization and oauth_verifier
-----------------------------------------------
- One time deal, get approval and confirm permissions.
- Request authorization token:
```
curl -XPOST 'https://api.appfigures.com/v2/oauth/request_token'\
        -H'Authorization: OAuth oauth_signature_method=PLAINTEXT,
                                oauth_consumer_key=XXXX-CLIENT-KEY-XXXX,
                                oauth_callback=oob,
                                oauth_signature=XXXX-SECRET-KEY-XXXX&' \
       -H'X-OAuth-Scope: account:read, private:read' \
       -H'Content-Length: 0'
```

- Response, authorization token and secret:
```
oauth_callback_confirmed=true&oauth_token=XXXX-FIRST-OAUTH-TOKEN-XXXX&oauth_token_secret=XXXX-FIRST-OAUTH-TOKEN-SECRET-XXXX
```

- NOTE: Callback oob is out-of-band.  User with be shown a page with the oauth_verifier that they’ll need
        to give to your application.

        Next step, with callback oob, will result in a page with an authorization code.


- Request permission (oauth_verifier), paste authorization token into browser:
```
https://api.appfigures.com/v2/oauth/authorize?oauth_token=XXXX-FIRST-OAUTH-TOKEN-XXXX
```

- In browser, approve authorization request, get `oauth_verifier` in replay:
```
XXXX-OAUTH-VERIFIER-XXXX
```


Request oauth_token and oauth_secret
------------------------------------
- Request:
```
curl -XGET 'https://api.appfigures.com/v2/oauth/access_token'\
  -H'Authorization: OAuth oauth_signature_method=PLAINTEXT,
                          oauth_verifier=XXXX-OAUTH-VERIFIER-XXXX,
                          oauth_consumer_key=XXXX-CLIENT-KEY-XXXX,
                          oauth_token=XXXX-FIRST-OAUTH-TOKEN-XXXX,
                          oauth_signature=XXXX-SECRET-KEY-XXXX&XXXX-FIRST-OAUTH-TOKEN-SECRET-XXXX'
```

- Response:
```
oauth_token=XXXX-FINAL-OAUTH-TOKEN-XXXX&oauth_token_secret=XXXX-FINAL-OAUTH-TOKEN-SECRET-XXXX
```

Test Final oauth token and secret
---------------------------------
- Request all products:
```
curl -XGET 'https://api.appfigures.com/v2/reports/sales?group_by=product' \
  -H'Authorization: OAuth oauth_signature_method=PLAINTEXT,
                          oauth_consumer_key=XXXX-CLIENT-KEY-XXXX,
                          oauth_token=XXXX-FINAL-OAUTH-TOKEN-XXXX,
                          oauth_signature=XXXX-SECRET-KEY-XXXX&XXXX-FINAL-OAUTH-TOKEN-SECRET-XXXX'
```


- Your property file should include:
```
UtilityAppFiguresSales.clientKey=XXXX-CLIENT-KEY-XXXX
UtilityAppFiguresSales.secretKey=XXXX-SECRET-KEY-XXXX
UtilityAppFiguresSales.oauthToken=XXXX-FINAL-OAUTH-TOKEN-XXXX
UtilityAppFiguresSales.oauthTokenSecret=XXXX-FINAL-OAUTH-TOKEN-SECRET-XXXX
```