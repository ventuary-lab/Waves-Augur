const WavesContractCache = require('./WavesContractCache');

(new WavesContractCache({
    contractMethods: {
        inviteuser: (sender, newaccount, data) => ([
            'wl_ref_' + newaccount,
            'wl_bio_' + newaccount,
            'wl_sts_' + newaccount,
        ]),
        signupbylink: (sender, hash, data, type) => ([
            'wl_bio_' + sender,
            'wl_blk_' + sender,
            'wl_sts_' + sender,
            'wl_sts_' + hash,
            'wl_ref_' + sender,
        ]),
        signup: (sender, data, type) => ([
            'wl_bio_' + sender,
            'wl_blk_' + sender,
            'wl_sts_' + sender,
        ]),
        userupdate: (sender, data, type) => ([
            'wl_bio_' + sender,
            'wl_sts_' + sender,
        ]),
        godsmodestring: (sender, key, val) => ([
            key,
        ]),
        projupdate: (sender, item, data) => ([
            'datajson_' + item,
        ]),
        withdraw: (sender) => ([
            'balance_' + sender,
        ]),
        additem: (sender, item, expVoting, expCrowd, expWhale, data) => ([
            'author_' + sender,
            'block_' + item,
            'expiration_block_' + item,
            'bank_' + item,
            'status_' + item,
            'datajson_' + item,
            'expiration_one_' + item,
            'expiration_two_' + item,
        ]),
        votecommit: (sender, item, hash) => ([
            'status_' + item,
            'commit_' + item + '_' + sender,
            'ncommits_' + item,
        ]),
        votereveal: (sender, item, vote, salt, review) => ([
            'reveal_' + item + '_' + sender,
            'cnt_yes_' + item,
            'cnt_no_' + item,
            'status_' + item,
            'review_' + item + '_' + sender + '_votereview',
            'balance_' + sender,
        ]),
        finalizevoting: (sender, item, account) => ([
            'final_' + item + '_' + account,
            'balance_' + account,
        ]),
        closeexpiredvoting: (sender, item, account) => ([
            'final_' + item + '_' + account,
            'balance_' + account,
        ]),
        donate: (sender, item, tier, mode, review) => ([
            'reviews_cnt_' + item + '_' + sender,
            'positive_fund_' + item + '_' + sender,
            'negative_fund_' + item + '_' + sender,
            'positive_fund_' + item,
            'negative_fund_' + item,
            // TODO DataEntry(getKeyItemAccReviewText(item, account, toString(cnt)), review),
            // TODO DataEntry(getKeyItemAccReviewMode(item, account, toString(cnt)), mode),
            // TODO DataEntry(getKeyItemAccReviewTier(item, account, toString(cnt)), tier)
        ]),
        whale: (sender, item, review) => ([
            'status_' + item,
            'review_' + item + '_' + sender + '_whalereview',
            // TODO 'balance_' + ITEM_AUTHOR,
            'buyout_amount_' + item,
        ]),
        claimwinnings: (sender, item, account) => ([
            'balance_' + account,
            'status_' + item,
            'final_' + item + '_' + account,
        ])
    }
})).start()
