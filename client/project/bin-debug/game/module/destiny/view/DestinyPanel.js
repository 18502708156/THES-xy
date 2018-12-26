/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/6/27 17:01
 * @meaning: 灵童命格详情
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
var DestinyPanel = (function (_super) {
    __extends(DestinyPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function DestinyPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.tPanelData = []; //界面总体数据数据
        _this.tItemList = []; //命格列表
        _this.tBagList = []; //背包命格列表
        _this.nIndex = 0; //当前选择下标
        _this.tDestinyList = []; //命格列表
        _this.bUp = false; //能否升级命格
        _this.m_Count = 0;
        _this.skinName = "DestinySkin";
        for (var i = 0; i < 6; i++) {
            _this.tItemList.push(_this["item" + i]);
        }
        UIHelper.SetLinkStyleLabel(_this.lbGoto1, "前往获取命格"); //下划线
        return _this;
    }
    DestinyPanel.prototype.childrenCreated = function () {
    };
    DestinyPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.nIndex = param[0] || 0;
        this.observe(MessageDef.DESTINY_CHANGE, this.UpdateContent); //
        this.observe(MessageDef.DESTINY_CHANGE, this.UpdateContent); //
        this.observe(MessageDef.DESTINY_CLICK, this.onItem); //
        this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateMeatialCount);
        this.observe(MessageDef.DESTINY_RP, this.setData);
        this._AddClick(this.btnResolve, this.onClick);
        this._AddClick(this.btnShow, this.onClick);
        this._AddClick(this.btnUp, this.onClick);
        this._AddClick(this.btnEquip, this.onClick);
        this._AddClick(this.goToEquip, this.onClick);
        this._AddClick(this.lbGoto1, this.onClick);
        this._AddClick(this.powerLabel, this.onClick);
    };
    DestinyPanel.prototype.UpdateContent = function () {
        this.setData();
        this.onSelectChange();
        //所有命格战力
        this.powerLabel.text = GameGlobal.DestinyController.GetPower();
    };
    DestinyPanel.prototype.getAttrInfoLb = function () {
        var strObj = { strL: "", strR: "" };
        var count = 0;
        for (var item in this.tBagList) {
            var data = this.tBagList[item];
            if (data.attars) {
                for (var index in data.attars) {
                    var pData = data.attars[index];
                    count++;
                    var strHuan = '\n';
                    if (count % 2 == 1) {
                        strObj.strL = strObj.strL + AttributeData.getAttStrByType(pData, 0, "+", false, '#682f00') + '\n';
                    }
                    else {
                        strObj.strR = strObj.strR + AttributeData.getAttStrByType(pData, 0, "+", false, '#682f00') + '\n';
                    }
                }
            }
        }
        return strObj;
    };
    DestinyPanel.prototype.setData = function () {
        this.tBagList = GameGlobal.DestinyController.getUseDestinyData();
        for (var i = 0; i < 6; i++) {
            var tList = { index: this.nIndex == i, data: this.tBagList[i], num: i };
            this.tItemList[i].onUpdate(tList);
        }
    };
    DestinyPanel.prototype.onClick = function (e) {
        switch (e.target) {
            case this.btnResolve:
                ViewManager.ins().open(DestinyResovePanel);
                break;
            case this.btnShow:
                ViewManager.ins().open(DestinyShow);
                break;
            case this.btnUp://升级
                if (this.bUp) {
                    GameGlobal.DestinyManage.babyStartUpLv(this.nIndex + 1);
                }
                else {
                    UserTips.ins().showTips("物品不足");
                }
                break;
            case this.btnEquip://点击则打开“选择命格装备面板”
                this.ShowDestinyEquipLayer(this.nIndex);
                break;
            case this.goToEquip://点击则打开“选择命格装备面板”
                this.ShowDestinyEquipLayer(this.nIndex);
                break;
            case this.lbGoto1://点击将跳转到“逆命面板”
                ViewManager.ins().openIndex(DestinyUpWin, 1);
                break;
            case this.powerLabel://打开属性界面
                ViewManager.ins().open(DestinyArrDescPanel, this.getAttrInfoLb().strL, this.getAttrInfoLb().strR); //打开属性界面
                break;
        }
    };
    DestinyPanel.prototype.onItem = function (_num) {
        this.tBagList = GameGlobal.DestinyController.getUseDestinyData();
        if (this.tBagList[_num]) {
            var same = this.nIndex == _num;
            var openEquip = true;
            if (this.tBagList[_num].level) {
                openEquip = same;
            }
            this.nIndex = _num || 0;
            this.setData();
            this.onSelectChange();
            if (openEquip) {
                this.ShowDestinyEquipLayer(_num);
            }
        }
        else {
            UserTips.ins().showTips("灵童达到" + DestinyConst.GetLockLevel(_num) + "阶解锁");
        }
    };
    DestinyPanel.prototype.ShowDestinyEquipLayer = function (index) {
        ViewManager.ins().open(DestinyEquipLayer, this.tBagList[index], this.nIndex, false);
    };
    //选择变化
    DestinyPanel.prototype.onSelectChange = function () {
        var data = this.tBagList[this.nIndex];
        if (data) {
            if (data.item) {
                if (data.id) {
                    this.gRect0.visible = false;
                    this.gRect1.visible = true;
                    this.gRect2.visible = false;
                    //当前属性
                    var tList = this.getArrInfoList(data);
                    this.info0.onUpdate(tList);
                    var local = GlobalConfig.ins().DestinyAttrsConfig[data.id];
                    if (local) {
                        var tList_1 = this.getArrInfoList(local);
                        this.info1.onUpdate(tList_1);
                    }
                    // 显示升级所需材料
                    this.showUpMeatial(GlobalConfig.ins().DestinyResolveConfig[data.type][data.level - 1].promotestar);
                }
                else {
                    this.gRect0.visible = false;
                    this.gRect1.visible = false;
                    this.gRect2.visible = true;
                    var tList = this.getArrInfoList(data);
                    this.info2.onUpdate(tList);
                }
                return;
            }
        }
        //未装备
        this.gRect0.visible = true;
        this.gRect1.visible = false;
        this.gRect2.visible = false;
    };
    //显示升级所需材料
    DestinyPanel.prototype.showUpMeatial = function (_count) {
        this.m_Count = _count;
        this.UpdateMeatialCount();
    };
    DestinyPanel.prototype.UpdateMeatialCount = function () {
        if (this.m_Count == null) {
            this.lbGetItemNe.text = "";
            return;
        }
        var _count = this.m_Count;
        var ownStr = "";
        var upId = GlobalConfig.ins().DestinyBaseConfig.uplevelitemid;
        var curNum = UserBag.ins().GetCount(upId);
        var config = GameGlobal.Config.ItemConfig[upId];
        var strCount = curNum + "/" + _count;
        //显示升级所需材料
        if (curNum >= _count) {
            ownStr = "|C:0x6e330b&T:\u6D88\u8017: |C:0x6e330b&T:" + config.name + "|C:0x019704&T:" + strCount + "|";
            this.bUp = true;
        }
        else {
            this.bUp = false;
            ownStr = "|C:0x6e330b&T:\u6D88\u8017: |C:0x6e330b&T:" + config.name + "|C:0xdb0000&T:" + strCount + "|";
        }
        this.lbGetItemNe.textFlow = TextFlowMaker.generateTextFlow(ownStr);
    };
    DestinyPanel.prototype.getArrInfoList = function (_arr) {
        var data = {};
        var strList = [];
        data.list = strList;
        if (_arr) {
            var config = GlobalConfig.ins().ItemConfig[_arr.item];
            data.quality = config.quality;
            strList[0] = config.name;
            var strPower = "";
            var strArr1 = "";
            var strArr2 = "";
            if (_arr.attars) {
                strPower = "战力+" + ItemConfig.CalcAttrScoreValue(_arr.attars);
                if (_arr.attars[0]) {
                    strArr1 = AttributeData.getAttStrByType(_arr.attars[0], 0, "+", false, '#682f00');
                }
                if (_arr.attars[1]) {
                    strArr2 = AttributeData.getAttStrByType(_arr.attars[1], 0, "+", false, '#682f00');
                }
            }
            strList[1] = strPower;
            if (_arr.desc) {
                strArr1 = _arr.desc;
            }
            strList[2] = strArr1;
            strList[3] = strArr2;
        }
        return data;
    };
    DestinyPanel.NAME = "命格";
    return DestinyPanel;
}(BaseView));
__reflect(DestinyPanel.prototype, "DestinyPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=DestinyPanel.js.map