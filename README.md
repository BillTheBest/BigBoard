readme.txt
==========

- BigBoard is composed of a html/css/js front end with a Java backend.
- BigBoard can either be run as an executable jar or installed in a java Application Server, like Apache Tomcat.


Features
--------

- Time and Date
- Weather
- Twitter feeds
- AppFigures Sales count


Installing - Executable jar
---------------------------

- Required:
  - Java 1.6 or greater

- Copy the executable jar to a folder where you want to run it from.
- Start BigBoard by running:

    java -jar BigBoard-X.X-war-exec.jar -httpPort 8080 -extractDirectory BigBoardExtract

  - **X.X** is the version of BigBoard.
  - **8080** is the port for BigBoard to listen on.
  - **BigBoardExtract** is the directory that the jar is extracted to and run from.


Installing - war
----------------

- Required:
  - Java 1.6 or greater
  - Apache Tomcat 7
  
- Start Tomcat.
- Copy the war file to the `webapps` folder, BigBoard should be deployed automatically.


Developing - Setup
------------------

- Required:
  - Java 1.6 or greater
  - Maven 2 or greater
  - Eclipse (suggested)

- Please use the code style formatter xml files in the contributing folder.

- To setup eclipse for BigBoard, please run:

    mvn eclipse:eclipse -DdownloadSources=true -DdownloadJavadocs=true
    
  - **eclipse:eclipse** creates the .project and .classpath files for your environment based on the pom.xml
  - **downloadSources=true** downloads the source for all the java dependencies, so that they are available for 
  debugging.  This can take a while, but is a one time event.
  - **downloadJavadocs=true** downloads the javadocs for all the java dependencies.  This can take a while, but is
  also a one time event.
  
- Import the project into Eclipse.


Developing - Building
---------------------

- Run maven to build the war and executable jar:

    mvn clean install tomcat7:exec-war


Developing - Running Tomcat 'inplace'
--------------------------------------

- To build, create war and run tomcat 'inplace' at http://localhost:8080/:

    mvn clean install tomcat7:run
    
- In this mode any changes to HTML, CSS, image or other files are available immediately without restarting Tomcat.
- Any changes to Java code however requires a Tomcat restart.

- To view the tomcat log file when using 'tomcat:run' on OSX, Linux or other Unix type system:

    tail -F ./target/tomcat/logs/big-board.log

- This can be run from the same location that the mvn command is run from.



