module.exports = class ProjectStatus {

    static VOTING = 'voting';
    static CROWDFUND = 'crowdfund';
    static WAITING_GRANT = 'waiting_grant';
    static GRANT = 'grant';
    static REJECTED = 'rejected';

    /**
     * Contract statuses
     *   new               Новый
     *   voting_commit     Голосование
     *   voting_reveal     Набрано нужное количество голосов
     *   featured          Результат голосования - YES, начался краудфайдинг
     *   delisted          Результат голосования - NO, проект отменент
     *   cashout           Выплачены призы
     *   buyout            Выплачен грант
     *
     * @param {string} contractStatus
     * @param {object} blocks
     * @param {number} height
     * @returns {string}
     */
    static getStatus(contractStatus, blocks, height) {
        // Voting
        if (['new', 'voting_commit', 'voting_reveal'].includes(contractStatus)) {
            return height < blocks.votingEnd ? this.VOTING : this.REJECTED;
        }

        // Crowdfund
        if (contractStatus === 'delisted') {
            return this.REJECTED;
        }
        if (contractStatus === 'featured') {
            return height < blocks.crowdfundEnd ? this.CROWDFUND : this.WAITING_GRANT;
        }

        // Granted
        return contractStatus === 'buyout' ? this.GRANT : this.WAITING_GRANT;
    }

};
