function tryToShowMessage(title,message){
    if (webkitNotifications.checkPermission()==0){
      showMessage();
    } else {
        webkitNotifications.requestPermission(function(){
            if (webkitNotifications.checkPermission()==0){
                showMessage(title,message);
            }
        });
    }
}

function showMessage(title,message){
    var iconUrl = '../images/icon.png';
    var notification = webkitNotifications.createNotification(iconUrl,title,message);
    notification.show();
}

function init(){
  showMessage("Goal Reminder","Make some sport!");
}

$(document).ready(function(){
    //init();
});
