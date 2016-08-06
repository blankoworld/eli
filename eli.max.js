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
var domain = 'https://quitter.se';
var locationLabel = 'Location:';
var timeLabel = 'Post time:';

// Network access API url
var api = '/api/';
var user_api = 'users/show/';
var user_rss = 'statuses/user_timeline/';
var group_api = 'statusnet/groups/show/';
var group_rss = 'statusnet/groups/timeline/';

// Other variables
var api_url = "",
    api_rss_url = "",
    img_name = "",
    template = "",
    widget = "";

var setConfig = function setConfig(domain, user, type) {
    api_url = domain + api + user_api;
    api_rss_url = domain + api + user_rss;
    img_name = "profile_image_url";
    if (type === "group") {
        api_url = domain + api + group_api;
        api_rss_url = domain + api + group_rss;
        img_name = "stream_logo";
    }
    url = api_url + user + ".xml";
};

var loadConfig = function loadConfig() {
    // fetch user choices
    domain = document.getElementById('profile_domain').value;
    user = document.getElementById('profile_name').value;
    var choosenType = document.getElementById('profile_type');
    type = choosenType.options[profile_type.selectedIndex].value;
    // change current configuration
    setConfig(domain, user, type);
    // display the result
    displayResult();
};

var getUrl = function getUrl(url, method) {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        req = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    req.open("GET", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            method(req.responseXML);
        }
    });
    req.send(null);
};

var displayResult = function displayResult() {
    // get main info
    getUrl(url, createTimeline);
};

var getTargetStatuses = function getTargetStatuses(source) {
    // get statuses from source
    var statuses = source.querySelector('statuses').getElementsByTagName('status');

    // browse statuses but no more than "max"
    var max_item = max - 1;
    for (var n = 0; n < statuses.length; n++) {
        var status = statuses[n];
        var content = "";

        // Check that this status can be displayed. If status deleted, do not do anything
        var statusDeleted = "";
        try {
            statusDeleted = status.getElementsByTagName('qvitter_delete_notice').item(0).firstChild.data;
        } catch (e) {}

        // Check status and add it to timeline only if it was not deleted
        if (statusDeleted !== 'true') {
            // Add a bloc about member that contains images, names and link
            var memberInfo = createMemberInfoBloc(status);

            // get status real content (in html)
            try {
                content = status.getElementsByTagNameNS('*', 'html').item(0).firstChild.data;
                content = content.replace(content.slice(content.indexOf('<div'), content.indexOf('div>') + 4), '');
            } catch (e) {}

            // If some picture with a link, get it.
            var imageElt = "";
            try {
                var enclosure = status.querySelector('attachments enclosure');
                if (['image/jpeg', 'image/gif', 'image/png', 'image/svg'].indexOf(enclosure.getAttribute("mimetype")) >= 0) {
                    var imageUrl = enclosure.getAttribute("url");
                    imageElt = document.createElement("a");
                    imageElt.target = "_blank";
                    imageElt.href = imageUrl;
                    var image = document.createElement("img");
                    image.src = imageUrl;
                    image.alt = "Attachment";
                    imageElt.appendChild(image);
                }
            } catch (e) {}

            // Status created date
            var timeElt = "";
            try {
                var time = new Date(status.querySelector('created_at').textContent).toLocaleString();
                timeElt = document.createElement("span");
                timeElt.className = "tooltip";
                var labelElt = document.createElement("span");
                labelElt.appendChild(document.createTextNode(timeLabel + " " + time));
                timeElt.appendChild(document.createTextNode(" ⌛ "));
                timeElt.appendChild(labelElt);
            } catch (e) {}

            // Status location
            var locationElt = "";
            try {
                var location = status.querySelector('user location').textContent;
                locationElt = document.createElement("span");
                locationElt.className = "tooltip";
                locationElt.appendChild(document.createTextNode(" ⌂ "));
                var labelLocationElt = document.createElement("span");
                labelLocationElt.textContent = locationLabel + " " + location;
                locationElt.appendChild(labelLocationElt);
            } catch (e) {}

            // Add status on timeline
            var item = document.createElement("article");
            var htmlContent = "";
            if (memberInfo !== "") {
                htmlContent += "<span class=\"groupmember\">" + memberInfo.innerHTML + "</span>";
            }
            if (timeElt !== "") {
                htmlContent += "<span class=\"tooltip\">" + timeElt.innerHTML + "</span>";
            }
            if (locationElt !== "") {
                htmlContent += "<span class=\"tooltip\">" + locationElt.innerHTML + "</span>";
            }
            htmlContent += "<br>";
            htmlContent += content;
            if (imageElt !== "") {
                htmlContent += imageElt.innerHTML;
            }
            htmlContent += "";
            item.innerHTML = htmlContent;
            widget.insertBefore(item, templateFooter);
        }

        // Hack to break the loop
        if ((max_item < statuses.length) && (n === max_item)) {
            n = statuses.length;
        }
    }
};

