var textWrapperRegExp = /{{.*?::(.*?)}}/g; //
var textWrapperRegExpSingle = /{{.*?::(.*?)}}/; //

var username = "marco"

$.fn.textNodes = function() {
    var ret = [];

    (function(el){
        if ((el.nodeType == 3)||(el.nodeName =="BR"))
            ret.push(el);
        else
            for (var i=0; i < el.childNodes.length; ++i)
                arguments.callee(el.childNodes[i]);
    })(this[0]);
    return $(ret);
}

function addSpaces(s){
    var result = "";
    for (var i = 0; i < s.length; i++) {
        result += s.charAt(i)
        if ((i + 1) % 7 == 0) {
            result += " ";
        }
    }
    return result;
}

function removeSpaces(s){
    return s.replace(/[ ]/g, '');
}

function getPassword(username){
    return "test";
}

function getUserPassword(){
    return "test";
}

function getImagePath(filename){
	return "images/"+filename;
}

function decryptText(textWrapper, password){
    // {{marco::endcryptedText}}
    parts = textWrapperRegExpSingle.exec(textWrapper.trim());
    if (parts != null) {
        var text = parts[1];
        return AesCtr.decrypt(removeSpaces(text), getPassword(), 256);
    }
    else {
        alert("No correct encrypted text '" + textWrapper + "'");
        return null;
    }
}

function encryptText(text){
    encryptedText = addSpaces(AesCtr.encrypt(text, getUserPassword(), 256));
    return "{{" + username + "::" + encryptedText + "}}";
}

function isDiv(el){
	return el.nodeName.toLowerCase()=="div";
}

function getTextBoxText(textbox){
	var el=textbox[0];
	if (isDiv(el)) {
		return el.innerText;
	} else {
		return textbox.val()	
	}
}

function setTextBoxText(textbox,text){
	var el=textbox[0];
	if (isDiv(el)) {
		return el.innerText=text;
	} else {
		return textbox.val(text)	
	}
}

function toogleTextboxEncryption(textbox){
    text = getTextBoxText(textbox)
    if (textbox.data('encypted') == true) {
        decryptedText = decryptText(text);
        if (decryptedText != null) {
			setTextBoxText(textbox,decryptedText)
        }
		textbox.css('background-image', 'url('+getImagePath('decrypted.png')+')');
        textbox.data('encypted', false)
    }
    else {
        if (text.trim().length > 0) {
			setTextBoxText(textbox,encryptText(text))
            textbox.css('background-image', 'url('+getImagePath('encrypted.png')+')');
            textbox.data('encypted', true)
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
		if (contenteditable=='true') {
			return;
		}
        html = html.replace(textWrapperRegExp, decryptText)
        e.data = html
    });
}

function styleTextBox(textarea){
	var originalWidth = textarea.width();
	var originalInnerWidth = textarea.innerWidth();
	textarea.css('paddingLeft','0');
	var originalLeftPadding =  originalInnerWidth-textarea.innerWidth();
	var leftPadding = 16;
	var newWidth =  originalWidth+originalLeftPadding-leftPadding;
	textarea.width(newWidth);
	textarea.css('padding-left', leftPadding+'px');
	textarea.css('background', 'no-repeat url('+getImagePath('decrypted.png')+')');
}

function timer(){	
	decryptBodyText();
    $('textarea,input:text,div[contenteditable=true]').each(function(i, e){
        textarea = $(e);
        if (!textarea.data('found')) {
			styleTextBox(textarea)
			var clickHandler = function(event){
                var x = event.pageX - this.offsetLeft;
                var y = event.pageY - this.offsetTop;
                if (x < 20 && y < 20) {
                    toogleTextboxEncryption($(this));
                }
            };
            textarea.click(clickHandler).dblclick(function(event){
				toogleTextboxEncryption($(this));
			});
            textarea.data('found', true);
        }
    });
}

function startEncryptTheCloud(){
    window.setInterval(timer, 1000)
}

function startEncryptTheCloudOnce(){
    window.setTimeout(timer, 1000)
}



