import React from 'react';
import CoreSettings from './views/CoreSettings.jsx'
import AdFormatTargeting from './views/AdFormatTargeting.jsx';
import GeoTargeting from './views/GeoTargeting.jsx';

import '../main.scss';
import './MyApplication.scss';

const CORE_SETTINGS = 'CORE_SETTINGS';
const AD_FORMAT_TARGETING = 'AD_FORMAT_TARGETING';
const GEO_TARGETING = 'GEO_TARGETING';

export default class MyApplication extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            campaignId: '1',
            selectedTab: CORE_SETTINGS,
        };
    }

    getTabClassName(thisTab) {
        if (thisTab === this.state.selectedTab)
            return 'tab selected';
        return 'tab';
    }

    clickTab(newTab) {
        this.setState({
            selectedTab: newTab
        });
    }

    renderTab(tab, title) {
        return (
            <a className={this.getTabClassName(tab)} onClick={() => this.clickTab(tab)}>
                {title}
            </a>
        );
    }

    render() {
        return (
            <div className='myapplication'>
                <div className='header'>
                    <img src='ttd-logo-white.png'/>
                </div>
                <div className='content'>
                    <div className='tabs'>
                        {this.renderTab(CORE_SETTINGS, 'Core Settings')}
                        {this.renderTab(GEO_TARGETING, 'Geo Targeting')}
                        {this.renderTab(AD_FORMAT_TARGETING, 'Ad Format Targeting')}
                    </div>
                    <div className='body'>
                        {this.renderSelectedTabContents(this.state.selectedTab)}
                    </div>
                </div>
            </div>
        );
    }

    renderSelectedTabContents() {
        switch (this.state.selectedTab) {
            default:
                throw new Error('Unexpected tab selected.');
            case CORE_SETTINGS:
                return <CoreSettings campaignId={this.state.campaignId}/>;
            case AD_FORMAT_TARGETING:
                return <AdFormatTargeting campaignId={this.state.campaignId}/>;
            case GEO_TARGETING:
                return <GeoTargeting campaignId={this.state.campaignId}/>;
        }
    }
}