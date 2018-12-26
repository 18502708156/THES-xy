/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/12 18:51
 * @meaning: 技能设置详情
 * 
 **/


class RoleSkilSetPanel extends BaseView implements ICommonWindowTitle {



	tSkillList = [];//商店数据
	
    listView;//

	

    
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "RoleSkillSetPanelSkin"

		this.observe(MessageDef.SKILL_SORT_CHANGE, this.updateList)//技能顺序变化

		this.observe(MessageDef.SKILL_GREWUPALL, this.updateList)//技能变化刷新
		this.observe(MessageDef.SKILL_UPGRADE, this.updateList)//技能变化刷新

	}

	public OnOpen() {



		for(let i = 0 ;i<8 ;i++)
		{
			let skList =  SubRoles.ins().GetRoleData().getSkillSort();
			var itemIndex = skList[i] -1  //修正技能下标
			var role = SubRoles.ins().GetRoleData()
			let skillIds = role.GetCurSkillIDs()
			let skillId = skillIds[itemIndex]
			if(skillId)
			{
				this.tSkillList.push(i)//下标
			}
		}


		this._AddItemClick(this.listView, this.onListViewClick)


		this.listView.itemRenderer = RoleSkilSetItem;
		
		this.UpdateContent()
	}


	OnClose() {
		// this.commonWindowBg.OnRemoved()
		// MessageCenter.ins().removeAll(this);
	};




	public updateList()
	{
		(this.listView.dataProvider as eui.ArrayCollection).replaceAll(this.tSkillList);
	}

	UpdateContent() {

		this.listView.dataProvider = new eui.ArrayCollection(this.tSkillList); 
	}





	private onListViewClick(e: eui.ItemTapEvent) {
	


	}


    private swapItems(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
    };

	/**点击 */
	onClick(e) {
	
	}
}