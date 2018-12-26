/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/10 11:15
 * @meaning: 答题控制类
 * 
 **/
class AnswerController extends BaseSystem {

    tAnswerData; //答题数据

    nOopenWinState = 0; //0未都未开启 1为开启了小窗口 2为开启了大窗口

    bOpenLayer = false;//是否打开了答题界面

	public constructor() {
		super();

	}

	public Init() {
		super.Init()
        //初始化
        this.tAnswerData = {type:0,rank:0,answerNum:0,answerNo:0,answerList:[],point:0,rankNo:0,operation:0,timeout:0}
	}

    //获取
    public getAnswerData()
    {
        return this.tAnswerData ;
    }

    //是否可以打开
    public bOpenAnswer()
    {
        let bOpen = false
        if(this.tAnswerData.type)
        {
            bOpen = true
        }
        return bOpen
    }


    //更新答题内容
    public updateAnswer(_data)
    {
        this.tAnswerData.type = this.sentenceTrue(this.tAnswerData.type,_data.type)
        this.tAnswerData.rank = this.sentenceTrue(this.tAnswerData.rank,_data.rank)
        this.tAnswerData.answerNum = this.sentenceTrue(this.tAnswerData.answerNum,_data.answerNum)
        this.tAnswerData.answerNo = this.sentenceTrue(this.tAnswerData.answerNo,_data.answerNo)
        this.tAnswerData.answerList = this.sentenceTrue(this.tAnswerData.answerList,_data.answerList)
        this.tAnswerData.point =  this.sentenceTrue(this.tAnswerData.point,_data.point)
        this.tAnswerData.rankNo =  this.sentenceTrue(this.tAnswerData.rankNo,_data.rankNo)
        this.tAnswerData.operation =  this.sentenceTrue(this.tAnswerData.operation,_data.operation)
        this.tAnswerData.timeout =  this.sentenceTrue(this.tAnswerData.timeout,_data.timeout)
    }

    sentenceTrue(_orignal,_value)
    {
        if(typeof(_value) === "number")
        {
            _orignal = _value
        }
        else if (typeof(_value) === "object")
        {
            _orignal = _value
        }
        return _orignal;
    }

    public OnSocketClose() {
        // 断线的时候清掉答题数据
        if (this.tAnswerData) {
            this.tAnswerData.type = 0
        }
    }
}