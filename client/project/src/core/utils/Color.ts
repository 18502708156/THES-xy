class ColorMatrixFilter extends egret.ColorMatrixFilter {
    public $addTarget(target:egret.DisplayObject):void {
    }
    
    public $removeTarget(target:egret.DisplayObject):void {
    }
    
    protected invalidate():void {
    }
}

class Color {
    public static readonly Red		= 0xFF0000
    public static readonly Green	= 0x00FF00
    public static readonly Blue		= 0x0000FF
    public static readonly White	= 0xFFFFFF
    public static readonly Black	= 0x000000
    public static readonly Yellow	= 0xFFeb04
    public static readonly Cyan		= 0x00ffff
    public static readonly Magenta	= 0xff00ff
    public static readonly Gray		= 0x808080

    public static readonly GrayAttr = 0x7c7c7c

    public static readonly GrayLabel = 0x505050
    public static readonly l_green_1 = 0x019704
    public static readonly l_green_2 = 0x2dff42
    public static readonly l_brown_2 = 0x682f00
    public static readonly l_gray = 0x94999b

    public static readonly GREEN_LIGHT = 0x32FF00

    public static readonly l_normal = 0x6e330b
    

    public static readonly NameBlue = 0x00A5FF

    public static readonly TitleYellow = 0xF5D061

    public static grayFilters: ColorMatrixFilter[] = [new ColorMatrixFilter(
        [0.3086, 0.6094, 0.0820, 0, 0,  
        0.3086, 0.6094, 0.0820, 0, 0,  
        0.3086, 0.6094, 0.0820, 0, 0,  
    0,      0,      0,      1, 0])];
    
     
    //琅琊榜游戏颜色
    public static readonly WhiteColor           = 0xE6F1F4                  //白色
    public static readonly White1Color           = 0XCDC7B1                  //白色
    public static readonly YellowWishColor      = 0xEAE0B8                  //淡黄
    public static readonly YellowColor          = 0xFFCC7C                  //黄色
    public static readonly OrangeColor          = 0xFF5A00                  //橙色
    public static readonly RedColor             = 0xCD1515                  //红色
    public static readonly GreenColor           = 0x04FF10                  //绿色
    public static readonly BludColor            = 0x00B1F1                  //蓝色

    public static GetStr(color: number): string {
        return "0x" + Number(color||0).toString(16);
    }

    public static GetFilter() {
        return this.grayFilters
    }
}

// F5D061   黄色文本
// 0x019704 获取方式颜色

