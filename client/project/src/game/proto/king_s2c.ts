// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class king_camp_point {
		public camp: number; // tag 1
		public point: number; // tag 2
	}

	function _decode_king_camp_point(d: SprotoTypeDeserialize) {
		let o = new king_camp_point;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 1:
				o.camp = d.ri ();
				break;
			case 2:
				o.point = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_king_camp_point(self: king_camp_point, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 3);

		if (self.camp != undefined) {
			se.wi (self.camp, 1);
		}

		if (self.point != undefined) {
			se.wi (self.point, 2);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["king_camp_point"] = {en: _encode_king_camp_point, de: _decode_king_camp_point}
	export class king_city_info {
		public camp: number; // tag 0
		public currcamp: number; // tag 1
		public currhp: number; // tag 2
		public maxhp: number; // tag 3
		public guards: king_guard_info[]; // tag 4
	}

	function _decode_king_city_info(d: SprotoTypeDeserialize) {
		let o = new king_city_info;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.camp = d.ri ();
				break;
			case 1:
				o.currcamp = d.ri ();
				break;
			case 2:
				o.currhp = d.ri ();
				break;
			case 3:
				o.maxhp = d.ri ();
				break;
			case 4:
				o.guards = d.roa("king_guard_info");
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_king_city_info(self: king_city_info, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 5);

		if (self.camp != undefined) {
			se.wi (self.camp, 0);
		}

		if (self.currcamp != undefined) {
			se.wi (self.currcamp, 1);
		}

		if (self.currhp != undefined) {
			se.wi (self.currhp, 2);
		}

		if (self.maxhp != undefined) {
			se.wi (self.maxhp, 3);
		}

		if (self.guards != undefined) {
			se.woa ("king_guard_info", self.guards, 4);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["king_city_info"] = {en: _encode_king_city_info, de: _decode_king_city_info}
	export class king_guard_info {
		public dbid: number; // tag 0
		public name: string; // tag 1
		public level: number; // tag 2
		public job: number; // tag 3
		public sex: number; // tag 4
		public power: number; // tag 5
		public isdead: boolean; // tag 6
	}

	function _decode_king_guard_info(d: SprotoTypeDeserialize) {
		let o = new king_guard_info;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.dbid = d.ri ();
				break;
			case 1:
				o.name = d.rs ();
				break;
			case 2:
				o.level = d.ri ();
				break;
			case 3:
				o.job = d.ri ();
				break;
			case 4:
				o.sex = d.ri ();
				break;
			case 5:
				o.power = d.ri ();
				break;
			case 6:
				o.isdead = d.rb ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_king_guard_info(self: king_guard_info, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 7);

		if (self.dbid != undefined) {
			se.wi (self.dbid, 0);
		}

		if (self.name != undefined) {
			se.ws (self.name, 1);
		}

		if (self.level != undefined) {
			se.wi (self.level, 2);
		}

		if (self.job != undefined) {
			se.wi (self.job, 3);
		}

		if (self.sex != undefined) {
			se.wi (self.sex, 4);
		}

		if (self.power != undefined) {
			se.wi (self.power, 5);
		}

		if (self.isdead != undefined) {
			se.wb (self.isdead, 6);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["king_guard_info"] = {en: _encode_king_guard_info, de: _decode_king_guard_info}
	export class king_guard_record {
		public camp: number; // tag 0
		public changhp: number; // tag 1
		public names: string[]; // tag 2
		public time: number; // tag 3
	}

	function _decode_king_guard_record(d: SprotoTypeDeserialize) {
		let o = new king_guard_record;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.camp = d.ri ();
				break;
			case 1:
				o.changhp = d.ri ();
				break;
			case 2:
				o.names = d.rsa ();
				break;
			case 3:
				o.time = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_king_guard_record(self: king_guard_record, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 4);

		if (self.camp != undefined) {
			se.wi (self.camp, 0);
		}

		if (self.changhp != undefined) {
			se.wi (self.changhp, 1);
		}

		if (self.names != undefined) {
			se.wsa (self.names, 2);
		}

		if (self.time != undefined) {
			se.wi (self.time, 3);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["king_guard_record"] = {en: _encode_king_guard_record, de: _decode_king_guard_record}
	export class king_player_info {
		public dbid: number; // tag 0
		public camp: number; // tag 1
		public status: number; // tag 2
	}

	function _decode_king_player_info(d: SprotoTypeDeserialize) {
		let o = new king_player_info;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.dbid = d.ri ();
				break;
			case 1:
				o.camp = d.ri ();
				break;
			case 2:
				o.status = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_king_player_info(self: king_player_info, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 3);

		if (self.dbid != undefined) {
			se.wi (self.dbid, 0);
		}

		if (self.camp != undefined) {
			se.wi (self.camp, 1);
		}

		if (self.status != undefined) {
			se.wi (self.status, 2);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["king_player_info"] = {en: _encode_king_player_info, de: _decode_king_player_info}
	export class king_report_persondetail {
		public camp: number; // tag 0
	}

	function _decode_king_report_persondetail(d: SprotoTypeDeserialize) {
		let o = new king_report_persondetail;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.camp = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_king_report_persondetail(self: king_report_persondetail, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 1);

		if (self.camp != undefined) {
			se.wi (self.camp, 0);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["king_report_persondetail"] = {en: _encode_king_report_persondetail, de: _decode_king_report_persondetail}
	export class king_report_sharedata {
		public rank: number[]; // tag 0
	}

	function _decode_king_report_sharedata(d: SprotoTypeDeserialize) {
		let o = new king_report_sharedata;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.rank = d.ria ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_king_report_sharedata(self: king_report_sharedata, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 1);

		if (self.rank != undefined) {
			se.wia (self.rank, 0);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["king_report_sharedata"] = {en: _encode_king_report_sharedata, de: _decode_king_report_sharedata}
	export class sc_king_attack_result_request {
		public iswin: boolean; // tag 0
		public commonpoint: number; // tag 1
		public camp: number; // tag 2
	}

	function _decode_sc_king_attack_result_request(d: SprotoTypeDeserialize) {
		let o = new sc_king_attack_result_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.iswin = d.rb ();
				break;
			case 1:
				o.commonpoint = d.ri ();
				break;
			case 2:
				o.camp = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_sc_king_attack_result_request(self: sc_king_attack_result_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 3);

		if (self.iswin != undefined) {
			se.wb (self.iswin, 0);
		}

		if (self.commonpoint != undefined) {
			se.wi (self.commonpoint, 1);
		}

		if (self.camp != undefined) {
			se.wi (self.camp, 2);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["sc_king_attack_result_request"] = {en: _encode_sc_king_attack_result_request, de: _decode_sc_king_attack_result_request}
	export class sc_king_begin_act_request {
	}

	function _decode_sc_king_begin_act_request(d: SprotoTypeDeserialize) {
		let o = new sc_king_begin_act_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_sc_king_begin_act_request(self: sc_king_begin_act_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 0);

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["sc_king_begin_act_request"] = {en: _encode_sc_king_begin_act_request, de: _decode_sc_king_begin_act_request}
	export class sc_king_city_data_request {
		public camp: number; // tag 0
		public currcamp: number; // tag 1
		public currhp: number; // tag 2
		public maxhp: number; // tag 3
		public guards: king_guard_info[]; // tag 4
		public guardtime: number; // tag 5
		public point: number; // tag 6
		public pointtime: number; // tag 7
		public record: king_guard_record[]; // tag 8
	}

	function _decode_sc_king_city_data_request(d: SprotoTypeDeserialize) {
		let o = new sc_king_city_data_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.camp = d.ri ();
				break;
			case 1:
				o.currcamp = d.ri ();
				break;
			case 2:
				o.currhp = d.ri ();
				break;
			case 3:
				o.maxhp = d.ri ();
				break;
			case 4:
				o.guards = d.roa("king_guard_info");
				break;
			case 5:
				o.guardtime = d.ri ();
				break;
			case 6:
				o.point = d.ri ();
				break;
			case 7:
				o.pointtime = d.ri ();
				break;
			case 8:
				o.record = d.roa("king_guard_record");
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_sc_king_city_data_request(self: sc_king_city_data_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 9);

		if (self.camp != undefined) {
			se.wi (self.camp, 0);
		}

		if (self.currcamp != undefined) {
			se.wi (self.currcamp, 1);
		}

		if (self.currhp != undefined) {
			se.wi (self.currhp, 2);
		}

		if (self.maxhp != undefined) {
			se.wi (self.maxhp, 3);
		}

		if (self.guards != undefined) {
			se.woa ("king_guard_info", self.guards, 4);
		}

		if (self.guardtime != undefined) {
			se.wi (self.guardtime, 5);
		}

		if (self.point != undefined) {
			se.wi (self.point, 6);
		}

		if (self.pointtime != undefined) {
			se.wi (self.pointtime, 7);
		}

		if (self.record != undefined) {
			se.woa ("king_guard_record", self.record, 8);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["sc_king_city_data_request"] = {en: _encode_sc_king_city_data_request, de: _decode_sc_king_city_data_request}
	export class sc_king_city_occupy_request {
		public camp: number; // tag 0
		public occupycamp: number; // tag 1
		public names: string[]; // tag 2
	}

	function _decode_sc_king_city_occupy_request(d: SprotoTypeDeserialize) {
		let o = new sc_king_city_occupy_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.camp = d.ri ();
				break;
			case 1:
				o.occupycamp = d.ri ();
				break;
			case 2:
				o.names = d.rsa ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_sc_king_city_occupy_request(self: sc_king_city_occupy_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 3);

		if (self.camp != undefined) {
			se.wi (self.camp, 0);
		}

		if (self.occupycamp != undefined) {
			se.wi (self.occupycamp, 1);
		}

		if (self.names != undefined) {
			se.wsa (self.names, 2);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["sc_king_city_occupy_request"] = {en: _encode_sc_king_city_occupy_request, de: _decode_sc_king_city_occupy_request}
	export class sc_king_fighting_change_request {
		public fighting: number[]; // tag 0
	}

	function _decode_sc_king_fighting_change_request(d: SprotoTypeDeserialize) {
		let o = new sc_king_fighting_change_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.fighting = d.ria ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_sc_king_fighting_change_request(self: sc_king_fighting_change_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 1);

		if (self.fighting != undefined) {
			se.wia (self.fighting, 0);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["sc_king_fighting_change_request"] = {en: _encode_sc_king_fighting_change_request, de: _decode_sc_king_fighting_change_request}
	export class sc_king_info_request {
		public camp: number; // tag 0
		public status: number; // tag 1
		public reborncout: number; // tag 2
		public citypoint: number; // tag 3
		public commonpoint: number; // tag 4
		public players: king_player_info[]; // tag 5
		public citys: king_city_info[]; // tag 6
		public fighting: number[]; // tag 7
		public transform: number[]; // tag 8
		public camppoint: king_camp_point[]; // tag 9
		public actcountdown: number; // tag 10
	}

	function _decode_sc_king_info_request(d: SprotoTypeDeserialize) {
		let o = new sc_king_info_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.camp = d.ri ();
				break;
			case 1:
				o.status = d.ri ();
				break;
			case 2:
				o.reborncout = d.ri ();
				break;
			case 3:
				o.citypoint = d.ri ();
				break;
			case 4:
				o.commonpoint = d.ri ();
				break;
			case 5:
				o.players = d.roa("king_player_info");
				break;
			case 6:
				o.citys = d.roa("king_city_info");
				break;
			case 7:
				o.fighting = d.ria ();
				break;
			case 8:
				o.transform = d.ria ();
				break;
			case 9:
				o.camppoint = d.roa("king_camp_point");
				break;
			case 10:
				o.actcountdown = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_sc_king_info_request(self: sc_king_info_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 11);

		if (self.camp != undefined) {
			se.wi (self.camp, 0);
		}

		if (self.status != undefined) {
			se.wi (self.status, 1);
		}

		if (self.reborncout != undefined) {
			se.wi (self.reborncout, 2);
		}

		if (self.citypoint != undefined) {
			se.wi (self.citypoint, 3);
		}

		if (self.commonpoint != undefined) {
			se.wi (self.commonpoint, 4);
		}

		if (self.players != undefined) {
			se.woa ("king_player_info", self.players, 5);
		}

		if (self.citys != undefined) {
			se.woa ("king_city_info", self.citys, 6);
		}

		if (self.fighting != undefined) {
			se.wia (self.fighting, 7);
		}

		if (self.transform != undefined) {
			se.wia (self.transform, 8);
		}

		if (self.camppoint != undefined) {
			se.woa ("king_camp_point", self.camppoint, 9);
		}

		if (self.actcountdown != undefined) {
			se.wi (self.actcountdown, 10);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["sc_king_info_request"] = {en: _encode_sc_king_info_request, de: _decode_sc_king_info_request}
	export class sc_king_info_update_request {
		public citys: king_city_info; // tag 0
	}

	function _decode_sc_king_info_update_request(d: SprotoTypeDeserialize) {
		let o = new sc_king_info_update_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.citys = d.ro("king_city_info");
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_sc_king_info_update_request(self: sc_king_info_update_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 1);

		if (self.citys != undefined) {
			se.wo ("king_city_info", self.citys, 0);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["sc_king_info_update_request"] = {en: _encode_sc_king_info_update_request, de: _decode_sc_king_info_update_request}
	export class sc_king_my_guard_city_request {
		public city: number; // tag 0
	}

	function _decode_sc_king_my_guard_city_request(d: SprotoTypeDeserialize) {
		let o = new sc_king_my_guard_city_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.city = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_sc_king_my_guard_city_request(self: sc_king_my_guard_city_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 1);

		if (self.city != undefined) {
			se.wi (self.city, 0);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["sc_king_my_guard_city_request"] = {en: _encode_sc_king_my_guard_city_request, de: _decode_sc_king_my_guard_city_request}
	export class sc_king_pk_result_request {
		public iswin: boolean; // tag 0
		public commonpoint: number; // tag 1
	}

	function _decode_sc_king_pk_result_request(d: SprotoTypeDeserialize) {
		let o = new sc_king_pk_result_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.iswin = d.rb ();
				break;
			case 1:
				o.commonpoint = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_sc_king_pk_result_request(self: sc_king_pk_result_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 2);

		if (self.iswin != undefined) {
			se.wb (self.iswin, 0);
		}

		if (self.commonpoint != undefined) {
			se.wi (self.commonpoint, 1);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["sc_king_pk_result_request"] = {en: _encode_sc_king_pk_result_request, de: _decode_sc_king_pk_result_request}
	export class sc_king_player_enter_request {
		public player: king_player_info; // tag 0
	}

	function _decode_sc_king_player_enter_request(d: SprotoTypeDeserialize) {
		let o = new sc_king_player_enter_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.player = d.ro("king_player_info");
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_sc_king_player_enter_request(self: sc_king_player_enter_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 1);

		if (self.player != undefined) {
			se.wo ("king_player_info", self.player, 0);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["sc_king_player_enter_request"] = {en: _encode_sc_king_player_enter_request, de: _decode_sc_king_player_enter_request}
	export class sc_king_player_leave_request {
		public dbid: number; // tag 0
	}

	function _decode_sc_king_player_leave_request(d: SprotoTypeDeserialize) {
		let o = new sc_king_player_leave_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.dbid = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_sc_king_player_leave_request(self: sc_king_player_leave_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 1);

		if (self.dbid != undefined) {
			se.wi (self.dbid, 0);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["sc_king_player_leave_request"] = {en: _encode_sc_king_player_leave_request, de: _decode_sc_king_player_leave_request}
	export class sc_king_point_data_request {
		public citypoint: number; // tag 0
		public commonpoint: number; // tag 1
		public cityreward: number[]; // tag 2
		public commonreward: number[]; // tag 3
	}

	function _decode_sc_king_point_data_request(d: SprotoTypeDeserialize) {
		let o = new sc_king_point_data_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.citypoint = d.ri ();
				break;
			case 1:
				o.commonpoint = d.ri ();
				break;
			case 2:
				o.cityreward = d.ria ();
				break;
			case 3:
				o.commonreward = d.ria ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_sc_king_point_data_request(self: sc_king_point_data_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 4);

		if (self.citypoint != undefined) {
			se.wi (self.citypoint, 0);
		}

		if (self.commonpoint != undefined) {
			se.wi (self.commonpoint, 1);
		}

		if (self.cityreward != undefined) {
			se.wia (self.cityreward, 2);
		}

		if (self.commonreward != undefined) {
			se.wia (self.commonreward, 3);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["sc_king_point_data_request"] = {en: _encode_sc_king_point_data_request, de: _decode_sc_king_point_data_request}
	export class sc_king_point_info_request {
		public camppoint: king_camp_point[]; // tag 0
	}

	function _decode_sc_king_point_info_request(d: SprotoTypeDeserialize) {
		let o = new sc_king_point_info_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.camppoint = d.roa("king_camp_point");
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_sc_king_point_info_request(self: sc_king_point_info_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 1);

		if (self.camppoint != undefined) {
			se.woa ("king_camp_point", self.camppoint, 0);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["sc_king_point_info_request"] = {en: _encode_sc_king_point_info_request, de: _decode_sc_king_point_info_request}
	export class sc_king_reborn_countdown_request {
		public reborncout: number; // tag 0
	}

	function _decode_sc_king_reborn_countdown_request(d: SprotoTypeDeserialize) {
		let o = new sc_king_reborn_countdown_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.reborncout = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_sc_king_reborn_countdown_request(self: sc_king_reborn_countdown_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 1);

		if (self.reborncout != undefined) {
			se.wi (self.reborncout, 0);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["sc_king_reborn_countdown_request"] = {en: _encode_sc_king_reborn_countdown_request, de: _decode_sc_king_reborn_countdown_request}
	export class sc_king_report_request {
		public persondetail: king_report_persondetail; // tag 0
		public rewards: reward_data[]; // tag 1
		public sharedata: king_report_sharedata; // tag 2
	}

	function _decode_sc_king_report_request(d: SprotoTypeDeserialize) {
		let o = new sc_king_report_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.persondetail = d.ro("king_report_persondetail");
				break;
			case 1:
				o.rewards = d.roa("reward_data");
				break;
			case 2:
				o.sharedata = d.ro("king_report_sharedata");
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_sc_king_report_request(self: sc_king_report_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 3);

		if (self.persondetail != undefined) {
			se.wo ("king_report_persondetail", self.persondetail, 0);
		}

		if (self.rewards != undefined) {
			se.woa ("reward_data", self.rewards, 1);
		}

		if (self.sharedata != undefined) {
			se.wo ("king_report_sharedata", self.sharedata, 2);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["sc_king_report_request"] = {en: _encode_sc_king_report_request, de: _decode_sc_king_report_request}
	export class sc_king_status_change_request {
		public dbid: number; // tag 0
		public status: number; // tag 1
	}

	function _decode_sc_king_status_change_request(d: SprotoTypeDeserialize) {
		let o = new sc_king_status_change_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.dbid = d.ri ();
				break;
			case 1:
				o.status = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_sc_king_status_change_request(self: sc_king_status_change_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 2);

		if (self.dbid != undefined) {
			se.wi (self.dbid, 0);
		}

		if (self.status != undefined) {
			se.wi (self.status, 1);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["sc_king_status_change_request"] = {en: _encode_sc_king_status_change_request, de: _decode_sc_king_status_change_request}
	export class sc_king_transform_change_request {
		public dbid: number; // tag 0
		public istransform: boolean; // tag 1
	}

	function _decode_sc_king_transform_change_request(d: SprotoTypeDeserialize) {
		let o = new sc_king_transform_change_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.dbid = d.ri ();
				break;
			case 1:
				o.istransform = d.rb ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_sc_king_transform_change_request(self: sc_king_transform_change_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 2);

		if (self.dbid != undefined) {
			se.wi (self.dbid, 0);
		}

		if (self.istransform != undefined) {
			se.wb (self.istransform, 1);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["sc_king_transform_change_request"] = {en: _encode_sc_king_transform_change_request, de: _decode_sc_king_transform_change_request}
	export class sc_king_update_city_request {
		public citys: king_city_info[]; // tag 0
	}

	function _decode_sc_king_update_city_request(d: SprotoTypeDeserialize) {
		let o = new sc_king_update_city_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.citys = d.roa("king_city_info");
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_sc_king_update_city_request(self: sc_king_update_city_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 1);

		if (self.citys != undefined) {
			se.woa ("king_city_info", self.citys, 0);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["sc_king_update_city_request"] = {en: _encode_sc_king_update_city_request, de: _decode_sc_king_update_city_request}
}
