#coding:utf8

import zip.zip_util
import os
import shutil

os.chdir(os.path.dirname(__file__))

rootDir = "../project/resource/assets/"
fromFiles = []
inDir = rootDir + "map/"
for value in os.listdir(inDir):
	fromFiles.append(inDir + value + "/mdata.txt")

zipName = "map.zz"
outPath = "../project/resource/cfg/" + zipName

zip.zip_util.create(zipName, fromFiles, rootDir)
shutil.move(zipName, outPath)

print("from => " + "\n".join(fromFiles))
print("to => " + outPath)
raw_input("finish!!!")