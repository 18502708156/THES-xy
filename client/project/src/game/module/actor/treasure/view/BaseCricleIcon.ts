



class BaseCricleIcon extends BaseView {

	imgBg: eui.Image //品质框
	imgIcon: eui.Image//图标


	childrenCreated()
	{
		super.childrenCreated()
	}
   
	setData(data) {

		if(!data) return

		if(data.icon)
		{
			this.imgBg.source = data.icon
		}

		if(typeof(data.quality) === "number" )
		{
			this.imgIcon.source = PetConst.QUALITY_SKILL_BG[data.quality] || ""
		}

	};


}