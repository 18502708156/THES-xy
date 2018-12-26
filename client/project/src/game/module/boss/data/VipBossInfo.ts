/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/1 15:15
 * @meaning: 至尊boss数据类
 * 
 **/

class VipBossInfo
{

    id; //副本索引
    cost //进入消耗道具
    costgold//进入消耗元宝
    needsuccess//扫荡功能开启所需通关次数
    vipCount//vip每日副本可额外进入次数
    levelLimit//等级限制
    viplvlimit//VIP限制
    fbid//调用基础副本id
    suredropId//通关必掉奖励调用掉落组
    dropId//通关机率奖励调用掉落组
    bossid//BOSS的怪物ID
    showItem//界面(第一个显示必掉)
    uititle//副本标题

    count = 0//挑战总次数
	daycount = 0//今天挑战次数

    //剩余次数 用于排序
    nLeftTime = 0; //当天剩余次数
    nOpen = 0 ;//是否已经开启 1为已经开启



    //自定义字段 _data 基本数据 _ex 额外数据
    public initLocalData(_data)
    { 
        this.id = _data.id ||0 //副本索引
        this.cost = _data.cost || []//进入消耗道具
        this.costgold = _data.costgold || []//进入消耗元宝
        this.needsuccess = _data.needsuccess//扫荡功能开启所需通关次数
        this.vipCount = _data.vipCount || [] //vip每日副本可额外进入次数
        this.levelLimit = _data.levelLimit || 0 //等级限制
        this.fbid = _data.fbid || 0 //调用基础副本id
        this.suredropId = _data.suredropId || 0 //通关必掉奖励调用掉落组
        this.dropId = _data.dropId || 0 //通关机率奖励调用掉落组
        this.bossid = _data.bossid || 0 //BOSS的怪物ID
        this.uititle = _data.uititle || "" //副本标题
        this.showItem = _data.showItem || [] //界面(第一个显示必掉)
        this.viplvlimit = _data.viplvlimit || 0 //VIP限制
        this.nLeftTime = this.vipCount[0]   //计算剩余次数用于排序

        
    //VIP限制
        
    }

    //更新服务端数据
    public updataDataByServer(_data)
    {
        this.count = _data.count ||0
        this.daycount = _data.daycount  ||0

    }

    //获取是否开启
    public getOpenTime():number
    {
        let nVipLv = UserVip.ins().lv || 0
        if (GameGlobal.actorModel.level >= this.levelLimit || nVipLv>=this.viplvlimit) 
        {
            this.nOpen = 1
        }
        return this.nOpen
    }

    //获取剩余次数
    public getLeftTime()
    {
        let nVipLv = UserVip.ins().lv || 0
        this.nLeftTime = this.vipCount[nVipLv] - this.daycount   //计算剩余次数用于排序
    }

    

}   