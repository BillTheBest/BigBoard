CONTRIBUTING.md
===============

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

    mvn clean install tomcat7:run -DCUSTOM_HOME="/Users/gturner/Developer/Work/BigBoardCustom"
    
- In this mode any changes to HTML, CSS, image or other files are available immediately without restarting Tomcat.
- Any changes to Java code however requires a Tomcat restart.

- To view the tomcat log file when using 'tomcat:run' on OSX, Linux or other Unix type system:

    tail -F ./target/tomcat/logs/big-board.log

- This can be run from the same location that the mvn command is run from.


JavaScript
------------------------------------------------------------------------------------------------------------------------

- If using Eclipse, please use the Code Style Formatter.
- Please use JSDoc tags to document your code.

- Use @author, @constructor, @param, and @returns.

    http://usejsdoc.org/tags-author.html
    http://usejsdoc.org/tags-constructor.html
    http://usejsdoc.org/tags-param.html
    http://usejsdoc.org/tags-returns.html

- Include a description of the object, full sentence.

- Example:

    /**
     * The ReferencePlugin object.
     * 
     * @author gturner
     * 
     * @constructor
     * @param {string}
     *          id - Id of the div to target for html replacement.
     * @param {int}
     *          interval - How often to run update() to refresh the content.
     * @param {string}
     *          exampleParameter - Parameter that will be printed out later in a method.
     */
    function ReferencePlugin( id, interval, exampleParameter ) {
      /* */
    }


- Reference:
http://usejsdoc.org/
https://github.com/jsdoc3/jsdoc
