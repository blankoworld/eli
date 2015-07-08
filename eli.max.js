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
var user = 'debian';
var max = 5;
var tag = 'elitimeline';
var domain = 'https://quitter.se'

// Other variables
var api = '/api/';
var user_api = 'users/show/';
var user_rss = 'statuses/user_timeline/';
var group_api = 'statusnet/groups/show/';
var group_rss = 'statusnet/groups/timeline/';
var api_url = domain+api+user_api;
var api_rss_url = domain+api+user_rss;
var img_name = 'profile_image_url';
if (type=='group') {
  api_url = domain+api+group_api
  api_rss_url = domain+api+group_rss;
  img_name = 'stream_logo';
}
url = api_url+user+'.xml';

function loadConfig()
{
    domain = document.getElementById('profile_domain').value;
    user = document.getElementById('profile_name').value;
    profile_type = document.getElementById('profile_type');
    type = profile_type.options[profile_type.selectedIndex].value;
    api_url = domain+api+user_api;
    api_rss_url = domain+api+user_rss;
    img_name = 'profile_image_url';
    if (type=='group') {
        api_url = domain+api+group_api
        api_rss_url = domain+api+group_rss;
        img_name = 'stream_logo';
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

  userinfo=xmlDoc.getElementsByTagName(type);
  try {
    id = userinfo[0].getElementsByTagName("id")[0].childNodes[0].nodeValue;
  }
  catch (e)
  {
    id = e;
  }
  // fetch image
  try {
    img = userinfo[0].getElementsByTagName(img_name)[0].childNodes[0].nodeValue;
  }
  catch (e) {
    img = '';
  }
  rss_url = api_rss_url+id+'.xml';
  xmlhttp.open("GET",rss_url,false);
  xmlhttp.send();
  xmlDoc=xmlhttp.responseXML;
  content = '<div id="eli_widget"><header>';
  if (img != '') {
    content += '<img src="'+img+'" alt="'+user+'" title="Avatar"/>';
  }
  content += ' <p>'+user+'</p></header>';
  var items = xmlDoc.getElementsByTagName('statuses').item(0).getElementsByTagName('status');
  var max_item = max - 1
  for (var n=0; n < items.length; n++) {
    try {
      var item_content = items[n].getElementsByTagName('statusnet:html').item(0).firstChild.data;
    }
    catch (e) {
      var item_content = '';
    }
    try {
      var image_url,image_link="";
      if (['image/jpeg','image/gif','image/png','image/svg'].indexOf(items[n].getElementsByTagName('attachments').item(0).getElementsByTagName('enclosure').item(0).getAttribute("mimetype"))>=0) {
        var image_url=items[n].getElementsByTagName('attachments').item(0).getElementsByTagName('enclosure').item(0).getAttribute("url");
        var image_link="<a target= \"_blank\" href=\""+image_url+"\"><img alt=\"Attachment\" src=" + image_url + " /></a>"
      }
    }
    catch(e) {
      var image_url,image_link="";
    }
        
    content += '<article>'+item_content+image_link+'</article>';
    if ((max_item < items.length) && (n==max_item))
    {
      n = items.length;
    }
  }

  content += '<footer></footer></div>';
  document.getElementById(tag).innerHTML = content;
}

window.onload = displayResult;
