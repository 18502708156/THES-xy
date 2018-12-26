# coding:utf8

import os
import gen_version_file as gen

def PackAtals(root, dir, outDir):
	dir = os.path.join(root, dir)
	imgList = []
	for child in os.listdir(dir):
		if os.path.isdir(os.path.join(dir, child)):
			print(child)
			gen.PackSingleAtals(root, child, outDir)

if __name__ == "__main__":
	dir = "E:\\lycq\\client\\project\\resource\\assets\\atlas_ui\\start_game"
	PackAtals(dir, "", dir)