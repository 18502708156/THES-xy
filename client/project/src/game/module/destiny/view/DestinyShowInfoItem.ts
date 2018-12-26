/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/7/10 16:51
 * @meaning: 灵童命格详细信息
 * 
 * 
 **/


class DestinyShowInfoItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // DestinyShowInfoSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected lbFight: eui.Label;
    protected nameLabel: eui.Label;
    protected lbInfo0: eui.Label;
    protected lbInfo1: eui.Label;
    /////////////////////////////////////////////////////////////////////////////




    private _totalNum = 0


    public constructor() {
        super();
        // 皮肤名称
        this.skinName = "DestinyShowInfoSkin";


    }

    public dataChanged(): void {

        if (this.data) {
          this.nameLabel.text  = this.data.name || ""

			let strPower = ""
			let strArr1 = ""
			let strArr2 = ""
			if (this.data.attars) {
				strPower = "战力+" + ItemConfig.CalcAttrScoreValue(this.data.attars)
				if (this.data.attars[0]) {
					strArr1 = AttributeData.getAttStrByType(this.data.attars[0], 0, "+", false, '#682f00');
				}
				if (this.data.attars[1]) {
					strArr2 = AttributeData.getAttStrByType(this.data.attars[1], 0, "+", false, '#682f00');
				}
			}
			this.lbFight.text = strPower

			if (this.data.desc) {
				strArr1 = this.data.desc
			}

			this.lbInfo0.text = strArr1
			this.lbInfo1.text = strArr2


        }




    }




    

}