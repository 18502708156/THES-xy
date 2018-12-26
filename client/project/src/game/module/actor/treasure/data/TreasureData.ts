/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/4 11:15
 * @meaning: 法宝普通数据类
 * 
 **/

class TreasureData {

    //法宝列表
    id// 法宝ID
    quality//品质
    name//法宝名称
    icon//法宝图标

    //法宝技能列表
    private SpellsResLvproConfig: any

    cost//升级消耗
    attrs//属性值（增加值）
    skillid: number[]//技能ID
    tiptext//提示等级
    attrstips //技能增加属性提示
    type  //类型



    //自定义字段
    lock //0代表没有锁 1代表锁了
    level //等级
    spellsId //对应操作时用的id



    //装备列表
    public updateByuseSpells(_data: Sproto.spellsAttr) {
        this.initData(_data.spellsNo, _data.lv, _data.skillList)
        this.level = _data.lv
    }


    //升级装备
    public updateUpuseSpells(_data: Sproto.cs_spellsRes_up_lv_response) {
        this.level = _data.lv

        var pSpellsLv = this.SpellsResLvproConfig ? this.SpellsResLvproConfig[this.level - 1] : null
        if (pSpellsLv) {
            this.cost = pSpellsLv.cost || []
            this.attrs = pSpellsLv.attrs || []
            this.tiptext = pSpellsLv.tiptext || ""
            this.attrstips = pSpellsLv.attrstips || ""
        }
    }

    //拥有列表
    public spellsList(_data: Sproto.spellsData) {
        this.initData(_data.spellsNo, 1, _data.skillList)
        this.lock = _data.lock || 0// #0没锁 1锁了
        this.spellsId = _data.spellsId || 0//对应操作时用的id
    }

    public replace(data: Sproto.cs_spellsRes_use_response) {
        this.initData(data.spellsNo, 1, data.oldSkillList)
        this.lock = data.lock || 0// #0没锁 1锁了
        this.spellsId = data.spellsId || 0//对应操作时用的id
    }


    public initData(_spellsNo: number, _lv: number, skills: number[]) {

        if (_spellsNo && _lv) {
            var pSpellsList = GlobalConfig.ins().SpellsResListConfig[_spellsNo] || {}
            this.SpellsResLvproConfig = GlobalConfig.ins().SpellsResLvproConfig[_spellsNo]
            if (!this.SpellsResLvproConfig) {
                return
            }
            var pSpellsLv = this.SpellsResLvproConfig[_lv - 1] || {}

            this.id = pSpellsList.id || 0
            this.quality = pSpellsList.quality || 0
            this.name = pSpellsList.name || ""
            this.icon = pSpellsList.icon || ""
            this.type = pSpellsList.type || 0

            this.cost = pSpellsLv.cost || []
            this.attrs = pSpellsLv.attrs || []
            this.skillid = skills
            this.tiptext = pSpellsLv.tiptext || ""
            this.attrstips = pSpellsLv.attrstips || ""
        }
    }
}