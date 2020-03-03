function calcMiddleButtons(start, total) {
    const beg = total - start > 3 ? start + 1 : total - 3;
    const btns = [];
    for (let i = beg; i < total; i++) {
        if (i > 1) {
            btns.push(i);
        }
        if (btns.length === 3) {
            break;
        }
    }
    return btns;
}

function calButtons(start, limit, total) {
    const rndTotal = Math.ceil(total / limit);
    const btns = calcMiddleButtons(start / limit, rndTotal);

    if (!btns.includes(rndTotal - 1)) {
        btns.push(0);
    }
    if (!btns.includes(rndTotal)) {
        btns.push(rndTotal);
    }

    if (btns[0] > 2) {
        btns.unshift(0);
    }
    if (btns[0] !== 1) {
        btns.unshift(1);
    }
    return btns;
}

module.exports = (start, limit, total) => {
    if (start % limit) {
        throw new Error('start must be evenly divisible by limit');
    }
    let buttons = ['*'];
    let status;
    let nextEnabled;
    let prevEnabled;

    if (total <= limit) {
        return {
            buttons,
            nextEnabled: false,
            prevEnabled: false,
            status: `1-${total} of ${total}`,
            next: () => {},
            prev: () => {},
            goto: () => {},
        };
    }

    if (total > limit) {
        buttons = calButtons(start, limit, total);
    }
    if (start + limit >= total) {
        status = `${start + 1}-${total} of ${total}`;
        nextEnabled = false;
        prevEnabled = true;
    } else {
        status = `${start + 1}-${start + limit} of ${total}`;
        nextEnabled = true;
        prevEnabled = true;
    }

    start = start / limit;
    total = total / limit;

    const next = () => (start + 1 < total ? start + 1 : start) * limit;
    const prev = () => (start - 1 > 0 ? start - 1 : 0) * limit;
    const goto = (num) => (num > 0 && num < total ? num : start) * limit;

    return {
        buttons,
        nextEnabled,
        prevEnabled,
        status,
        next,
        prev,
        goto,
    };
};
