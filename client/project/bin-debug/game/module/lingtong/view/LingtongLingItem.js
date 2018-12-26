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
var LingtongLingItem = (function (_super) {
    __extends(LingtongLingItem, _super);
    function LingtongLingItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "PetLingItemSkin";
        return _this;
    }
    LingtongLingItem.prototype.data = function (petId, index) {
        this._petId = petId;
        this._index = index;
        var petInfo = GameGlobal.LingtongPetModel.GetInfo(petId);
        var lingLv = petInfo ? petInfo.getLingByIndex(index) : 0;
        if (lingLv == 0) {
            var canOpen = GameGlobal.LingtongPetModel.canOpenLingByIndex(petId, index);
            this.txt.textColor = canOpen ? Color.l_green_1 : Color.l_brown_2;
            this.txt.text = canOpen ? "可激活" : GameGlobal.LingtongPetModel.openLingConditionStr(petId, index) + "\r御灵可激活";
        }
        else {
            var currentAttrList = GameGlobal.LingtongPetModel.getLingAttrByIndex(petId, index);
            this.txt.textColor = Color.l_brown_2;
            this.txt.text = AttributeData.getAttStrByType(currentAttrList[0], 0, "+", false, "#ffffff");
        }
        if (!this.mMc) {
            this.mMc = new MovieBaseObject;
            this.effGroup.addChild(this.mMc);
        }
        this.mMc.LoadByUrl(ResDataPath.GetUIEffePath("ui_eff_yuling_00" + LingtongLingItem.EFFIDS[lingLv]), -1, true);
        this.UpdateRedPoint();
    };
    LingtongLingItem.prototype.UpdateRedPoint = function () {
        if (!this.redPoint) {
            return;
        }
        this.redPoint.visible = GameGlobal.LingtongPetModel.IsRedPointUpLings(GameGlobal.LingtongPetModel.GetInfo(this._petId), this._index);
    };
    Object.defineProperty(LingtongLingItem.prototype, "select", {
        set: function (value) {
            this.mMc.scaleX = this.mMc.scaleY = value ? 1.6 : 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LingtongLingItem.prototype, "index", {
        get: function () {
            return this._index;
        },
        enumerable: true,
        configurable: true
    });
    LingtongLingItem.EFFIDS = (_a = {},
        _a[0] = 6,
        _a[1] = 5,
        _a[2] = 1,
        _a[3] = 2,
        _a[4] = 3,
        _a[5] = 4,
        _a);
    return LingtongLingItem;
}(eui.Component));
__reflect(LingtongLingItem.prototype, "LingtongLingItem");
var _a;
//# sourceMappingURL=LingtongLingItem.js.map