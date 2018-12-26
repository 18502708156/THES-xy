class CrossGuildWarPanel extends BaseView implements ICommonWindowTitle {

	public static NAME = "帮会战";

    /////////////////////////////////////////////////////////////////////////////
    // CrossGuildWarSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected tstate: eui.Label;
    protected timeTxt: eui.Label;
    protected itemList: eui.List;
    protected item0: eui.Component;
    protected item1: eui.Component;
    protected item2: eui.Component;
    protected item3: eui.Component;
    protected item4: eui.Component;
    protected tcount: eui.Label;
    /////////////////////////////////////////////////////////////////////////////



	public constructor() {
		super();
		this.skinName = 'CrossGuildWarSkin';
		
	}

	public childrenCreated() {
	}

	public OnOpen(...param: any[]) {
		this.observe(MessageDef.UPDATE_TEAM_MYINFO, this.UpdateContent)
		
	}

	public OnClose() {

	}

	UpdateContent() {

	}

}

class CrossGuildCityItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
    // CrossGuildCityItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected stateImg: eui.Image;
    protected s1: eui.Image;
    protected s2: eui.Image;
    protected s3: eui.Image;
    protected tstate: eui.Label;
    protected tname: eui.Label;
    protected tpower: eui.Label;
    protected tscore: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	private STATE_IMG = ['xxx0', 'xxx1', 'xxx2', 'xxx3'];

	dataChanged() {
		if(!this.data) return;

		let info: CrossGuildInfo = this.data;

		this.tstate.visible = info.isWaring;
		this.stateImg.source = this.STATE_IMG[info.state];
		this.s1.visible = info.state > 0;
		this.s2.visible = info.state > 1;
		this.s3.visible = info.state > 2;

		this.tname.textFlow = TextFlowMaker.generateTextFlow('玩家：' + '|C:' + info.isMySide ? '0x0fc06' : '0xdb0000' + '&T:' + info.name + '|');
		this.tpower.textFlow = TextFlowMaker.generateTextFlow('战力：' + '|C:0x000000&T:' + info.power + '|');
		this.tscore.textFlow = TextFlowMaker.generateTextFlow('积分：' + '|C:0x000000&T:' + info.score + '|');
	}

}
