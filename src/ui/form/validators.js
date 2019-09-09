import moment from 'moment';

/**
 * 
 * @param {Object} data - Project object
 * @param {String} attribute - param name
 * @returns {Object | undefined}
 */
export function expireCrowdAndDemoDayValidator(data) {
    let { expireCrowd, demoDay } = data;

    if (!expireCrowd || !demoDay) {
        return;
    };

    const currentDate = moment();
    
    expireCrowd = moment(expireCrowd);
    demoDay = moment(demoDay);

    const validationObject = {
        areBothDatesInvalid: (
            // currentDate, expireCrowd, demoDay
            currentDate.add(1, 'days').isAfter()
        ),
        isDemoBeforeCrowdfund: demoDay.isBefore(expireCrowd)
    };
    console.log(expireCrowd, demoDay, currentDate, { a: expireCrowd.isBefore(currentDate), b: demoDay.isBefore(currentDate) });

    const { areBothDatesInvalid, isDemoBeforeCrowdfund } = validationObject;

    if (areBothDatesInvalid) {
        return __('Deadlines cannot be select as past dates');
    }
    if (isDemoBeforeCrowdfund) {
        return __('Demo day cannot be set earlier that crowdfunding deadline');
    }
    // if ()

    // expireCrowd, demoDay
    // __('String is too short, min: {min}', {
    //     min: params.min,
    // });
    //     которые находятся в статусе Crowdfunding
    // - оба числа не могут быть датами в прошлом
    // - demo day не может оканчиваться раньше, чем croudfunding deadline
    // - цель (waves) можно лишь увеличивать
    // - и еще прошу поправить отображение дат в этих полях - при редактированиии видны не даты, а DD.MM.YYYY. А должна отображаться дата

    // f (!_get(values, attribute) && !_get(values, 'socials.url_' + SocialEnum.TELEGRAM)) {
    //     return __('Twitter or telegram is required');
    // }
    // return false;
    // return __('Both dates')

}