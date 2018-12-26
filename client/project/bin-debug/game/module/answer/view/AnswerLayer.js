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
/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/25 21:15
 * @meaning: 科举界面
 *
 **/
var AnswerLayer = (function (_super) {
    __extends(AnswerLayer, _super);
    function AnswerLayer() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.tName = []; //名字列表
        _this.tScore = []; //分数列表
        _this.tAs = []; //答案列表
        _this.tRe = []; //结果列表
        _this.nCountTime = 0; //倒计时
        _this.skinName = "AnswerSkin";
        return _this;
    }
    AnswerLayer.prototype.childrenCreated = function () {
        for (var i = 0; i <= 2; i++) {
            var item = this["lbNe" + (i + 1)];
            this.tName[i] = item;
        }
        //分数
        for (var i = 0; i <= 2; i++) {
            var item = this["lbSc" + (i + 1)];
            this.tScore[i] = item;
        }
        //答案
        for (var i = 0; i <= 3; i++) {
            var item = this["lbAs" + (i + 1)];
            this.tAs[i] = item;
        }
        //结果
        for (var i = 0; i <= 3; i++) {
            var item = this["imgAn" + (i + 1)];
            this.tRe[i] = item;
        }
    };
    AnswerLayer.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.ANSWER_CHANGE, this.UpdateContent);
        this.commonWindowBg.OnAdded(this);
        this._AddClick(this.lbRank, this.onClick);
        this._AddClick(this.imgSe1, this.onClick);
        this._AddClick(this.imgSe2, this.onClick);
        this._AddClick(this.imgSe3, this.onClick);
        this._AddClick(this.imgSe4, this.onClick);
        this.AddTimer(1000, 0, this.startUpdate); //时间更新函数
        GameGlobal.AnswerManage.openAnswer(); //再次验证一下数据
        GameGlobal.AnswerController.bOpenLayer = true; //记录打开答题界面
    };
    AnswerLayer.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
        TimerManager.ins().remove(this.startUpdate, this);
        GameGlobal.AnswerController.bOpenLayer = false; //记录关闭答题界面
    };
    AnswerLayer.prototype.startUpdate = function () {
        if (this.nCountTime > 0) {
            this.nCountTime -= 1;
            if (this.tLayerData) {
                if (this.tLayerData.type === 1) {
                    var str = "|C:0x682f00&T:\u7B54\u9898\u5269\u4F59\u65F6\u95F4|C:0x369427&T:" + this.nCountTime + "|C:0x369427&T:\u79D2|";
                    this.lbTime.textFlow = TextFlowMaker.generateTextFlow(str); //
                }
                else if (this.tLayerData.type === 2) {
                    var str = "|C:0x682f00&T:" + this.nCountTime + "|C:0x682f00&T:\u79D2\u540E\u8FDB\u5165\u4E0B\u4E00\u9898|";
                    this.lbTime.textFlow = TextFlowMaker.generateTextFlow(str); //   
                }
                else {
                    this.lbTime.text = "";
                }
            }
        }
        else {
            this.lbTime.text = "";
        }
    };
    AnswerLayer.prototype.setData = function () {
        if (GameGlobal.AnswerController.getAnswerData()) {
            this.tLayerData = GameGlobal.AnswerController.getAnswerData();
            this.nCountTime = (this.tLayerData.timeout + 1) || 0;
        }
    };
    AnswerLayer.prototype.onClick = function (e) {
        var nSelct = 0;
        switch (e.target) {
            case this.lbRank:
                GameGlobal.AnswerManage.sendRetRank();
                break;
            case this.imgSe1:
                nSelct = 1;
                break;
            case this.imgSe2:
                nSelct = 2;
                break;
            case this.imgSe3:
                nSelct = 3;
                break;
            case this.imgSe4:
                nSelct = 4;
                break;
        }
        //答题
        if (this.tLayerData && (!this.tLayerData.operation) && (nSelct > 0)) {
            GameGlobal.AnswerManage.sendAnswer(this.tLayerData.answerNum, nSelct);
        }
    };
    AnswerLayer.prototype.UpdateContent = function () {
        this.setData();
        this.startUpdate();
        this.updateInfo();
        this.updateRank();
        this.updateTitel(); //更新答题内容
    };
    //更新排行吧
    AnswerLayer.prototype.updateRank = function () {
        var rankData = this.tLayerData.rank;
        if (rankData.length) {
            this.gRank.visible = true;
            for (var item in rankData) {
                this.tName[item].text = rankData[item].name || "";
                this.tScore[item].text = rankData[item].point || "";
            }
        }
        else {
            this.gRank.visible = false;
        }
    };
    //更新相关信息内容
    AnswerLayer.prototype.updateInfo = function () {
        //排名
        var pData = this.tLayerData;
        if (!pData)
            return;
        if (pData.rankNo) {
            this.lbMyRank.text = "我的排名: 第" + pData.rankNo + "名";
        }
        else {
            this.lbMyRank.text = "未上榜";
        }
        //分数
        if (pData.point) {
            this.lbMyScore.text = pData.point + "";
        }
        else {
            this.lbMyScore.text = "";
        }
        if (pData.answerNum) {
            //第N题
            this.lbTitle.text = "第" + pData.answerNum + "题";
        }
        var nMax = GlobalConfig.ins().AnswerBaseConfig.answermax;
        this.lbTitleNums.text = "共" + nMax + "题";
    };
    //更新答题内容
    AnswerLayer.prototype.updateTitel = function () {
        //
        var pData = this.tLayerData;
        if (!pData)
            return;
        var tAsData = GlobalConfig.ins().AnswerQuestionConfig[pData.answerNo]; //目前答题的题目内容
        if (tAsData && tAsData.question) {
            this.lbQus.text = tAsData.question; //问题
            var strAn = ["A: ", "B: ", "C: ", "D: "];
            var tAsList = [tAsData.result1, tAsData.result2, tAsData.result3, tAsData.result4];
            for (var item in this.tAs) {
                this.tAs[item].text = strAn[item] + tAsList[pData.answerList[item] - 1]; //显示答案内容
            }
        }
        //对错 结果图片
        if (pData.operation || pData.type == 2) {
            for (var item in this.tRe) {
                this.tRe[item].visible = true;
                var strIndex = "0";
                for (var index in pData.answerList) {
                    if (pData.answerList[index] === 1) {
                        strIndex = index;
                    }
                }
                if (strIndex == item) {
                    this.tRe[item].source = "ui_dt_bm_gou";
                }
                else {
                    this.tRe[item].source = "ui_dt_bm_x";
                }
            }
        }
        else {
            for (var item in this.tRe) {
                this.tRe[item].visible = false;
            }
        }
        //选择框
        if (pData.operation) {
            this.imgSelect.visible = true;
            var tListSe = [];
            tListSe[1] = this.imgSe1;
            tListSe[2] = this.imgSe2;
            tListSe[3] = this.imgSe3;
            tListSe[4] = this.imgSe4;
            this.imgSelect.x = tListSe[pData.operation].x;
            this.imgSelect.y = tListSe[pData.operation].y;
        }
        else {
            this.imgSelect.visible = false;
        }
    };
    AnswerLayer.LAYER_LEVEL = LayerManager.UI_Main_2;
    return AnswerLayer;
}(BaseEuiView));
__reflect(AnswerLayer.prototype, "AnswerLayer", ["ICommonWindow"]);
//# sourceMappingURL=AnswerLayer.js.map