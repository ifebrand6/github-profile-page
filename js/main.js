"use strict";

function addSearchFocus() 
{
    var searchBox = document.getElementById("search-box");
    searchBox.classList.add("focused");
}

function removeSearchFocus()
{
    var searchBox = document.getElementById("search-box");
    searchBox.classList.remove("focused");
}

function hideDropdown()
{
    var dropdowns = document.getElementsByClassName("dropdown");
    for (var i = 0; i < dropdowns.length; i++) {
        var dropdown = dropdowns[i];
        if (dropdown.tagName !== undefined) {
            dropdown.style.display = "none";
        }
    }
}

function toggleSearchArea()
{
    var searchArea = document.getElementById("search-area");
    var navBar = document.getElementById("main-nav")
    if (searchArea.classList.contains("display-sm-none")) {
        searchArea.classList.remove("display-sm-none");
        navBar.classList.add("show-search-area");
    } else {
        searchArea.classList.add("display-sm-none");
        navBar.classList.remove("show-search-area");
    }
}

function toggleDropdown(event)
{   
    event.stopPropagation()
    var parent = event.target.closest(".nav-item")
    for (var i = 0; i < parent.childNodes.length; i++) {
        var child = parent.childNodes[i];
        if (child.tagName !== undefined) {
            if (child.classList.contains("dropdown")) {
                if (child.style.display == "none" || child.style.display == "") {
                    //close other dropdowns
                    hideDropdown()
                    child.style.display = "inline-block";
                } else {
                    child.style.display = "none";
                }
            }
        }
    }
}

/**
 * Converts date in UTC string format to a human readable format
 */
function generateHumanReadableDate(dateString)
{
    var today = new Date();
    var date = new Date(dateString);
    var secondsDifference = (today.getTime() - date.getTime()) / (1000);
    if (secondsDifference < 60) {
        return " a few seconds ago";
    }

    var minutesDifference = Math.round((today.getTime() - date.getTime()) / (1000 * 60));
    if (minutesDifference === 1) {
        return minutesDifference + " minute ago";
    }
    if (minutesDifference < 60) {
        return minutesDifference + " minutes ago";
    }

    var hoursDifference = Math.round((today.getTime() - date.getTime()) / (1000 * 3600));
    if (hoursDifference === 1) {
        return hoursDifference + " hour ago";
    }
    if (hoursDifference <= 24) {
        return hoursDifference + " hours ago";
    }

    var daysDifference = Math.round((today.getTime() - date.getTime()) / (1000 * 3600 * 24));
    if (daysDifference === 1) {
        return daysDifference + " day ago";
    }
    if (daysDifference <= 8) {
        return daysDifference + " days ago";
    }

    if (daysDifference < 365) {
        return "on " + date.toLocaleString('default', { month: 'short' }) + " " + date.getDate();
    }

    var diffYears = Math.round((today.getTime() - date.getTime()) / (1000 * 3600 * 24 * 365));
    if (diffYears === 1) {
        return diffYears + " year ago";
    }

    return diffYears + " years ago";
}


//  * Generates an SVG element path

function SvgPathGenerator(pathString, options = {}) 
{
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute("viewBox", options.viewBox ? options.viewBox : "0 0 16 16");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("width", options.width ? options.width : "16");
    svg.setAttribute("height", options.height ? options.height : "16");
    svg.setAttribute("aria-hidden", "true");

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute("fill-rule", "evenodd");
    path.setAttribute("d", pathString);
    svg.appendChild(path);
    return svg;
}

/**
 * Generates the HTML element for a repository
 * 
 */
