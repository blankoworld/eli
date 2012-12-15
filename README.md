# ELI, Expression Libre Identica

## About

This is a javascript widget that permit to show an Identi.ca timeline. This works for a user or a group.

## License

This program is under the [WTF Public License](http://sam.zoy.org/wtfpl/COPYING 'Read more about the WTF Public License').

## Installation

Just:

  * copy the eli.js in your website directory
  * add this code **at the end of your page before the </body> tag**:

    <div id="content">
      <p>Timeline activity...</p>
    </div>
    
    <script type="text/javascript" src="./eli.js">
      var type = 'user'; // could be 'group' to follow a group
      var user = 'bl4n';
      var max = 5;
      var tag = 'content';
    </script>

An example is available on **index.html** page.

## Configuration

You probably want to change these variables:

  * type: Add here **user** OR **group** if you want to follow a user OR a group
  * user: Add here the name of the user (or the group) you want to follow
  * max: Add here the number of statuses you want to display. By default identica seems to only give 20 statuses.
  * tag: The name of the tag we should change to display all statuses. In the previous example, the div with ID equal to *content* would be changed. But you can add another ID.

## Contact

You can contact me at the given address: olivier+eli [AT] dossmann [DOT] net
