/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/25 21:15
 * @meaning: 科举界面
 * 
 **/
class AnswerLayer extends BaseEuiView implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Main_2

    /////////////////////////////////////////////////////////////////////////////
    protected commonWindowBg: CommonWindowBg;

    protected lbNe1: eui.Label;
    protected lbSc1: eui.Label;
    protected lbNe2: eui.Label;
    protected lbNe3: eui.Label;
    protected lbSc2: eui.Label;
    protected lbSc3: eui.Label;
    protected lbMyRank: eui.Label;
    protected lbMyScore: eui.Label;
    protected lbTitleNums: eui.Label;
    protected lbTitle: eui.Label;
    protected lbQus: eui.Label;
    protected lbAs1: eui.Label;
    protected lbAs2: eui.Label;
    protected lbAs3: eui.Label;
    protected lbAs4: eui.Label;
    protected lbRank: eui.Label;

    protected lbTime: eui.Label;

    
    
    protected imgAn1: eui.Image;
    protected imgAn2: eui.Image;
    protected imgAn3: eui.Image;
    protected imgAn4: eui.Image;

    //答题选择框
    protected imgSe1: eui.Image;
    protected imgSe2: eui.Image;
    protected imgSe3: eui.Image;
    protected imgSe4: eui.Image;


    protected imgSelect: eui.Image;//当前选择框


    protected gRank : eui.Group //排名内容
    

    


    /////////////////////////////////////////////////////////////////////////////

    tName = [];//名字列表
    tScore= [];//分数列表
    tAs= [];//答案列表
    tRe= [];//结果列表
    tLayerData;//界面数据

    nCountTime = 0; //倒计时

	public constructor() {
		super()
		this.skinName = "AnswerSkin"
	}

	public childrenCreated() {
       
        for (let i = 0; i <= 2; i++) {
            let item = this["lbNe" + (i+1)]
            this.tName[i] = item
        }

        //分数
        for (let i = 0; i <= 2; i++) {
            let item = this["lbSc" + (i+1)]
            this.tScore[i] = item
        }

        //答案
        for (let i = 0; i <= 3; i++) {
            let item = this["lbAs" + (i+1)]
            this.tAs[i] = item
        }

        //结果
        for (let i = 0; i <= 3; i++) {
            let item = this["imgAn" + (i+1)]
            this.tRe[i] = item
        }
    }



	public OnOpen(...param: any[]) {
		this.observe(MessageDef.ANSWER_CHANGE, this.UpdateContent)
        this.commonWindowBg.OnAdded(this);
		this._AddClick(this.lbRank, this.onClick)
		this._AddClick(this.imgSe1, this.onClick)
		this._AddClick(this.imgSe2, this.onClick)
		this._AddClick(this.imgSe3, this.onClick)
		this._AddClick(this.imgSe4, this.onClick)

        this.AddTimer(1000, 0, this.startUpdate); //时间更新函数

        GameGlobal.AnswerManage.openAnswer()//再次验证一下数据

        GameGlobal.AnswerController.bOpenLayer = true //记录打开答题界面

	}

	
	public OnClose() {
		this.commonWindowBg.OnRemoved()
        TimerManager.ins().remove(this.startUpdate, this);
        GameGlobal.AnswerController.bOpenLayer = false //记录关闭答题界面
	}


    private startUpdate()
    {
        if(this.nCountTime>0)
        {
            this.nCountTime-=1;
            if(this.tLayerData)
            {
                if(this.tLayerData.type ===1) //答题中
                {
                    let str =  `|C:0x682f00&T:答题剩余时间|C:0x369427&T:${this.nCountTime}|C:0x369427&T:秒|`
                    this.lbTime.textFlow =   TextFlowMaker.generateTextFlow(str) //
                }
                else if(this.tLayerData.type ===2) //等待中
                {
                    let str =  `|C:0x682f00&T:${this.nCountTime}|C:0x682f00&T:秒后进入下一题|`
                    this.lbTime.textFlow =   TextFlowMaker.generateTextFlow(str) //   
                }
                else
                {
                    this.lbTime.text = ""
                }
            }
        }
        else
        {
            this.lbTime.text = ""
        }
    }

    private setData(){
        if( GameGlobal.AnswerController.getAnswerData())
        {
            this.tLayerData = GameGlobal.AnswerController.getAnswerData()
            this.nCountTime =(this.tLayerData.timeout+1) ||0
        }

    }

	private onClick(e: egret.TouchEvent)
	{
        var nSelct = 0
		switch (e.target) {
				case this.lbRank:
                    GameGlobal.AnswerManage.sendRetRank()
				break
				case this.imgSe1:
                    nSelct = 1
				break		
				case this.imgSe2:
                    nSelct = 2
				break
				case this.imgSe3:
                    nSelct = 3
				break
				case this.imgSe4:
                    nSelct = 4
				break                                    
    	}


        //答题
        if(this.tLayerData&&(!this.tLayerData.operation)&&(nSelct>0))
        {
            GameGlobal.AnswerManage.sendAnswer(this.tLayerData.answerNum,nSelct)
        }

	}

	private UpdateContent() {
        this.setData()

        this.startUpdate()
        
        this.updateInfo()
        this.updateRank()

        this.updateTitel()//更新答题内容
     }

     //更新排行吧
     private updateRank()
     {
         var rankData =  this.tLayerData.rank
         if(rankData.length)
         {
            this.gRank.visible = true
            for (const item in rankData) {
                this.tName[item].text = rankData[item].name || ""
                this.tScore[item].text = rankData[item].point || ""
            }
         }
         else
         {
             this.gRank.visible = false
         }


     }

     //更新相关信息内容
     private updateInfo()
     {
        //排名
        var pData =  this.tLayerData
         if(!pData) return ;
        if(pData.rankNo)
        {
            this.lbMyRank.text =  "我的排名: 第" +  pData.rankNo   + "名"
        }
        else
        {
            this.lbMyRank.text =  "未上榜"
        }
        //分数
        if(pData.point)
        {
             this.lbMyScore.text = pData.point  + "" 
        }
        else
        {
             this.lbMyScore.text =  "" 
        }

        if(pData.answerNum)
         {
            //第N题
            this.lbTitle.text = "第" + pData.answerNum + "题"
         }

         

         var nMax =   GlobalConfig.ins().AnswerBaseConfig.answermax
         this.lbTitleNums.text = "共" + nMax + "题"




     }

     //更新答题内容
     private updateTitel()
     {
         //
        var pData =  this.tLayerData
        if(!pData) return ;
        var tAsData = GlobalConfig.ins().AnswerQuestionConfig[pData.answerNo] //目前答题的题目内容
        if(tAsData&& tAsData.question)
        {
            this.lbQus.text = tAsData.question //问题
            let strAn = ["A: ","B: ","C: ","D: "]
            var tAsList = [tAsData.result1,tAsData.result2,tAsData.result3,tAsData.result4]
            for (const item in this.tAs) {
                this.tAs[item].text =strAn[item] + tAsList[pData.answerList[item] -1] //显示答案内容
            }
        }

        //对错 结果图片
        if(pData.operation||pData.type == 2)
        {
            for (const item in this.tRe) {
                this.tRe[item].visible = true
                let strIndex =  "0"
                for (const index in pData.answerList) {
                    if(pData.answerList[index] ===1)
                    {
                        strIndex = index
                    }
                }
                if(strIndex ==item)
                {
                  this.tRe[item].source = "ui_dt_bm_gou"
                }
                else
                {
                  this.tRe[item].source = "ui_dt_bm_x"
                }
            }
        }
        else
        {
            for (const item in this.tRe) {
                this.tRe[item].visible = false
            }
        }

        //选择框

            if(pData.operation)
            {
                this.imgSelect.visible = true

                let tListSe = []
                tListSe[1] = this.imgSe1
                tListSe[2] = this.imgSe2
                tListSe[3] = this.imgSe3
                tListSe[4] = this.imgSe4
                
                this.imgSelect.x  =  tListSe[pData.operation].x
                this.imgSelect.y  =  tListSe[pData.operation].y
            }
            else
            {
                this.imgSelect.visible = false
            }

     }


}