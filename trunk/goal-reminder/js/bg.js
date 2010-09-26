const defaultState = {
    goals: [{
        title: 'Become a super man!',
        text: '20 PushUps'
    }, {
        title: 'Become a RockStar!',
        text: 'Play one Song.'
    }]
}

var countDownLengthInMinutes = 25;
var countDown;
var showingNotification=false;

function setState(state){
    localStorage["state"] = JSON.stringify(state);
}

function getState(){
    try {
        return JSON.parse(localStorage["state"]);
    } 
    catch (error) {
        return defaultState;
    }
}

function showMessage(title,message){
    var iconUrl = '../images/icon.png';
    var notification = webkitNotifications.createNotification(iconUrl,title,message);
    notification.onclose = restartCountDown;
    notification.onerror = restartCountDown;
    notification.show();
}

function showGoalMessage(goal){
     showMessage(goal.title,goal.text);
     showingNotification = true;     
}

function showRandomGoal(){
  var state = getState();
  var goals = state.goals;
  if (goals.length>0) {
    var randomGoalIndex = Math.floor(goals.length*Math.random()); 
    showGoalMessage(goals[randomGoalIndex]);
  }
}

function restartCountDown(){
  countDown = (countDownLengthInMinutes+1)*60-1;
  showingNotification = false;
}

function onEverySecond(){
  countDown--;  
  var minutes = Math.floor(countDown/60);
  if (minutes<=0 && !showingNotification) {    
      showRandomGoal();    
  } 
  chrome.browserAction.setBadgeText({text:""+minutes});
}

function init(){
  restartCountDown();
  setInterval(onEverySecond,1000);
}

$(document).ready(function(){
    init();
});
