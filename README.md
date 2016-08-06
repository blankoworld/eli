# ELI, Expression Libre Incongrue

## About

ELI is a javascript widget that permits to show a GNU Social timeline. It can display either a user timeline or a group timeline.

We usually call it a *ELI's Badge*, a *ELI's Timeline* or just **ELI**.

I suggest you to checkout [our official demo page](http://eli.depotoi.re/ "Discover ELI in action") to have an idea about what ELI can do.

[![Demo](https://img.shields.io/badge/demo-official-green.svg)](http://eli.depotoi.re/ "Discover ELI in action")
![Javascript](https://img.shields.io/badge/code-javascript-bb0000.svg)

## Overview

ELI retrieves some data from GNU Social network and create a *Badge*.

You're so able to:

  * display either user or group timeline
  * display its avatar/logo
  * choose the domain from which you fetch statuses
  * set a limit of displayed statuses
  * display statuses ' attachments
  * display time and location from each status
  * choose time/location displayed label
  * display your main page even if ELI don't finish to retrieve data

![User Timeline](eli_attachment.png)   ![Group Timeline](eli_group.png)

Check local demo using [**minimal.html**](minimal.html) page or try an interactive one with [**index.html**](index.html) page.

## Installation

Just:

  * copy the eli.js in your website directory
  * add this code in your page:

```html
    <div id="elitimeline">
      <p>Timeline activity...</p>
    </div>
```

Then add this code **at the end of your page before the `</body>` tag**:

```html
    <script type="text/javascript" src="./eli.js">
      var type = 'user'; // could be 'group' to follow a group
      var user = 'bl4n';
      var max = 5;
      var tag = 'elitimeline';
      var domain = 'myGNUSocialDomain.tld';
    </script>
```

Adapt domain content by your GNU Social Instance. For an example: **https://quitter.se**.

In order ELI widget to be more beautiful, add this in your CSS file or in **`</style>` tag**:

```css
#eli_widget {
width: 250px;
height: auto;
margin: 0;
padding: 0;
border: thin solid #eee;
border-radius: 12px;
box-shadow: 2px 1px 5px #000;
}

#eli_widget header {
text-align: left;
border-bottom: 5px solid #fb6104;
background-color: #43568e;
border-top-left-radius: 12px;
border-top-right-radius: 12px;
color: #ffffff;
}

#eli_widget header img {
margin: 5px;
background-color: #ffffff;
border-top-left-radius: 12px;
float: left;
}

#eli_widget header p {
margin: 0;
line-height: 60px;
}

#eli_widget article {
display: block;
margin-bottom: 5px;
padding: 5px;
border-bottom: thin solid #eeeeee;
overflow: hidden; /* For too long link: hide but enable click on it */
}

#eli_widget article img {
margin: 5px;
max-width: 230px;
}

#eli_widget article p {
margin-top: 0px;
}

.tooltip {position: relative;}
.tooltip span {display: none;}
.tooltip:hover span {
display: block;
position: absolute;
left: 0; top: 10%;
margin: 20px 0 0;
width: 200px;
color: #4D4D4C;
border: thin solid #eeeeee;
padding: 4px;
background: white;
}
```

A more fully CSS example is available in **style.css** file.

## Configuration

When adding ELI's javascript declaration, you can use these variables:

  * type: Either **user** OR **group**. The last one is used when you want to follow a group
  * user: the name of the user (or the group) you want to follow
  * max: maximum displayed statuses. By default GNU Social seems to give only 20 statuses
  * tag: tagname ELI will use to replace its content and display the badge
  * domain: your GNU Social instance URL
  * timeLabel: Label that appears on time entry
  * locationLabel: Label that appears on location entry

## Contribution

[ELI is available on Github](http://github.com/blankoworld/eli).

**eli.js** is a minimal version of ELI. To have a more readable version, and to develop it, we recommand you to use **eli.max.js** file.

After having improved and tested ELI's code, **don't forget to minify your code** by using http://javascript-minifier.com/:

  * Copy/paste the content of eli.max.js
  * Delete the license lines, and these functions:
    * loadForm()
    * loadConfig()
  * Click on **Minify**
  * Copy the result and replace eli.js file content

Then publish your result on Github.

## License

This program is under the [WTF Public License](http://sam.zoy.org/wtfpl/COPYING 'Read more about the WTF Public License').

## Contributors

  * [LubuWest](https://github.com/LubuWest)
  * [mart-e](https://github.com/mart-e)
  * [Olivier DOSSMANN](https://github.com/blankoworld)