function RepositoryGenerator(repository)
{
    var starButton = null;
    if (repository.viewerHasStarred) {
        starButton = document.createElement('button');
        starButton.classList.add('button');
        starButton.appendChild(SvgPathGenerator("M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"));
        var t = document.createTextNode('Unstar');
        starButton.appendChild(t)
    } else {
        starButton = document.createElement('button');
        starButton.classList.add('button');
        starButton.appendChild(SvgPathGenerator("M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"));
        var t = document.createTextNode('Star');
        starButton.appendChild(t)
    }

    var dateInfo = document.createElement('span');
    dateInfo.classList.add('info-item')
    dateInfo.innerHTML = 'Updated ' + generateHumanReadableDate(repository.updatedAt);

    var languageInfo = null

    if (repository.primaryLanguage != null) {
        languageInfo = document.createElement('span');
        languageInfo.classList.add('info-item');

        var languageColor = document.createElement('span');
        languageColor.classList.add('language-color');
        languageColor.style.backgroundColor = repository.primaryLanguage.color;

        languageInfo.appendChild(languageColor);

        var t = document.createTextNode(repository.primaryLanguage.name);
        languageInfo.appendChild(t)
    }

    var starGazersInfo = null;
    if (repository.stargazerCount > 0) {
        starGazersInfo = document.createElement('span');
        starGazersInfo.classList.add('info-item');

        var anchor = document.createElement('a');
        anchor.href = repository.url + '/stargazers';
        anchor.appendChild(SvgPathGenerator("M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"));
        var t = document.createTextNode(repository.stargazerCount);
        anchor.appendChild(t);
        starGazersInfo.appendChild(anchor)
    }

    var forkCountInfo = '';
    if (repository.forkCount > 0) {
        forkCountInfo = document.createElement('span');
        forkCountInfo.classList.add('info-item');

        var anchor = document.createElement('a')
        anchor.href = repository.url + '/network/members';
        anchor.appendChild(SvgPathGenerator("M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"));
        var t = document.createTextNode(repository.forkCount);
        anchor.appendChild(t);
        forkCountInfo.appendChild(anchor)
    }

    var licenseInfo = '';
    if (repository.licenseInfo != null) {
        licenseInfo = document.createElement('span');
        licenseInfo.classList.add('info-item');

        licenseInfo.appendChild(SvgPathGenerator("M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z"));
        var t = document.createTextNode(repository.licenseInfo.name);
        licenseInfo.appendChild(t);
    }

    var repositoryMain = document.createElement('div');
    repositoryMain.classList.add('repository-main');
    repositoryMain.classList.add('padding-vertical-md');

    var left = document.createElement('div');
    left.classList.add('width-75');

    var right = document.createElement('div');
    right.classList.add('width-25');
    right.classList.add('star-button-holder');
    right.appendChild(starButton);

    var headingAnchor = document.createElement('a');
    headingAnchor.href = repository.url;
    var t = document.createTextNode(repository.name);
    headingAnchor.appendChild(t);
    var heading = document.createElement('h3');
    heading.appendChild(headingAnchor);
    left.appendChild(heading);

    var description = document.createElement('p');
    description.classList.add('description');
    t = document.createTextNode(repository.description);
    description.append(t);
    left.appendChild(description);

    var info = document.createElement('div')
    info.classList.add("info");
    if (languageInfo) {
        info.appendChild(languageInfo);
    }
    if (starGazersInfo) {
        info.appendChild(starGazersInfo);
    }
    if (forkCountInfo) {
        info.appendChild(forkCountInfo);
    }
    if (licenseInfo) {
        info.appendChild(licenseInfo);
    }
    if (dateInfo) {
        info.appendChild(dateInfo);
    }
    left.appendChild(info);

    repositoryMain.appendChild(left);
    repositoryMain.appendChild(right);
    return repositoryMain;
}

/**
 *  Updates DOM with the fetched user data from github
 */
