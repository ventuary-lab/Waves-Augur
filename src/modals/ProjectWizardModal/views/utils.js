import moment from 'moment';

/**
 * 
 * @param {Date} date 
 * @returns {String}
 */
export function mapDateFieldToInitial(date) {

    return moment(date).format('YYYY-MM-DD');
}