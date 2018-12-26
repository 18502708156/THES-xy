#coding:utf8

import os
import time
import json
import shutil

copyFileCounts = 0

# 拷贝目录
def copyFiles(sourceDir, targetDir, cover = True):   
    global copyFileCounts
    # print sourceDir
    # print u"%s 当前处理文件夹%s已处理%s 个文件" %(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())), sourceDir,copyFileCounts)   
    if not os.path.exists(sourceDir):
        print("not found source dir => " + sourceDir)
        return
    for f in os.listdir(sourceDir):
        sourceF = os.path.join(sourceDir, f)
        targetF = os.path.join(targetDir, f)

        if os.path.isfile(sourceF):   
            #创建目录   
            if not os.path.exists(targetDir):
                os.makedirs(targetDir)
                copyFileCounts += 1

            #文件不存在，或者存在但是大小不同，覆盖   
            if cover or (not os.path.exists(targetF) or (os.path.exists(targetF) and (os.path.getsize(targetF) != os.path.getsize(sourceF)))):
                #2进制文件
                open(targetF, "wb").write(open(sourceF, "rb").read())
                # print u"%s %s 复制完毕" %(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())), targetF)   
            else:
                pass
                # print u"%s %s 已存在，不重复复制" %(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())), targetF)

        if os.path.isdir(sourceF):   
            copyFiles(sourceF, targetF, cover)   

# 拷贝文件
def CopyFile(sourceFile, targetFile):
    dir = os.path.dirname(targetFile)
    if not os.path.exists(dir):
        os.makedirs(dir)
    shutil.copyfile(sourceFile, targetFile)

def GetFileName(path):
    path = path.split(".")[0]
    index01 = path.rfind("/")
    index02 = path.rfind("\\")
    name01 = index01 != -1 and path[(index01 + 1):] or path
    name02 = index02 != -1 and path[(index02 + 1):] or path
    return len(name01) < len(name02) and name01 or name02

# def MergeFile(dir):


# 编译脚本
def BuildScript(projectDir, outDir):
    print("read egretProperties.json")
    propPath = os.path.join(projectDir, "egretProperties.json")
    propFile = file(propPath, "r")
    oldContent = propFile.read()
    propFile.close()
    print("modify egretProperties.json")
    jsonData = json.load(file(propPath, "r"))
    jsonData["resources"] = ["resource\\skins", "resource\\default.thm.json"]
    json.dump(jsonData, file(propPath, "w"))
    # publish
    os.system("egret publish " + projectDir + " --version temp_version_folder")
    # reset
    print("reset egretProperties.json")
    file(propPath, "w").write(oldContent)

    oldDir = os.path.join(projectDir, "bin-release\\web\\temp_version_folder")
    # copyDir = [
    #     "libs",
    #     "polyfill",
    # ]
    copyFileArray = [
        "resource\\default.thm.json",
        # "favicon.ico",
        "main.min.js",
        # "index.html",
    ]
    # for dir in copyDir:
    #     copyFiles(os.path.join(oldDir, dir), os.path.join(outDir, dir))
    for filePath in copyFileArray:
        CopyFile(os.path.join(oldDir, filePath), os.path.join(outDir, filePath))

def _FindAllLib(dir):
    libFiles = []
    for parent, dirnames, filenames in os.walk(dir):
        for filename in filenames:
            if filename.endswith(".js"):
                path = os.path.join(parent, filename)
                libFiles.append(path)
    return libFiles

# 合并库文件
def MergerLib(outDir):
    outName = "merged.js"
    libDirs = [
        os.path.join(outDir, "libs"),
        os.path.join(outDir, "polyfill")
    ]

    libFiles = []
    for path in libDirs:
        print("find lib dir => " + path)
        for filePath in _FindAllLib(path):
            libFiles.append(filePath)
    if len(libFiles) == 0:
        print("[INFO] MergerLib libFiles == 0, path => " + outDir)
        return
    fileContent = ""
    for filePath in libFiles:
        fp = file(filePath, "r")
        fileContent += "//" + filePath.replace(outDir, "") + "\n"
        fileContent += fp.read() + "\n\n"
        fp.close()
    file(os.path.join(outDir, outName), "w").write(fileContent)
    # 合并成，删除库文件目录
    for path in libDirs:
        print("delete lib dir => " + path)
        shutil.rmtree(path)
