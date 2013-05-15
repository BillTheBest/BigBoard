Tomcat Custom Content
=====================

Requirements
------------

- For either embedded or deployed war, the application will read an environment variable called `CUSTOM_HOME`.
- `CUSTOM_HOME` will be an absolute path to a directory that contains custom user files.
- `CUSTOM_HOME` is external to the deployed war, so that redeployments will not change the customized files.
- The contents of`CUSTOM_HOME` will be served up like any other resource.


Implementation - Environment Variable Tomcat
--------------------------------------------

- Used by app.
- Edit startup.sh or startup.bat and add the following lines at the first blank line in the file:
...
# BEGIN ADDED
echo "Setting CUSTOM_HOME JAVA_OPTS values"
export JAVA_OPTS="$JAVA_OPTS -DCUSTOM_HOME=\"/var/www/big-board-custom\""
# END ADDED
...


Implementation - Environment Variable Executable Jar
----------------------------------------------------

- Used by app.
- Add the environment variable to the end of the start command:

java -jar BigBoard-X.X-war-exec.jar -httpPort 8080 -extractDirectory BigBoardExtract \
 -DCUSTOM_HOME=\"/var/www/big-board-custom\" 



Implementation - context.xml
----------------------------

- Used by app.
- Create a context.xml in the `webapp/META-INF/` folder.
- Add to context.xml:

    <Context aliases="/custom=${CUSTOM_HOME}" ></Context>

- Reference:

    http://stackoverflow.com/questions/3714080/tomcat-7-maven-plugin
    http://stackoverflow.com/questions/12715331/how-do-i-add-aliases-to-a-servlet-context-in-java


Implementation - Custom Servlet
-------------------------------

- Not used.
- Create a servlet that maps anything starting with "/custom" to `CUSTOM_HOME`.

- Commandline:

    mvn clean install tomcat7:run -DCUSTOM_HOME="/Users/gturner/Developer/Work/BigBoardCustom"

    java -jar BigBoard-1.0-SNAPSHOT-war-exec.jar -httpPort 8080 -extractDirectory BigBoardExtract \
     -DCUSTOM_HOME="/Users/gturner/Developer/Work/BigBoardCustom"


- Reference: 
http://stackoverflow.com/questions/12715331/how-do-i-add-aliases-to-a-servlet-context-in-java


Implementation - Tomcat Alias in server.xml
-------------------------------------------

- Not used.
- Add an docBase and alias to server.xml:


			  <!-- BEGIN ADDED -->
			  
			  <Context docBase="BigBoard" path="/bigboard" reloadable="true"
			    source="org.eclipse.jst.j2ee.server:BigBoard" aliases="/custom=${CUSTOM_HOME}" />
			    
        <!-- END ADDED -->

- Reference: 
    http://stackoverflow.com/questions/11138701/difference-between-tomcats-extraresourcepaths-and-aliases-to-access-an-external
    http://tomcat.apache.org/tomcat-7.0-doc/config/host.html

