interface ITabViewData {
    className: string
    name: string
    notShow: boolean
    obj?: egret.DisplayObject
}

class TabView extends eui.Group implements eui.ICollection {

    public static readonly COPY = {
        "name": 1,
        "skinName": 1,
    }

    public static CreateTabViewData(cls: any, args?: any, notShow = false): ITabViewData {
        let data
        if (typeof(cls) == "string") {
            data = {
                className: (cls),
                name: "",
                notShow: notShow
            }
        } else {
            data = {
                className: egret.getQualifiedClassName(cls),
                name: cls.NAME || "",
                notShow: notShow
            }
        }
        if (args) {
            for (let key in args) {
                data[key] = args[key]
            }
        }
        return data
    }

    private childrenDatas: ITabViewData[] = []
    protected childrenList: ITabViewData[] = []

    public constructor() {
        super();
    }

    public get layout(): eui.LayoutBase {
        return this.$layout;
    }

    protected proposedSelectedIndex:number = eui.ListBase.NO_PROPOSED_SELECTION;

    public _selectedIndex:number = -1;

    public get selectedIndex():number {
        return this.proposedSelectedIndex != eui.ListBase.NO_PROPOSED_SELECTION ? this.proposedSelectedIndex : this._selectedIndex;
    }

    public set selectedIndex(value:number) {
        value = +value|0;
        this.setSelectedIndex(value);
    }

    private setSelectedIndex(value:number):void {
        if (value == this.selectedIndex) {
            return
        }
        if (!this.childrenList.length) {
            return
        }
        this.NewChild(value)
        this.proposedSelectedIndex = value;
        this.invalidateProperties();
        eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "selectedIndex");
    }

    protected commitProperties():void {
        super.commitProperties();
        if (this.proposedSelectedIndex != eui.ListBase.NO_PROPOSED_SELECTION) {
            this.commitSelection(this.proposedSelectedIndex);
            this.proposedSelectedIndex = eui.ListBase.NO_PROPOSED_SELECTION;
        }
    }

    private commitSelection(newIndex:number):void {
        if (newIndex >= 0 && newIndex < this.childrenList.length) {
            if (this._selectedIndex != newIndex) {
                this.ShowOrHide(this._selectedIndex, false)
            }
            this._selectedIndex = newIndex;
            // this.CreateChild(newIndex)
            this.ShowOrHide(newIndex, true)
        }
        else {
            this._selectedIndex = -1;
        }
        this.invalidateSize();
        this.invalidateDisplayList();
    }

    public NewChild(index: number): boolean {
        let data = this.childrenList[index]
        if (data && !data.obj) {
            let cls = egret.getDefinitionByName(data.className)
            let obj = data.obj = new cls
            data.className = null
            var keys = Object.keys(data);
            for (let key of keys) {
                let value = data[key]
                if (!value) {
                    continue
                }
                if (key == "id") {
                    this[value] = obj
                } else {
                    if (key.indexOf("$") == -1){
                        obj[key] = value
                    }
                }
            }
            this.addChild(obj)
            obj.visible = false
        }
        return data && data.obj ? true : false
    }

    public Replace(cls: any): void {
        this.RemoveAll()
        this.childrenList[0] = TabView.CreateTabViewData(cls)
        this.selectedIndex = 0
    }

    protected RemoveAll() {
        this._selectedIndex = -1
        this.proposedSelectedIndex = eui.ListBase.NO_PROPOSED_SELECTION

        this.removeChildren()
        for (let data of this.childrenList) {
            let id = data["id"]
            if (id) {
                this[id] = null
            }
        }
        this.childrenList = []
    }

    protected ShowOrHide(index: number, visible:boolean): egret.DisplayObject {
        let data = this.childrenList[index]
        if (data && data.obj) {
            let child = data.obj
            if (egret.is(child, "eui.UIComponent")) {
                (<eui.UIComponent><any>child).includeInLayout = visible;
            }
            child.visible = visible;
            return child
        }
    }

    private _UpdateList() {
        this.childrenList = []
        for (let data of this.childrenDatas) {
            // if (!data.notShow) {
                this.childrenList.push(data)
            // }
        }
    }

    public UpdateTabShowState(index: number, state: boolean) {
        let data = this.childrenDatas[index]
        if (data) {
            data.notShow = !state
        }
        this._UpdateList()
    }

    public get length():number {
        return this.childrenList.length
    }

    public getItemAt(index:number):any {
        let data = this.childrenList[index]
        // return data ? data.name : ""
        return data
    }

    public getItemIndex(item:any):number {
        let list = this.childrenList;
        let length = list.length;
        for (let i = 0; i < length; i++) {
            if (list[i].name == item) {
                return i;
            }
        }
        return -1;
    }

    public getElementAt(index: number) {
        let data = this.childrenList[index]
        return data ? data.obj : null
    }

    public GetElementCls(index: number) {
        let data = this.childrenList[index]
        if (data) {
            if (data.obj) {
                return Util.GetClass(data.obj)
            }
            if (data.className) {
                return egret.getDefinitionByName(data.className)
            }
        }
        return null
    }

    public set tabChildren(datas: ITabViewData[]) {
        this.childrenDatas = datas
        this._UpdateList()
    }
}

eui.registerBindable(TabView.prototype, "selectedIndex");
eui.registerProperty(TabView, "tabChildren", "Array", true);

