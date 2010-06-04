const defaultState = {
    user: {
        username: "shybyte",
        key: "secret",
    },
    friends: [{
        username: 'stefe',
        key: 'liebertee'
    }],
    sites: [{
        pattern: 'facebook'
    }, {
        pattern: 'meinvz'
    }, {
        pattern: 'studivz'
    }, {
        pattern: '/encrypt-the-cloud-demo.html'
    }]
}

var ports = [];



function setState(state){
    localStorage["state"] = JSON.stringify(state);
    //chrome.browserAction.setBadgeText({text:"on"});
    //console.log("setState");
    $.each(ports, function(i, port){
        postState(port);
    });
}

function getState(){
    try {
        return JSON.parse(localStorage["state"]);
    } 
    catch (error) {
        return defaultState;
    }
}

function postState(port){
    console.log("post to" + port)
    port.postMessage({
        method: 'onStateChanged',
        state: getState()
    });
}

chrome.extension.onConnect.addListener(function(port){
    ports.push(port);
    port.onMessage.addListener(function(msg){
        if (msg.method == "getState") {
            postState(port);
        }
    });
    port.onDisconnect.addListener(function(event){
        //console.log("disconnect from" + port);
        removeFromArray(ports, port)
    });
});


//chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo){
//    console.log("Selectec Tab " + tabId);
//    chrome.pageAction.setIcon({
//        tabId: tabId,
//        path: 'icons/icon-19.png'
//    });
//});
