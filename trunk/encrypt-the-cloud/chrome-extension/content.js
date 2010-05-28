var passwort = ""

function getImagePath(filename){
	return chrome.extension.getURL("images/"+filename);
}

chrome.extension.sendRequest({method: 'getPassWord'}, function(response) {
		console.log(response.result);
});


startEncryptTheCloud()

