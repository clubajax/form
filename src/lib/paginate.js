function calcButtons(start, limit, total) {
    const rndTotal = Math.ceil(total / limit);
    const curr = start / limit + 1;
    const btns = [curr];
    // prev
    if (curr > 1) {
        btns.unshift(curr - 1);
        if (curr - 2 > 1) {
            btns.unshift(curr - 2);
            if (curr - 3 === 1) {
                btns.unshift(1);
            } else {
                btns.unshift(0);
                btns.unshift(1);
            }
        } else  if (curr - 1 > 1) {
            if (curr - 2 === 1) {
                btns.unshift(1);
            } else {
                btns.unshift(0);
                btns.unshift(1);
            }
        }
    }
    // next
    if (curr < rndTotal) {
        btns.push(curr + 1);
        if (curr + 1 < rndTotal) {
            if (curr + 2 === rndTotal) {
                btns.push(rndTotal);
            } else {
                if (curr + 3 === rndTotal) {
                    btns.push(curr + 2);
                    btns.push(rndTotal);
                } else {
                    btns.push(curr + 2);
                    btns.push(0);
                    btns.push(rndTotal);
                }
                
            }
        }
    }
    return btns;
}

module.exports = (start, limit, total) => {
    
    if ((start - 0) % limit) {
        throw new Error(`start must be evenly divisible by limit: ${start} % ${limit} = ${start % limit}`);
    }
    const rndTotal = limit < total ? Math.ceil(total / limit) : total;
    let buttons = [];
    let buttonIndex = -1;
    let status;
    let nextEnabled;
    let prevEnabled;
    let results = rndTotal === 1 ? 'Result' : 'Results';
    if (total <= limit) {
        return {
            buttons,
            buttonIndex,
            nextEnabled: false,
            prevEnabled: false,
            status: `${rndTotal} ${results}`,
            next: () => {},
            prev: () => {},
            goto: () => {},
        };
    }

    if (total > limit) {
        buttons = calcButtons(start, limit, total);
    }
    results = total === 1 ? 'Result' : 'Results'; 
    if (start + limit >= total) {
        status = `${total} ${results}`;
        nextEnabled = false;
        prevEnabled = true;
    } else {
        status = `${total} ${results}`;
        nextEnabled = true;
        prevEnabled = true;
    }

    start = start / limit;
    total = total / limit;
    buttonIndex = start;

    const next = () => ((start + 1 < total ? start + 1 : start) * limit) + 0;
    const prev = () => ((start - 1 > 0 ? start - 1 : 0) * limit) + 0;
    const goto = (num) => ((num > 0 && num < total ? num : start) * limit) + 0;
    const setLimit = (_limit) => {
        limit = _limit;
    };

    return {
        buttons,
        buttonIndex,
        nextEnabled,
        prevEnabled,
        status,
        setLimit,
        next,
        prev,
        goto,
    };
};
