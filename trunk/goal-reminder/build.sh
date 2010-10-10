zipFile="builds/goal-reminder.zip"
rm $zipFile
zip -r $zipFile images crx js lib manifest.json -x"*.svn*" -x"*.tmp_*" -x"*replace.js*" -x"*jquery.js*"