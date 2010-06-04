$.fn.textNodes = function(){
    var ret = [];
    
    (function(el){
        if ((el.nodeType == 3) || (el.nodeName == "BR")) 
            ret.push(el);
        else 
            for (var i = 0; i < el.childNodes.length; ++i) 
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

function removeFromArray(a, element){
    pos = -1;
    for (var i = 0; i < a.length; i++) {
        if (a[i] == element) {
            pos = i;
            break;
        }
    }
    if (pos >= 0) {
        for (var i = pos; i < a.length - 1; i++) {
            a[i] = a[i + 1];
        }
        a.pop();
    }
}


function exist(array, predicate){
    for (var i = 0; i < array.length; i++) {
        if (predicate(array[i])) {
            return true;
        }
    }
    return false
}

function isEnabledForSite(state, location){
    return exist(state.sites, function(site){
        return isSitePatternMatchingLocation(site.pattern,location)
    });
}

function isSitePatternMatchingLocation(sitePattern, location){
	if (sitePattern.indexOf('/')>=0) {
		return location.href.indexOf(sitePattern) >= 0;
	} else {
	    return location.host.indexOf(sitePattern) >= 0;    
	}
}
