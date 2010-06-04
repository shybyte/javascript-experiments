const defaultState = {
    username: "shybyte",
    key: "secret",
    friends: [{
        password: 'stefe',
        key: 'liebertee'
    }],
    sites: ['google', 'facebook', 'meinvz']
};

var ports = [];



function setState(state){
    localStorage["state"] = JSON.stringify(state);
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
		removeFromArray(ports,port)
    });
});
