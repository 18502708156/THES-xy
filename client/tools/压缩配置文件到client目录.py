#coding:utf8

import zipfile 
import os
import shutil


__selfDir__ = os.path.dirname(__file__)
os.chdir(__selfDir__ + "/lua2json")

os.system("lua2json.exe")
os.chdir(__selfDir__)

#把整个文件夹内的文件打包 
def adddirfile(outPath, inDir): 
	f = zipfile.ZipFile(outPath,'w',zipfile.ZIP_DEFLATED) 
	os.chdir(inDir)
	for dirpath, dirnames, filenames in os.walk("./"):
		print("-----------------------")
		for filename in filenames: 
			f.write(os.path.join(dirpath,filename)) 
	f.close() 

# fromFiles = ["./lua2json/config"]
outPath = "../project/resource/cfg/config.zz"

adddirfile(outPath, "./lua2json/config/")

# zipName = os.path.basename(outPath)

# zip.zip_util.create(zipName, fromFiles, "./lua2json")
# shutil.move(zipName, outPath)
# shutil.copy("./lua2json/config.json", "../project/resource/cfg/config.json")

# print("from => " + "\n".join(fromFiles))
print("to => " + outPath)
# print("to => ../project/resource/cfg/config.json")
raw_input("finish!!!")