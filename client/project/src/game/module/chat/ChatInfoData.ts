class ChatInfoData extends ChatDataBase {

	public IsTipType() : boolean {
		return this.type == ChatType.Public || this.type == ChatType.System || (this.type == ChatType.Guild && this.type2 == 0)
	}

	type: number
	type2: number
	id: number
	name: string
	job: number
	sex: number
	vip: number
	monthCard: number
	ladderLevel: number
	isFirst: number
	pointId: number
	str: string
	time: number = 0
	serverid: number
	headframe: number

	share :Sproto.share_date;



	superMonthCard: number = 0



	public constructor(data: Sproto.chat_data | Sproto.guild_chat = null) {
		super()
		if (!data) {
			return
		}
		if (data) {
			if (egret.is(data, "Sproto.chat_data")) {
				let chatData = data as Sproto.chat_data
				this.type = chatData.type
				this.id = chatData.id
				this.name = chatData.name
				this.job = chatData.job
				this.sex = chatData.sex
				this.vip = chatData.vip
				this.share = chatData.share
				this.str = chatData.str
				this.serverid = chatData.serverid
				this.time = chatData.time
				this.headframe = chatData.headframe
			} else if (egret.is(data, "Sproto.guild_chat")) {
				let guildChat = data as Sproto.guild_chat
				this.name = guildChat.name
				this.type = ChatType.Guild
				this.id = guildChat.playerid
				this.type2 = data.type
				this.job = data.job
				this.sex = data.sex
				this.str = guildChat.content
				this.vip = guildChat.vip
				// this.monthCard = t.monthCard
				this.monthCard = 0
				this.time = guildChat.time
				this.share = guildChat.share
				this.headframe = guildChat.headframe
			} else {
				console.log("not type => " + data)
			}
			
		}
	}
}

class ChatSystemData extends ChatDataBase{
	type: number
	str: string
	time: number
	
	public constructor(type, str, time) {
		super()
		this.type = type
		this.str = str
		this.time = time || 0
	}
}