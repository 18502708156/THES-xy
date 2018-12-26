/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/4 11:15
 * @meaning: 法宝普通数据类
 *
 **/
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var TreasureData = (function () {
    function TreasureData() {
    }
    //装备列表
    TreasureData.prototype.updateByuseSpells = function (_data) {
        this.initData(_data.spellsNo, _data.lv, _data.skillList);
        this.level = _data.lv;
    };
    //升级装备
    TreasureData.prototype.updateUpuseSpells = function (_data) {
        this.level = _data.lv;
        var pSpellsLv = this.SpellsResLvproConfig ? this.SpellsResLvproConfig[this.level - 1] : null;
        if (pSpellsLv) {
            this.cost = pSpellsLv.cost || [];
            this.attrs = pSpellsLv.attrs || [];
            this.tiptext = pSpellsLv.tiptext || "";
            this.attrstips = pSpellsLv.attrstips || "";
        }
    };
    //拥有列表
    TreasureData.prototype.spellsList = function (_data) {
        this.initData(_data.spellsNo, 1, _data.skillList);
        this.lock = _data.lock || 0; // #0没锁 1锁了
        this.spellsId = _data.spellsId || 0; //对应操作时用的id
    };
    TreasureData.prototype.replace = function (data) {
        this.initData(data.spellsNo, 1, data.oldSkillList);
        this.lock = data.lock || 0; // #0没锁 1锁了
        this.spellsId = data.spellsId || 0; //对应操作时用的id
    };
    TreasureData.prototype.initData = function (_spellsNo, _lv, skills) {
        if (_spellsNo && _lv) {
            var pSpellsList = GlobalConfig.ins().SpellsResListConfig[_spellsNo] || {};
            this.SpellsResLvproConfig = GlobalConfig.ins().SpellsResLvproConfig[_spellsNo];
            if (!this.SpellsResLvproConfig) {
                return;
            }
            var pSpellsLv = this.SpellsResLvproConfig[_lv - 1] || {};
            this.id = pSpellsList.id || 0;
            this.quality = pSpellsList.quality || 0;
            this.name = pSpellsList.name || "";
            this.icon = pSpellsList.icon || "";
            this.type = pSpellsList.type || 0;
            this.cost = pSpellsLv.cost || [];
            this.attrs = pSpellsLv.attrs || [];
            this.skillid = skills;
            this.tiptext = pSpellsLv.tiptext || "";
            this.attrstips = pSpellsLv.attrstips || "";
        }
    };
    return TreasureData;
}());
__reflect(TreasureData.prototype, "TreasureData");
//# sourceMappingURL=TreasureData.js.map