// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class cs_xianlv_active_request {
		public id: number; // tag 0
	}

	function _decode_cs_xianlv_active_request(d: SprotoTypeDeserialize) {
		let o = new cs_xianlv_active_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.id = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_cs_xianlv_active_request(self: cs_xianlv_active_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 1);

		if (self.id != undefined) {
			se.wi (self.id, 0);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["cs_xianlv_active_request"] = {en: _encode_cs_xianlv_active_request, de: _decode_cs_xianlv_active_request}
	export class cs_xianlv_active_response {
		public ret: boolean; // tag 0
	}

	function _decode_cs_xianlv_active_response(d: SprotoTypeDeserialize) {
		let o = new cs_xianlv_active_response;
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

	function _encode_cs_xianlv_active_response(self: cs_xianlv_active_response, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 1);

		if (self.ret != undefined) {
			se.wb (self.ret, 0);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["cs_xianlv_active_response"] = {en: _encode_cs_xianlv_active_response, de: _decode_cs_xianlv_active_response}
	export class cs_xianlv_addexp_request {
		public id: number; // tag 0
		public autoBuy: number; // tag 1
	}

	function _decode_cs_xianlv_addexp_request(d: SprotoTypeDeserialize) {
		let o = new cs_xianlv_addexp_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.id = d.ri ();
				break;
			case 1:
				o.autoBuy = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_cs_xianlv_addexp_request(self: cs_xianlv_addexp_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 2);

		if (self.id != undefined) {
			se.wi (self.id, 0);
		}

		if (self.autoBuy != undefined) {
			se.wi (self.autoBuy, 1);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["cs_xianlv_addexp_request"] = {en: _encode_cs_xianlv_addexp_request, de: _decode_cs_xianlv_addexp_request}
	export class cs_xianlv_addexp_response {
		public ret: boolean; // tag 0
		public exp: number; // tag 1
		public level: number; // tag 2
	}

	function _decode_cs_xianlv_addexp_response(d: SprotoTypeDeserialize) {
		let o = new cs_xianlv_addexp_response;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.ret = d.rb ();
				break;
			case 1:
				o.exp = d.ri ();
				break;
			case 2:
				o.level = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_cs_xianlv_addexp_response(self: cs_xianlv_addexp_response, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 3);

		if (self.ret != undefined) {
			se.wb (self.ret, 0);
		}

		if (self.exp != undefined) {
			se.wi (self.exp, 1);
		}

		if (self.level != undefined) {
			se.wi (self.level, 2);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["cs_xianlv_addexp_response"] = {en: _encode_cs_xianlv_addexp_response, de: _decode_cs_xianlv_addexp_response}
	export class cs_xianlv_outbound_request {
		public first: number; // tag 0
		public second: number; // tag 1
	}

	function _decode_cs_xianlv_outbound_request(d: SprotoTypeDeserialize) {
		let o = new cs_xianlv_outbound_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.first = d.ri ();
				break;
			case 1:
				o.second = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_cs_xianlv_outbound_request(self: cs_xianlv_outbound_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 2);

		if (self.first != undefined) {
			se.wi (self.first, 0);
		}

		if (self.second != undefined) {
			se.wi (self.second, 1);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["cs_xianlv_outbound_request"] = {en: _encode_cs_xianlv_outbound_request, de: _decode_cs_xianlv_outbound_request}
	export class cs_xianlv_upstar_request {
		public id: number; // tag 0
	}

	function _decode_cs_xianlv_upstar_request(d: SprotoTypeDeserialize) {
		let o = new cs_xianlv_upstar_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.id = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_cs_xianlv_upstar_request(self: cs_xianlv_upstar_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 1);

		if (self.id != undefined) {
			se.wi (self.id, 0);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["cs_xianlv_upstar_request"] = {en: _encode_cs_xianlv_upstar_request, de: _decode_cs_xianlv_upstar_request}
	export class cs_xianlv_upstar_response {
		public ret: boolean; // tag 0
		public star: number; // tag 1
	}

	function _decode_cs_xianlv_upstar_response(d: SprotoTypeDeserialize) {
		let o = new cs_xianlv_upstar_response;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.ret = d.rb ();
				break;
			case 1:
				o.star = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_cs_xianlv_upstar_response(self: cs_xianlv_upstar_response, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 2);

		if (self.ret != undefined) {
			se.wb (self.ret, 0);
		}

		if (self.star != undefined) {
			se.wi (self.star, 1);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["cs_xianlv_upstar_response"] = {en: _encode_cs_xianlv_upstar_response, de: _decode_cs_xianlv_upstar_response}
}

