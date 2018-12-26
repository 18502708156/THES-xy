/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/7 15:01
 * @meaning: 法宝打造详情
 * 
 **/


class TreasureMakePanel extends BaseView implements ICommonWindowTitle {

	public static readonly NAME = "打造"


	protected pMakeRect0:TreaMakeRect;
	protected pMakeRect1:TreaMakeRect;
	private listView:eui.List;
	protected lbAccount1 : eui.Label;
	protected lbAccount2 : eui.Label;
	
	private tPanelData = [];//界面总体数据数据
	private tMakeRect = [];//打造框数组
	private tHave = [];//持有列表
    
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "TreasureMakePanelSkin"
        this.listView.itemRenderer = TreasureHoldIcon;
	}

	public childrenCreated() {
		this.tMakeRect.push(this.pMakeRect0)
		this.tMakeRect.push(this.pMakeRect1)
		UIHelper.SetLinkStyleLabel(this.lbAccount2, "法宝图鉴")
    }

	public OnOpen(...param: any[]) {

        var nIndex = param[0] || 0;
		this.observe(MessageDef.TREASURE_CHANGE, this.UpdateContent)//法宝数据变化
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateContent)//物品变化的时候也刷新一下内容
		this.observe(MessageDef.TREASURE_LOCK, this.upList)//上锁变化
        this._AddClick(this.lbAccount2, this.onClick)

	}


	public upList()
	{
		this.setData();
		(this.listView.dataProvider as eui.ArrayCollection).replaceAll(this.tHave);
	}

	public UpdateContent()
	{
		this.setData();
		
		// (this.listView.dataProvider as eui.ArrayCollection).replaceAll(this.tHave);
		this.listView.dataProvider = new eui.ArrayCollection(this.tHave)


		//更新
		for(let i = 1;i<=2;i++)
		{
			this.tMakeRect[i-1].onUpdate(i)
		}


		let strSkillLv =  `|C:0x682f00&T:累计20次完美打造,必出完美法宝|C:0xdb0000&T: (完美法宝有特技)|`
        this.lbAccount1.textFlow =   TextFlowMaker.generateTextFlow(strSkillLv) //    skillLevel + "级"//技能等级

	}



	public setData()
	{
		this.tHave = GameGlobal.TreasureModel.getHaveList()
	}



	private onClick(e: egret.TouchEvent)
	{
		switch (e.target) {
				case this.lbAccount2:
					ViewManager.ins().open(TreasureShowWin)
				break
			}
	}

	public static RedPointCheck(): boolean {
        return GameGlobal.TreasureModel.mRedPoint.Get(TreasureRedPoint.INDEX_MAKE_TREASURE)
    }
	
}

