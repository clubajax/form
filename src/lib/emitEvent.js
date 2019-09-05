const EVENT_NAME = 'change';
module.exports = function (instance, value) {
	value = value === undefined ? instance.value : value;
	value = typeof value === 'object' ? value : { value };
	const eventName = instance['event-name'] || EVENT_NAME;
    const emitType = eventName === EVENT_NAME ? 'emit' : 'fire';
    console.log(' - ', emitType, eventName, value);
	instance[emitType](eventName, value, true);
};
