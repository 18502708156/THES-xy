# coding:utf8
from config import *
from base.start import *

UP_GAME_CODE = "提升版本号"

COMPILE_GAME_CODE = "编译游戏代码"
# COPY_GAME_RES = "拷贝游戏资源"
# PACK_UI_ATLAS = "打包UI图集"
# COMPRESS_IMAGE = "压缩图片"

GEN_MD5 = "生成版本MD5文件"
GEN_VER = "生成版本号文件"
GEN_NEW = "新版本文件"

# "拷贝游戏资源列表"
COPY_GAME_RES_DATA = [
    "resource\\assets\\cfg",
    # "resource\\assets\\music",
    # "resource\\assets\\game_start",
    # "resource\\assets\\map",
    # "resource\\assets\\movie",

    # "resource\\assets\\image\\battlemap",
]

# "压缩图片列表"
COMPRESS_IMAGE_DATA = [
    "resource\\assets\\atlas_font",
    "resource\\assets\\image\\item_single",
]

if __name__ == "__main__":
    Start()