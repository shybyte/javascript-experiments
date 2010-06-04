var textWrapperRegExp = /{{(.*?)::(.*?)}}/g; //
var textWrapperRegExpSingle = /{{(.*?)::(.*?)}}/; //
var state2 = {
    user: {
        username: "shybyte",
        key: "secret",
    },
    friends: [{
        username: 'stefe',
        key: 'liebertee'
    }],
    sites: [{
        domainPart: 'google'
    }, {
        domainPart: 'facebook'
    }, {
        domainPart: 'meinvz'
    }]
};
addUserMap(state2);

function getState(){
    return state2;
}

function addUserMap(state){
    var map = {};
    $.each(state.friends, function(i, friend){
        map[friend.username] = friend;
    });
    map[state.user.username] = state.user;
    state.userByName = map;
    //console.log(state)
}

function getPassword(username){
    var user = getState().userByName[username];
    if (user) {
        return user.key;
    }
    else {
        return null;
    }
}

function getUserPassword(){
    return getState().user.key;
}

function getUsername(){
    return getState().user.username;
}

function getImagePath(filename){
    return "images/" + filename;
}

function isEncrypted(s){
    parts = textWrapperRegExpSingle.exec(s.trim());
    return parts != null;
}

function decryptText(textWrapper){
    // {{marco::endcryptedText}}
    parts = textWrapperRegExpSingle.exec(textWrapper.trim());
    if (parts != null) {
        var username = parts[1];
        var text = parts[2];
        var key = getPassword(username)
        if (key) {
            return AesCtr.decrypt(removeSpaces(text), getPassword(username), 256);
        }
        else {
            throw "UNKNOWN_USER";
        }
    }
    else {
        alert("No correct encrypted text '" + textWrapper + "'");
        return null;
    }
}

function encryptText(text){
    encryptedText = addSpaces(AesCtr.encrypt(text, getUserPassword(), 256));
    return "{{" + getUsername() + "::" + encryptedText + "}}";
}

function isDiv(el){
    return el.nodeName.toLowerCase() == "div";
}

function getTextBoxText(textbox){
    var el = textbox[0];
    if (isDiv(el)) {
        return el.innerText;
    }
    else {
        return textbox.val()
    }
}

function setTextBoxText(textbox, text){
    var el = textbox[0];
    if (isDiv(el)) {
        return el.innerText = text;
    }
    else {
        return textbox.val(text)
    }
}

function toogleTextboxEncryption(textbox){
    text = getTextBoxText(textbox)
    if (isEncrypted(text)) {
        decryptedText = decryptText(text);
        if (decryptedText != null) {
            setTextBoxText(textbox, decryptedText)
        }
    }
    else {
        if (text.trim().length > 0) {
            setTextBoxText(textbox, encryptText(text))
        }
        else {
            alert("Nothing to encrypt!");
        }
    }
}

function decryptBodyText(){
    $('body').textNodes().each(function(i, e){
        html = e.data
        if (!html) {
            return;
        }
        contenteditable = e.parentNode.getAttribute('contenteditable');
        if (contenteditable == 'true') {
            return;
        }
        if (textWrapperRegExp.test(html)) {
            try {
                html2 = html.replace(textWrapperRegExp, decryptText)
                e.data = html2
                $(e.parentNode).effect("highlight", {}, 3000);
            } 
            catch (ex) {
                if (ex == 'UNKNOWN_USER') {
                    //					$(e.parentNode).effect("highlight", {
                    //						color: '#ff0000'
                    //					}, 500);
                }
                else {
                    throw ex;
                }
            }
        }
    });
}

function styleTextBox(textarea){
    var originalWidth = textarea.width();
    var originalInnerWidth = textarea.innerWidth();
    textarea.css('paddingLeft', '0');
    var originalLeftPadding = originalInnerWidth - textarea.innerWidth();
    var leftPadding = 16;
    var newWidth = originalWidth + originalLeftPadding - leftPadding;
    textarea.width(newWidth);
    textarea.css('padding-left', leftPadding + 'px');
    textarea.css('background', 'no-repeat url(' + getImagePath('decrypted.png') + ')');
}

function timer(){
    decryptBodyText();
    $('textarea,input:text,div[contenteditable=true]').each(function(i, e){
        textarea = $(e);
        if (!textarea.data('found')) {
            textarea.dblclick(function(event){
                if (encryptTheCloudIsActive) {
                    toogleTextboxEncryption($(this));
                }
            });
            textarea.data('found', true);
        }
    });
}

var encryptTheCloudTimer
var encryptTheCloudIsActive = false

function startEncryptTheCloud(){
    if (!encryptTheCloudIsActive) {
        encryptTheCloudTimer = window.setInterval(timer, 1000)
        encryptTheCloudIsActive = true;
    }
}

function stopEncryptTheCloud(){
    if (encryptTheCloudIsActive) {
        encryptTheCloudTimer = window.clearInterval(encryptTheCloudTimer);
        encryptTheCloudIsActive = false;
    }
}

function runEncryptTheCloudOnce(){
    window.setTimeout(timer, 1000);
}



