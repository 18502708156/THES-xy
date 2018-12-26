local parse_core = require "core"
local buildin_types = parse_core.buildin_types

local gmatch = string.gmatch
local tsort = table.sort
local tconcat = table.concat
local sformat = string.format


local mt = {}
mt.__index = mt

local function string_split(self, sep)
  local sep, fields = sep or ",", {}
  local pattern = string.format("([^%s]+)", sep)
  self:gsub(pattern, function(c) table.insert(fields, c) end)
  return fields
end

local function innercls_to_str(str)
  local tal = string_split(str, ".")
  if #tal > 1 then
    return table.concat(tal, "_")
  else
    return str
  end
end

local function upper_head(s)
  local c =  string.upper(string.sub(s, 1, 1))
  return c..string.sub(s, 2)
end

local function create_stream()
  return setmetatable({}, mt)
end

function mt:write(s, deep)
  s = s or ""
  deep = deep or 0

  local prefix = ""
  for i=1,deep do
    prefix = prefix.."\t"
  end

  self[#self+1] = prefix..s
end

function mt:dump()
  return tconcat( self, "\n")
end



local function str_split(str, sep)
  if sep == nil then
    sep = "%s"
  end

  local t={}
  local i=1
  for v in gmatch(str, "([^"..sep.."]+)") do
    t[i] = v
    i = i + 1
  end
  return t
end



-- class = {
--   {class_name = AAA, type_name = A.A.AAA,  max_field = 11, sproto_type = {}, internal_class = {}},
--   {class_name = BBB, type_name = B.B.BBB,  max_field = 11, sproto_type = {}, internal_class = {}},
-- }

local function _get_max_field_count(sproto_type)
  local maxn = #sproto_type
  local last_tag = -1

  for i=1,#sproto_type do
    local field = sproto_type[i]
    local tag = field.tag

    if tag < last_tag then
      error("tag must in ascending order")
    end

    if tag > last_tag +1 then 
      maxn = maxn + 1
    end
    last_tag = tag
  end

  return maxn
end

local function type2class(type_name, class_name, sproto_type)
  local class = {
    class_name = class_name,
    type_name = type_name, 
    max_field_count = sproto_type and _get_max_field_count(sproto_type) or nil,
    sproto_type = sproto_type,
    internal_class = {},
  }

  return class
end




local function gen_protocol_class(ast)
  local ret = {}
  for k,v in pairs(ast) do
    ret[#ret+1] = {
      name = k, 
      tag = v.tag,
      request = v.request,
      response = v.response,
    }
  end
  table.sort(ret, function (a, b) return a.name < b.name end)

  local cache = {}
  local classes = {}
  for i=1,#ret do
    local name = ret[i].name
    local fold = str_split(name, ".")

    local fullname = ""  
    local per = classes
    for i,v in ipairs(fold) do
      if i == 1 then fullname = v
      else fullname = fullname.."."..v end

      local item = cache[fullname]
      if not item then
        item = {}
        cache[fullname] = item
        table.insert(per, item)
      end

      per = item
      item.name = v
      item.value = ast[fullname]
    end
  end


  ret.classes = classes
  return ret
end



local function gen_type_class(ast)
  local type_name_list = {}
  local class = {}
  local cache = {}

  for k, _ in pairs(ast) do
    type_name_list[#type_name_list+1] = k
  end
  tsort(type_name_list, function (a, b) return a<b end)

  for i=1, #type_name_list do
    local k = type_name_list[i]
    local type_list = str_split(k, ".")
    
    local cur = class
    local type_name = ""
    for i=1,#type_list do
      local class_name = type_list[i]

      if i == 1 then type_name = class_name 
      else type_name = type_name.."."..class_name end

      if not cache[type_name] then
        local sproto_type = ast[type_name]
        local class_info =  type2class(sproto_type and type_name or nil, class_name, sproto_type)
        cur[#cur+1] = class_info
        cache[type_name] = class_info
      end

      cur = cache[type_name].internal_class
    end

  end

  return class
end

local _class_type = {
  string = "string",
  -- integer = "Int64",
  integer = "number",
  boolean = "boolean",
}
local function _2class_type(t, is_array, key)
  t = _class_type[t] or t

  if is_array and key then -- map
    local tk = _class_type[key.typename]
    assert(tk , "Invalid map key.")
    -- return string.format("Dictionary<%s, %s>", tk, t)
    return string.format("{[key:%s]: %s}", tk, t)
  elseif is_array and not key then -- arrat
    return innercls_to_str(t).."[]"
  elseif not is_array and not key then -- element
    return innercls_to_str(t)
  else
    error("Invalid field type.")
  end
end


local _write_func = {
  string = "ws",
  integer = "wi",
  boolean = "wb",
}
local function _write_encode_field(field, idx, stream, deep)
  local typename = field.typename
  local tag = field.tag
  local name = field.name
  local func_name = _write_func[typename] or "wo"
  if field.array then
    if field.key then
      func_name = func_name .. "d"
    else
      func_name = func_name .. "a"
    end
  end

  stream:write(sformat("if (self." .. name .. " != undefined) {", idx), deep)
  if  _write_func[typename] then
	  stream:write(sformat("se.%s (self.%s, %d);", func_name, name, tag), deep+1)
  else
  		stream:write(sformat("se.%s (\"%s\", self.%s, %d);", func_name, field.typename, name, tag), deep+1)
  end
  stream:write("}\n", deep)
end


local _read_func = {
  string = "rs",
  integer = "ri",
  boolean = "rb",
}
local function _write_read_field(field, stream, deep)
  local typename = field.typename
  local is_array = field.array
  local tag = field.tag
  local name = field.name
  local key = field.key

  local func_name = _read_func[typename]

  stream:write("case "..(tag)..":", deep)
  if func_name then
    if is_array then func_name = func_name.."a" end
    stream:write("o."..name.." = d."..func_name.." ();", deep+1)

  elseif key then
    assert(is_array)
    local fmt = string.format("o.%s = d.rm(%s, v => v.%s);", name, typename, key.name)
    stream:write(fmt, deep+1)

  else
    func_name = "ro"
    if is_array then func_name = func_name.."a" end
    stream:write("o."..name.." = d."..func_name.."(\""..innercls_to_str(typename).."\");", deep+1)

  end
  stream:write("break;", deep+1)
end



local function dump_class(class_info, stream, deep, parent_cls)
  local class_name = class_info.class_name
  if class_name == "package" then
    return
  end
  local sproto_type = class_info.sproto_type
  local internal_class = class_info.internal_class
  local max_field_count = class_info.max_field_count

  if sproto_type then
    if parent_cls then
      class_name = parent_cls .. "_" .. class_name
    end
    stream:write("export class "..class_name.." {", deep)
        
    -- max_field_count
    deep = deep + 1;

    for i=1,#sproto_type do
      local field = sproto_type[i]
      local type = _2class_type(field.typename, field.array, field.key)
      local name = field.name
      local tag = field.tag

      stream:write(sformat("public %s: %s; // tag %d", name, type, tag), deep)
    end

    deep = deep - 1;
    stream:write("}\n", deep)

    stream:write(sformat("function _decode_%s(d: SprotoTypeDeserialize) {", class_name), deep)
  	  stream:write(sformat("let o = new %s;", class_name), deep+1)
      stream:write("let t = -1;", deep+1)
      stream:write("while (-1 != (t = d.rt())) {", deep+1)
        stream:write("switch (t) {", deep+2)
        for i=1,#sproto_type do
          local field = sproto_type[i]
          _write_read_field(field, stream, deep+2)
        end
        stream:write("default:", deep+2)
          stream:write("d.nod ();", deep+3)
          stream:write("break;", deep+3)
        stream:write("}", deep+2)
      stream:write("}", deep+1)
      stream:write("return o", deep+1)
    stream:write("}\n", deep)

    stream:write(sformat("function _encode_%s(self: %s, st: Sproto.SprotoStream) {", class_name, class_name), deep)
      stream:write("let se = SprotoCore.GetSerialize(st, " .. max_field_count .. ");\n", deep+1)
      for i=1,#sproto_type do
        local field = sproto_type[i]
        _write_encode_field(field, i-1, stream, deep+1)
      end
      stream:write("return SprotoCore.CloseSerialize(se);", deep+1);
    stream:write("}\n", deep)
    stream:write(sformat("ALL_DICT[\"%s\"] = {en: _encode_%s, de: _decode_%s}", class_name, class_name, class_name), deep)
    

    for i=1,#internal_class do
      dump_class(internal_class[i], stream, deep, class_name)
    end

  else
    for i=1,#internal_class do
      dump_class(internal_class[i], stream, deep, class_name)
    end
  end
end


local function _gen_sprototype_namespace(package)
  -- return upper_head(package).."Sproto"
  -- return "Sproto" .. upper_head(package)
  -- return "Sproto" .. string.upper(package)
  return "Sproto"
end


local function _gen_protocol_classname(package)
  return upper_head(package).."Protocol"
end

local function constructor_protocol(class, package, stream, deep)
  local class_name = _gen_protocol_classname(package)
  local type_namespace = _gen_sprototype_namespace(package)
  -- local type_namespace = _gen_sprototype_namespace("")

  stream:write("public constructor() {", deep)
  stream:write("super()", deep + 1)
  stream:write("let prof = this.Protocol", deep + 1)
  deep = deep + 1
    for _,class_info in ipairs(class) do
      local name = class_info.name
      local tag = class_info.tag
      local request_type = class_info.request
      local response_type = class_info.response
      -- local stag = name..".Tag"
      -- local stag = class_name .. "." .. name
      local stag = class_info.tag

      -- stream:write("this.Protocol.SetProtocol("..stag..");", deep)
      local setStr01 = "null"
      if request_type then
        --request_type = type_namespace.."."..innercls_to_str(request_type)
        -- stream:write("this.Protocol.SetRequest("..stag..", " .. request_type .. ");",deep)
        setStr01 = "\"" .. innercls_to_str(request_type) .. "\""
      end

      local setStr02 = "null"
      if response_type then
        -- response_type = type_namespace.."."..innercls_to_str(response_type)
        -- stream:write("this.Protocol.SetResponse("..stag.. ", " .. response_type .. ");", deep)
        setStr02 = "\"" .. innercls_to_str(response_type) .. "\""
      end
      stream:write("prof.Set("..stag.. ", " .. setStr01 .. ", " .. setStr02 .. ");", deep)
    end
  deep = deep - 1
  stream:write("}\n", deep)
end


local function dump_protocol_class(class, stream, deep)
  local name = class.name
  local value = class.value

  stream:write("public static readonly "..name..": number = " .. value.tag, deep)

  -- stream:write("public class "..name.." {", deep)
  --   if value then
  --     assert(#class == 0)
  --     stream:write("public const int Tag = "..value.tag..";", deep+1)
  --   else
  --     for i,v in ipairs(class) do
  --       dump_protocol_class(v, stream, deep+1)
  --     end
  --   end
  -- stream:write("}\n", deep)
end



local function parse_protocol(class, stream, package)
  if not class or #class == 0 then return end

  local class_name = _gen_protocol_classname(package)
  stream:write("class "..class_name.." extends Sproto.ProtocolBase {")
  table.sort(class.classes, function(lhs, rhs)
  	return lhs.value.tag < rhs.value.tag and true or false
  end)
    for i,v in ipairs(class.classes) do
      dump_protocol_class(v, stream, 1)
    end
    -- stream:write("public static Instance: "..class_name.." = new "..class_name.."();", 1)
    constructor_protocol(class, package, stream, 1)

    
  stream:write("}")
end


local function parse_type(class, stream, package)
  if not class or #class == 0 then return end

  local namespace = _gen_sprototype_namespace(package)
  stream:write("namespace "..namespace.." { ")

  for i=1,#class do
    local class_info = class[i]
    dump_class(class_info, stream, 1)
  end

  stream:write("}\n\n")
end

local header = [[// Generated by sprotodump. DO NOT EDIT!]]
local using = [[
]]


local function parse_ast2type(ast, package, name)
  package = package or ""
  local type_class = gen_type_class(ast)
  local stream = create_stream()

  stream:write(header)
  -- stream:write([[// source: ]]..(name or "input").."\n")
  stream:write(using)

  -- parse type
  parse_type(type_class, stream, package)

  return stream:dump()
end


local function parse_ast2protocol(ast, package)
  package = package or ""
  local protocol_class = gen_protocol_class(ast)
  local stream = create_stream()

  stream:write(header)
  stream:write(using)

  -- parse protocol
  parse_protocol(protocol_class, stream, package)

  return stream:dump()  
end


local function parse_ast2all(ast, package, name)
  package = package or ""
  local type_class = gen_type_class(ast.type)
  local protocol_class = gen_protocol_class(ast.protocol)
  local stream = create_stream()

  stream:write(header)
  -- stream:write([[// source: ]]..(name or "input").."\n")
  stream:write(using)

  parse_type(type_class, stream, package)
  parse_protocol(protocol_class, stream, package)

  return stream:dump()  
end



------------------------------- dump -------------------------------------
local util = require "util"

local function main(trunk, build, param)
  local package = util.path_basename(param.package or "")
  local outfile = param.outfile
  local dir = param.dircetory or ""

  if outfile then
    local data = parse_ast2all(build, package, table.concat(param.sproto_file, " "))
    util.write_file(dir..outfile, data, "w")
  else
    -- dump sprototype
    for i,v in ipairs(trunk) do
      local name = param.sproto_file[i]
      local outcs = util.path_basename(name)..".ts"
      local data = parse_ast2type(v.type, package, name)
      util.write_file(dir..outcs, data, "w")
    end

    -- dump protocol
    if build.protocol then
      package = util.path_basename(param.package or "")
      local data = parse_ast2protocol(build.protocol, package)
      
      local outfile = package.."Protocol.ts"
      util.write_file(dir..outfile, data, "w")
    end
  end
end

return main
