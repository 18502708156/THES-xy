class GameServerData {

	public static readonly PAGE_COUNT = 20

	public static MaxId: number
	public static PageData: GameServerPageData[] = []
	public static SelectData: GameServerDescData = null

	public static Callback: Function = null
	public static ThisObject: any = null

	public static HasRecentSvr(): boolean {
		if (GameServerData.PageData && GameServerData.PageData[0] && GameServerData.PageData[0].datas && GameServerData.PageData[0].datas.length) {
			return true
		}
		return false
	}

	public static Init(maxId: number, datas: GameServerDescData[], lastList: GameServerDescData[]): void {
		this.MaxId = maxId
		let recentData = new GameServerPageData
		recentData.name = `最近登录`
		recentData.index = 0
		recentData.datas = datas
		GameServerData.PageData.push(recentData)
		let page = Math.max(Math.ceil(maxId / GameServerData.PAGE_COUNT), 1)
		for (let i = page; i >= 1; --i) {
			let data = new GameServerPageData
			data.name = `${((i - 1) * GameServerData.PAGE_COUNT) + 1} - ${i * GameServerData.PAGE_COUNT}服`
			data.index = i
			data.datas = []
			GameServerData.PageData.push(data)
		}
		GameServerData.PageData[1].datas = lastList
		if (datas != null && datas.length > 0) {
			GameServerData.SelectData = datas[0]
		}
		if (GameServerData.SelectData == null) {
			if (lastList != null && lastList.length > 0) {
				GameServerData.SelectData = lastList[0]
			}
		}
	}

	public static GetPageData(page: number): void {
		HttpHelper.GetServerList(page, this._DoPageData, this)
	}

	private static _DoPageData(page: number, event: egret.Event) {
		let jo = JSON.parse(event.currentTarget.response)
		let jsonObject = jo.data
		
		let list = []
		for (let key in jsonObject) {
			let obj = jsonObject[key]
			let serverData = GameServerDescData.Get(obj)
			if (serverData) {
				list.push(serverData)
			}
		}
		list.sort((lhs, rhs) => {
			return rhs.id - lhs.id
		})
		for (let data of GameServerData.PageData) {
			if (data.index == page) {
				data.datas = list
				break
			}
		}
		if (GameServerData.Callback && GameServerData.ThisObject) {
			GameServerData.Callback.call(GameServerData.ThisObject, page)
		}
	}
}

class GameServerPageData {
	public index: number
	public name: string
	public datas: GameServerDescData[]
}

class GameServerDescData {
	public id: number
	public name: string
	public ip: string
	public status: number
	public version: number

	public GetStatus(): number {
		if (this.status == 1 || this.status == 3) {
			return 1
		} else if (this.status == 2 || this.status == 4) {
			return 2
		}
		return 0
	}

	public CanEnter(): boolean {
		if (!this.version) {
			return false
		}
		if (Main.Instance.GmLevel) {
			return true
		}
		return this.status == 1 || this.status == 2
	}

	public static Get(obj: any, ignore = false): GameServerDescData {
		if (!ignore) {
			if (obj.status == 0 && !Main.Instance.GmLevel) {
				return null
			}
		}
		let data = new GameServerDescData
		data.id = obj.sid
		data.name = WindowData._GetServerName(obj.sid)
		data.ip = obj.addr
		data.status = obj.status
		data.version = obj.version
		return data
	}
}