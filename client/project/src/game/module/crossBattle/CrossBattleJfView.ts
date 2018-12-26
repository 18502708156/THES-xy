class CrossBattleJfView extends BaseView implements ICommonWindowTitle {
	public static NAME = "个人贡献"
	windowTitleIconName = "争霸奖励"
	list:eui.List
	public constructor(){
		super();
		this.skinName = "CrossBattleJfViewSkin"
		this.list.itemRenderer = CrossBattleJfItem
	}

	protected childrenCreated(): void {

	}
 
	public OnOpen() {
		GameGlobal.CrossBattleModel.getJfModel()   //请求数据
		this.observe(MessageDef.JF_UPDATE_INFO, this.UpdateContent);
	}

	/*		let weight = (config) => {
			let skinid = config.skinid
			if (this.mModel.HasDress(skinid)) {
				return -100000 - skinid
			}
			let cur = GameGlobal.UserBag.GetCount(config.itemid.id)
			let need = config.itemid.count
			if (cur >= need) {
				return -10000 - skinid
			}
			return skinid
		}
		this.mList.sort((lhs, rhs) => {
			return weight(lhs) - weight(rhs)
		})
	 */

	public UpdateContent(): void {
		let config = GameGlobal.Config.KingPointsRewardConfig
		let configData = []
		for(let data in config){
            configData.push(data);
		}

		let weight = (num) => {
			let skinid = Number(num)
			if (GameGlobal.CrossBattleModel.commonpoint > config[skinid].partnerpoints && GameGlobal.CrossBattleModel.commonreward.indexOf(skinid)==-1 ) {
				return -100000 + skinid
			}
			if (GameGlobal.CrossBattleModel.commonreward.indexOf(skinid)>-1) {
				return -1000 + skinid
			}
			if(GameGlobal.CrossBattleModel.commonpoint < config[skinid].partnerpoints) {
				return -10000 + skinid
 			}
		}
		
		configData.sort((lhs, rhs) => {
            return weight(lhs) - weight(rhs)
		})

		this.list.dataProvider = new eui.ArrayCollection(configData); 
	}

}

class CrossBattleJfItem extends eui.ItemRenderer{
	public text:eui.Label;
	public bnt:eui.Button;
	public num:eui.Label;
	public wdc:eui.Label;
	public list:eui.List;
	public ylq:eui.Image;
	public constructor(){
		super();
       
	}    

	protected dataChanged() { 
		let data = Number(this.data)
		let config = GameGlobal.Config.KingPointsRewardConfig
		this.text.text = "【贡献奖励】(个人贡献达"+ config[data].partnerpoints +")"
		this.list.dataProvider = new eui.ArrayCollection(config[data].showItem)		
		this.num.text = GameGlobal.CrossBattleModel.commonpoint +"/"+ config[data].partnerpoints
		this.wdc.visible = false
		this.ylq.visible = false
		this.bnt.visible = false
		if(GameGlobal.CrossBattleModel.commonpoint<config[data].partnerpoints){
			this.wdc.visible = true
		}else{
			if(GameGlobal.CrossBattleModel.commonreward.indexOf(data) != -1){
			   this.ylq.visible = true		
			}else{
				this.bnt.visible = true
			}
		}
	}

	protected childrenCreated(): void {
		this.list.itemRenderer = ItemBase
		this.bnt.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}   

	private _OnClick() {
		let data = Number(this.data)
		GameGlobal.CrossBattleModel.huoQuJiangLi(2,data)
	} 
}




class CrossBattleMJfView extends BaseView implements ICommonWindowTitle {
	public static NAME = "王城积分"
	windowTitleIconName = "争霸奖励"
	list:eui.List
	public constructor(){
		super();
		this.skinName = "CrossBattleJfViewSkin"
		this.list.itemRenderer = CrossBattleMJfItem
	}

	protected childrenCreated(): void {

	}

	public OnOpen() {
		GameGlobal.CrossBattleModel.getJfModel()   //请求数据
		this.observe(MessageDef.JF_UPDATE_INFO, this.UpdateContent);
	}

	public UpdateContent(): void {
		let config = GameGlobal.Config.KingWPointsRewardConfig
		let configData = []
		for(let data in config){
            configData.push(data);
		}

		let weight = (num) => {
			let skinid = Number(num)
			if (GameGlobal.CrossBattleModel.citypoint > config[skinid].citypoints && GameGlobal.CrossBattleModel.cityreward.indexOf(skinid)==-1 ) {
				return -100000 + skinid
			}
			if (GameGlobal.CrossBattleModel.cityreward.indexOf(skinid)>-1) {
				return -1000 + skinid
			}
			if(GameGlobal.CrossBattleModel.citypoint < config[skinid].citypoints) {
				return -10000 + skinid
 			}
		}
		
		configData.sort((lhs, rhs) => {
            return weight(lhs) - weight(rhs)
		})
		this.list.dataProvider = new eui.ArrayCollection(configData);    
	}

}

class CrossBattleMJfItem extends eui.ItemRenderer{
	public text:eui.Label;
	public bnt:eui.Button;
	public num:eui.Label;
	public wdc:eui.Label;
	public list:eui.List;
	public ylq:eui.Image;
	public constructor(){
		super();
       
	}    

	protected dataChanged() { 
		let data = Number(this.data)
		let config = GameGlobal.Config.KingWPointsRewardConfig
		this.text.text = "【王城奖励】(王城积分达到"+ config[data].citypoints +")"
		this.list.dataProvider = new eui.ArrayCollection(config[data].showItem)		
		this.num.text = GameGlobal.CrossBattleModel.citypoint +"/"+ config[data].citypoints
		this.wdc.visible = false
		this.ylq.visible = false
		this.bnt.visible = false
		if(GameGlobal.CrossBattleModel.citypoint<config[data].citypoints){
			this.wdc.visible = true
		}else{
			if(GameGlobal.CrossBattleModel.cityreward.indexOf(data) != -1){
			   this.ylq.visible = true		
			}else{
				this.bnt.visible = true
			}
		}
	}

	protected childrenCreated(): void {
		this.list.itemRenderer = ItemBase
		this.bnt.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}   

	private _OnClick() {
		let data = Number(this.data)
		GameGlobal.CrossBattleModel.huoQuJiangLi(1,data)
	} 
}