/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/17 17:15
 * @meaning: 藏宝图数据类
 * 
 **/

class FbcbtData
{

    id:number;	//关卡id
    page:number;//	藏宝图第几页（6关为1页）
    dod:number;//难度模式
    fbId:number;//	基础副本id
    firstAwardSw;//首通奖励展示
    dayAward;//	每日通关奖励展示

    item;//奖励数据
    caption//获得描述

    
    name:string;     
    desc:string;     

    todayNum = 0;//当天通关次数
    star = 0;//星数


    //自定义字段 _data 基本数据 _ex 额外数据
    public initLocalData(_data,_ex)
    {
        this.id = _data.id
        this.page = _data.page
        this.dod = _data.dod
        this.fbId = _data.fbId
        this.firstAwardSw = _data.firstAwardSw || []
        this.dayAward = _data.dayAward || []
        this.item = _data.item//奖励数据
        this.caption = _data.caption//获得描述

        this.name = _ex.name || ""
        this.desc = _ex.desc || ""
    }

    //更新服务端数据
    public updataDataByServer(_data)
    {
        this.todayNum = _data.todayNum
        this.star = _data.star 
    }

}   