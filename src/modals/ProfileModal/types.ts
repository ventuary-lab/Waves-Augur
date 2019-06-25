

export type UserSocials = {
    url_twitter: string;
    url_telegram: string;
}

export type UserAccount = {
    address: string;
    ref: string;
    name: string;
    title: string;
    activity: string;
    avatar: string;
    social: UserSocials,
    status: string;
}