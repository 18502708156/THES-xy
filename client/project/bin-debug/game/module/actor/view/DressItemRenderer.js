var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var DressItemRenderer = (function (_super) {
    __extends(DressItemRenderer, _super);
    function DressItemRenderer() {
        var _this = _super.call(this) || this;
        _this.skinName = "DressItemSkin";
        return _this;
    }
    DressItemRenderer.prototype.dataChanged = function () {
        // var data: DressItemInfo = this.data;
        // let timeInfo = GameGlobal.dressmodel.timeInfo;
        // if (null != data) {
        // let cfgZhuanban = GameGlobal.Config.ZhuangBanId[data.zhuanban.id]
        // let iconName = cfgZhuanban ? cfgZhuanban.cost.itemId : ""
        // iconName = GameGlobal.Config.ItemConfig[iconName] ? GameGlobal.Config.ItemConfig[iconName].icon : iconName
        // if (this.redPoint0.visible = !1, data.isUser) this.timelabel.visible = !0, this.imgIcon.source = ResDataPath.GetItemFullPath(iconName);
        // else {
        // 	this.timelabel.visible = !1
        // 	this.imgIcon.source = ResDataPath.GetItemFullPath(iconName)
        // 	// this.imgIcon.source = "dress" + e.zhuanban.id + "d_png";
        // 	//UserBag.ins().getBagGoodsCountById(0, t) >= i && (3 == data.zhuanban.pos && GameGlobal.actorModel.level <= 16 ? this.redPoint0.visible = !1 : this.redPoint0.visible = !0)
        // }
        // this.setRedVisible(data);
        // if (this.imageName.text = data.zhuanban .name, data.isDress ? this.huanhuaImage.visible = !0 : this.huanhuaImage.visible = !1, 0 == data.timer) {
        // 	this.timelabel.textFlow = (new egret.HtmlTextParser).parser("<font color='#00ff00'>永久</font>"), this.levellabel.visible = !0;
        // 	var n = GameGlobal.dressmodel.getinfoById(data.zhuanban.id);
        // 	this.levellabel.text = n.dressLevel + "级"
        // } else data.timer > 0 ? (this.timelabel.text = this.updateTimer(data.timer), this.levellabel.visible = !1) : (this.timelabel.visible = !1, this.levellabel.visible = !1)
        this.UpdateSelect();
        // }
        //隐藏用图片代替(琅琊榜)
        // this.timelabel.visible = false
        //不显示等级(琅琊榜)
        this.levellabel.visible = false;
    };
    // private setRedVisible(data:DressItemInfo):void
    // {
    // 	var t = data.zhuanban.cost.itemId,
    // 		i = data.zhuanban.cost.num;
    // 	var n = GameGlobal.dressmodel.getinfoById(data.zhuanban.id);
    // 	if(n)
    // 	{
    // 		if(UserBag.ins().getBagGoodsCountById(0, t) >= i && n.dressLevel<5 && GameGlobal.actorModel.level > 16) //&& GameGlobal.actorModel.level > 16
    // 		{
    // 			this.redPoint0.visible = true;
    // 		}else
    // 		{
    // 			this.redPoint0.visible = false;
    // 		}
    // 	}else
    // 	{
    // 		if(UserBag.ins().getBagGoodsCountById(0, t) >= i && GameGlobal.actorModel.level > 16) //&& GameGlobal.actorModel.level <= 16
    // 		{
    // 			this.redPoint0.visible = true;
    // 		}else
    // 		{
    // 			this.redPoint0.visible = false;
    // 		}
    // 	}
    // }
    DressItemRenderer.prototype.UpdateSelect = function () {
        // let data: DressItemInfo = this.data
        // if (data == null || data.context == null) {
        // 	return
        // }
        // let dressId = null
        // switch (data.zhuanban.pos) {
        // 	case DressType.ROLE:
        // 		dressId = data.context.mDressBody
        // 		break
        // 	case DressType.ARM:
        // 		dressId = data.context.mDressWeapon
        // 		break
        // 	case DressType.WING:
        // 		dressId = data.context.mDressWing
        // 		break
        // }
        // this.selectImage.visible = dressId == data.zhuanban.id
    };
    DressItemRenderer.prototype.updateTimer = function (e) {
        var t = "", i = e - GameServer.serverTime;
        return t = (i / 24 / 3600 >> 0) + "天" + (i / 3600 % 24 >> 0) + "时" + (i / 60 % 60 >> 0) + "分";
    };
    return DressItemRenderer;
}(eui.ItemRenderer));
__reflect(DressItemRenderer.prototype, "DressItemRenderer");
//# sourceMappingURL=DressItemRenderer.js.map