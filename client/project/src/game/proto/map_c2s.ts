// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class cs_map_enter_request {
		public mapid: number; // tag 0
	}

	function _decode_cs_map_enter_request(d: SprotoTypeDeserialize) {
		let o = new cs_map_enter_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.mapid = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_cs_map_enter_request(self: cs_map_enter_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 1);

		if (self.mapid != undefined) {
			se.wi (self.mapid, 0);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["cs_map_enter_request"] = {en: _encode_cs_map_enter_request, de: _decode_cs_map_enter_request}
	export class cs_map_enter_response {
		public ret: boolean; // tag 0
	}

	function _decode_cs_map_enter_response(d: SprotoTypeDeserialize) {
		let o = new cs_map_enter_response;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.ret = d.rb ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_cs_map_enter_response(self: cs_map_enter_response, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 1);

		if (self.ret != undefined) {
			se.wb (self.ret, 0);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["cs_map_enter_response"] = {en: _encode_cs_map_enter_response, de: _decode_cs_map_enter_response}
	export class cs_map_fly_request {
		public mapid: number; // tag 0
		public x: number; // tag 1
		public y: number; // tag 2
	}

	function _decode_cs_map_fly_request(d: SprotoTypeDeserialize) {
		let o = new cs_map_fly_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.mapid = d.ri ();
				break;
			case 1:
				o.x = d.ri ();
				break;
			case 2:
				o.y = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_cs_map_fly_request(self: cs_map_fly_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 3);

		if (self.mapid != undefined) {
			se.wi (self.mapid, 0);
		}

		if (self.x != undefined) {
			se.wi (self.x, 1);
		}

		if (self.y != undefined) {
			se.wi (self.y, 2);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["cs_map_fly_request"] = {en: _encode_cs_map_fly_request, de: _decode_cs_map_fly_request}
	export class cs_map_leave_request {
		public mapid: number; // tag 0
	}

	function _decode_cs_map_leave_request(d: SprotoTypeDeserialize) {
		let o = new cs_map_leave_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.mapid = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_cs_map_leave_request(self: cs_map_leave_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 1);

		if (self.mapid != undefined) {
			se.wi (self.mapid, 0);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["cs_map_leave_request"] = {en: _encode_cs_map_leave_request, de: _decode_cs_map_leave_request}
	export class cs_map_leave_response {
		public ret: boolean; // tag 0
	}

	function _decode_cs_map_leave_response(d: SprotoTypeDeserialize) {
		let o = new cs_map_leave_response;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.ret = d.rb ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_cs_map_leave_response(self: cs_map_leave_response, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 1);

		if (self.ret != undefined) {
			se.wb (self.ret, 0);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["cs_map_leave_response"] = {en: _encode_cs_map_leave_response, de: _decode_cs_map_leave_response}
	export class cs_map_maincity_channel_info_request {
	}

	function _decode_cs_map_maincity_channel_info_request(d: SprotoTypeDeserialize) {
		let o = new cs_map_maincity_channel_info_request;
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

	function _encode_cs_map_maincity_channel_info_request(self: cs_map_maincity_channel_info_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 0);

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["cs_map_maincity_channel_info_request"] = {en: _encode_cs_map_maincity_channel_info_request, de: _decode_cs_map_maincity_channel_info_request}
	export class cs_map_maincity_channel_info_response {
		public channels: maincity_channel_data[]; // tag 0
	}

	function _decode_cs_map_maincity_channel_info_response(d: SprotoTypeDeserialize) {
		let o = new cs_map_maincity_channel_info_response;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.channels = d.roa("maincity_channel_data");
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_cs_map_maincity_channel_info_response(self: cs_map_maincity_channel_info_response, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 1);

		if (self.channels != undefined) {
			se.woa ("maincity_channel_data", self.channels, 0);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["cs_map_maincity_channel_info_response"] = {en: _encode_cs_map_maincity_channel_info_response, de: _decode_cs_map_maincity_channel_info_response}
	export class cs_map_maincity_enter_request {
		public channelId: number; // tag 0
	}

	function _decode_cs_map_maincity_enter_request(d: SprotoTypeDeserialize) {
		let o = new cs_map_maincity_enter_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.channelId = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_cs_map_maincity_enter_request(self: cs_map_maincity_enter_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 1);

		if (self.channelId != undefined) {
			se.wi (self.channelId, 0);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["cs_map_maincity_enter_request"] = {en: _encode_cs_map_maincity_enter_request, de: _decode_cs_map_maincity_enter_request}
	export class cs_map_maincity_enter_response {
		public ret: boolean; // tag 0
	}

	function _decode_cs_map_maincity_enter_response(d: SprotoTypeDeserialize) {
		let o = new cs_map_maincity_enter_response;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.ret = d.rb ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_cs_map_maincity_enter_response(self: cs_map_maincity_enter_response, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 1);

		if (self.ret != undefined) {
			se.wb (self.ret, 0);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["cs_map_maincity_enter_response"] = {en: _encode_cs_map_maincity_enter_response, de: _decode_cs_map_maincity_enter_response}
	export class cs_map_maincity_worship_request {
		public type: number; // tag 0
	}

	function _decode_cs_map_maincity_worship_request(d: SprotoTypeDeserialize) {
		let o = new cs_map_maincity_worship_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.type = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_cs_map_maincity_worship_request(self: cs_map_maincity_worship_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 1);

		if (self.type != undefined) {
			se.wi (self.type, 0);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["cs_map_maincity_worship_request"] = {en: _encode_cs_map_maincity_worship_request, de: _decode_cs_map_maincity_worship_request}
	export class cs_map_maincity_worship_response {
		public ret: boolean; // tag 0
	}

	function _decode_cs_map_maincity_worship_response(d: SprotoTypeDeserialize) {
		let o = new cs_map_maincity_worship_response;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.ret = d.rb ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_cs_map_maincity_worship_response(self: cs_map_maincity_worship_response, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 1);

		if (self.ret != undefined) {
			se.wb (self.ret, 0);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["cs_map_maincity_worship_response"] = {en: _encode_cs_map_maincity_worship_response, de: _decode_cs_map_maincity_worship_response}
	export class cs_map_move_request {
		public mapid: number; // tag 0
		public x: number; // tag 1
		public y: number; // tag 2
	}

	function _decode_cs_map_move_request(d: SprotoTypeDeserialize) {
		let o = new cs_map_move_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.mapid = d.ri ();
				break;
			case 1:
				o.x = d.ri ();
				break;
			case 2:
				o.y = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_cs_map_move_request(self: cs_map_move_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 3);

		if (self.mapid != undefined) {
			se.wi (self.mapid, 0);
		}

		if (self.x != undefined) {
			se.wi (self.x, 1);
		}

		if (self.y != undefined) {
			se.wi (self.y, 2);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["cs_map_move_request"] = {en: _encode_cs_map_move_request, de: _decode_cs_map_move_request}
	export class maincity_channel_data {
		public id: number; // tag 0
		public count: number; // tag 1
	}

	function _decode_maincity_channel_data(d: SprotoTypeDeserialize) {
		let o = new maincity_channel_data;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.id = d.ri ();
				break;
			case 1:
				o.count = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_maincity_channel_data(self: maincity_channel_data, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 2);

		if (self.id != undefined) {
			se.wi (self.id, 0);
		}

		if (self.count != undefined) {
			se.wi (self.count, 1);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["maincity_channel_data"] = {en: _encode_maincity_channel_data, de: _decode_maincity_channel_data}
}
