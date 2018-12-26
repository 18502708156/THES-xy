# -*- coding: utf-8 -*-

import os
import sys
import shutil

import oss2

sys.path.append(os.path.dirname(__file__) + "/../")
from access_key import *

WORK = os.path.dirname(__file__)

# 创建Bucket对象，所有Object相关的接口都可以通过Bucket对象来进行
bucket = True

def Init():
    access_key_id = os.getenv('OSS_TEST_ACCESS_KEY_ID', OSS_TEST_ACCESS_KEY_ID)
    access_key_secret = os.getenv('OSS_TEST_ACCESS_KEY_SECRET', OSS_TEST_ACCESS_KEY_SECRET)
    bucket_name = os.getenv('OSS_TEST_BUCKET', 'dntgres')
    endpoint = os.getenv('OSS_TEST_ENDPOINT', 'oss-cn-shenzhen.aliyuncs.com')

    # 确认上面的参数都填写正确了
    for param in (access_key_id, access_key_secret, bucket_name, endpoint):
        assert '<' not in param, 'not param:' + param

    # 创建Bucket对象，所有Object相关的接口都可以通过Bucket对象来进行
    global bucket
    bucket = oss2.Bucket(oss2.Auth(access_key_id, access_key_secret), endpoint, bucket_name)

def CheckExistsFile(filePath):
    print(" check osss dir => " + filePath)
    exist = bucket.object_exists(filePath)
    if exist:
        print('''
        >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        exists file => ''' + filePath + '''
        >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        ''')
        raise Exception("exists file =>" + filePath)

# CheckExistsFile("ver")