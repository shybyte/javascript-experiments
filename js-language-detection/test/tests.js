module("analyzeText");

test("Empty String", function() {
	var fingerPrint = languageDetection.analyzeText("");
	deepEqual(fingerPrint.nGramFrequencies, [ [ '_', 1 ] ]);
});

test("1-Gram", function() {
	var fingerPrint = languageDetection.analyzeText("acccbb", 1, 1);
	deepEqual(fingerPrint.nGramFrequencies, [ [ "c", 3 ], [ "b", 2 ],
			[ "_", 1 ], [ "a", 1 ] ]);
});

test("Hallo Hase.", function() {
	var fingerPrint = languageDetection.analyzeText("Hallo Hase.");

	deepEqual(fingerPrint.nGramFrequencies, [ [ "H", 2 ], [ "_", 2 ],
			[ "a", 2 ], [ "l", 2 ], [ "Ha", 2 ], [ "_H", 2 ], [ "_Ha", 2 ],
			[ ".", 1 ], [ "e", 1 ], [ "o", 1 ], [ "s", 1 ], [ "._", 1 ],
			[ "al", 1 ], [ "as", 1 ], [ "e.", 1 ], [ "ll", 1 ], [ "lo", 1 ],
			[ "o_", 1 ], [ "se", 1 ], [ "Hal", 1 ], [ "Has", 1 ], [ "all", 1 ],
			[ "ase", 1 ], [ "e._", 1 ], [ "llo", 1 ], [ "lo_", 1 ],
			[ "se.", 1 ], [ "Hall", 1 ], [ "Hase", 1 ], [ "_Hal", 1 ],
			[ "_Has", 1 ], [ "allo", 1 ], [ "ase.", 1 ], [ "llo_", 1 ],
			[ "se._", 1 ], [ "Hallo", 1 ], [ "Hase.", 1 ], [ "_Hall", 1 ],
			[ "_Hase", 1 ], [ "allo_", 1 ], [ "ase._", 1 ] ]);
});

test("abccc and abcd", function() {
	var fingerPrint1 = languageDetection.analyzeText("abccc");
	var fingerPrint2 = languageDetection.analyzeText("abcd");
	deepEqual(fingerPrint1.nGramFrequencies, [ [ "c", 3 ], [ "cc", 2 ],
			[ "_", 1 ], [ "a", 1 ], [ "b", 1 ], [ "_a", 1 ], [ "ab", 1 ],
			[ "bc", 1 ], [ "c_", 1 ], [ "_ab", 1 ], [ "abc", 1 ], [ "bcc", 1 ],
			[ "cc_", 1 ], [ "ccc", 1 ], [ "_abc", 1 ], [ "abcc", 1 ],
			[ "bccc", 1 ], [ "ccc_", 1 ], [ "_abcc", 1 ], [ "abccc", 1 ],
			[ "bccc_", 1 ] ]);
	deepEqual(fingerPrint2.nGramFrequencies, [ [ "_", 1 ], [ "a", 1 ],
			[ "b", 1 ], [ "c", 1 ], [ "d", 1 ], [ "_a", 1 ], [ "ab", 1 ],
			[ "bc", 1 ], [ "cd", 1 ], [ "d_", 1 ], [ "_ab", 1 ], [ "abc", 1 ],
			[ "bcd", 1 ], [ "cd_", 1 ], [ "_abc", 1 ], [ "abcd", 1 ],
			[ "bcd_", 1 ], [ "_abcd", 1 ], [ "abcd_", 1 ] ]);

});

module("distance");

test("distanceToFingerPrint", function() {
	var fingerPrint1 = languageDetection.analyzeText("abccc");
	var fingerPrint2 = languageDetection.analyzeText("abcd");

	equal(fingerPrint1.distanceToFingerPrint(fingerPrint1), 0);
	equal(fingerPrint2.distanceToFingerPrint(fingerPrint2), 0);
	equal(fingerPrint1.distanceToFingerPrint(fingerPrint2), 227);
	equal(fingerPrint2.distanceToFingerPrint(fingerPrint1), 207);
});

module("detectLanguage");

function assertLanguage(text,lang) {
	equal(languageDetection.detectLanguage(text),lang);
}

test("detectLanguage", function() {
	languageDetection.setFingerPrintData('en',en);
	languageDetection.setFingerPrintData('de',de);
	
	assertLanguage("Das ist ein Test.","de");
	assertLanguage("This is a test.","en");
	
	assertLanguage("Hallo wie gehts Dir?","de");
	assertLanguage("Hello, how are you?","en");

});