const EVENT_NAME = 'change';
module.exports = function (instance, value) {
    if (instance.blockEvent) {
        return;
    }
    value = value === undefined ? instance.value : value;
    value = typeof value === 'object' ? value : {value};
    const eventName = instance['event-name'] || EVENT_NAME;
    const emitType = eventName === EVENT_NAME ? 'emit' : 'fire';
    instance[emitType](eventName, value, true);
    instance.__value = value.value;
};
