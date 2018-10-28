const uidMap = {};
function uid (prefix = 'uid') {
	uidMap[prefix] = uidMap[prefix] || 0;
	uidMap[prefix]++;
	return `${prefix}-${uidMap[prefix]}`;
}

module.exports = uid;