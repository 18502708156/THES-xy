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
var GBRoleHead = (function (_super) {
    __extends(GBRoleHead, _super);
    function GBRoleHead() {
        return _super.call(this) || this;
    }
    GBRoleHead.prototype.childrenCreated = function () {
    };
    GBRoleHead.prototype.SetPlayerInfo = function (info, no) {
        this.labNo.text = "" + no;
        this.labNo.textColor = GBRoleHead.Color_Type[no - 1];
        this.imgFace.source = ResDataPath.GetHeadImgName(info.mJob, info.mSex);
        this.labName.text = "" + info.mName;
        this.labServer.text = "S" + info.mServerId;
    };
    GBRoleHead.Color_Type = [0xdb0000, 0xd27701, 0xc400fd];
    return GBRoleHead;
}(eui.Component));
__reflect(GBRoleHead.prototype, "GBRoleHead", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=GBRoleHead.js.map