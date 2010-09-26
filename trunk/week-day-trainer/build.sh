rm -r build

mkdir build
mkdir build/js
mkdir build/js/flot
mkdir build/css

cp index.html build
cp favicon.ico build
cp apple-touch-icon.png build

cp css/style.css build/css

cp js/modernizr.min.js build/js
cp js/gears_init.min.js build/js
cp js/jquery.min.js build/js
cp js/script.min.js build/js
cp js/flot/excanvas.min.js build/js/flot

cp offline.manifest build
cp offline-manifest-gears.json build