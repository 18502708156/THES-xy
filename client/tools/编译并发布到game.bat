svn up ..\..\resource\assets
cmd /c egret publish ../project --version buyaogenwochongming
rmdir ..\..\game /s /q
:check
@if exist ..\..\game (
	@echo ɾ��game�ļ���ʧ�ܣ����������
	@pause
	rmdir ..\..\game /s /q
	goto check
)
move ..\project\bin-release\web\buyaogenwochongming ..\..\game
TortoiseProc /command:commit /path:"..\..\game" /logmsg:"�ύ�°汾" /closeonend:0