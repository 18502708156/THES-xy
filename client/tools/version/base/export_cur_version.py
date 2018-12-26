# coding:utf8

"""
拷贝最新版本的资源文件到一个临时目录
"""

import json
import os
import sys
import shutil

EXPORT_ROOT_DIR = "F:\\game\\game4\\release"
EXPORT_OUT_DIR = "F:\\temp_export"

if not os.path.exists(EXPORT_ROOT_DIR):
    exit()    

if not os.path.exists(EXPORT_OUT_DIR):
    os.makedirs(EXPORT_OUT_DIR)

verFileList = []
for fileName in os.listdir(os.path.join(EXPORT_ROOT_DIR, "ver_dir")):
    verFileList.append(fileName.replace("ver", "").replace(".json", ""))
verFileList.sort()
if len(verFileList) < 1:
    exit()
maxVerName = verFileList[len(verFileList) - 1]
verJsonData = json.load(open(os.path.join(EXPORT_ROOT_DIR, "ver_dir", "ver" + maxVerName + ".json"), "r")) 

outRoot = os.path.join(EXPORT_OUT_DIR, "out")
if os.path.exists(outRoot):
    shutil.rmtree(outRoot)
shutil.copytree(os.path.join(EXPORT_ROOT_DIR, str(verJsonData["__base_ver__"])), outRoot)

def CopyFile(verData, path):
    if type(verData) == int:
        if not os.path.exists(os.path.dirname(os.path.join(outRoot, path))):
            os.makedirs(os.path.dirname(os.path.join(outRoot, path)))
        shutil.copy(os.path.join(EXPORT_ROOT_DIR, str(verData), path), os.path.join(outRoot, path))
        return
    for k in verData:
        CopyFile(verData[k], os.path.join(path, k))

for k in verJsonData:
    if k == "__base_ver__":
        continue
    CopyFile(verJsonData[k], k)

fp = open(os.path.join(outRoot, maxVerName), "w")
fp.close()