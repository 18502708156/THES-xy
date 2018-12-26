#coding:utf8
import shutil
import os

os.system("egret publish .\\xntg_login --version temp_version_folder")
if os.path.exists(".\\xntg_login\\bin-release\\web\\temp_version_folder\\main.min.js"):
    print("has")
    shutil.copy(".\\xntg_login\\bin-release\\web\\temp_version_folder\\main.min.js", "..\\libEx\\start\\bin\\start\\start.min.js")
    shutil.copy(".\\xntg_login\\bin-release\\web\\temp_version_folder\\main.min.d.ts", "..\\libEx\\start\\bin\\start\\start.min.d.ts")

    shutil.copy(".\\xntg_login\\bin-release\\web\\temp_version_folder\\main.min.js", "..\\project\\libs\\modules\\start\\start.min.js")
    shutil.copy(".\\xntg_login\\bin-release\\web\\temp_version_folder\\main.min.d.ts", "..\\project\\libs\\modules\\start\\start.min.d.ts")
else:
    print("not")
raw_input("finish!!!")

