class CrossGuildPanel extends BaseView implements ICommonWindowTitle {

	public static NAME = "帮会战";

	/////////////////////////////////////////////////////////////////////////////
    // CrossGuildSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected group: eui.Group;
    protected btnGo: eui.Button;
    protected btnHelp: eui.Button;
    protected timeTxt: eui.Label;
    protected itemList: eui.List;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super();
		this.skinName = 'CrossGuildSkin';
	}

	public childrenCreated() {
		this.itemList.itemRenderer = ItemBaseNotName;
		this.itemList.dataProvider = new eui.ArrayCollection();
	}

	public OnOpen(...param: any[]) {
		this.observe(MessageDef.UPDATE_TEAM_MYINFO, this.UpdateContent)
		this.AddClick(this.btnGo, this.onClick);
		this.AddClick(this.btnHelp, this.onClick);
	}

	private onClick(e:egret.TouchEvent) {
		if(e.target == this.btnHelp) {
			ViewManager.ins().open(CrossGuildTipPanel);
		}
		else {
			
		}
 	}

	public OnClose() {
		this.removeEvents();
		this.removeObserve();
	}

	UpdateContent() {
		//如果活动开启
		// this.group.visible = false;
	}

}