function updateDOMWithFetchedUserData(data)
{
    // update repositories count components
    var respositoryCountBadges = document.getElementsByClassName('repositories-count')
    for (var i = 0; i < respositoryCountBadges.length; i++) {
        respositoryCountBadges[i].innerHTML = data.user.repositories.totalCount;
    }
    //update url for profile image
    var profileImages = document.getElementsByClassName("profile-image");
    for (var i = 0; i < profileImages.length; i++) {
        if (profileImages[i].tagName !== undefined) {
            profileImages[i].src = data.user.avatarUrl;
        }
    }
    //update usename text
    var usernameTexts = document.getElementsByClassName("username-text");
    for (var i = 0; i < usernameTexts.length; i++) {
        if (usernameTexts[i].tagName !== undefined) {
            var t = document.createTextNode(data.user.login);
            usernameTexts[i].appendChild(t);
        }
    }
    //update fullname text
    var fullnameTexts = document.getElementsByClassName("fullname-text");
    for (var i = 0; i < fullnameTexts.length; i++) {
        if (fullnameTexts[i].tagName !== undefined) {
            var t = document.createTextNode(data.user.name);
            fullnameTexts[i].appendChild(t);
        }
    }
    //update status
    var status =  data.user.status
    if (status != null) {
        var statusMessages = document.getElementsByClassName("user-status-message");
        for (var i = 0; i < statusMessages.length; i++) {
            if (statusMessages[i].tagName !== undefined) {
                var t = document.createTextNode(status.message);
                statusMessages[i].appendChild(t);
            }
        }
        var statusEmojiHolder = document.getElementsByClassName("user-status-emoji-holder");
        for (var i = 0; i < statusEmojiHolder.length; i++) {
            if (statusEmojiHolder[i].tagName !== undefined) {
                var doc = new DOMParser().parseFromString(status.emojiHTML, 'text/html');
                statusEmojiHolder[i].appendChild(doc.body);
            }
        }
    }

   
    //update bio
    var bio = document.getElementById("bio");
    var bioText = document.createTextNode(data.user.bio);
    bio.appendChild(bioText);
    //populate the repositories list element with repositories
    var repositoriesList = document.getElementById("repositories-list");
    var repositories = data.user.repositories.nodes;
    for (var i = 0; i < 20; i++) {
        var repository = repositories[i];
        console.log(i)
        if (repository == undefined) {
            continue;
        }
        // console.log(repositoriesList)
        repositoriesList.append(RepositoryGenerator(repository));
    }
    //update network info
    var followers = document.getElementById("followers-count");
    followers.innerHTML = data.user.followers.totalCount;
    var following = document.getElementById("following-count");
    following.innerHTML = data.user.following.totalCount;
    var starredRepositoriesCount = document.getElementById("starred-repositories-count");
    starredRepositoriesCount.innerHTML = data.user.starredRepositories.totalCount;
    //updatemcontact info
    var contactLocation = document.getElementsByClassName("contact-location");
    for (var i = 0; i < contactLocation.length; i++) {
        if (contactLocation[i].tagName !== undefined) {
            var t = document.createTextNode(data.user.location);
            contactLocation[i].appendChild(t);
        }
    }

    var contactEmail = document.getElementsByClassName("contact-email");
    for (var i = 0; i < contactEmail.length; i++) {
        if (contactEmail[i].tagName !== undefined) {
            var a = document.createElement('a')
            a.setAttribute('href', "mailto:" + data.user.email)
            var t = document.createTextNode(data.user.email);
            a.appendChild(t);
            contactEmail[i].appendChild(a)
        }
    }

    var contactWebsite = document.getElementsByClassName("contact-website");
    for (var i = 0; i < contactWebsite.length; i++) {
        if (contactWebsite[i].tagName !== undefined) {
            var a = document.createElement('a')
            a.setAttribute('href', 'https://' + data.user.websiteUrl)
            var t = document.createTextNode(data.user.websiteUrl);
            a.appendChild(t);
            contactWebsite[i].appendChild(a)
        }
    }

    var contactTwitter = document.getElementsByClassName("contact-twitter");
    for (var i = 0; i < contactTwitter.length; i++) {
        if (contactTwitter[i].tagName !== undefined) {
            var a = document.createElement('a')
            a.setAttribute('href', "https://twitter.com/" + data.user.twitterUsername)
            var t = document.createTextNode("@" + data.user.twitterUsername);
            a.appendChild(t);
            contactTwitter[i].appendChild(a)
        }
    }
}

/**
 * Detects if an element is still in view port
 */
function elementInViewport (el) {
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}


window.addEventListener('load', function () {
    document.querySelectorAll('.dropdown-toggler').forEach(item => {
        item.addEventListener('click', event => {
            toggleDropdown(event);
        })
    })
    document.addEventListener('click', function(event) {
        if (!event.target.classList.contains("dropdown")) {
            hideDropdown();
        }
    })

    document.addEventListener('scroll', function() {
        //determine if main profile image has scrolled out of view
        var mainProfileImage = document.getElementById("spy-profile-view");
        var auxProfileImage =  document.getElementById("aux-profile-image");
        if (elementInViewport(mainProfileImage)) {
            auxProfileImage.style.opacity = 0;
        } else {
            auxProfileImage.style.opacity = 1;
        }
    })
})
export {updateDOMWithFetchedUserData};