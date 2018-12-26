#coding:utf8

import os
import sys
import shutil
import hashlib
import json
import PIL.Image as Image
import util

sys.path.append(os.path.dirname(__file__) + "/../")

from com.AtlasUtil import *
import compress_img as com

WORK = os.path.dirname(__file__)

def CheckDir(dir):
	if not os.path.exists(dir):
		os.makedirs(dir)
		return
	if not os.path.isdir(dir):
		os.makedirs(dir)

def MoveFile(src, dst):
	dir = os.path.dirname(dst)
	CheckDir(dir)
	shutil.move(src, dst)

def CopyImg(root, dir, outDir):
	for parent, dirnames, filenames in os.walk(dir):
		for filename in filenames:
			path = os.path.join(parent, filename)
			newPath = path.replace(root, outDir)
			CheckDir(os.path.dirname(newPath))
			# print(path, newPath)
			shutil.copy2(path, newPath)

def PackAtals(root, outFolderPath, folderPath):
	for parent,dirnames,filenames in os.walk(folderPath):
		for dirName in dirnames:
			dirPath = os.path.join(parent, dirName).replace(folderPath, "")[1:]
			PackSingleAtals(folderPath, dirPath, outFolderPath)

def GenAtalsConfig(resjsonPath, checkDir, outputPath):
	ResetAtalsConfig(resjsonPath, "assets/atlas_ui", checkDir, "assets/atlas", outputPath, "default_at.res.json")

def CompressAtals(outCheckDir):
	com.CompressOrigen(outCheckDir)
