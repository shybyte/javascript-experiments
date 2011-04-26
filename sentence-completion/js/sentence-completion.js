$(function() {
	var sentenceSearcher = {
		search : function(query, onResult) {
			console.log(query);
			onResult([
					"Das ist ein langer toller Satz.",
					"Das ist ein langer, langer, langer, langer, langer, langer toller Satz.",
					"Das ist kurz.", "Das ist ein langer toller Satz." ]);
		}
	}

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
	var CURSOR_MARKER_TEXT = "\u200B";
	var CURSOR_MARKER_HTML = '<span id="cursorMarker">' + CURSOR_MARKER_TEXT
			+ "</span>";
	var $editor = $(editor);
	var popup = createSentenceSelectionPopup(onPopupClose,
			onPopupSentenceSelected);
	var isCompletionRunning = false;

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

		var currentSentence = findCurrentSentence()[0];

		var cursorMakerOffset = findCursorMarkerScreenOffset();
		var height = findCursorMarker().height();
		var popupOffset = $.extend({}, cursorMakerOffset, {
			top : cursorMakerOffset.top + height
		});

		sentenceSearcher.search(currentSentence, function(sentencesResult) {
			popup.show(popupOffset, sentencesResult);
		});

	}

	function onPopupClose() {
		isCompletionRunning = false;
		removeCusorMarker();
	}

	function onPopupSentenceSelected(sentence) {
		onPopupClose();
		console.log(sentence);
	}

	function addCusorMarker() {
		insertHtmlAtCursor(CURSOR_MARKER_HTML);
	}

	function removeCusorMarker() {
		$("#cursorMarker").remove();
	}

	function findCurrentSentence() {
		var text = $editor.text();
		var searchRegExp = new RegExp("(^|\\.)[^\\.]*\\" + CURSOR_MARKER_TEXT);
		var sentenceMatch = searchRegExp.exec(text);
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

	function createSentenceSelectionPopup(onCloseHandler,
			onSentenceSelectedHandler) {
		var $popup = $('<div class="sentenceCompletionPopup" style="display:none">Hallo</div>');
		var selectedIndex = 0;
		var sentences = [];

		$('body').append($popup);

		function setSelected(i) {
			$('.sentence:eq(' + selectedIndex + ')', $popup).removeClass(
					'selected');
			selectedIndex = (sentences.length + i) % sentences.length;
			$('.sentence:eq(' + selectedIndex + ')', $popup).addClass(
					'selected');
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
			switch (e.keyCode) {
			case 38:
				popup.cursorUp();
				break;
			case 40:
				popup.cursorDown();
				break;
			case 27:
				$popup.hide();
				onCloseHandler();
				break;
			case 13:
				$popup.hide();
				onSentenceSelectedHandler(sentences[selectedIndex]);
				break;
			}
			return false;
		}

		return {
			show : function(offset, newSentences) {
				setSentences(newSentences);
				setSelected(0);
				$popup.show();
				$popup.offset(offset);
			},

			keydown : keydown,

			cursorUp : function() {
				setSelected(selectedIndex - 1);
			},

			cursorDown : function() {
				setSelected(selectedIndex + 1);
			},

			hide : function() {
				$popup.hide();
			}
		};
	}
}
