@echo on

set cur=%cd%
::创建外链文件夹
set CLIENT_ASSETS=%cur%\project\resource\assets
cd..
cd..
cd..
set raw=%cd%
::链接地址
set SOURCE_ASSETS=%raw%\xiyouH5\project\assets\dev

echo %CLIENT_ASSETS%

if exist %CLIENT_ASSETS% (
	echo "已经存在文件夹"
) else (
	echo "链接文件夹" %CLIENT_ASSETS%
	mklink /J %CLIENT_ASSETS% "%SOURCE_ASSETS%"
)

rem mklink /J "client\project\resource\assets" "resource\assets"

pause