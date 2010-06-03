$(function(){
    $("#accordion").accordion({
        clearStyle: true,
        autoHeight: false
    });
    var state = chrome.extension.getBackgroundPage().getState();
    initDisplay(state);
    $('#save').click(function(){
        saveState();
        window.close()
        return false;
    })
});


function saveState(){
    var state = chrome.extension.getBackgroundPage().getState();
    state.key = $("#key").val();
    state.username = $("#username").val();
    state.friends = getFriendsFromUI();
    chrome.extension.getBackgroundPage().setState(state);
}

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

function initDisplay(state){
    $("#username").val(state.username);
    $("#key").val(state.key);
    initFriendsGUI(state.friends);
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

// mock background page
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
                }]
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
