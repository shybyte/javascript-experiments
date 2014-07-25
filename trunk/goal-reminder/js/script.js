function showMessage(title,message){
    var iconUrl = '../images/icon.png';
    var notification = chrome.notifications.create(null,{
      type: 'basic',
      title: title,
      message: message,
      iconUrl: iconUrl
    });
}

function init(){
  showMessage("Goal Reminder","Make some sport!");
}

$(document).ready(function(){
    //init();
});
