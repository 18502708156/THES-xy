# coding:utf8

import os
import sys

sys.path.append(os.path.dirname(__file__) + "/../")
sys.path.append(os.path.dirname(__file__) + "/../../")
from config import *

varfileName = "ver_dir"

def copyMD5File(local_dir,targetDir):
    files = os.listdir(local_dir)
    os.chdir(local_dir)
    for x in files:
        filename = os.path.join(local_dir, x)
        if os.path.isdir(x) and x != 'temp_upload' and x != varfileName and x != ".svn":
            if os.path.exists(filename + "\\md5.json"):
                if os.path.exists(targetDir + "\\" +x) == False:
                    os.makedirs(targetDir + "\\" +x)
                if os.path.exists(targetDir  + "\\" +x + "\\md5.json") == False:
                    os.system('copy '+filename+"\\md5.json"+' '+targetDir + "\\" +x + "\\md5.json")

    path = os.path.join(local_dir, varfileName)
    path2 = os.path.join(targetDir, varfileName)
    os.system('Xcopy '+path+' '+path2 +' /s /e /y /q')

def svncommit():
    copyMD5File(OUT_DIR,VER_DIR)

    path = os.path.join(OUT_DIR, varfileName)
    path2 = os.path.join(VER_DIR, varfileName)
    os.system('Xcopy '+path+' '+path2 +' /s /e /y /q')
    
    svnFile = getAllNoSvnFile(VER_DIR)
    print svnFile
    os.chdir(VER_DIR)
    return os.system('svn commit -m "version information" ' + svnFile)
    
def getAllNoSvnFile(local_dir):
    files = os.listdir(local_dir)
    os.chdir(local_dir)
    all_files = ""
    for x in files:
        filename = os.path.join(local_dir, x)
        ret = os.popen('svn status ./' + x).read()
        if x != varfileName and len(ret) and ret.find("?") != -1:
            cmd='svn add ./' + x
            all_files += " ./" + x
            ret = os.system(cmd)
        # 如果是目录，
        if os.path.isdir(x):
            all_files += getAllNoSvnFile(filename)
            os.chdir(local_dir)
    return all_files

if __name__ == "__main__":
    copyMD5File(OUT_DIR,VER_DIR)