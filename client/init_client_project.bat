@echo on

set cur=%cd%
::���������ļ���
set CLIENT_ASSETS=%cur%\project\resource\assets
cd..
cd..
cd..
set raw=%cd%
::���ӵ�ַ
set SOURCE_ASSETS=%raw%\xiyouH5\project\assets\dev

echo %CLIENT_ASSETS%

if exist %CLIENT_ASSETS% (
	echo "�Ѿ������ļ���"
) else (
	echo "�����ļ���" %CLIENT_ASSETS%
	mklink /J %CLIENT_ASSETS% "%SOURCE_ASSETS%"
)

rem mklink /J "client\project\resource\assets" "resource\assets"

pause