$(function() {
    var sentenceSearcher = {
        search: function(query, onResult) {
            console.log(query);
            onResult([ "Das ist ein langer toller Satz.",
                    "Das ist ein langer, langer, langer, langer, langer, langer toller Satz.", "Das ist kurz.",
                    "Das ist ein langer toller Satz." ]);
        }
    };

    $('#textEditor').each(function() {
        addSentenceCompletion(this, sentenceSearcher);
        $(this).focus();
    });
});

/**
 * @param editor
 *            an contenteditable="true" (no textarea or input)
 */
function addSentenceCompletion(editor, sentenceSearcher) {
    //var CURSOR_MARKER_TEXT = "\u200B";
    var CURSOR_MARKER_TEXT = "§";
    var CURSOR_MARKER_HTML = '<span id="cursorMarker">' + CURSOR_MARKER_TEXT + "</span>";
    var $editor = $(editor);
    var popup = createSentenceSelectionPopup(onPopupClose, onPopupSentenceSelected);
    var isCompletionRunning = false;
    var editorText = getEditorText();
    var currentSentenceMatch = null;
    var id = 0;

    $(editor).keydown(function(e) {
        if (isCompletionRunning) {
            return popup.keydown(e);
        } else if (e.keyCode == 32 && e.ctrlKey) {
            onPressCompletionKey();
        }
        return true;
    });

    function onPressCompletionKey() {
        isCompletionRunning = true;
        addCusorMarker();

        editorText = getEditorText();
        console.log(editorText);

        currentSentenceMatch = findCurrentSentence(editorText);
        var currentSentence = currentSentenceMatch[3];

        var cursorMakerOffset = findCursorMarkerScreenOffset();
        var height = findCursorMarker().height();
        var popupOffset = $.extend({}, cursorMakerOffset, {
            top: cursorMakerOffset.top + height
        });

        sentenceSearcher.search($.trim(currentSentence.replace(/\n/g, ' ')), function(sentencesResult) {
            popup.show(popupOffset, sentencesResult);
        });

    }

    function escapeHtml(html) {
        return html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function getEditorText() {
        var html = $editor.html();
        var myLineBreak = String.fromCharCode(0xF8D0);
        html = html.replace(/<br[^>]*><div>/ig, myLineBreak).replace(/<br[^>]*>/ig, myLineBreak);
        html = html.replace(/<\/div>/ig, '').replace(/<div>/ig, myLineBreak).replace(/<\/p>/ig, myLineBreak);
        var $tempDiv = jQuery('<div/>').html(html);
        var text = $tempDiv.text().replace(new RegExp(myLineBreak, 'g'), '\n');
        return text;
    }

    function onPopupClose() {
        isCompletionRunning = false;
        removeCusorMarker();
    }

    function onPopupSentenceSelected(sentence) {
        console.log(sentence);
        var replaceIndexStart = currentSentenceMatch.index + currentSentenceMatch[1].length +
                currentSentenceMatch[2].length;
        console.log("space match ='"+currentSentenceMatch[2]+"'");

        var sentenceSpanId = "sentence"+(id++);
        var sentenceSpan = '<span id="'+sentenceSpanId+'">'+escapeHtml(sentence)+'</span>';
        
        editorText = escapeHtml(editorText.substr(0, replaceIndexStart)) + sentenceSpan +
                escapeHtml(editorText.substr(replaceIndexStart + currentSentenceMatch[3].length+1));
        $editor.html(editorText);
        isCompletionRunning = false;
        
        var $sentenceSpan = $('#'+sentenceSpanId,$editor);
        var sel = window.getSelection();
        sel.collapse($sentenceSpan.get(0), 1);
        
    }

    function addCusorMarker() {
        insertHtmlAtCursor(CURSOR_MARKER_HTML);
    }

    function removeCusorMarker() {
        $("#cursorMarker").remove();
    }

    function findCurrentSentence(text) {
        var searchRegExp = new RegExp("(^|\\.)(\\s*)([^\\.]*?)\\" + CURSOR_MARKER_TEXT, "m");
        var sentenceMatch = searchRegExp.exec(text);
        console.log(sentenceMatch);
        return sentenceMatch;
    }

    function findCursorMarkerScreenOffset() {
        var $cursorMarker = findCursorMarker();
        return $cursorMarker.offset();
    }

    function findCursorMarker() {
        return $("#cursorMarker");
    }

    function insertNodeAtCursor(node) {
        var sel, range, html;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                sel.getRangeAt(0).insertNode(node);
            }
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            html = (node.nodeType == 3) ? node.data : node.outerHTML;
            range.pasteHTML(html);
        }
    }

    function insertHtmlAtCursor(html) {
        var sel, range, node;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = window.getSelection().getRangeAt(0);
                node = range.createContextualFragment(html);
                range.insertNode(node);
            }
        } else if (document.selection && document.selection.createRange) {
            document.selection.createRange().pasteHTML(html);
        }
    }

    function createSentenceSelectionPopup(onCloseHandler, onSentenceSelectedHandler) {
        var $popup = $('<div class="sentenceCompletionPopup" style="display:none">Hallo</div>');
        var selectedIndex = 0;
        var sentences = [];

        $('body').append($popup);

        function setSelected(i) {
            $('.sentence:eq(' + selectedIndex + ')', $popup).removeClass('selected');
            selectedIndex = (sentences.length + i) % sentences.length;
            $('.sentence:eq(' + selectedIndex + ')', $popup).addClass('selected');
        }

        function setSentences(newSentences) {
            sentences = newSentences;
            $popup.empty();
            $.each(sentences, function(i, sentence) {
                $popup.append($('<div class="sentence"/>').text(sentence));
            });
        }

        function keydown(e) {
            e.preventDefault();
            console.log(e.keyCode);
            switch (e.keyCode) {
            case 38:
                setSelected(selectedIndex - 1);
                break;
            case 40:
                setSelected(selectedIndex + 1);
                break;
            case 27:
                $popup.hide();
                onCloseHandler();
                break;
            case 39:
            case 13:
                $popup.hide();
                onSentenceSelectedHandler(sentences[selectedIndex]);
                break;
            }
            return false;
        }

        return {
            show: function(offset, newSentences) {
                setSentences(newSentences);
                setSelected(0);
                $popup.show();
                $popup.offset(offset);
            },

            keydown: keydown

        };
    }
}
