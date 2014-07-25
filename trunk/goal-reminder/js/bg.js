const defaultState = {
    active: true,
    countDownLengthInMinutes: 15,
    enableTTS: true,
    goalSelectionMode: "CYCLE_IN_RANDOM_ORDER",
    goals: [{
        title: 'Become a Superman',
        text: 'Do 20 Push-Ups.'
    },
    {
        title: 'Become a Rock Star',
        text: 'Play one Song.'
    }]
}

var currentState;
var countDown;
var lastGoalIndex = 999;
var showingNotification = false;

function goals(){
    return getState().goals;
}

const GoalSelectionMode = {
    RANDOM:{
        getNextGoalIndex:function () {
            lastGoalIndex = Math.floor(goals().length * Math.random());
            return lastGoalIndex;
        }
    },
    CYCLE_IN_ORDER:{
        getNextGoalIndex:function () {
            lastGoalIndex = (lastGoalIndex + 1) % goals().length;
            return lastGoalIndex;
        }
    },
    CYCLE_IN_RANDOM_ORDER:{
        randomOrder : [],
        getNextGoalIndex:function () {
            var goalsLength = goals().length;
            if(this.randomOrder.length == 0) {
                this.randomOrder = createRandomOrder(goalsLength,lastGoalIndex);
            }
            lastGoalIndex = this.randomOrder.splice(0,1)[0];
            return lastGoalIndex<goalsLength ? lastGoalIndex : this.getNextGoalIndex();
        }
    }
}

function setState(state){
    console.log(state);
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
        var loadedState = JSON.parse(localStorage["state"]);
        if (!loadedState.goalSelectionMode) {
            loadedState.goalSelectionMode = defaultState.goalSelectionMode;
        }
        return loadedState;
    }
    catch(error){
        return defaultState;
    }
}

function showMessage(title, message){
    var iconUrl = '../images/icon.png';
    var notification = chrome.notifications.create('goal-reminder',{
      type: 'basic',
      title: title,
      message: message,
      iconUrl: iconUrl,
      priority: 2
    },function () {
      onDisplayMessage(title,message);
    });
}

function onDisplayMessage(title,message) {
    if (currentState.enableTTS) {
        chrome.tts.speak(title+message,currentState.voiceOptions || {});
    }
}

function showGoalMessage(goal){
    showMessage(goal.title, goal.text);
    showingNotification = true;
}

function showNextGoal(){
    var state = getState();
    var goals = state.goals;
    if (goals.length > 0){
        showGoalMessage(goals[getCurrentGoalSelectionMode().getNextGoalIndex()]);
    }
}

function getCurrentGoalSelectionMode(){
    return GoalSelectionMode[getState().goalSelectionMode || ""] || defaultState.goalSelectionMode;
}

function restartCountDown(id,byUser){
    countDown = (getState().countDownLengthInMinutes + 1) * 60 - 1;
    showingNotification = false;
}

function onEverySecond(){
    if (getState().active) {
      countDown--;
      var minutes = Math.floor(countDown / 60);
      if (minutes <= 0 && !showingNotification){
          showNextGoal();
      }
      chrome.browserAction.setBadgeText({
          text: "" + minutes
      });
    }
}

function init(){
    restartCountDown();
    setInterval(onEverySecond, 1000);
    chrome.notifications.onClosed.addListener(restartCountDown);
    chrome.notifications.onClicked.addListener(function (notificationId) {
      chrome.notifications.clear(notificationId,function () {
        restartCountDown();
      });
    });
}

$(document).ready(function(){
    init();
});
