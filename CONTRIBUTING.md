contributing.txt
================

TODO: Finish document.

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
