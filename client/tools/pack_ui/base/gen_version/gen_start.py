#coding:utf8

import gen_version_file as gen
import compress_img as com
import util as util
import shutil
import os
import sys
import json

sys.path.append(os.path.dirname(__file__) + "/../")
sys.path.append(os.path.dirname(__file__) + "/../../")
from config import *


def Start(projectDir):
    print("gen_start!!!")
    # 版本路径


    atlasDir = PROJECT_DIR_1
    gen.PackAtals(projectDir, os.path.join(projectDir, PROJECT_DIR_2), os.path.join(projectDir, atlasDir))
    gen.GenAtalsConfig(os.path.join(projectDir, "resource\\default.res.json"), os.path.join(projectDir, PROJECT_DIR_2), os.path.join(projectDir, "resource"))
    gen.CompressAtals(os.path.join(projectDir, PROJECT_DIR_2))


    raw_input("\nfinish!!!")