var createTemplate = function createTemplate(image) {
    // Initialization
    template = document.createElement("div");
    template.id = tag;
    widget = document.createElement("div");
    widget.id = "eli_widget";
    // Add header with the username and a link to its social network
    var templateHeader = document.createElement("header");
    if (image !== "") {
        var networkLink = document.createElement("a");
        networkLink.target = "_blank";
        networkLink.href = domain + "/" + user;
        var targetImage = document.createElement("img");
        targetImage.src = image;
        targetImage.title = "Avatar";
        targetImage.alt = user;
        networkLink.appendChild(targetImage);
        templateHeader.appendChild(networkLink);
    }
    var content = document.createElement("p");
    content.textContent = "\u00A0" + user;  // add a space before target
    templateHeader.appendChild(content);
    widget.appendChild(templateHeader);
    // Finally add footer
    templateFooter = document.createElement("footer");
    widget.appendChild(templateFooter);
};

var createTimeline = function createTimeline(source) {
    // get info about target
    var targetInfo = source.getElementsByTagName(type);
    // get image source
    var imageSource = "";
    try {
        imageSource = source.querySelector(img_name).textContent;
    } catch (e) {}

    // get target ID to fetch RSS feed (for an example with ID 3, RSS feed is 3.xml)
    try {
        targetId = source.querySelector("id").textContent;
    } catch (e) {
        throw new Error(alert("Can't fetch social network info."));
    }

    // create template
    createTemplate(imageSource);

    // fetch RSS feed
    rss_url = api_rss_url + targetId + ".xml";
    getUrl(rss_url, getTargetStatuses);

    // replace timeline by new content
    template.appendChild(widget);
    var timeline = document.getElementById(tag);
    parent = timeline.parentNode;
    parent.replaceChild(template, timeline);
};

var createMemberInfoBloc = function createMemberInfoBloc(text) {
    // only create this bloc if type is group
    var infoBloc = "";
    if (type === "group") {
        try {
            // get data
            var pseudo = "@" + text.querySelector('screen_name').textContent;
            var name = text.querySelector('name').textContent;
            var image = text.querySelector('profile_image_url_https').textContent;
            var link = text.getElementsByTagNameNS('*', 'profile_url').item(0).firstChild.data;
            infoBloc = document.createElement("span");
            // then start creating bloc
            infoBloc.className = "groupmember";
            var linkElt = document.createElement("a");
            linkElt.className = "tooltip";
            linkElt.target = "_blank";
            linkElt.href = link;
            // add image, pseudo, then name into the link
            var imageElt = document.createElement("img");
            imageElt.alt = "Profile";
            imageElt.align = "left"; // TODO: Add this directive into CSS (add imageElt.classList.add("member"))
            imageElt.src = image;
            linkElt.appendChild(imageElt);
            linkElt.appendChild(document.createTextNode(pseudo));
            var nameElt = document.createElement("span");
            nameElt.textContent = name;
            linkElt.appendChild(nameElt);
            // finally add link to the bloc
            infoBloc.appendChild(linkElt);
        } catch (e) {}
    }
    return infoBloc;
};

// Set default configuration
setConfig(domain, user, type);

window.onload = displayResult;
