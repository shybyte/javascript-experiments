rm builds/encrypt-the-cloud-cxt.zip
zip -r builds/encrypt-the-cloud-cxt.zip chrome-extension js lib manifest.json -x"*.svn*" -x"*.tmp_*" -x"*replace.js*" -x"*jquery.js*"