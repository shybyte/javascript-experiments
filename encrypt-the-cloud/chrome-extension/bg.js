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