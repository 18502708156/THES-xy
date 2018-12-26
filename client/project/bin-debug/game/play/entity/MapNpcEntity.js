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
var MapNpcEntity = (function (_super) {
    __extends(MapNpcEntity, _super);
    function MapNpcEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MapNpcEntity.prototype.UpdateInfo = function (model) {
        this.UpateName(model.GetName());
        _super.prototype.UpdateInfo.call(this, model);
    };
    MapNpcEntity.prototype.UpateName = function (str) {
        if (!str) {
            if (this.m_NameTxt)
                this.m_NameTxt.visible = false;
            return;
        }
        if (!this.m_NameTxt) {
            this.m_NameTxt = new MapEntityTxt;
        }
        else {
            this.m_NameTxt.visible = true;
        }
        this.addChild(this.m_NameTxt);
        this.m_NameTxt.textFlow = TextFlowMaker.generateTextFlow(str);
    };
    return MapNpcEntity;
}(RoleBattleEntity));
__reflect(MapNpcEntity.prototype, "MapNpcEntity");
//# sourceMappingURL=MapNpcEntity.js.map