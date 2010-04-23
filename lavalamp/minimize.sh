#!/bin/sh
java -jar ../../opt/clojure-compiler/compiler.jar --js lavalamp.js  --compilation_level ADVANCED_OPTIMIZATIONS --js_output_file lavalamp-min.js  --summary_detail_level 3 --warning_level  VERBOSE
ls -ls