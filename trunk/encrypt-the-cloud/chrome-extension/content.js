var state
var started = false;

function setState(newState){
    addUserMap(newState);
    state = newState;
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
        if (!started) {
            started = true;
            startEncryptTheCloud();
        }
    }
});







