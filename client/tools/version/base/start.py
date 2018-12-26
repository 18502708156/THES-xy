# coding:utf8

import com.Log as Log

import gen_version.gen_start as gen_start
import gen_version.gen_version_code as gen_version_code
import gen_version.Md5Operate as md5
import os
import sys

sys.path.append(os.path.dirname(__file__) + "/../")
# sys.path.append(os.path.dirname(__file__) + "/../../")
from config import *
from run import *
                
def Exec():
    
    curVersion = gen_version_code.GetMaxVersion(OUT_DIR)

    Log.Info("当前版本号 => " + str(curVersion))

    versionDir = os.path.join(OUT_DIR, str(curVersion))
    if not os.path.exists(versionDir):
        Log.Info("not version dir!!! " + versionDir)
        exit()

    gen_start.Start(versionDir, PROJECT_DIR, curVersion, OUT_DIR)

    # input = Log.RawInput("版本信息是否提交SVN！！！(y/n)")
    # if input != "Yes":
    #     md5.copyMD5File(OUT_DIR,VER_DIR)
    #     ret = md5.svncommit()
    #     if(ret==0):
    #         print '---------------commit svn success'
    #     else:
    #         print '---------------commit svn fail'


def Start():
    # md5.copyMD5File(VER_DIR,OUT_DIR)
    input = Log.RawInput("开始！！！(Yes/N)")
    if input != "Yes":
        print("exit!!!")
        exit()

    if globals().has_key("UP_GAME_CODE"):
        import start_up

    Exec()