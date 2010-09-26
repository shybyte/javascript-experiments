const defaultState = {
    goals: [{
        title: 'Become a super man!',
        text: '20 PushUps'
    }, {
        title: 'Become a RockStar!',
        text: 'Play one Song.'
    }]
}

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
    notification.onclose = scheduleNextNotification;
    notification.onerror = scheduleNextNotification;
    notification.show();
}

function showGoalMessage(goal){
     showMessage(goal.title,goal.text);
}

function showRandomGoal(){
  var state = getState();
  var goals = state.goals;
  if (goals.length>0) {
    var randomGoalIndex = Math.floor(goals.length*Math.random()); 
    showGoalMessage(goals[randomGoalIndex]);
  }
}

function scheduleNextNotification(){
  setTimeout(showRandomGoal,25*60*1000);
}

function init(){
  scheduleNextNotification();
}

$(document).ready(function(){
    init();
});
