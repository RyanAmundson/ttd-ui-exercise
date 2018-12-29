import React from 'react'
import PropTypes from 'prop-types'
import './GeoCheckboxList.scss'

export default class GeoCheckboxList extends React.Component {
    static propTypes = {
        // Available ad formats
        items: PropTypes.arrayOf(PropTypes.shape({
            // Unique ID for the geo location
            geoId: PropTypes.string.isRequired,
            // Name of the city
            city: PropTypes.string.isRequired,
            // Name of the state
            state: PropTypes.string.isRequired,
        })),
        searchText: PropTypes.string.isRequired,
        // onToggleItem(itemToToggle) => void, should mark the item as selected
        onToggleItem: PropTypes.func,
        // getIsChecked(itemToCheck) => bool
        getIsChecked: PropTypes.func,
    };

    renderItem(item) {
        return <span>{item.city}, {item.state}</span>;
    }

    render() {
        return (
            <div className='geocheckboxlist'>
                <input type='search' placeholder='Search...' value={this.props.searchText} onChange={e => this.props.onSearchChanged(e.target.value)}/>
                <div className='geocheckboxlist__contents'>
                {this.props.items.length === 0 && <div>Loading...</div>}
                {this.props.items.map(item =>
                    <div key={item.geoId}>
                        <label>
                            <input type='checkbox' checked={this.props.getIsChecked(item)} onChange={() => this.props.onToggleItem(item)}/>
                            {this.renderItem(item)}
                        </label>
                    </div>)}
                </div>
            </div>
        );
    }
}

GeoCheckboxList.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        geoId: PropTypes.string,
        name: PropTypes.string,
        state: PropTypes.string
    })),
    onToggleItem: PropTypes.func,
    getIsChecked: PropTypes.func,
};