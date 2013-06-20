zipFile="builds/goal-reminder.zip"
rm $zipFile
zip -r $zipFile images crx js manifest.json -x"*.svn*" -x"*.tmp_*" -x"*jquery.js*"