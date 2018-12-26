#coding:utf8
import Util
import Log
import os
import shutil
import hashlib
import json
import PIL.Image as Image

WORK = os.path.dirname(__file__)

'''
打包图集

@param 根目录
@param 子目录，作为文件名使用
@param 输出目录
'''
def PackSingleAtals(root, dirName, outDir):
	fileDir = os.path.join(root, dirName)
	if not os.path.isdir(fileDir):
		print(fileDir + " not dir!!!")
		return
	Log.Info("打包目录 => " + fileDir)
	outFileName = "_".join(dirName.split("\\")) 
	exePath = os.path.join(WORK, "..\\gen_version\\libs\\texturepack\\bin\\TexturePacker.exe")
	packImgList = []
	fullPackImgList = []
	imgList = []
	# 目录包含image，不打包改目录图片
	if fileDir.find("image") != -1:
		for fileName in os.listdir(fileDir):
			if fileName.endswith(".jpg") or fileName.endswith(".png"):
				filePath = os.path.join(fileDir, fileName)
				imgList.append(filePath)
	else:
		for fileName in os.listdir(fileDir):
			filePath = os.path.join(fileDir, fileName)
			if fileName.endswith(".jpg"):
				print("copy jpg => " + filePath)
				imgList.append(filePath)
				continue
			if not fileName.endswith(".png"):
				continue
			image = Image.open(filePath)
			# 太大的图片忽略
			if image.width * image.height >= 450 * 200:
				imgList.append(filePath)
				print("ignore image ", filePath, image.size)
				continue
			packImgList.append(fileName)
			fullPackImgList.append(os.path.join(fileDir, fileName))
	outSaveDir = fileDir.replace(root, outDir)
	Util.ClearDir(outSaveDir)
	Util.CheckDir(outSaveDir)
	if len(fullPackImgList) == 1:
		imgList.append(fullPackImgList[0])
		fullPackImgList = []
	if len(fullPackImgList) > 0:
		# 打包图集
		jsonPath = os.path.join(outSaveDir, outFileName + ".json")
		pngPath = os.path.join(outSaveDir, outFileName + ".png")
		argsArray = [
			"--disable-rotation",
			"--size-constraints AnySize",
			"--max-width 2048",
			"--max-height 2048",
			"--format json-array",
		]
		command = exePath + " {0} --data {1} --sheet {2} {3}".format(" ".join(argsArray), jsonPath, pngPath, " ".join(packImgList))
		# print(command)
		curDir = os.getcwd()
		os.chdir(fileDir)
		os.system(command)	
		os.chdir(curDir)
		ParserSliceArea(jsonPath)
		# os.chdir(curDir)
	for file in imgList:
		shutil.copy2(file, file.replace(root, outDir))


'''
重新设置图集的配置

@param res.json 路径
@param 删除的目录前缀
@param 检查的目录
@param 附加的前缀
@param 配置生成目录
'''
def ResetAtalsConfig(resjsonPath, deletePrefix, checkDir, prefix, outDir):
	jsonData = json.load(open(resjsonPath, "r"))
	resJsonData = jsonData["resources"]
	jsonData["resources"] = []
	newResJsonData = []
	# 移除旧的配置
	for data in resJsonData:
		if not data["url"].startswith(deletePrefix):
			newResJsonData.append(data)
	# 读取新生成的文件目录	
	for parent, dirnames, filenames in os.walk(checkDir):
		for filename in filenames:
			# 文件路径
			realFilePath = os.path.join(parent, filename)
			# 配置路径
			filePath = realFilePath.replace(checkDir, prefix).replace("\\", "/")
			fileType = "image"
			if filename.endswith(".json"):
				fileType = "sheet"

			# 如果是sheet的图片，不添加到列表
			if fileType == "image" and realFilePath.endswith(".png") and os.path.exists(realFilePath.replace(".png", ".json")):
				continue
			typeData = {
				"url": filePath,
				"type": fileType,
				"name": Util.GetFileName(filePath) + (fileType == "sheet" and "_json" or "")
			}
			# 增加图集元素
			if fileType == "sheet":
				frameJsonData = json.load(file(realFilePath, "r"))
				sheetArray = []
				for sheetKey in frameJsonData["frames"]:
					sheetArray.append(sheetKey)
				typeData["subkeys"] = ",".join(sheetArray)
			elif fileType == "image":
				if typeData["name"].find("@") != -1:
					im = Image.open(realFilePath)
					returnData = ParserSliceData2(typeData["name"], im.width, im.height)
					im.close()
					if returnData[0]:
						typeData["name"] = returnData[1]
						typeData["scale9grid"] = returnData[2]

			newResJsonData.append(typeData)

	jsonData["resources"] = newResJsonData
	json.dump(jsonData, file(os.path.join(outDir, "default.res.json"), "w"))


# 解析九宫格json数据
def ParserSliceArea(path):
	jsonData = json.load(file(path))
	imageName = jsonData["meta"]["image"]
	oldFrames = jsonData["frames"]
	newFrames1 = {}
	for frameData in oldFrames:
		temp = {}
		newFrames1[frameData["filename"].split(".")[0]] = temp
		temp["x"] = frameData["frame"]["x"]
		temp["y"] = frameData["frame"]["y"]
		temp["w"] =  frameData["frame"]["w"]
		temp["h"] = frameData["frame"]["h"]
		temp["offX"] = frameData["spriteSourceSize"]["x"]
		temp["offY"] = frameData["spriteSourceSize"]["y"]
		temp["sourceW"] = frameData["sourceSize"]["w"]
		temp["sourceH"] = frameData["sourceSize"]["h"]
	jsonData = {}
	jsonData["file"] = imageName

	newFrames2 = {}
	for name in newFrames1:
		data = newFrames1[name]
		newFrames2[ParserSliceData(name, data)] = data
	jsonData["frames"] = newFrames2

	# 重写配置
	json.dump(jsonData, file(path, "w"))


# 解析九宫格数据
def ParserSliceData(keyName, jsonData):
	returnData = ParserSliceData2(keyName, jsonData["sourceW"], jsonData["sourceH"])
	if returnData[0]:
		jsonData["scale9grid"] = returnData[2]
	return returnData[1]


def ParserSliceData2(keyName, width, height):
	returnData = [False, keyName, None]
	names = keyName.split("@")
	if len(names) < 2:
		return returnData
	for name in names:
		array = name.split("_")
		if len(array) > 0:
			# 检查数据的正确性
			for value in array:
				try:
					int(value)
				except:
					array = []
					break
			# 检查结果
			if len(array) > 0:
				left = int(array[0])
				top = len(array) < 2 and left or int(array[1])
				right = len(array) < 3 and left or int(array[2])
				bottom = len(array) < 4 and top or int(array[3])

				x = left
				y = top
				width = width - right - left
				height = height - bottom - top

				print("scale9grid => " + keyName)
				returnData[0] = True
				returnData[1] = names[0]
				returnData[2] = "{0},{1},{2},{3}".format(x, y, width, height)
				return returnData
	return returnData

