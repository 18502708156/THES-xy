/**
 * 扫荡模块 
 */
class TsumKoBaseMoppingUpPanel extends BaseView
{
	 //skinName

    // TsumKoBaseMoppingUpSkin.exml
	
	//扫荡Btn
    public onceBtn:eui.Button;
	//一键扫荡Btn
	private allBtn:eui.Button;

	public constructor()
	{
		super()
	}


	public childrenCreated() 
	{
		this._AddClick(this.onceBtn, this._OnClick);
		this._AddClick(this.allBtn, this._OnClick);
	}

    public OnOpen()
	{
        
    }
	  private _OnClick(e: egret.TouchEvent) {
        switch (e.currentTarget) {
            case this.onceBtn:
				let id=GameGlobal.TsumKoBaseModel.recordId;
				if(id==0)
				{
					id=(GameGlobal.TsumKoBaseModel.chapterid-1)*9+1
				}
				GameGlobal.TsumKoBaseModel.SendSweep(GameGlobal.Config.DisasterFbConfig[id].id);
			break
            case this.allBtn:
				GameGlobal.TsumKoBaseModel.SendSweepAll();
			break 
        }
    }

	
}


