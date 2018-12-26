/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/27 17:01
 * @meaning: 灵童命格属性内容详情
 * 
 **/


//打造的信息框
class DestinyInfoRect extends BaseView {

    /////////////////////////////////////////////////////////////////////////////
    // DestinyRectInfoSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected lbArr0: eui.Label;
    protected lbArr1: eui.Label;
    protected lbArr2: eui.Label;
    protected lbArr3: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	tListLb: eui.Label[] = []

	public constructor() {
		super();
		this.skinName = "DestinyRectInfoSkin";

		for(let i= 0;i<4;i++)
		{
			this.tListLb[i] =  this["lbArr" + i]
		}

	}



	onUpdate(_data: {quality: number, list: string[]}): void {
		if(_data)
		{
			this.tListLb[0].textColor = ItemBase.QUALITY_COLOR[_data.quality]
			for (const item in this.tListLb) {
				let str = _data.list[item] || ""
				this.tListLb[item].text =  str
			}
		}
	}




}

