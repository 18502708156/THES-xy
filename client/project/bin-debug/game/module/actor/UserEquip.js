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
var UserEquip = (function (_super) {
    __extends(UserEquip, _super);
    function UserEquip() {
        var _this = _super.call(this) || this;
        _this.mDeityEquipRP = new DeityEquipRedPoint;
        _this.regNetMsg(S2cProtocol.sc_equip_update_data, _this.doUpDataEquip);
        _this.regNetMsg(S2cProtocol.sc_bag_deal_smelt_result, _this.doSmeltREquip);
        return _this;
    }
    // timeID: number = 0;
    // private m_CheckTimer: CheckTimer
    UserEquip.ins = function () {
        return _super.ins.call(this);
    };
    /**
    * 发送传装备
    * @param itemHandle	道具唯一标识
    * @param pos		   道具位置
    */
    UserEquip.prototype.sendWearEquipment = function (itemHandle, pos) {
        var cs_equip_wear = new Sproto.cs_equip_wear_request();
        cs_equip_wear.itemHandle = itemHandle;
        cs_equip_wear.pos = pos;
        GameSocket.ins().Rpc(C2sProtocol.cs_equip_wear, cs_equip_wear);
    };
    ;
    /**
     * 熔炼装备
     * @return 是否成功发送
     */
    UserEquip.prototype.sendSmeltEquip = function (arr) {
        var cs_bag_smelt = new Sproto.cs_bag_smelt_request();
        cs_bag_smelt.type = 0; //后端已弃用
        cs_bag_smelt.itemHandle = new Array();
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != null) {
                cs_bag_smelt.itemHandle.push(arr[i].handle);
            }
        }
        if (cs_bag_smelt.itemHandle.length == 0)
            return false;
        GameSocket.ins().Rpc(C2sProtocol.cs_bag_smelt, cs_bag_smelt);
        return true;
    };
    /**
     * 处理装备更新
     */
    UserEquip.prototype.doUpDataEquip = function (rsp) {
        var equipPos = rsp.equipPos;
        var item = new ItemData;
        item.parser(rsp.data);
        var role = SubRoles.ins().GetRoleData();
        var equip = role.getEquipByIndex(equipPos);
        equip.item = item;
        equip.deityEquipData.UpdateInfo(rsp.reddata);
        GameGlobal.MessageCenter.dispatch(MessageDef.CHANGE_EQUIP);
    };
    ;
    /**
     * 处理装备熔炼返回结果
     */
    UserEquip.prototype.doSmeltREquip = function (rsp) {
        var state = rsp.state;
        if (state == 0) {
            UserTips.ins().showTips("|C:0xff0000&T:熔炼失败！|");
            return;
        }
        var goldCount = rsp.goldCount;
        var len = rsp.len;
        this.SmeltEquipComplete();
    };
    ;
    /**派发处理装备熔炼返回结果 消息*/
    UserEquip.prototype.SmeltEquipComplete = function () {
        GameGlobal.MessageCenter.dispatch(MessageDef.BAG_DEAL_SMELT);
    };
    /** 对比装备返回高战力的装备 */
    UserEquip.contrastEquip = function (sourceItem, item) {
        if (!sourceItem || sourceItem.handle == 0)
            return item;
        if (!item || item.handle == 0)
            return sourceItem;
        if (item.GetScore() > sourceItem.GetScore())
            return item;
        else
            return sourceItem;
    };
    /**
     * 通过角色，部位，获取玩家对应角色的对应部位装备
     * @param job
     * @param pos 面板类型 0 强化 1 宝石 2 注灵 3 突破
     */
    UserEquip.prototype.getEquipsByJobNPos = function (job, pos) {
        var roles = SubRoles.ins().GetRoleData();
        if (roles.job == job)
            return roles.getEquipByIndex(pos);
        return null;
    };
    ;
    UserEquip.GetEquipId = function (equiptype, lv, quality, job) {
        return 100000 + lv + equiptype * 10000 + quality * 100 + 1000 * job;
    };
    // 通过装备位置跟品质获取配置ID，job不传就默认为1,有equipRole和equipPos表示要对比对应装备找到刚好评分大一点的
    // public getEquipConfigIDByPosAndQuality(equiptype, quality, job: number = 1, equipRoleIndex: number = -1, equipPos: number = -1) {
    //     var zhuan = UserZs.ins().lv || 0;
    //     var level = GameLogic.ins().actorModel.level;
    //     var configID = 100000 + 1 + equiptype * 10000 + quality * 100 + 1000 * job;
    //     for (var i = 1; i < 99; i++) {
    //         var id = 100000 + i + equiptype * 10000 + quality * 100 + 1000 * job;
    //         var config = GlobalConfig.ins().ItemConfig[id];
    //         if (config != undefined) {
    //             if (equipRoleIndex != -1) {
    //                 var score = ItemConfig.pointCalNumber(config);
    //                 var curEquip = SubRoles.ins().getSubRoleByIndex(equipRoleIndex).getEquipByIndex(equipPos);
    //                 var curScore = 0;
    //                 if (curEquip && curEquip.item.configID) {
    //                     curScore = ItemConfig.calculateBagItemScore(curEquip.item);
    //                 }
    //                 if (curScore < score) {
    //                     configID = id;
    //                     break;
    //                 }
    //             }
    //             if (config.zsLevel <= zhuan && config.level <= level) {
    //                 configID = id;
    //             } else {
    //                 break;
    //             }
    //         } else {
    //             break;
    //         }
    //     }
    //     return configID;
    // };
    UserEquip.prototype.checkEquipsIsWear = function (item) {
        var role = SubRoles.ins().GetRoleData();
        var equipLen = role.getEquipLen();
        for (var j = 0; j < equipLen; j++) {
            if (item.handle == role.getEquipByIndex(j).item.handle) {
                return true;
            }
        }
        return false;
    };
    ;
    //合成神装
    UserEquip.prototype.SendComposeDeityEquip = function (pos) {
        var req = new Sproto.cs_equip_red_generate_request;
        req.slot = pos;
        this.Rpc(C2sProtocol.cs_equip_red_generate, req);
    };
    //神装觉醒
    UserEquip.prototype.SendDeityEquipAwake = function (pos) {
        var req = new Sproto.cs_equip_red_upgrade_request;
        req.slot = pos;
        this.Rpc(C2sProtocol.cs_equip_red_upgrade, req);
    };
    //神装注灵
    UserEquip.prototype.SendDeityEquipInjectSoul = function (pos, payType) {
        var req = new Sproto.cs_equip_red_inject_request;
        req.slot = pos;
        req.mode = payType;
        this.Rpc(C2sProtocol.cs_equip_red_inject, req, function (rsp) {
            if (!rsp.ret)
                UserTips.ins().showTips("注灵失败");
        }, this);
    };
    //获取第一位神装位置
    UserEquip.prototype.GetDeityEquipPos = function () {
        var roleModel = GameGlobal.SubRoles.GetRoleData();
        for (var idx = 0; idx < 10; idx++) {
            var equipData = roleModel.getEquipByIndex(idx);
            var curId = equipData.item.configID;
            if (DeityEquipConst.IsDeityEquip(curId))
                return idx;
        }
        return -1;
    };
    //获取身上穿戴的神装数量
    UserEquip.prototype.GetDeityEquipNum = function () {
        var num = 0;
        var roleModel = GameGlobal.SubRoles.GetRoleData();
        for (var idx = 0; idx < 10; idx++) {
            var equipData = roleModel.getEquipByIndex(idx);
            var curId = equipData.item.configID;
            if (DeityEquipConst.IsDeityEquip(curId))
                num++;
        }
        return num;
    };
    //获取注灵总等级
    UserEquip.prototype.GetDeityEquipInjectLevel = function () {
        var num = 0;
        var roleModel = GameGlobal.SubRoles.GetRoleData();
        for (var idx = 0; idx < 10; idx++) {
            var equipData = roleModel.getEquipByIndex(idx);
            var curId = equipData.item.configID;
            if (DeityEquipConst.IsDeityEquip(curId))
                num += equipData.deityEquipData.injectLevel;
        }
        return num;
    };
    //指定位置的神装是否可觉醒或合成
    UserEquip.prototype.CanTheDeityEquipAwake = function (pos) {
        var roleModel = GameGlobal.SubRoles.GetRoleData();
        if (!roleModel) {
            return;
        }
        var equipData = roleModel.getEquipByIndex(pos);
        var curId = equipData.item.configID;
        var nextEquipId = DeityEquipConst.GetNextDeityEquipId(curId, pos);
        var nextConfig = GameGlobal.Config.ItemConfig[nextEquipId];
        if (nextConfig && nextConfig.level > GameGlobal.actorModel.level)
            return false;
        if (DeityEquipConst.IsMaxAwakeLevel(curId))
            return false;
        var cost = DeityEquipConst.GetAwakeCost(curId, pos);
        return Checker.Data(cost, false);
    };
    //是否有神装可觉醒或合成
    UserEquip.prototype.HasDeityEquipAwake = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_32, true))
            return false;
        for (var idx = 0; idx < 10; idx++) {
            if (this.CanTheDeityEquipAwake(idx))
                return true;
        }
        return false;
    };
    //指定位置的神装是否可注灵
    UserEquip.prototype.CanTheDeityEquipInject = function (pos) {
        var roleModel = GameGlobal.SubRoles.GetRoleData();
        var equipData = roleModel.getEquipByIndex(pos);
        var curId = equipData.item.configID;
        if (!DeityEquipConst.IsDeityEquip(curId))
            return false;
        var injectLv = equipData.deityEquipData.injectLevel;
        if (DeityEquipConst.IsMaxInjectLevel(pos, injectLv))
            return false;
        var cost = DeityEquipConst.GetInjectCost(pos, injectLv + 1);
        return Checker.Data(cost, false);
    };
    //是否有神装可注灵
    UserEquip.prototype.HasDeityEquipInject = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_32, true))
            return false;
        for (var idx = 0; idx < 10; idx++) {
            if (this.CanTheDeityEquipInject(idx))
                return true;
        }
        return false;
    };
    UserEquip.prototype.HasDeityEquipResolve = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_32, true))
            return false;
        return GameGlobal.UserBag.getBagEquipByLevelSort(ITEM_QUALITY.RED_QUALITY).length > 0;
    };
    return UserEquip;
}(BaseSystem));
__reflect(UserEquip.prototype, "UserEquip");
//# sourceMappingURL=UserEquip.js.map