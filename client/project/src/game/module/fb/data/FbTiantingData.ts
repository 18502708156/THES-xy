/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/17 17:15
 * @meaning: 勇闯天庭数据类
 * 
 **/

class FbTiantingData
{


    id = 0;//关卡id
    fbId = 0;//基础副本id
    bossId = 0;//BOSSid
    firstAward = [];//首通奖励 (宝箱奖励)
    specialAwardshow = [];//首通特殊奖励展示
    uishow = 0; //奖励id
    caption1 = ""
    caption2 = ""
    


    //自定义字段 _data 基本数据 _ex 额外数据
    public initLocalData(_data)
    {
        this.id = _data.id;//关卡id
        this.fbId =  _data.fbId;//基础副本id
        this.bossId =  _data.bossId;//BOSSid
        this.firstAward = _data.firstAward;//首通奖励 (宝箱奖励)
        this.specialAwardshow =  _data.specialAwardshow;//首通特殊奖励展示
        this.uishow = _data.uishow
        this.caption1 = _data.caption1
        this.caption2 = _data.caption2
    }

    // //更新服务端数据
    // public updataDataByServer(_data)
    // {
    //     this.todayNum = _data.todayNum
    //     this.star = _data.star 
    // }

}   