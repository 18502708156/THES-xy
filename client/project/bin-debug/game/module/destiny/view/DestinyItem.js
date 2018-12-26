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
var DestinyItem = (function (_super) {
    __extends(DestinyItem, _super);
    function DestinyItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "DestinyItemSkin";
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onClick, _this);
        return _this;
    }
    DestinyItem.prototype.onUpdate = function (_data) {
        this.data = _data;
        if (_data.data != null) {
            this.imgAdd.visible = !_data.data;
            this.lbLock.text = " ";
            var pData = _data.data;
            if (pData.level) {
                this.lbLv.text = "Lv." + pData.level;
                this.imgIcon.visible = true;
                var config = GlobalConfig.ins().ItemConfig[pData.item];
                this.imgIcon.source = ResDataPath.GetItemFullPath(config.icon);
                this.imgBg.source = ResDataPath.GetItemQualityName(config.quality);
            }
            else {
                this.imgBg.source = ResDataPath.GetItemQualityName(0);
                this.imgIcon.visible = false;
                this.imgAdd.visible = true;
                this.lbLv.text = "";
            }
        }
        else {
            this.imgAdd.visible = false;
            var level = DestinyConst.GetLockLevel(_data.num);
            this.lbLock.text = level + "阶\n解锁";
            this.imgBg.source = ResDataPath.GetItemQualityName(0);
            this.imgIcon.visible = false;
            this.lbLv.text = "";
        }
        this.imgSelect.visible = _data.index;
        this.imgRed.visible = GameGlobal.DestinyController.mRedPoint.IsRedUp(_data.num);
    };
    // public setHandle(_callBack) {
    // 	if(_callBack)
    // 	{
    // 		this.callBack =_callBack
    // 	}
    // }
    DestinyItem.prototype.onClick = function (e) {
        MessageCenter.ins().dispatch(MessageDef.DESTINY_CLICK, this.data.num);
    };
    return DestinyItem;
}(eui.Component));
__reflect(DestinyItem.prototype, "DestinyItem");
//# sourceMappingURL=DestinyItem.js.map