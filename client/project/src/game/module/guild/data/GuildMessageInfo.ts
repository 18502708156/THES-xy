class GuildMessageInfo {
	type: number;
	content: string;
	roleId: number;
	name: string;
	job: number;
	sex: number;
	vip: number;
	monthCard: number;
	superMonthCard: number;
	office: number;

	public time: number = 0

	public parserMessage(bytes: Sproto.guild_chat) {
		this.type = bytes.type
		this.content = bytes.content
		//帮会聊天才有一下内容
		if (this.type == 1) {
			this.roleId = bytes.playerid
			this.name = bytes.name
			this.job = bytes.job
			this.sex = bytes.sex
			this.vip = bytes.vip
			this.office = bytes.office
			this.time = bytes.time || 0
		}
	};
}