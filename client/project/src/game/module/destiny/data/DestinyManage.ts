/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/6/26 21:15
 * @meaning: 灵童命格管理类
 * 
 **/

class DestinyManage extends BaseSystem {



	public constructor() {
		super();
        this.regNetMsg(S2cProtocol.sc_baby_star_init, this.doBabyStar);

	}

	public Init() {
		super.Init()
	}



    // #逆命
    public babyStartGet(num) {
		let req = new Sproto.cs_baby_start_get_request;
        req.num = num
        this.Rpc(C2sProtocol.cs_baby_start_get, req, (rsp) => {
			let rspData: Sproto.cs_baby_start_get_response = rsp;
            if(rspData.ret)
            {
                GameGlobal.DestinyController.babyStarGet(rspData)
                MessageCenter.ins().dispatch(MessageDef.DESTINY_CHANGE);
                MessageCenter.ins().dispatch(MessageDef.DESTINY_GET_REWARD,rspData);
                
            }
		})
    };


    //#使用
    // id 		0 : integer #道具id
    // pos 	1 : integer #装到第几个位置
    public babyStartUse(id,pos) {
		let req = new Sproto.cs_baby_start_use_request;
        req.id = id
        req.pos = pos
        this.Rpc(C2sProtocol.cs_baby_start_use, req, (rsp) => {
			let rspData: Sproto.cs_baby_start_use_response = rsp;
            if(rspData.ret)
            {
                GameGlobal.DestinyController.babyStartUse(rspData)
                MessageCenter.ins().dispatch(MessageDef.DESTINY_CHANGE);
                UserTips.InfoTip("装备成功")
            } else {
                UserTips.InfoTip("装备失败")
            }
		})
	};

    //#升级
    // pos 	1 : integer #升级第几个位置上的
    public babyStartUpLv(pos) {
		let req = new Sproto.cs_baby_start_up_lv_request;
        req.pos = pos
        this.Rpc(C2sProtocol.cs_baby_start_up_lv, req, (rsp) => {
			let rspData: Sproto.cs_baby_start_up_lv_response = rsp;
            if(rspData.ret)
            {
                GameGlobal.DestinyController.babyStartUpLv(rspData)
                MessageCenter.ins().dispatch(MessageDef.DESTINY_CHANGE);
            }
		})
	};

    //分解
    // idList 	1 : *integer #需要分解的列表
    public babyStartSmelt(idList) {
		let req = new Sproto.cs_baby_start_smelt_request;
        req.idList = idList
        this.Rpc(C2sProtocol.cs_baby_start_smelt, req, this.DoStarSmelt, this)
	};

    private DoStarSmelt(rsp: Sproto.cs_baby_start_smelt_response) {
        if (rsp.ret) {
            MessageCenter.ins().dispatch(MessageDef.DESTINY_SMELT);
        } else {
            UserTips.InfoTip("分解失败")
        }
    }



    //点亮混元
    public babyStartLight() {
		let req = new Sproto.cs_baby_start_light_request;
        this.Rpc(C2sProtocol.cs_baby_start_light, req, (rsp) => {
			let rspData: Sproto.cs_baby_start_light_response = rsp;
            if(rspData.ret)//成功处理
            {
                GameGlobal.DestinyController.babyStartLight(rspData)
                MessageCenter.ins().dispatch(MessageDef.DESTINY_CHANGE);
            }
		})
	};


    //灵童命格数据初始化
    public doBabyStar(rsp : Sproto.sc_baby_star_init_request)
    {
        GameGlobal.DestinyController.doBabyStar(rsp)
        GameGlobal.MessageCenter.dispatch(MessageDef.DESTINY_CHANGE)
    }

   




}