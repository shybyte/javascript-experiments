const defaultState = {
		username: "shybyte",
		key: "secret",
		friends: [{
			password: 'stefe',
			key: 'liebertee'
		}]
};


function setState(state) {
	localStorage["state"] = JSON.stringify(state);
}

function getState() {
	try {
		return JSON.parse(localStorage["state"]);
	}
	catch (error) {
		return defaultState;
	}
}

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.method == "getPassWord")
      sendResponse({result: "test"});
    else
      sendResponse({}); // snub them.
  });
  
  