import moment from 'moment';

/**
 * 
 * @param {Object} data - Project object
 * @param {String} attribute - param name
 * @param {Object | undefined} initialState - Project object
 * @returns {Object | undefined}
 */
export function expireCrowdAndDemoDayValidator(data, attribute, initialState) {
    let { expireCrowd, demoDay } = data;

    if (!expireCrowd || !demoDay) {
        return;
    };

    if (initialState) {
        const { expireCrowd: initialExpireCrowd, demoDay: initialDemoDay } = initialState;

        if (initialExpireCrowd && initialDemoDay) {
            return;
        }
    }

    const currentDate = moment();
    
    expireCrowd = moment(expireCrowd);
    demoDay = moment(demoDay);

    const validationObject = {
        areBothDatesInvalid: expireCrowd.isBefore(currentDate) || demoDay.isBefore(currentDate),
        isDemoBeforeCrowdfund: demoDay.isBefore(expireCrowd),
        isDatesRangeInvalid: !(
            expireCrowd.isAfter(currentDate) &&
            demoDay.subtract(9, 'days').isAfter(expireCrowd)
        )
    };

    const { areBothDatesInvalid, isDemoBeforeCrowdfund, isDatesRangeInvalid } = validationObject;

    if (areBothDatesInvalid) {
        return __('Deadlines cannot be select as past dates');
    }
    if (isDemoBeforeCrowdfund) {
        return __('Demo day cannot be set earlier than crowdfunding deadline');
    }
    if (isDatesRangeInvalid) {
        return __('Demo day must be set at least 10 days later than crowdfunding deadline');
    }
}


/**
 * 
 * @param {Object} data - Project object
 * @param {String} attribute - param name
 * @param {Object} initialState - Project object
 * @returns {Object | undefined}
 */
export function wavesTargetAmountValidator(data, attribute, initialState) {
    if (!data || !initialState) {
        return;
    }

    const { targetWaves } = data;
    const { positiveBalance } = initialState;

    if (Number(targetWaves) >= positiveBalance) {
        return;
    };

    return __('Amount of waves as target cannot be less than collected sum');
}