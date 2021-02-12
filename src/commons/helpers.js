/**
 * returns true if an object is "not" empty
 * else it returns false
 * @param {Object} obj The object to be tested
 */
const isNotEmpty = obj => {
	return typeof obj === 'undefined' || obj === null
		? false
		: Boolean(Object.keys(obj).length);
};

export { isNotEmpty };
