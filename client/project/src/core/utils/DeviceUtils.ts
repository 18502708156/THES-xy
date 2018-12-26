// TypeScript file
class DeviceUtils {
    public static get IsHtml5() {
        return egret.Capabilities.runtimeType == egret.RuntimeType.WEB;
    }
    public static get IsNative() {
        return egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE;
    }
    public static get IsMobile() {
        return egret.Capabilities.isMobile;
    }
    public static get IsPC() {
        return !egret.Capabilities.isMobile;
    }
    public static get IsQQBrowser() {
        return this.IsHtml5 && navigator.userAgent.indexOf('MQQBrowser') != -1;
    }
    public static get IsIEBrowser() {
        return this.IsHtml5 && navigator.userAgent.indexOf("MSIE") != -1;
    }
    public static get IsFirefoxBrowse() {
        return this.IsHtml5 && navigator.userAgent.indexOf("Firefox") != -1;
    }
    public static get IsChromeBrowser() {
        return this.IsHtml5 && navigator.userAgent.indexOf("Chrome") != -1;
    }
    public static get IsSafariBrowser() {
        return this.IsHtml5 && navigator.userAgent.indexOf("Safari") != -1;
    }
    public static get IsOperaBrowser() {
        return this.IsHtml5 && navigator.userAgent.indexOf("Opera") != -1;
    }
    public static get isLocation() {
        return location.href.indexOf("192.168.201") >= 0
            || location.href.indexOf("127.0.0.1") >= 0
            || location.href.indexOf("localhost") >= 0
            || location.href.indexOf("cq.api.com") >= 0;
    }
}