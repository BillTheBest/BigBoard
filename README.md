README.md
=========

What is BigBoard?
-----------------

- BigBoard is a web dashboard.
- Runs in **Google Chrome** or other WebKit based browsers.
- Written in html/css/js with a Java backend.
- Run as an executable jar or war deployed to Apache Tomcat.
- For customization instructions, please see CUSTOMIZATION.md
- BigBoard is licensed under GPL 3.0, please see LICENSE.md
   

Features
--------

- Time and Date
- Wunderground weather
  - Current weather
  - Forecast
- Twitter feeds
  - Trending
  - Displaying single user multiple tweets
  - Displaying multiple users single tweets
- AppFigures Sales count
- SickBeard history


Installing - Executable jar
---------------------------

- Required:
  - Java 1.6 or greater

- Copy the executable jar to a folder where you want to run it from.
- Start BigBoard by running:
```
    java -jar BigBoard-X.X-war-exec.jar -httpPort 8080 -extractDirectory BigBoardExtract -DCUSTOM_HOME=\"/var/www/big-board-custom\"
```
  - NOTE: This is all one line
  - **X.X** is the version of BigBoard.
  - **8080** is the port for BigBoard to listen on.
  - **BigBoardExtract** is the directory that the jar is extracted to and run from.
  - **/var/www/big-board-custom** is the directory for custom content.


Installing - war
----------------

- Required:
  - Java 1.6 or greater
  - Apache Tomcat 7

- Edit startup.sh or startup.bat and add the following lines at the first blank line in the file:

```
# BEGIN ADDED
echo "Setting CUSTOM_HOME JAVA_OPTS values"
export JAVA_OPTS="$JAVA_OPTS -DCUSTOM_HOME=\"/var/www/big-board-custom\""
# END ADDED
```

  - **/var/www/big-board-custom** is the directory for custom content.
  
- Start Tomcat.
- Copy the war file to the `webapps` folder, BigBoard should be deployed automatically.



