// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class cs_enhance_get_reward_request {
		public no: number; // tag 0
	}

	function _decode_cs_enhance_get_reward_request(d: SprotoTypeDeserialize) {
		let o = new cs_enhance_get_reward_request;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.no = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_cs_enhance_get_reward_request(self: cs_enhance_get_reward_request, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 1);

		if (self.no != undefined) {
			se.wi (self.no, 0);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["cs_enhance_get_reward_request"] = {en: _encode_cs_enhance_get_reward_request, de: _decode_cs_enhance_get_reward_request}
	export class cs_enhance_get_reward_response {
		public ret: boolean; // tag 0
		public no: number; // tag 1
	}

	function _decode_cs_enhance_get_reward_response(d: SprotoTypeDeserialize) {
		let o = new cs_enhance_get_reward_response;
		let t = -1;
		while (-1 != (t = d.rt())) {
			switch (t) {
			case 0:
				o.ret = d.rb ();
				break;
			case 1:
				o.no = d.ri ();
				break;
			default:
				d.nod ();
				break;
			}
		}
		return o
	}

	function _encode_cs_enhance_get_reward_response(self: cs_enhance_get_reward_response, st: Sproto.SprotoStream) {
		let se = SprotoCore.GetSerialize(st, 2);

		if (self.ret != undefined) {
			se.wb (self.ret, 0);
		}

		if (self.no != undefined) {
			se.wi (self.no, 1);
		}

		return SprotoCore.CloseSerialize(se);
	}

	ALL_DICT["cs_enhance_get_reward_response"] = {en: _encode_cs_enhance_get_reward_response, de: _decode_cs_enhance_get_reward_response}
}

