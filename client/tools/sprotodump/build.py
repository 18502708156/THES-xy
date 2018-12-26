#coding:UTF-8

import os
import sys
import json

workDir = os.path.dirname(__file__)

os.chdir(os.path.join(workDir,"core"))

configObj = json.load(open("../config.txt"))
outDir = configObj["out_dir"]

if outDir[0] == ".":
	outDir = workDir + "/" + outDir

if not os.path.isdir(outDir):
	print("not found dir => " + workDir)
	exit()
if outDir[-1] != "/" or outDir[-1] != "\\":
	outDir += "/"
	

inDir = configObj["in_dir"]

if inDir[0] == ".":
	inDir = workDir + "/" + inDir

if not os.path.isdir(inDir):
	print("not found dir => " + workDir)
	exit()
if inDir[-1] != "/" or inDir[-1] != "\\":
	inDir += "/"

def _SingleDump(moduleName, excludeNames):
	print("-------------------------------------")
	print("dump => " + moduleName)
	protoFiles = []

	for fileName in os.listdir(inDir):
		for exclude in excludeNames:
			if (fileName.find(exclude) != -1):
				continue
			protoFiles.append(inDir + fileName)

	os.system("lua.exe sprotodump.lua -ts {0} -d {1} -p {2}".format(" ".join(protoFiles), outDir, moduleName))

def _Dump(moduleNames):
	for i, moduleName in enumerate(moduleNames):
		moduleList = moduleNames[:]
		moduleList.remove(moduleName)
		_SingleDump(moduleName, moduleList)


_Dump(['c2s', "s2c"])

raw_input("please enter key to exit!!!")
