copy %1\*.html
copy %1\*.js
copy %1\*.map
copy %1\*.css
copy %1\*.json
copy %1\*.config
robocopy %1\Images Images /E
robocopy %1\Resources Resources /E

git add *.html *.js *.css *.json *.map
git commit -m "deploy"
git push