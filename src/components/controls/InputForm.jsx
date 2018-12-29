import React from 'react';
import PropTypes from 'prop-types';
import './InputForm.scss';
import Loader from './Loader.jsx';

export default class InputForm extends React.Component {
    static propTypes = {
        // Set to true while loading data.
        isLoading: PropTypes.bool.isRequired,
        // Set to true while saving data.
        isSaving: PropTypes.bool.isRequired,
        // Set to true when there was an error with saving or loading.
        isError: PropTypes.bool.isRequired,
        // Function to call when the user requests to submit the form.
        onSubmit: PropTypes.func.isRequired,
        // Function to call when the user clicks the "retry" button.
        onRetry: PropTypes.func.isRequired
    };

    getClassName() {
        let additionalClass = '';

        if (this.props.isLoading) {
            additionalClass = 'input-form--loading';
        } else if (this.props.isSaving) {
            additionalClass = 'input-form--saving';
        } else if (this.props.isError) {
            additionalClass = 'input-form--error';
        }

        return `input-form ${additionalClass}`;
    }

    renderError() {
        return (
            <div>
                <div>
                    There was an error while communicating with the server.
                </div>
                <button onClick={this.props.onRetry}>Retry</button>
            </div>
        );
    }

    render() {
        return (
            <div className={this.getClassName()}>
                <div className='input-form__content'>
                    { this.props.isError && this.renderError()}
                    <div className='input-form__fields__container'>
                        <div className='input-form__fields'>
                            {this.props.children}
                        </div>
                    </div>
                    <div className="input-form__save">
                        <button className="input-form__save-button" onClick={this.props.onSubmit}>
                            Save
                        </button>
                    </div>
                    { (this.props.isLoading || this.props.isSaving) && !this.props.isError && <Loader/>}
                </div>
            </div>
        );
    }
}
