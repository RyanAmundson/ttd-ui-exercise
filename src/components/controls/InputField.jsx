import React from 'react';
import PropTypes from 'prop-types'
import './InputField.scss';

export default class InputField extends React.Component {
    static propTypes = {
        // The label for the input
        label: PropTypes.string,
        // The actual input component.
        children: PropTypes.node
    };

    render() {
        return (
            <div className="input-field">
                <label className="input-field__label">{this.props.label}</label>
                {this.props.children}
            </div>
        );
    }
}