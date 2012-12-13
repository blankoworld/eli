/* This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://sam.zoy.org/wtfpl/COPYING for more details. */

var loadForm = document.getElementById('loadForm');
loadForm.addEventListener('submit', function(e) {
  e.preventDefault();
  loadConfig();
}, true);

// Change variables here.
var type = 'user'; // could be 'group' to follow a group
var user = 'bl4n';
var max = 5;
var tag = 'content';

// Other variables
var api = 'http://identi.ca/api/';
var user_api = 'users/show/';
var user_rss = 'statuses/user_timeline/';
var group_api = 'statusnet/groups/show/';
var group_rss = 'statusnet/groups/timeline/';
var api_url = api+user_api;
var api_rss_url = api+user_rss;
if (type=='group') {
  api_url = api+group_api
  api_rss_url = api+group_rss;
}
url = api_url+user+'.xml';

function loadConfig()
{
    api = document.getElementById('profile_api').value;
    user = document.getElementById('profile_name').value;
    profile_type = document.getElementById('profile_type');
    type = profile_type.options[profile_type.selectedIndex].value;
    api_url = api+user_api;
    api_rss_url = api+user_rss;
    if (type=='group') {
        api_url = api+group_api
        api_rss_url = api+group_rss;
    }
    url = api_url+user+'.xml';

    displayResult();
}

function displayResult()
{
  if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  }
  else
  {// code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.open("GET",url,false);
  xmlhttp.send();
  xmlDoc=xmlhttp.responseXML;

  user=xmlDoc.getElementsByTagName(type);
  try {
    id = user[0].getElementsByTagName("id")[0].childNodes[0].nodeValue;
  }
  catch (e)
  {
    id = e;
  }
  rss_url = api_rss_url+id+'.xml';
  xmlhttp.open("GET",rss_url,false);
  xmlhttp.send();
  rssDoc=xmlhttp.responseXML;
  content = '<ul>';
  var items = rssDoc.getElementsByTagName('statuses').item(0).getElementsByTagName('status');
  var max_item = max - 1
  for (var n=0; n < items.length; n++) {
    try {
      var item_content = items[n].getElementsByTagName('statusnet:html').item(0).firstChild.data;
    }
    catch (e) {
      var item_content = ''
    }
    content += '<li>'+item_content+'</li>';
    if ((max_item < items.length) && (n==max_item))
    {
      n = items.length;
    }
  }

  content += '</ul>';
  document.getElementById(tag).innerHTML = content;
}

