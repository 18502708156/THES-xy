/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/8 14:15
 * @meaning: 商店黑市数据类
 * 
 **/

class ShopBlackData extends ShopBaseData {

    index:number;//索引
    type:number;//类型
    unlocktype:Array<any>;//解锁条件类型
    mark:number;//稀有标识
    id:number;//道具ID
    count:number;//单次购买数量
    daycount:number;//最大限购次数
    currency:Array<any>;//商品兑换货币类型及数量

    //自定义字段
    buyTime  = 0;//购买次数
    shopType = 0; //商店类型

    //data 商店数据
    public initLocalData(data,_type)
    {
        this.index = data.index || 0 ;//索引
        this.type = data.type || 0 ;//类型
        this.unlocktype = data.unlocktype || {} ;//解锁条件类型
        this.mark = data.mark || 0 ;//稀有标识
        this.id = data.id || 0 ;//道具ID
        this.count = data.count || 0 ;//单次购买数量
        this.daycount = data.daycount || 0 ;//最大限购次数
        this.currency = data.currency || {} ;//商品兑换货币类型及数量

        this.shopType = _type || 0
    }


}