var state

function setState(newState){
    state = newState;
    if (isEnabledForCurrentSite(state)) {
    	addUserMap(newState);
        startEncryptTheCloud()
    }
    else {
        stopEncryptTheCloud()
    }
}

function isEnabledForCurrentSite(state){
    return isEnabledForSite(window.location.host);
}

function getState(){
    return state;
}

function getImagePath(filename){
    return chrome.extension.getURL("images/" + filename);
}

var port = chrome.extension.connect();
port.postMessage({
    method: 'getState'
});

port.onMessage.addListener(function(msg){
    if (msg.method == "onStateChanged") {
        setState(msg.state)
    }
});







