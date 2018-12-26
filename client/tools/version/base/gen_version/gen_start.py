#coding:utf8

import gen_version_file as gen
import compress_img as com
import util as util
import gen_version_code as gen_code
import shutil
import os
import sys
import json

sys.path.append(os.path.dirname(__file__) + "/../")
sys.path.append(os.path.dirname(__file__) + "/../../")
from config import *
from run import *


def Start(outDir, projectDir, version, root):
    print("gen_start!!!")
    # 版本路径

    globalsVar = globals()

    step = [
        "COMPILE_GAME_CODE",
        "COPY_GAME_RES",
        "PACK_UI_ATLAS",
        "COMPRESS_IMAGE",

        "GEN_MD5",
        "GEN_VER",
        "GEN_NEW",
    ]

    for s in step:
        if globalsVar.has_key(s):
            print(globalsVar[s].decode("utf8").encode("gbk"))

    if raw_input("continue(y/n)") != "y":
        print("interrupt!!!")
        return

    def index(s):
        if globals().has_key(s):
            print(globalsVar[s].decode("utf8").encode("gbk"))
            return True
        return False

    if index("COMPILE_GAME_CODE"):
        print("===> STEP00")
        util.BuildScript(projectDir, outDir)

    if index("COPY_GAME_RES"):
        print("===> STEP01")
        copyPath = COPY_GAME_RES_DATA

        for path in copyPath:
            print("=> copy " + path)
            util.copyFiles(os.path.join(projectDir, path), os.path.join(outDir, path))

    # 2、打包图集
    if index("PACK_UI_ATLAS"):
        print("===> STEP02")
        atlasDir = "resource\\assets\\atlas_ui"
        gen.PackAtals(projectDir, outDir, atlasDir)
        gen.GenAtalsConfig(os.path.join(projectDir, "resource\\default.res.json"), os.path.join(outDir, atlasDir), os.path.join(outDir, "resource"))
        gen.CompressAtals(os.path.join(outDir, atlasDir))

    # 3、压缩资源
    if index("COMPRESS_IMAGE"):
        print("===> STEP03")
        compressPath = COMPRESS_IMAGE_DATA
        for path in compressPath:
            com.Compress(projectDir, path, outDir)

    if index("GEN_MD5"):
        print("===> STEP04")
        gen_code.Gen(outDir, version)

    if index("GEN_VER"):
        print("===> STEP06")
        gen_code.GenVersionCodeFile(root, version)

    if index("GEN_NEW"):
        print("===> STEP07")
        gen_code.UpNewVersionFile(root, version)

    raw_input("\nfinish!!!")