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
var GBattleDragonItem = (function (_super) {
    __extends(GBattleDragonItem, _super);
    function GBattleDragonItem() {
        return _super.call(this) || this;
    }
    GBattleDragonItem.prototype.childrenCreated = function () {
    };
    GBattleDragonItem.prototype.SetGuardInfo = function (info) {
        this.imgFace.source = ResDataPath.GetHeadImgName(info.mJob, info.mSex);
        this.labName.text = info.mName + ".S" + info.mServerId;
        this.labDesc.text = info.mGangName ? "(" + info.mGangName + ")" : "";
    };
    GBattleDragonItem.prototype.SetMonsterInfo = function (icon, name) {
        this.imgFace.source = icon;
        this.labName.text = name;
        this.labDesc.text = "";
    };
    GBattleDragonItem.prototype.SetLeader = function (flag) {
        this.imgLeader.visible = flag;
    };
    return GBattleDragonItem;
}(eui.Component));
__reflect(GBattleDragonItem.prototype, "GBattleDragonItem", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=GBattleDragonItem.js.map