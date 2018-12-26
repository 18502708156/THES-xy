# coding:utf8

import gen_version.gen_start as gen_start
import gen_version.gen_version_code as gen_version_code
import com.Log as Log
import os
import sys

sys.path.append(os.path.dirname(__file__) + "/../")
from config import *
from run import *

input = Log.RawInput("提升版本号！！！(Y/N)")
newVersion = input == "Y"

curVersion = gen_version_code.GetMaxVersion(OUT_DIR)
Log.Info("当前版本号 => " + str(curVersion))
if newVersion:
    curVersion = curVersion + 1

    Log.Info("新建版本号 => " + str(curVersion))
    path = os.path.join(OUT_DIR, str(curVersion))
    Log.Info("out dir => " + path)
    os.makedirs(path)
else:
    pass
