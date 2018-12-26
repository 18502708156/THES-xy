/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/6/5 14:01
 * @meaning: 师徒出师奖励详情
 * 
 **/


class TeacherDepartItem extends BaseView {
    /////////////////////////////////////////////////////////////////////////////
    // TeacherItemDepart.exml
    /////////////////////////////////////////////////////////////////////////////
    protected lbNe: eui.Label;
    protected listViewL: eui.List;
    protected listViewR: eui.List;
    protected btnDepart: eui.Button;
    protected lbFree: eui.Label;
    protected mPriceIcon: PriceIcon;
    
    
    /////////////////////////////////////////////////////////////////////////////
	
	private oData;//师徒数据
	private nType = 1; //1 完美出师 2普通出师		


	public constructor() {
		super();
		this.skinName = "TeacherItemDepart";
        this._AddClick(this.btnDepart, this.onClick)

        this.listViewL.itemRenderer = ItemBaseNotName
        this.listViewR.itemRenderer = ItemBaseNotName
	}

	

	public onUpdate(_type): void {
		this.nType = _type ||1
		this.oData =  GlobalConfig.ins().GraduateConfig[this.nType]
        this.onUpdateContent()
	}



    private onUpdateContent() {
        if(this.oData.pupilreward&&this.oData.masterreward)
        {
            this.listViewL.dataProvider = new eui.ArrayCollection(this.oData.pupilreward)
            this.listViewR.dataProvider = new eui.ArrayCollection(this.oData.masterreward)
        }

        if(this.nType ===2)
        {
            this.lbFree.visible = false
            this.mPriceIcon.visible = true
            if(this.oData.cost[0])
            {
                this.mPriceIcon.setType(this.oData.cost[0].id)
                this.mPriceIcon.setPrice(this.oData.cost[0].count)
            }
            this.lbNe.text = "完美出师"
        }
        else
        {
            this.mPriceIcon.visible = false
            this.lbFree.visible = true
            this.lbNe.text = "普通出师"
        }
    }

	private onClick(e: egret.TouchEvent)
	{
		switch (e.target) {
				case this.btnDepart:
                    let id = GameGlobal.TeacherController.getTeacherIdInFirst()
                    if (this.nType == 2) {
                        if (Checker.CheckDatas(this.oData.cost, false)) {
                            if(id) {
                                GameGlobal.TeacherManage.graduation(id,this.nType)
                            }
                        }
                    } else {
                        if(id) {
                            GameGlobal.TeacherManage.graduation(id,this.nType)
                        }
                    }
				break
			}
	}



}

