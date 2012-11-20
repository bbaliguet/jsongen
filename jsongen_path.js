// syntax
// {param1:"str:blabla{path}", param2:"num:[1000,2000:100]",
// param3:["5", {param1: "str:{../index}"}]}

(function(scope){

	var indexKeyword = "__index__",
		keyKeyword = "__key__",
		parentKeyword = "__parent__"

	var SimpleConf = function (conf) {
		this.conf = conf;
	}
	SimpleConf.prototype.resolve = function () {
		this.processing = true
		var simpleType = this.conf.substr(0,3), result
		if (simpleType == "str") {
			result = this.conf.substr(4)
			// handle intervals and vars
		}
		if (simpleType == "num") {
			// handle interval
			result = 12345
		}
		this.processing = false
		return result
	}

	var structGen = function(conf) {
		var type = Object.prototype.toString.call(conf)
		if (type == "[object String]") {
			return new SimpleConf(conf)
		} else if (type =="[object Array]") {
			var nb = conf[0],
				content = conf[1],
				out = [], element
			// handles intervals
			nb = parseInt(nb, 10);
			for (var i = 0; i<nb ; i++) {
				element = structGen(content)
				element[indexKeyword] = i
				element[parentKeyword] = out
				out.push(element)
			}
			return out
		} else {
			// case object
			var out ={}, element
			for (var key in conf) {
				if (conf.hasOwnProperty(key)) {
					element = structGen(conf[key])
					element[keyKeyword] = key
					element[parentKeyword] = out
					out[key] = element
				}
			}
			return out
		}
	}

	var resolveStruct = function (struct) {
		if (struct instanceof SimpleConf) {
			return struct.resolve()			
		} else {
			for (var key in struct) {
				if (struct.hasOwnProperty(key) 
					&& key != parentKeyword
					&& key != keyKeyword
					&& key != indexKeyword) {
					struct[key] = resolveStruct(struct[key])
				}
			}
		}
		return struct
	}

	var cleanStruct = function (struct) {
		if (typeof struct === "object") {
			delete struct[parentKeyword]
			delete struct[indexKeyword]
			delete struct[keyKeyword]
			for (var key in struct) {
				if (struct.hasOwnProperty(key))
					cleanStruct(struct[key])
			}
		}
	}

	scope.jsongen = function(conf) {
		var struct = resolveStruct(structGen(conf))
		cleanStruct(struct)
		return JSON.stringify(struct)
	}

})(window)


console.log(jsongen({
	param1: "str:blabla[5,7]",
	param2:"num:[1000,2000:100]",
	param3:["5", {
		p1 : "str:{../__index__}",
		p2 : "num:5"
	}]}))