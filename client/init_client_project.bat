@echo off

set CLIENT_ASSETS=project\resource\assets

echo %CLIENT_ASSETS%

if exist %CLIENT_ASSETS% (
	echo "已经存在文件夹"
) else (
	echo "链接文件夹" %CLIENT_ASSETS%
	mklink /J %CLIENT_ASSETS% "..\assets\dev"
)

rem mklink /J "client\project\resource\assets" "resource\assets"


pause