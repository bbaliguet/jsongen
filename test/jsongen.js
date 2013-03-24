var jsongen = require('../jsongen.js').jsongen,
	assert = require('assert')

exports['test jsongen module'] = function(assert) {
	assert.equal(jsongen({}), '{}')
	assert.equal(jsongen({
		param: "str:test"
	}), '{"param":"test"}')
	assert.equal(jsongen({
		param: ["2", "index", "str:test{index}"]
	}), '{"param":["test0","test1"]}')
}

if (module == require.main) require('test').run(exports)