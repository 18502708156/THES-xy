/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/27 14:35
 * @meaning: 丹药界面
 *
 **/
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
var RoleElixirPanel = (function (_super) {
    __extends(RoleElixirPanel, _super);
    function RoleElixirPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mItems = [];
        _this.nSelectIndex = 0;
        _this.tElixirData = [];
        _this.tDanYaoName = ["生命丹", "攻击丹", "防御丹", "命中丹", "闪避丹", "暴击丹", "抗暴丹", "攻速丹"];
        _this.tDanYaoImg = ["2006701", "2006702", "2006703", "2006704", "2006705", "2006706", "2006707", "2006708"];
        _this.skinName = "RoleElixirSkin";
        _this.name = '丹药';
        return _this;
    }
    RoleElixirPanel.prototype.childrenCreated = function () {
        this._AddClick(this.btnUp, this.onCkick);
        this.observe(MessageDef.ROLE_ELIXIR_UPDATE, this.UpdateContent);
        this.commonWindowBg.SetTitle("丹药");
        for (var i = 0; i <= 7; i++) {
            var item = this["g" + i];
            item.currentState = "open";
            this.mItems[i] = item;
            this._AddClick(item, this._OnItemClick);
        }
    };
    RoleElixirPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        GameGlobal.MessageCenter.dispatch(MessageDef.ROLE_ELIXIR_UPDATE);
        this.nSelectIndex = 0;
        this.UpdateContent();
    };
    RoleElixirPanel.prototype.onCkick = function (e) {
        var pData = this.getNowSelctDanYao();
        if (pData) {
            if (UserBag.CheckEnough(pData.itemid.id, pData.itemid.count)) {
                GameGlobal.UserElixir.useElixir(pData.posId);
                // this.localCanUp(true)
            }
        }
    };
    RoleElixirPanel.prototype.getNowSelctDanYao = function () {
        return this.tElixirData[this.nSelectIndex];
    };
    RoleElixirPanel.prototype.upDateData = function () {
        this.tElixirData = GameGlobal.UserElixir.getElixirData(); //
    };
    RoleElixirPanel.prototype.UpdateContent = function () {
        this.upDateData();
        this.localCanUpPos();
        var selectIndex = this.nSelectIndex;
        for (var i = 0; i < this.mItems.length; i++) {
            var item = this.mItems[i];
            item.img_select.visible = i == selectIndex;
            this.UpdateItem(i);
        }
        this.upDateInfo();
    };
    RoleElixirPanel.prototype.upDateInfo = function () {
        var pData = this.getNowSelctDanYao();
        if (this.nSelectIndex <= this.tDanYaoName.length) {
            this.lbName.text = this.tDanYaoName[this.nSelectIndex];
        }
        //消耗物品
        this.needItemView.SetItemId(pData.itemid.id, pData.itemid.count);
        //已使用
        UIHelper.SetLabelText(this.lbHasUse, "已使用：", pData.level + "");
        //属性加成
        this.tattr.text = AttributeData.getAttStr(pData.attrpower, 0, 1, '：');
        //战力
        this.powerLabel.text = ItemConfig.CalcAttrScoreValue(GameGlobal.UserElixir.getElixirArr());
        //总属性战力
        var attr;
        for (var i = 0; i < 8; i++) {
            attr = GameGlobal.UserElixir.getElixirArr()[i];
            if (attr) {
                this['totalAttr' + i].text = AttributeData.getAttStrByType(attr, 0, "+", false, '#682f00');
            }
            else {
                this['totalAttr' + i].text = '';
            }
        }
    };
    //定位到可以升级的地方 _bFirstMy是否以当前
    // localCanUp(_bFirstMy) {
    //     if (_bFirstMy) {
    //         //已经有选择的位置
    //         if (this.tElixirData[this.nSelectIndex]) {
    //             var nSelectId = this.tElixirData[this.nSelectIndex].itemid.id
    //             var nHaveNums = GameGlobal.UserBag.GetCount(nSelectId)
    //             if (GameGlobal.UserBag.GetCount(nSelectId) > this.tElixirData[this.nSelectIndex].itemid.count) {
    //                 ////如果发现当前可以继续升级的话,选择的位置不发生改变
    //                 return
    //             }
    //         }
    //     }
    //     var bFind = false
    //     for (const item in this.tElixirData) {
    //         var nGetId = this.tElixirData[item].itemid.id
    //         if (nGetId) {
    //             if (GameGlobal.UserBag.GetCount(nGetId) >= this.tElixirData[item].itemid.count) {
    //                 this.nSelectIndex = this.tElixirData[item].posId //定位到可以升级的地方
    //                 bFind = true
    //                 break
    //             }
    //         }
    //     }
    //     if (!bFind) {
    //         this.nSelectIndex = 0 //重置到0的位置
    //     }
    // }
    RoleElixirPanel.prototype.localCanUpPos = function () {
        if (this.tElixirData[this.nSelectIndex]) {
            var selectId = this.tElixirData[this.nSelectIndex].itemid.id;
            if (GameGlobal.UserBag.GetCount(selectId) >= this.tElixirData[this.nSelectIndex].itemid.count)
                return;
        }
        for (var item in this.tElixirData) {
            var nGetId = this.tElixirData[item].itemid.id;
            if (nGetId) {
                if (GameGlobal.UserBag.GetCount(nGetId) >= this.tElixirData[item].itemid.count) {
                    this.nSelectIndex = this.tElixirData[item].posId;
                    break;
                }
            }
        }
    };
    RoleElixirPanel.prototype.UpdateItem = function (itemIndex) {
        var item = this.mItems[itemIndex];
        if (itemIndex <= this.tDanYaoName.length) {
            item.lb_name.text = this.tDanYaoName[itemIndex];
            var strImg = this.tDanYaoImg[itemIndex];
            item.img_icon.source = ResDataPath.GetItemFullPath(strImg);
        }
        var strLv = "";
        if (this.tElixirData[itemIndex] && this.tElixirData[itemIndex].level) {
            if (this.tElixirData[itemIndex].level > 0) {
                strLv = this.tElixirData[itemIndex].level;
            }
        }
        item.lb_level.text = strLv;
        item.lb_name.textColor = 0x682f00;
        UIHelper.ShowRedPoint(item, this.tElixirData[itemIndex].itemid.count <= GameGlobal.UserBag.GetCount(this.tElixirData[itemIndex].itemid.id));
    };
    RoleElixirPanel.prototype._OnItemClick = function (e) {
        var index = this.mItems.indexOf(e.currentTarget);
        this.nSelectIndex = index;
        this.UpdateContent();
    };
    RoleElixirPanel.prototype.OnClose = function () {
    };
    RoleElixirPanel.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return Deblocking.Check(DeblockingType.TYPE_29);
    };
    RoleElixirPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return RoleElixirPanel;
}(BaseEuiView));
__reflect(RoleElixirPanel.prototype, "RoleElixirPanel", ["ICommonWindow"]);
//# sourceMappingURL=RoleElixirPanel.js.map