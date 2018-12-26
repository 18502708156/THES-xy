# coding:utf8
import base.com.Log as Log

# 版本文件输出目录
OUT_DIR = "F:\\game\\game6\\release"

#客户端目录
# CLIENT = "D:\\develop\\xntg_rel\\client"
CLIENT = "D:\\develop\\xntg\\client"

# 工程目录
PROJECT_DIR = CLIENT + "\\project"

#版本信息文件
VER_DIR = CLIENT + '\\ver_res'

# 游戏id
GAME_ID = "6"

# 游戏目录版本号
CODE_DIR_VERSION = "1"

# 基础版本号
CODE_BASE = 52

Log.Info("输出目录 => " + OUT_DIR)
Log.Info("工程目录 => " + PROJECT_DIR)
Log.Info("游戏id => " + GAME_ID)
Log.Info("游戏目录版本号 => " + (CODE_DIR_VERSION))
Log.Info("基础版本号 => " + str(CODE_BASE))