#coding:utf8

import json
import os
import shutil
import re
import sys
import PIL.Image as Image

try: 
  import xml.etree.cElementTree as ET 
except ImportError: 
  import xml.etree.ElementTree as ET 



resJson = {}
PRO_ROOT = "D:/develop/lyb/client/project/"
ROOT = PRO_ROOT + "resource/" 
EXML_ROOT = ["skins"]
UI_ROOT = ["assets/atlas_ui/"]
WITHOUT_NAME = {
	"cm_json": True,
	"zjm_json": True
}

# WITHOUT_EXML_NAME = {
# 	"MainTopPanelSkin": True,
# 	"MainTop2PanelSkin": True,
# 	"MainTop2PanelSkin": True,
# 	"MainPlayFunViewSkin": True,
# }



def GetExmlRef(resJson, rootPath, filePath, imgRoots):
	if not os.path.exists(filePath):
		raw_input("not found file => " + filePath)
		return

	patternEui = re.compile("\{http://ns\.egret\.com/eui\}(\w+)")
	patternWing = re.compile("\{http://ns\.egret\.com/wing\}(\w+)")
	patternNs1 = re.compile("\{\*}(\w+)")
	# match = patternNs1.match("{*}Button")

	def GetType(value):
		match = patternEui.match(value)
		if match:
			return "eui." + match.groups()[0]
		match = patternNs1.match(value)
		if match:
			return match.groups()[0]
		match = patternWing.match(value)
		if match:
			return "wing." + match.groups()[0]
		print("not match => " + value)
		return None

	try: 
		tree = ET.parse(filePath)     #打开xml文档 
		root = tree.getroot()         #获得root节点  
	except Exception, e: 
		print ("Error:cannot parse file => " + filePath)
		return None

	childList = []
	sourceList = []

	if not root.attrib.has_key("class"):
		print("[ERROR] not class => " + filePath)
		return
	className = root.attrib["class"]

	def GetChild(root):
		for child in root:
			GetChild(child)
			if GetType(child.tag) == "eui.Image":
				childList.append(child)
			elif GetType(child.tag) == "eui.Button":
				childList.append(child)

	GetChild(root)

	def GetAllSource(list):
		for data in list:
			attrib = data.attrib
			if attrib.has_key("source"):
				source = attrib["source"]
				if len(source) != 0:
					sourceList.append(source)
			elif attrib.has_key("icon"):
				source = attrib["icon"]
				if len(source) != 0:
					sourceList.append(source)
	
	GetAllSource(childList)

	refList = {}
	for source in sourceList:
		if resJson.has_key(source):
			if resJson[source]["type"] == "image":
				fileUrl = resJson[source]["url"] 
				isSheet = False
				if fileUrl.endswith(".png") and fileUrl.find("image") == -1:
					img = Image.open(os.path.join(rootPath, fileUrl))
					if img.width * img.height < 450 * 200:
						isSheet = True
					img.close()
				if isSheet:
					dirName = os.path.dirname(fileUrl)
					for imgRoot in imgRoots:
						dirName = dirName.replace(imgRoot, "")
					dirName = dirName.replace("/", "_") + "_json"
					refList[dirName] = True
				else:
					refList["resource/" + fileUrl] = True
			else:
				print("[ERROR] type is not image => " + source)
		else:
			print("[ERROR] not source => " + source)

	outList = []
	for k in refList:
		if WITHOUT_NAME.has_key(k):
			continue
		outList.append(k)
	
	# print(className + " => ")
	# print(outList)
	# return {className: outList}
	if len(outList) == 0:
		return False
	return json.dumps({className: outList})

def GetResJson():
	obj = json.load(open(ROOT + "default.res.json", "r"))
	for data in obj["resources"]:
		resJson[data["name"]] = data

GetResJson()

def GetAllExmlFile(rootDir):
	allExmlFile = []
	for a, b, c in os.walk(rootDir):
		for fileName in c:
			if fileName.endswith(".exml"):
				allExmlFile.append(os.path.join(a, fileName).replace("\\", "/"))
	return allExmlFile

allExml = []
allRefData = {}
for dirs in EXML_ROOT:
	for filePath in GetAllExmlFile(os.path.join(ROOT, dirs)):
		allExml.append(filePath)
outStr = "var RES_REF = {\n\t" 
for exmlPath in allExml:
	datas = GetExmlRef(resJson, ROOT, exmlPath, UI_ROOT)
	if datas:
		outStr = outStr + datas[1:-1] + ",\n\t"
		# for k in datas:
		# 	allRefData[k] = datas[k]
outStr = outStr + "}"
open(PRO_ROOT + "src/ref.ts", "w").write(outStr)

raw_input("finish!!!")
