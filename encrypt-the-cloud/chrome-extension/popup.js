$(function(){
	$("#accordion").accordion();
    loadState();
    $('#save').click(function(){
    	saveState();
		window.close()
    })
});


function saveState() {
	var state = chrome.extension.getBackgroundPage().getState();
	state.password = $("#password").val();
	state.username = $("#username").val();
	chrome.extension.getBackgroundPage().setState(state);
}

function loadState() {
	var state = chrome.extension.getBackgroundPage().getState();
	$("#username").val(state.username);
	$("#password").val(state.password);
}