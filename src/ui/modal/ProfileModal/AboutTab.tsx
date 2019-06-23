import React from 'react';
import InputField from 'ui/form/InputField';
import Button from 'ui/form/Button/Button';
// import SvgIcon from 'components/global/common/SvgIcon';
import { Field } from 'react-final-form'

import InputTag from 'ui/form/InputTag';
import { html } from 'components';
const bem: any = html.bem('AboutTab');

import FormContext from './context';

type State = {
    tags: string[];
}

class AboutTab extends React.Component<React.HTMLAttributes<HTMLDivElement>> {
    state: State;

    constructor(props: any) {
        super(props);

        this.state = {
            tags: [],
        }
    }

    // onTagAdd = (event: React.KeyboardEvent) => {
    //     const { value } = event.target;

    //     console.log({ event })

    //     if (event.keyCode === 13) {
    //         this.setState((prevState: State) => ({ tags: [...prevState.tags, value] }));
    //     }
    // }

    connectUserImage () {
        
    }

    render () {
        const { connectUserImage } = this;
        const { tags } = this.state;

        return (
            <div {...this.props} className={bem.block()}>
                <h3>About tab</h3>
                <span>Add More Information about yourself</span>
                <FormContext.Consumer>
                    {({ avatar }) => (
                        <div className={bem.element('grid')}>
                            <div>
                                <span>Avatar URL</span>
                                <Field name="avatar" placeholder="Enter" component="input"/>
                                <Button className="base-green" onClick={connectUserImage}>Connect</Button>
                                <img src={avatar} alt={avatar}/>
                            </div>
                            <div>
                                <span>Your Occupation</span>
                                <Field name="title" placeholder="Enter" component="input"/>
                            </div>
                            <div>
                                <span>Tags</span>
                                <div>
                                    <label>Use ‘Enter’ to add a hashtag (10 max)</label>
                                    <Field name="tags" placeholder="Enter" component="input"/>
                                    <div>
                                        {tags.map((tag: string) => <InputTag>{tag}</InputTag>)}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <span>Your Country</span>
                                <Field name="location" placeholder="Enter" component="input"/>
                            </div>
                        </div>
                    )}
                </FormContext.Consumer>
            </div>
        );
    }
}

export default AboutTab;