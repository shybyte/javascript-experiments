$(function(){
    $("#accordion").accordion({
        clearStyle: true,
        autoHeight: false
    });
    initDisplay();
    $('#save').click(function(){
        saveState();
        window.close()
        return false;
    })
});

function saveState(){
    var state = chrome.extension.getBackgroundPage().getState();
    state.user.key = trimmedVal($("#key"));
    state.user.username = trimmedVal($("#username"));
    state.friends = getFriendsFromUI();
    state.sites = getSitesFromUI();
    chrome.extension.getBackgroundPage().setState(state);
}

function initDisplay(){
    var state = chrome.extension.getBackgroundPage().getState();
    $("#username").val(state.user.username);
    $("#key").val(state.user.key);
    initFriendsGUI(state.friends);
    initSitesGUI(state.sites);
}

/* Friends */

function getFriendsFromUI(){
    var friends = [];
    $('tr', getFriendsTableBody()).each(function(){
        friends.push({
            username: trimmedVal($('.username', this)),
            key: trimmedVal($('.key', this))
        });
    });
    return friends;
}

function initFriendsGUI(friends){
    displayFriends(friends);
    $('#addFriendButton').click(function(){
        addFriendRow(getFriendsTableBody(), ({
            username: '',
            key: ''
        }), true);
    });
}

function getFriendsTableBody(){
    return $('#friendsTable tbody');
}


function addFriendRow(tableBody, friend, anim){
    tableBody.append($.nano('<tr style="-webkit-transform:scale(0.1)"><td><input type="text" class="username" value="{username}"></td><td><input type="text" class="key" value="{key}"/></td><td><button class="removeButton">-</button></td></tr>', friend));
    initLastRow(tableBody, anim);
}



function isEmpty(s){
    return !s || s.match(/^\s*$/);
}

function displayFriends(friends){
    var tableBody = getFriendsTableBody();
    if (friends) {
        $.each(friends, function(i, friend){
            if (!isEmpty(friend.username) && !isEmpty(friend.username)) {
                addFriendRow(tableBody, friend, false);
            }
        });
    }
}


/* Sites */

function initSitesGUI(sites){
    var tableBody = getSitesTableBody();
    if (sites) {
        $.each(sites, function(i, site){
            if (!isEmpty(site.pattern)) {
                addSiteRow(tableBody, site, false);
            }
        });
    }
    $('#addSiteButton').click(function(){
        addSiteRow(tableBody, {pattern:''}, true);
    });
	$('#addCurrentSiteButton').click(function(){
        addCurrentSite();
    });
}

function addCurrentSite(){
	chrome.tabs.getSelected(null,function (tab){
		addSiteRow(getSitesTableBody(), {pattern:domainOf(tab.url)}, true);
	});
}


function getSitesFromUI(){
    var sites = [];
    $('tr', getSitesTableBody()).each(function(){
        var sitePattern = cleanSitePattern(trimmedVal($('.site', this)));
        sites.push({
            pattern: sitePattern
        });
    });
    return sites;
}

function addSiteRow(tableBody, site, anim){
    tableBody.append($.nano('<tr style="-webkit-transform:scale(0.1);"><td><input type="text" class="site" value="{pattern}"></td><td><button class="removeButton">-</button></td></tr>', site));
	initLastRow(tableBody,anim);
}


function getSitesTableBody(){
    return $('#sitesTable tbody');
}


/* table utils */ 

function showRow(row, anim){
    if (anim) {
        window.setTimeout(function(){
            row.css('webkitTransform', 'scale(1)')
        }, 10);
    }
    else {
        row.css('webkitTransform', 'scale(1)');
    }
}

function initLastRow(tableBody,anim){
    var row = $('tr:last-child', tableBody);
    showRow(row, anim);
    $('.removeButton', row).click(function(){
        removeRow($(this.parentNode.parentNode));
    });
}

function removeRow(row){
    row.css('webkitTransform', 'scale(0)');
    window.setTimeout(function(){
        row.remove()
    }, 500);
}


/* mock background page */

if (!chrome.extension) {
    chrome.extension = {
        getBackgroundPage: function(){
            var state = {
                username: "shybyte",
                key: "secret",
                friends: [{
                    username: "stefe",
                    key: "polly"
                }, {
                    username: "",
                    key: " "
                }],
                sites: ['google', 'facebook', 'meinvz']
            };
            return {
                setState: function(newState){
                    state = newState;
                    console.log(state);
                },
                getState: function(){
                    return state;
                }
                
            }
        }
    };
}
