/**
 * 系統預告_怪物顯示類型
 */
enum FateShowModelType
{
    /**図片 */
    LogoImg=0,
    /**角色 */
    Role=1,//角色
    /**寵物 */
    Pet=2,//寵物
    /**仙侶 */
    FairyTale=3,//仙侶
    /**玄女 */
    FemaleDeva=4,//玄女
    /**天神 */
    GodOfHeaven=5,//天神
    /**靈童 */
    SpiritualChild=8,//靈童
    /**坐騎 */
    Mounts=10,//坐騎
    /**翅膀 */
    Wing=11,//翅膀
    /**守护 */
    TheFairy=12,//守护
    /**神兵 */
    DivineTroops=13,//神兵
    /**時裝 */
    Fashion=14,//時裝
    /**稱號 */
    Title=15,//稱號
    /**寵物通靈 */
    PetPsyche=20,//寵物通靈
    /**寵物獸魂 */
    PetAnimalSoul=21,//寵物獸魂
    /**仙侶法陣 */
    FairyTaleNormalArray=30,//仙侶法陣
    /**仙侶仙位 */
    FairyTaleImmortalPosition=31,//仙侶仙位
    /**玄女法器 */
    FemaleDevaWeapons=40,//玄女法器
    /**玄女花X */
    FemaleDevaFlower=41,//玄女花X
    /**玄女靈氣 */
    FemaleDevaO2=42,//玄女靈氣
    /**法寶 */
    MagicProps=16,//法寶
 }

/**
 * 功能預告 特效
 */
class FateEff
{
    // public static isShow=false;
    public static IDED2=0;
   
    public static isShow=false;
    public static isShow3=false;

    public static isShowEff(thisObj):void
    {
        if(FateEff.IDED2!=0)
        {
            switch(GameGlobal.Config.FuncNoticeConfig[FateEff.IDED2].type)
            {
                case FateShowModelType.Mounts:
                case FateShowModelType.Title:
                case FateShowModelType.Fashion:
                case FateShowModelType.TheFairy:
                case FateShowModelType.DivineTroops:
                case FateShowModelType.Wing:
                case FateShowModelType.MagicProps:
                    //this.effArr.push(this.addEff(thisObj["roleBtn"],"ui_zhy001"));
                    let btn=thisObj["roleBtn"];
                    UIHelper.SetBtnEffe(btn,"ui_zhy001",true,1,1,55,55);
                    break;

                case FateShowModelType.FairyTale:
                case FateShowModelType.FairyTaleNormalArray:
                case FateShowModelType.FairyTaleImmortalPosition:
                case FateShowModelType.FemaleDeva:
                case FateShowModelType.FemaleDevaFlower:
                case FateShowModelType.FemaleDevaWeapons:
                case FateShowModelType.FemaleDevaO2:
                    let btn2=thisObj["xiannvBtn"];
                    UIHelper.SetBtnEffe(btn2,"ui_zhy001",true,1,1,55,55);
                    break;
                
                case FateShowModelType.Pet:
                case FateShowModelType.PetPsyche:
                case FateShowModelType.PetAnimalSoul:
                    let btn3=thisObj["petBtn"];
                    UIHelper.SetBtnEffe(btn3,"ui_zhy001",true,1,1,55,55);
                    break;
            }


        }
    }
    

    public static isShowEff2(thisObj):void
    {
        if(FateEff.isShow==true)
        {
            if(FateEff.IDED2!=0)
            {
                switch(GameGlobal.Config.FuncNoticeConfig[FateEff.IDED2].type)
                {
                    case FateShowModelType.Title:
                        UIHelper.SetBtnEffe(thisObj["roleTitle"],"ui_yhy002",true,1.2,1.2,47,45);
                        break;
                    case FateShowModelType.Fashion:
                        UIHelper.SetBtnEffe(thisObj["dressBtn"],"ui_yhy002",true,1.2,1.2,47,45);
                        break;
                    case FateShowModelType.TheFairy:
                        UIHelper.SetBtnEffe(thisObj["list"].getChildAt(0),"ui_yhy002",true,1.2,1.2,47,45);
                        break;
                    case FateShowModelType.DivineTroops:
                        UIHelper.SetBtnEffe(thisObj["list"].getChildAt(0),"ui_yhy002",true,1.2,1.2,47,45);
                        break;
                    case FateShowModelType.MagicProps:
                        UIHelper.SetBtnEffe(thisObj["bless"],"ui_yhy002",true,1.2,1.2,47,45);
                        break;
                }

            }
            FateEff.isShow=false;
        }
    }

    public static isShowEff3(thisObj):void
    {
        if(FateEff.isShow3==true)
        {
            if(FateEff.IDED2!=0)
            {
                switch(GameGlobal.Config.FuncNoticeConfig[FateEff.IDED2].type)
                {
                    case FateShowModelType.Mounts: //this.commonWindowBg.tabBar.getChildAt(0)
                        UIHelper.SetBtnEffe(thisObj["commonWindowBg"].tabBar.getChildAt(2),"ui_fhy002",true,1,1,70,45);
                        break;
                    case FateShowModelType.Wing:
                        UIHelper.SetBtnEffe(thisObj["commonWindowBg"].tabBar.getChildAt(3),"ui_fhy002",true,1,1,70,45);
                        break;
                    // case FateShowModelType.TheFairy:
                    //     UIHelper.SetBtnEffe(thisObj["list"].getChildAt(0),"ui_fhy002",true,1.2,1.2,47,45);
                    //     break;
                    // case FateShowModelType.DivineTroops:
                    //     UIHelper.SetBtnEffe(thisObj["list"].getChildAt(0),"ui_fhy002",true,1.2,1.2,47,45);
                    //     break;
                    // case FateShowModelType.MagicProps:
                    //     UIHelper.SetBtnEffe(thisObj["bless"],"ui_fhy002",true,1.2,1.2,47,45);
                    //     break;
                }

            }
            FateEff.isShow3=false;
        }
    }

}
