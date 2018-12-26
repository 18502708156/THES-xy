-----------------------------------------------------------------------------  
-- Imports and dependencies  
-----------------------------------------------------------------------------  
local math = require('math')  
local string = require("string")  
local table = require("table")  
  
local print = print
local tconcat = table.concat
local tinsert = table.insert
local srep = string.rep
local type = type
local pairs = pairs
local tostring = tostring
local next = next
function printTable(root)
  if root == nil then
    return
  end
  local cache = {  [root] = "." }
  local function _dump(t,space,name)
    local temp = {}
    for k,v in pairs(t) do
      local key = tostring(k)
      if cache[v] then
        tinsert(temp,"+" .. key .. " {" .. cache[v].."}")
      elseif type(v) == "table" then
        local new_key = name .. "." .. key
        cache[v] = new_key
        tinsert(temp,"+" .. key .. _dump(v,space .. (next(t,k) and "|" or " " ).. srep(" ",#key),new_key))
      else
        tinsert(temp,"+" .. key .. " [" .. tostring(v).."]")
      end
    end
    return tconcat(temp,"\n"..space)
  end
  print(_dump(root, "",""))
end

local base = _G  
  

  
-- Private functions  
local encodeString  
local isArray  
local isEncodable  
  
-----------------------------------------------------------------------------  
-- PUBLIC FUNCTIONS  
-----------------------------------------------------------------------------  
--- Encodes an arbitrary Lua object / variable.  
-- @param v The Lua object / variable to be JSON encoded.  
-- @return String containing the JSON encoding in internal Lua string format (i.e. not unicode)  
function encode (v, first)  
  -- Handle nil values  
  if v==nil then  
    return "null"  
  end  
    
  local vtype = base.type(v)    
  
  -- Handle strings  
  if vtype=='string' then      
    return '"' .. encodeString(v) .. '"'        -- Need to handle encoding in string  
  end  
    
  -- Handle booleans  
  if vtype=='number' or vtype=='boolean' then  
    return base.tostring(v)  
  end  
    
  -- Handle tables  
  if vtype=='table' then  
    local rval = {}  
    -- Consider arrays separately  
    local bArray, maxCount = isArray(v,first)
    if bArray then  
      for i = 1,maxCount do  
        local val = encode(v[i])
        if val == "null" then
          val = ""
        end
        table.insert(rval, val)  
      end  
    else    -- An object, not an array  
      for i,j in base.pairs(v) do  
        if isEncodable(i) and isEncodable(j) then  
          table.insert(rval, '"' .. encodeString(i) .. '":' .. encode(j))  
        end  
      end  
    end  
    if bArray then  
      -- return '[\n' .. table.concat(rval,',\n') ..'\n]\n'  
      return '[' .. table.concat(rval,',') ..']'  
    else  
      return '{' .. table.concat(rval,',\n') .. '}\n'  
    end  
  end  
    
  -- Handle null values  
  if vtype=='function' and v==null then  
    return 'null'  
  end  
    
  base.assert(false,'encode attempt to encode unsupported type ' .. vtype .. ':' .. base.tostring(v))  
end  
  
function encode2 (v, first)  
  -- Handle nil values  
  if v==nil then  
    return "null"  
  end  
    
  local vtype = base.type(v)    
  
  -- Handle strings  
  if vtype=='string' then      
    return '"' .. encodeString(v) .. '"'        -- Need to handle encoding in string  
  end  
    
  -- Handle booleans  
  if vtype=='number' or vtype=='boolean' then  
    return base.tostring(v)  
  end  
    
  -- Handle tables  
  if vtype=='table' then  
    local rval = {}  
    -- Consider arrays separately  
    local bArray, maxCount = isArray2(v,first)
    if bArray then  
      for i = 1,maxCount do  
        local val = encode2(v[i])
        -- if val == "null" then
        --   val = ""
        -- end
        table.insert(rval, val)  
      end  
    else    -- An object, not an array  
      for i,j in base.pairs(v) do  
        if isEncodable(i) and isEncodable(j) then  
          table.insert(rval, '"' .. encodeString(i) .. '":' .. encode2(j))  
        end  
      end  
    end  
    if bArray then  
      -- return '[\n' .. table.concat(rval,',\n') ..'\n]\n'  
      return '[' .. table.concat(rval,',') ..']'  
    else  
      return '{' .. table.concat(rval,',\n') .. '}\n'  
    end  
  end  
    
  -- Handle null values  
  if vtype=='function' and v==null then  
    return 'null'  
  end  
    
  base.assert(false,'encode2 attempt to encode2 unsupported type ' .. vtype .. ':' .. base.tostring(v))  
end  

  
--- Encodes a string to be JSON-compatible.  
-- This just involves back-quoting inverted commas, back-quotes and newlines, I think ;-)  
-- @param s The string to return as a JSON encoded (i.e. backquoted string)  
-- @return The string appropriately escaped.  
  
local escapeList = {  
    ['"']  = '\\"',  
    ['\\'] = '\\\\',  
    ['/']  = '\\/',   
    ['\b'] = '\\b',  
    ['\f'] = '\\f',  
    ['\n'] = '\\n',  
    ['\r'] = '\\r',  
    ['\t'] = '\\t'  
}  
  
function encodeString(s)  
    if base.type(s) == "number" then
        s = base.tostring(s)
    end
    return s:gsub(".", function(c) return escapeList[c] end) -- SoniEx2: 5.0 compat  
end  
  
-- Determines whether the given Lua type is an array or a table / dictionary.  
-- We consider any table an array if it has indexes 1..n for its n items, and no  
-- other data in the table.  
-- I think this method is currently a little 'flaky', but can't think of a good way around it yet...  
-- @param t The table to evaluate as an array  
-- @return boolean, number True if the table can be represented as an array, false otherwise. If true,  
-- the second returned value is the maximum  
-- number of indexed elements in the array.   
function isArray(t,first)
	--[[return false--]]    
  -- Next we count all the elements, ensuring that any non-indexed elements are not-encodable   
  -- (with the possible exception of 'n')  
  if(first) then
    first = false
    return false
  end
  
  local maxIndex = 0
  local length = #t
  for k,v in base.pairs(t) do  
    if (base.type(k)=='number' and math.floor(k)==k and 1<=k and k <= length) then   -- k,v is an indexed pair  
      if (not isEncodable(v)) then return false end -- All array elements must be encodable  
      maxIndex = math.max(maxIndex,k)  
    else  
      if (k=='n') then  
        if v ~= table.getn(t) then return false end  -- False if n does not hold the number of elements  
      else -- Else of (k=='n')  
        if isEncodable(v) then return false end  
      end  -- End of (k~='n')  
    end -- End of k,v not an indexed pair  
  end  -- End of loop across all pairs  
  return true, maxIndex
end  
  
function isArray2(t,first)
  --[[return false--]]    
  -- Next we count all the elements, ensuring that any non-indexed elements are not-encodable   
  -- (with the possible exception of 'n')  
  if(first) then
    first = false
    return false
  end
  
  if t.GetListLen then
  	local len = t:GetListLen()
  	local maxLen = len
  	for i = len, 1, -1 do
  		if t[i] == nil then
  			maxLen = maxLen - 1
  		end
  		break
  	end
  	return maxLen > 0, maxLen
  end
  return #t > 0, #t
end  

--- Determines whether the given Lua object / table / variable can be JSON encoded. The only  
-- types that are JSON encodable are: string, boolean, number, nil, table and json.null.  
-- In this implementation, all other types are ignored.  
-- @param o The object to examine.  
-- @return boolean True if the object should be JSON encoded, false if it should be ignored.  
function isEncodable(o)  
  local t = base.type(o)  
  return (t=='string' or t=='boolean' or t=='number' or t=='nil' or t=='table') or (t=='function' and o==null)   
end  


--上面是json库的代码


function include(path)
  --print(lfs.currentdir())
    local f = io.lines(path, "*L")
    --local dir = string.gsub(path, "(.*[\\/])(%a+\.%a+)", "%1")
    --print("######-------  "..dir)
    local line = f()
    local content = {}
    while(line) do
        if string.find(line, "--#include") then
            local l = string.gsub(line, "(--#include).*\"(.+)\".*", "%2")
            --print("------#######   ".. line)
            --print("------#######   "..l)
            --print("------#######   "..dir..l)
            --line = openFile(dir..l)
            line = openFile(l)
        end
        table.insert(content, line)
        table.insert(content, '\n')
        line = f()
    end
    local ret = table.concat(content)
    --会出现连续2个逗号
    if ret == nil or ret == "" then ret = "nil" end

    return ret 
end

require("lfs")

local rootpath = lfs.currentdir()

function openFile(path)
    local cur = lfs.currentdir()
    local dir = string.gsub(path, "(.*[\\/])(%a+\.%a+)$", "%1")
    local file = string.gsub(path, "(.*[\\/])(%a+\.%a+)$", "%2")

    --print("######  "..dir)
    --print("------  "..path)
    lfs.chdir(dir)
    --print("chdir:" .. dir)
    s = include(file)
    lfs.chdir(cur)
    return s
end

local function createConfigFile(tb, className)
	-- print(rootpath)
	local fn = string.format("%s/config/%s.ts", rootpath, className)
	local fts = io.open(fn, "w")
	fts:write(string.format("class %s {\n", className))

	local ins = tb
	if isArray(tb) then
		ins = tb[1]
		if ins == nil then
			for k,v in pairs(tb) do
				ins = v
				break
			end
		end
	end

	for k, v in pairs(ins) do
		fts:write(string.format("public %s : %s;\n", k, type(v)))
	end
	fts:write("}")
	fts:close() 
end

function ex(luaFile, className, fp, requireFile)
  luaFileTemp = luaFile .. ".temp"
  --jsonFile = string.gsub(luaFile, "(.*[\\/])(%a+\.%a+)$", "%2")..".json"


  if requireFile ~= nil and requireFile ~= "" then
    local r = openFile(requireFile)
    f = io.open("temp.lua", "w")
    f:write(r)
    f:close()
    dofile("temp.lua")
    --assert(loadstring(r.." return nil"))()
  end
  print("openfile.."..luaFile)
  local s = openFile(luaFile)
  -- print("openfile.."..luaFile)
  --[[
    f = io.open("temp.lua", "w")
    f:write(s)
    f:close()
    dofile("temp.lua")
    local tb = _G[className]
    --]]

    local strData, arg1 = loadstring(s.." return "..className)
    if arg1 then
      print(arg1)
    end
    local tb = strData()

    if className == "MonstersConfig" then
      local temp = {}
      for k, v in pairs(tb) do
        if k > 30000 and k < 100000 then
          temp[k] = v
        end
      end
      tb = temp
    end

    if type(tb) == "table" then
      local first = true
      local state, newtb, newtbKeys = ConvertArray(className, tb)
      tb = newtb
      local j 
      if state then
        j = encode2(tb,first)
      else 
        j = encode(tb,first)
      end
      --f = io.open(outputPath..jsonFile, "w")
      fp:write(newtbKeys .. '"'..className ..'":\n'..j)   --key值
      print("convert successed")

	--   createConfigFile(tb, className) 
    else
      print("convert failed")
      local f = io.open(luaFileTemp, "w+")
      f:write(s);

      f:close();
    end
end

function _InsertKeys(keys, temp, ckey2)
  if not temp[ckey2] then
    temp[ckey2] = true
    table.insert(keys, ckey2)
  end
end

function _SetNewTable(keys, tb)
  local len = #keys
  local meta = {
    GetListLen = function() return len end
  }
  meta.__index = meta

  local newTable = {}
  for key, v in pairs(tb) do
    local cList = setmetatable({}, meta)
    for i, ckey in ipairs(keys) do
      local val = v[ckey]
      cList[i] = val
    end
    newTable[key] = cList
  end
  return newTable
end

function ConvertArray(className, tb)
  if not customClassName[className] then
    return false, tb, ""
  end

  local keyType = 1
  local keys = {}
  local temp = {}
  for k, v in pairs(tb) do
    for ckey, cVal in pairs(v) do
      -- key 数量为2
      if type(ckey) == "number" and type(cVal) == "table" then
        keyType = 2
        for ckey2, cVal2 in pairs(cVal) do
          _InsertKeys(keys, temp, ckey2)
        end
      else
        _InsertKeys(keys, temp, ckey)
      end
    end
  end
  print(className .. " >>keys>>" .. table.concat(keys, ", "))

    local newTable = {}
  if keyType == 1 then
    newTable = _SetNewTable(keys, tb)
  elseif keyType == 2 then
    for key, v in pairs(tb) do
      newTable[key] = _SetNewTable(keys, v)
    end
  else
    print("----------------------------------------------------------------------- not !!!!!!")
  end

    -- printTable(newTable)

  local strList = {}
  local customKey = {}
  for index, name in pairs(keys) do
    table.insert(strList, "\"" .. name .. "\":" .. (index - 1))
    table.insert(customKey, name .. ": number")
  end
  table.insert(allClassName, className .. "_keys: {" .. table.concat(customKey, "; ") .. "}")
  -- print(table.concat( strList, ", "))
  return true, newTable, "\"" .. className .. "_keys\": {" .. table.concat( strList, ",") .. "},\n"

end

local rootPath = lfs.currentdir()
configFile = "config.txt"
local fp = io.open("config.json", "w")
local fp2 = io.open("temp_all_cls_name.txt", "w")

if fp == nil then print("创建文件失败") return end
fp:write("{\n")
dofile(configFile)

customClassName = customClassName or {}
temp = {}
for _, val in ipairs(customClassName) do
  temp[val] = true
end
customClassName = temp
allClassName = {}

lfs.chdir(luaPath)
local isFirst = false
local testName = 1

local file = io.open(rootPath .. "\\config", "rb")
if file then
  file:close()
else
  os.execute("md " .. rootPath .. "\\config")
end


for _, file in ipairs(luaFiles) do
  local testFp = io.open(rootPath .. "\\config\\" .. testName .. ".json", "w")
  testFp:write("{")
  testName = testName + 1
	if isFirst == true then
		fp:write(",")
    -- ex(file[1], file[2], fp)
    ex(file[1], file[2], testFp)
	else
		isFirst = true
    -- ex(file[1], file[2], fp, lfs.currentdir() .. langFile)
    ex(file[1], file[2], testFp, lfs.currentdir() .. langFile)
	end
  testFp:write("}")
  testFp:close()
  if not customClassName[file[2]] then
    table.insert(allClassName, file[2])
  else
  	table.insert(allClassName, file[2] .. ": {[key: number]: any[]}")
  end
end
fp:write("}")
fp:close()


fp2:write(table.concat( allClassName, "\n"))
fp2:close()

-- os.execute("pause")