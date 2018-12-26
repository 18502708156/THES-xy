svn up ..\..\resource\assets
cmd /c egret publish ../project --version buyaogenwochongming
rmdir ..\..\game /s /q
:check
@if exist ..\..\game (
	@echo 删除game文件夹失败，任意键重试
	@pause
	rmdir ..\..\game /s /q
	goto check
)
move ..\project\bin-release\web\buyaogenwochongming ..\..\game
TortoiseProc /command:commit /path:"..\..\game" /logmsg:"提交新版本" /closeonend:0