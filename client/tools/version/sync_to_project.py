# coding:utf8

import os
import PIL.Image as Image

from config import *

def Exec():
    if not os.path.exists(OUT_DIR):
        print("not exists => " + OUT_DIR)
        return
    if not os.path.exists(PROJECT_DIR):
        print("not exists => " + PROJECT_DIR)
        return
    # for a, b, c in os.walk(OUT_DIR):
    #     print(a, b, c)
    for dirName in os.listdir(OUT_DIR):
        print(os.path.join(OUT_DIR, dirName))
    
# Exec()


root = "D:\\develop\\xntg\\assets\\dev\\map"
for dirName in os.listdir("D:\\develop\\xntg\\assets\\dev\\map"):
    path = os.path.join(root, dirName, "small.jpg")
    sImg=Image.open(path) 
    w,h=sImg.size  
    print w,h 
    dImg=sImg.resize((w/2,h/2),Image.ANTIALIAS)  #设置压缩尺寸和选项，注意尺寸要用括号
    dImg.save(path)