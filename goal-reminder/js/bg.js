const defaultState = {
    active: true,
    countDownLengthInMinutes: 15,
    enableTTS: true,
    goals: [{
        title: 'Become a Superman!',
        text: 'Do 20 Push-Ups.'
    },
    {
        title: 'Become a Rock Star!',
        text: 'Play one Song.'
    }]
}

var currentState;

var countDown;
var showingNotification = false;

function setState(state){
    currentState = state;
    localStorage["state"] = JSON.stringify(state);
    if (!state.active) {
      chrome.browserAction.setBadgeText({
          text: ""
      });
    }
}



function getState(){
    if (currentState == null){
        currentState = readState()
    }
    return currentState;
}

function readState(){
    try{
        return JSON.parse(localStorage["state"]);
    }
    catch(error){
        return defaultState;
    }
}

function showMessage(title, message){
    var iconUrl = '../images/icon.png';
    var notification = webkitNotifications.createNotification(iconUrl, title, message);
    notification.onclose = restartCountDown;
    notification.onerror = restartCountDown;
    notification.ondisplay = function () {
        onDisplayMessage(title,message);
    };
    notification.show();
}

function onDisplayMessage(title,message) {
    if (currentState.enableTTS) {
        chrome.tts.speak(title+message);
    }
}

function showGoalMessage(goal){
    showMessage(goal.title, goal.text);
    showingNotification = true;
}

function showRandomGoal(){
    var state = getState();
    var goals = state.goals;
    if (goals.length > 0){
        var randomGoalIndex = Math.floor(goals.length * Math.random());
        showGoalMessage(goals[randomGoalIndex]);
    }
}

function restartCountDown(){
    countDown = (getState().countDownLengthInMinutes + 1) * 60 - 1;
    showingNotification = false;
}

function onEverySecond(){
    if (getState().active) {
      countDown--;
      var minutes = Math.floor(countDown / 60);
      if (minutes <= 0 && !showingNotification){
          showRandomGoal();
      }
      chrome.browserAction.setBadgeText({
          text: "" + minutes
      });
    }
}

function init(){
    restartCountDown();
    setInterval(onEverySecond, 1000);
}

$(document).ready(function(){
    init();
});
