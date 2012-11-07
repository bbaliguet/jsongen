// syntax
// {param1:"str:blabla{index}", param2:"num:[1000,2000:100]",
// param3:["5", "index", {...}]}

(function(scope){

	var replaceIndex = function(conf, indexes) {
		return conf.replace(/\{([^\}]+)\}/g, indexes["$1"])
	}

	var jsongen = function(conf, indexes) {
		var type = Object.prototype.toString.call(conf)
		if (type == "[object String]") {
			var simpleType = conf.substr(0,3)
			if (simpleType == "str") {
				conf = conf.substr(3)
				// handle intervals and vars
				return replaceIndex(conf, indexes)
			}
			if (simpleType == "num") {
				// handle interval
				return 123456
			}
		} else if (type =="[object Array]") {
			var nb = conf[0],
				index = conf[1],
				content = conf[2],
				out = []
			// handle intervals
			nb = parseInt(nb, 10);
			for (var i = 0; i<nb ; i++) {
				indexes[index] = i
				out.push(jsongen(content, indexes))
			}
			return out
		} else {
			// case object
			var out ={}
			for (var key in conf) {
				if (conf.hasOwnProperty(key))
					out[key] = jsongen(conf[key],indexes)
			}
			return out
		}
	}

	scope.jsongen = function(conf) {
		return JSON.stringify(jsongen(conf, {}))
	}
})(window)


console.log(jsongen({
	param1: "str:blabla[5,7]",
	param2:"num:[1000,2000:100]",
	param3:["5", "index", {
		p1 : "str{index}",
		p2 : "num"
	}]}))