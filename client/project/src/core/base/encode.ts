var ccode = ccode || {};

ccode.getByte = function (data){
    var length = data.length;
    var result = new Array();
    for(var i = 0; i < length; i++){
        result[i] = data.charCodeAt(i);
    }
    return result;
}

ccode.getChar = function (array){
    var string = new String();
    for (var i in array){
        string += String.fromCharCode(array[i]);
    }
    return string;
}

ccode.encrypt = function (data, key){
    var dataArr = ccode.getByte(data);
    var keyArr = ccode.getByte(key);
    var array = new Array();
    var lengthData = dataArr.length;
    var lengthKey = keyArr.length;
    for(var i = 0; i <   lengthData; i ++){
        array[i] =  (0xff & dataArr[i]) + (0xff & keyArr[i % lengthKey])
    }
    return array.join('@');
}

ccode.decrypt = function (encode, key) {
    var codeArr = encode.split('@');
    var keyArr = ccode.getByte(key);
    var array = new Array();
    var lengthCode = codeArr.length;
    var lengthKey = keyArr.length;
    for (var i = 0; i < lengthCode; i++) {
        array[i] = codeArr[i] - (0xff & keyArr[i % lengthKey]);
    }
    return ccode.getChar(array);
}