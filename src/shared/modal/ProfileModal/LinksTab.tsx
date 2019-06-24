import React from 'react';
import InputField from 'ui/form/InputField';
import Button from 'ui/form/Button/Button';
import SvgIcon from 'components/global/common/SvgIcon';
import { Field } from 'react-final-form'

import { html } from 'components';
const bem: any = html.bem('LinksTab');

import './ProfileModal.scss';

const LinksTab: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
    const placeholder = "Enter URL";

    return (
        <div {...props} className={bem.block()}>
            <h3>Links</h3>
            <span>Connect With Your Social Media To Get More Coverage</span>
            <div className={bem.element('grid')}>
                <span>Twitter</span>
                <Field name="socials.url_twitter" placeholder={placeholder} component="input"/>
                <span>Facebook</span>
                <Field name="socials.url_facebook" placeholder={placeholder} component="input"/>
                <span>Linkedin</span>
                <Field name="socials.url_linkedin" placeholder={placeholder} component="input"/>
                <span>Telegram</span>
                <Field name="socials.url_telegram" placeholder={placeholder} component="input"/>
                <span>Your website</span>
                <Field name="socials.url_website" placeholder={placeholder} component="input"/>
            </div>
        </div>
    )
}

export default LinksTab;