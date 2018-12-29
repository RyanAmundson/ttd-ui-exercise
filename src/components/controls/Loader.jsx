import React from 'react'
import './Loader.scss'

export default class Loader extends React.Component {
    render() {
        return (
            <div className='loader-gear'>
                <img src='gear.gif'/>
            </div>
        );
    }
}