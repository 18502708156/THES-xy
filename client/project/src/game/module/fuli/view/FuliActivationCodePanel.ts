/**
 * 福利_兑换码
 */
class FuliActivationCodePanel extends BaseEuiView
{
	//skinName
	//FuliActivationCodeSkin.exml

	public static LAYER_LEVEL = LayerManager.UI_Main;
	
	
	//textInput
	private inputText:eui.TextInput;
	//确定btn
	private receiveBtn:eui.Button;	
	//福利大厅表
	private tab:any;
	public constructor()
    {
        super()
			this.skinName = "FuliActivationCodeSkin";
    }
	public childrenCreated() 
    {
		this.tab=GameGlobal.Config.WelfareBaseConfig;
       	this._AddClick(this.receiveBtn,this._OnClick);
		this._AddClick(this.inputText,this._OnClick);
		this.observe(MessageDef.FULI_GET_REDEEMCODE, this.msgPrompt);
    }
	public OnOpen()
    {
		// this.inputText.text = "请输入激活码";
	}
    public UpdateContent() 
    {
	}
    private msgPrompt(msg)
	{
		if(msg.ret!=undefined && msg.ret!=null)
		{
			let str="";
			switch (msg.ret) 
			{
            case 0:
              if (this.inputText) 
			  {
                 this.inputText.text = "";
				 str = "激活码礼包兑换成功，请去邮箱查看领取！"
              }
			  break;
			case -1:str = "不存在激活码"; break
			case 1: str = "不存在激活码"; break
            case 2: str = "不存在的礼包"; break
            case 3: str = "激活码已使用"; break
            case 4: str = "已兑换相同礼包"; break
            case 5: str = "验证失败"; break
            case 6: str = "激活码已过期"; break
            default:str=msg.ret+"";break
			}
			 UserTips.ins().showTips(str);
		}
	}

    private _OnClick(e: egret.TouchEvent)
    {
        switch (e.currentTarget) 
        {
            case this.receiveBtn:
                let item=this.inputText.text;
				if(item!="")
				{
					GameGlobal.FuliModel.SendRedeemCode(item);
				}
            	break;
			case this.inputText:
				// this.inputText.text="";
				break;
        }
    }
    public OnClose() 
	{
		
	}
}