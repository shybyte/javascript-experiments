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
    state.user.key = $("#key").val();
    state.user.username = $("#username").val();
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
            username: $('.username', this).val(),
            key: $('.key', this).val()
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
        }));
    });
}

function getFriendsTableBody(){
    return $('#friendsTable tbody');
}


function addFriendRow(tableBody, friend){
    tableBody.append($.nano('<tr><td><input type="text" class="username" value="{username}"></td><td><input type="text" class="key" value="{key}"/></td><td><button class="removeFriendButton">-</button></td></tr>', friend));
    $('tr:last-child .removeFriendButton', tableBody).click(function(){
        $(this.parentNode.parentNode).remove();
    });
}

function isEmpty(s){
    return !s || s.match(/^\s*$/);
}

function displayFriends(friends){
    var tableBody = getFriendsTableBody();
    if (friends) {
        $.each(friends, function(i, friend){
            if (!isEmpty(friend.username) && !isEmpty(friend.username)) {
                addFriendRow(tableBody, friend);
            }
        });
    }
}


/* Sites */

function initSitesGUI(sites){
    var tableBody = getSitesTableBody();
    if (sites) {
        $.each(sites, function(i, site){
            if (!isEmpty(site.domainPart)) {
                addSiteRow(tableBody, site);
            }
        });
    }
    $('#addSiteButton').click(function(){
        addSiteRow(getSitesTableBody(), "");
    });
}

function getSitesFromUI(){
    var sites = [];
    $('tr', getSitesTableBody()).each(function(){
        sites.push({domainPart:$('.site', this).val()});
    });
    return sites;
}

function addSiteRow(tableBody, site){
    tableBody.append($.nano('<tr><td><input type="text" class="site" value="{domainPart}"></td><td><button class="removeButton">-</button></td></tr>', site));
    $('tr:last-child .removeButton', tableBody).click(function(){
        $(this.parentNode.parentNode).remove();
    });
}

function getSitesTableBody(){
    return $('#sitesTable tbody');
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
