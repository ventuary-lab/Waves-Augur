import React from 'react';
import PropTypes from 'prop-types';
import Button from 'ui/form/Button';
import Grid from 'ui/list/Grid';

import {html} from 'components';

import './IndexPage.scss';

const bem = html.bem('IndexPage');

export default class IndexPage extends React.PureComponent {

    static propTypes = {

    };



    render() {

        const items = [
            {
                name: 'Ivan',
                secondName: 'Ivanov',
                work: 'development',
            },
            {
                name: 'Petr',
                secondName: 'Petrov',
                work: 'manager',
            },
            {
                name: 'Jhon',
                secondName: 'Doe',
                work: 'designer',
            },
        ];

        return (
            <section className={bem.block()}>
                Main page
                <Button
                    label={'asdf'}
                    icon={'book'}
                />
                <Grid
                    listId={'adf'}
                    items={items}
                    columns={[
                        {
                            label: 'Name',
                            attribute: 'name',
                            // visible: false,
                        },
                        {
                            label: __('Second name'),
                            attribute: 'secondName',
                        },
                        {
                            label: 'Work',
                            attribute: 'work',
                        },
                    ]}
                />

            </section>
        );
    }
}
