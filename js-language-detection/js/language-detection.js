var languageDetection = function() {
	var fingerPrintByLanguage = {};

	function sortedNGramFrequencies(frequencyByNGram) {
		var nGramFrequencies = [];
		for (nGram in frequencyByNGram) {
			nGramFrequencies.push([ nGram, frequencyByNGram[nGram] ]);
		}

		nGramFrequencies.sort(function(p1, p2) {
			var fDiff = p2[1] - p1[1];
			if (fDiff == 0) {
				var nDiff = p1[0].length - p2[0].length;
				if (nDiff == 0) {
					return p1[0].localeCompare(p2[0]);
				}
				return nDiff;
			}
			return fDiff;
		});

		return nGramFrequencies;
	}

	function countNGrams(text, minN, maxN) {
		var frequencyByNGram = {};

		text = (" " + text + " ").replace(/\s+/g, "_");

		for ( var n = minN; n <= maxN; n++) {
			for ( var i = 0; i < text.length - n + 1; i++) {
				var nGram = text.substr(i, n);

				if (!nGram.match(/.+_.+/)) {
					var f = frequencyByNGram[nGram];
					frequencyByNGram[nGram] = f ? f + 1 : 1;
				}

			}
		}

		if (frequencyByNGram['_'] > 1) {
			frequencyByNGram['_'] = Math.ceil(frequencyByNGram['_'] / 2);
		}
		return frequencyByNGram;
	}

	function getPostionByNGramMap(nGramFrequencies) {
		var map = {};
		var pos = 1;
		var lastFrequency = nGramFrequencies[0][1];
		for ( var i = 0; i < nGramFrequencies.length; i++) {
			var frequency = nGramFrequencies[i][1];
			if (frequency != lastFrequency) {
				lastFrequency = frequency;
				pos++;
			}
			map[nGramFrequencies[i][0]] = pos;
		}
		return map;
	}

	/**
	 * @returns a FingerPrint
	 *          like{frequencyByNGram:{e:123},nGramFrequencies:["e",123],[""]}
	 */
	function analyzeText(text, minN, maxN) {
		minN = minN ? minN : 1;
		maxN = maxN ? maxN : 5;

		var frequencyByNGram = countNGrams(text, minN, maxN);

		return readFingerPrint(sortedNGramFrequencies(frequencyByNGram));
	}

	/**
	 * @returns a FingerPrint
	 */
	function readFingerPrint(nGramFrequencies) {
		var positionByNGram = getPostionByNGramMap(nGramFrequencies);

		function distanceToFingerPrint(otherFingerPrint) {
			var distance = 0;
			var maxI = Math.min(nGramFrequencies.length, 400);
			for ( var i = 0; i < maxI; i++) {
				var nGram = nGramFrequencies[i][0];

				if (typeof otherFingerPrint.positionByNGram[nGram] === 'undefined') {
					distance += otherFingerPrint.nGramFrequencies.length;
				} else {
					distance += Math.abs(positionByNGram[nGram]
							- otherFingerPrint.positionByNGram[nGram]);
				}
			}
			return distance;
		}

		return {
			nGramFrequencies : nGramFrequencies,
			positionByNGram : positionByNGram,
			distanceToFingerPrint : distanceToFingerPrint
		};
	}

	function detectLanguage(text, fingerPrintDataByLanguageMap) {
		var textFingerPrint = analyzeText(text);
		var minDistance = 1.7976931348623157e+308;
		var bestLanguage;
		for (lang in fingerPrintByLanguage) {
			var distance = textFingerPrint.distanceToFingerPrint(fingerPrintByLanguage[lang]);
			if (distance < minDistance) {
				minDistance = distance;
				bestLanguage = lang;
			}
		}
		return bestLanguage;
	}

	return {
		setFingerPrintData : function(lang, fingerPrintData) {
			fingerPrintByLanguage[lang] = readFingerPrint(fingerPrintData);
		},
		detectLanguage : detectLanguage,
		analyzeText : analyzeText
	};

}();