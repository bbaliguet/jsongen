// syntax
// {param1:"str:blabla{index}", param2:"num:[1000,2000:100]",
// param3:["5", "index", {...}]}

(function(exports) {

	var replaceIndex = function(conf, indexes) {
		var matches = conf.match(/\{([^\}]+)\}/g);
		if (matches) {
			for (var i = 0, match, key; match = matches[i]; i++) {
				key = match.substring(1, match.length - 1)
				if (key in indexes) {
					conf = conf.replace(match, indexes[key])
				}
			}
		}
		return conf
	}

	var jsongen = function(conf, indexes) {
		var type = Object.prototype.toString.call(conf)
		if (type == "[object String]") {
			var simpleType = conf.substr(0, 4)
			if (simpleType == "str:") {
				conf = conf.substr(4)
				// handle intervals and vars
				return replaceIndex(conf, indexes)
			}
			if (simpleType == "num:") {
				// handle interval
				return 123456
			}
		} else if (type == "[object Array]") {
			var nb = conf[0],
				index = conf[1],
				content = conf[2],
				out = []
				// handle intervals
				nb = parseInt(nb, 10);
			for (var i = 0; i < nb; i++) {
				indexes[index] = i
				out.push(jsongen(content, indexes))
			}
			return out
		} else {
			// case object
			var out = {}
			for (var key in conf) {
				if (conf.hasOwnProperty(key)) out[key] = jsongen(conf[key], indexes)
			}
			return out
		}
	}

	exports.jsongen = function(conf) {
		return JSON.stringify(jsongen(conf, {}))
	}
})( /* browser + nodejs compatible */ typeof exports === 'undefined' ? window : exports)