/**
 * 八十一难主介面List_Com
 */
class TsumKoListItem extends eui.ItemRenderer {

	// TsumKoListItemSkin.exml

	private bgImg: eui.Image;//背景图
    private notAdoptLabel:eui.Label;//提示文本
    private checkpointNameLabel:eui.Label;//关卡文本
    private adoptImg:eui.Image;//通过Img
    private recordLabel:eui.Label;//查看记录
    private goBtn:eui.Button;//进入按钮
    private extraPanel:PetShowPanel//怪物模型

    public childrenCreated()
    {
        this.goBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
            ViewManager.ins().open(TsumKoBasePanel,this.data.chapterid);
        }, this);
        this.recordLabel.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            ViewManager.ins().open(TsumKoBaseRecordPanel);
        },this);
       
        
	}
    

	dataChanged()
    {
		let data = this.data;
        this.bgImg.source=data.title;//bg
        this.checkpointNameLabel.text=data.name;//名字
        this.extraPanel.SetBodyId(MonstersConfig.GetAppId(data.monsterid));//显示怪物

        let info_clear=GameGlobal.TsumKoBaseModel.info_clear;//已通关的关卡
        let num=Math.floor(info_clear/9);
        
        this.goBtn.visible=true;
        this.notAdoptLabel.visible=false;
        //if(GameGlobal.TsumKoBaseModel.isAdopt==true)
        if(GameGlobal.TsumKoBaseModel.IsAllClearance(data.chapterid)==true) //是否全部通关
        {
            this.adoptImg.visible=true;
        }
        else
        {
            this.adoptImg.visible=false;
        }
        // if(info_clear==0 || info_clear==9) 
        //     num+=1;
        if(num+2<=data.chapterid)
        {
            this.adoptImg.visible=false;
            this.notAdoptLabel.visible=true;
            this.goBtn.visible=false;
        }
    }
}