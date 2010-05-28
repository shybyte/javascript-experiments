/*
2	 * jQuery replaceText - v1.1 - 11/21/2009
3	 * http://benalman.com/projects/jquery-replacetext-plugin/
4	 * 
5	 * Copyright (c) 2009 "Cowboy" Ben Alman
6	 * Dual licensed under the MIT and GPL licenses.
7	 * http://benalman.com/about/license/
8	 */
9	(function($){$.fn.replaceText=function(b,a,c){return this.each(function(){var f=this.firstChild,g,e,d=[];if(f){do{if(f.nodeType===3){g=f.nodeValue;e=g.replace(b,a);if(e!==g){if(!c&&/</.test(e)){$(f).before(e);d.push(f)}else{f.nodeValue=e}}}}while(f=f.nextSibling)}d.length&&$(d).remove()})}})(jQuery);
