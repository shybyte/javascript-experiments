var textWrapperRegExp = /{{.*?::(.*?)}}/g; //
var textWrapperRegExpSingle = /{{.*?::(.*?)}}/; //
var username = "marco"

function decryptText(textWrapper){
	// {{marco::endcryptedText}}
	parts = textWrapperRegExpSingle.exec(textWrapper.trim());
	if (parts != null) {
		var text = parts[1];
		return AesCtr.decrypt(text, "test", 256);
	}
	else {
		alert("No correct encrypted text '" + textWrapper+"'");
		return null;
	}	
}

function encryptText(text){
    return "{{"+username+"::"+AesCtr.encrypt(text, "test", 256)+"}}";
}

function toogleTextboxEncryption(textbox){
	if (textbox.data('encypted')==true) {
		decryptedText = decryptText(textbox.val())
		if (decryptedText != null) {
			textbox.val(decryptedText);
		}
		textbox.css('background-image', 'url(image/decrypted.png)');
		textbox.data('encypted',false)
	} else {
		text = textbox.val()
		if (text.trim().length > 0) {
			textbox.val(encryptText(textbox.val()));
			textbox.css('background-image', 'url(image/encrypted.png)');
			textbox.data('encypted', true)
		} else {
			alert("Nothing to encrypt!");
		}
	}
}

$(document).ready(function(){
	$('body').each(function(i,e) {
		html = e.innerHTML
		html = html.replace(textWrapperRegExp,decryptText)
		e.innerHTML=html
	});
	var textareas = $('textarea')
    textareas.css('padding-left', '22px');
	textareas.css('background', 'no-repeat url(image/decrypted.png)');
	textareas.click(function(event){
			var x = event.pageX - this.offsetLeft;
			var y = event.pageY - this.offsetTop;
			if (x<20 && y<20) {
				toogleTextboxEncryption($(this));
			}
	});
    
    $('#encrypt').click(function(){
        encryptedText = encryptText($('#in').val())
        $('#out').val(encryptedText);
    });
});
