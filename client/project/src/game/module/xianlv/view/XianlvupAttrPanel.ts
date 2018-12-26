class XianlvupAttr extends eui.Component implements eui.UIComponent {
    public constructor() {
        super();
    }

    public starLv0: eui.Label;
    public text0: eui.Label;
    public text1: eui.Label;
    public text2: eui.Label;
    public skilltext0: eui.Label;
    public starLv1: eui.Label;
    public newtext0: eui.Label;
    public newtext1: eui.Label;
    public newtext2: eui.Label;
    public skilltext1: eui.Label;
    public zdl: eui.Label;
    public skill0: eui.Image
    public skill1: eui.Image
    public say0: eui.Label
    public say1: eui.Label

    addAttrType(attrs0, attrs1) {
        for (let i = 0; i < attrs0.length; i++) {
            if (attrs0[i].type == attrs1[i].type) {
                attrs0[i].value += attrs1[i].value
            }
        }
        return attrs0
    }

    setAttrNol(attr0, attr1) {
        this.currentState = "normal";
        for (let i = 0; i < attr0.length; i++) {
            this["text" + i].text = AttributeData.TYPE_TO_NAME[attr0[i].type] + "+" + attr0[i].value
        }
        for (let i = 0; i < attr0.length; i++) {
            this["newtext" + i].text = AttributeData.TYPE_TO_NAME[attr1[i].type] + "+" + attr1[i].value
        }
        //ItemConfig.CalcAttrScoreValue(attr0)
        this.zdl.text = "战斗力：+" + (ItemConfig.CalcAttrScoreValue(attr1) - ItemConfig.CalcAttrScoreValue(attr0))
    }

    setAttrFull(attr0) {
        this.currentState = "full";
        for (let i = 0; i < attr0.length; i++) {
            this["text" + i].text = AttributeData.TYPE_TO_NAME[attr0[i].type] + "+" + attr0[i].value
        }
    }

    setStarNol(Star, NextStar) {
        this.starLv0.text = Star
        this.starLv1.text = NextStar
    }

    setStarFull(Star) {
        this.starLv0.text = Star
    }

    setSkillNol(skill0:any[], skill1:any[]) {
        this.skill0.source = skill0[0]
        this.skilltext0.text = skill0[1]
        this.say0.text = skill0[2]
        this.skill1.source = skill1[0]
        this.skilltext1.text = skill1[1]
        this.say1.text = skill1[2]
    }

    setSkillFull(skill0:any[]) {
        this.skill0.source = skill0[0]
        this.skilltext0.text = skill0[1]
        this.say0.text = skill0[2]
    }

}