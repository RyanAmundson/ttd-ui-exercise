import React from 'react'
import PropTypes from 'prop-types'
import './AdFormatCheckboxList.scss'

export default class AdFormatCheckboxList extends React.Component {
    static propTypes = {
        // Available ad formats
        items: PropTypes.arrayOf(PropTypes.shape({
            // Unique ID for the ad format
            id: PropTypes.string.isRequired,
            // Name of the ad format
            name: PropTypes.string.isRequired,
            // The type of the ad format
            type: PropTypes.oneOf(['display', 'video', 'text']),
            // The "width" of the ad format (could be pixels or characters)
            width: PropTypes.number.isRequired,
            // The "height" of the ad format (optional, but if provided, in pixels)
            height: PropTypes.number
        })),
        // onToggleItem(itemToToggle) => void, should mark the item as selected
        onToggleItem: PropTypes.func,
        // getIsChecked(itemToCheck) => bool
        getIsChecked: PropTypes.func,
    };

    renderItem(item) {
        switch(item.type) {
            case 'display':
                return <span>{item.name} ({item.width}x{item.height})</span>;
            case 'text':
                return <span>{item.name} (max: {item.width} characters)</span>;
            case 'video':
                return <span>{item.name} ({item.width}:{item.height})</span>;
        }
    }

    render() {
        return (
            <div className='adformatcheckboxlist'>
            {this.props.items.map(item =>
                <div key={item.id}>
                    <label>
                        <input type='checkbox' checked={this.props.getIsChecked(item)} onChange={() => this.props.onToggleItem(item)}/>
                        {this.renderItem(item)}
                    </label>
                </div>)}
            </div>
        );
    }
}