#coding:utf8

def Info(s):
    if type(s) == str:
        print(s.decode("utf8").encode("gbk"))
    else:
        print(s)

def RawInput(s):
    return raw_input(s.decode("utf8").encode("gbk"))

if __name__ == "__main__":
    Info("测试")
