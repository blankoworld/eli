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
  //Header
  content = '<div id="eli_widget"><header>';
  if (img != '') {
    content += '<a target= "_blank" href="'+domain+"/" + user + '"><img src="'+img+'" alt="'+user+'" title="Avatar"/></a>';
  }
  content += ' <p>'+user+'</p></header>';
  
  //Statuses in Array
  var items = xmlDoc.getElementsByTagName('statuses').item(0).getElementsByTagName('status');
  var max_item = max - 1
  
  //Read item from array
  for (var n=0; n < items.length; n++) {
    try {//Images, names and link for Group member
        var item_groupmember="",item_groupmember_screen_name="",item_groupmember_name="", item_groupmember_image="",item_groupmember_link="";
        if (type=='group'){
             var item_groupmember_screen_name = "@" + items[n].getElementsByTagName('screen_name').item(0).firstChild.data;
             var item_groupmember_name = items[n].getElementsByTagName('name').item(0).firstChild.data;
             var item_groupmember_image = items[n].getElementsByTagName('profile_image_url_https').item(0).firstChild.data;
             var item_groupmember_link = items[n].getElementsByTagNameNS('*','profile_url').item(0).firstChild.data;
             var item_groupmember = '<span class=\"groupmember\"><a class=\"tooltip\" target= \"_blank\" href=\"' + item_groupmember_link + '\"><img alt=\"Profile\" align=\"left\" src="' + item_groupmember_image + '\" />' + item_groupmember_screen_name + ' <span>' + item_groupmember_name +'</span>  </a>     </span>';}
    }
    catch (e) {
        var item_groupmember='',item_groupmember_name='',item_groupmember_image='',item_groupmember_link='';
    }

    try {//Get Status Html
        var item_content = items[n].getElementsByTagNameNS('*','html').item(0).firstChild.data;
        item_content = item_content.replace(item_content.slice(item_content.indexOf('<div'),item_content.indexOf('div>')+4),'') 
    }
    catch (e) {
        var item_content = '';
    }
    
    try {//Get image and link if attached
        var image_url="",image_link="";
        if (['image/jpeg','image/gif','image/png','image/svg'].indexOf(items[n].getElementsByTagName('attachments').item(0).getElementsByTagName('enclosure').item(0).getAttribute("mimetype"))>=0) {
            var image_url=items[n].getElementsByTagName('attachments').item(0).getElementsByTagName('enclosure').item(0).getAttribute("url");
            var image_link="<a target= \"_blank\" href=\""+image_url+"\"><img alt=\"Attachment\" src=" + image_url + " /> </a>"
        }
    }
    catch(e) {
      var image_url="",image_link="";
    }
    
    try {//Get Create Time from status
        var item_time = '';
        item_time = new Date( items[n].getElementsByTagName('created_at').item(0).firstChild.data).toLocaleString();
        item_time= "<span class=\"tooltip\">&#x231B\;<span>Post time: " + item_time +"</span> </span>";
    }
    catch (e) {
        var item_time = '';
    }
    
    try {//Get location from status
        var item_location='';
        item_location = items[n].getElementsByTagName('user').item(0).getElementsByTagName('location').item(0).firstChild.data;
        item_location= "<span class=\"tooltip\">&#x2302\; <span>Location: " + item_location +"</span></span>";
    }
    catch (e) {
        var item_location = '';
    }
   
    try {//Check for delete notice
        var delete_notice='';
        delete_notice = items[n].getElementsByTagName('qvitter_delete_notice').item(0).firstChild.data
    }
        
    catch (e) {
        var delete_notice= '';
    }
       
    if (delete_notice!=='true'){//Build status string and add to timeline
        content += '<article>'+item_groupmember+item_time+item_location +"<br />" +item_content+image_link+'</article>'
    }
    
    if ((max_item < items.length) && (n==max_item))
    {
      n = items.length;
    }
  }

  content += '<footer></footer></div>';
  document.getElementById(tag).innerHTML = content;
}

window.onload = displayResult;
