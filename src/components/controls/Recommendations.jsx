import React from 'react';
import PropTypes from 'prop-types';
import CancelOnUnmount from '../../services/CancelOnUnmount.js'
import CampaignCoreSettingsRecommendationService from '../../services/CampaignCoreSettingsRecommendationService';
import CampaignGeoRecommendationService from '../../services/CampaignGeoRecommendationService';
import CampaignAdFormatRecommendationService from '../../services/CampaignAdFormatRecommendationService';
import './Recommendations.scss'

export default class Recommendations extends React.Component {
    static propTypes = {
        recommendationType: PropTypes.string.isRequired,
        campaignId: PropTypes.string.isRequired,
        canAddRecommendation: PropTypes.bool.isRequired

    };

    constructor(props) {
        super(props);

        this.state = {
            newRecommendationText: '',
            recommendations: []
        };

        this.handleAddRecommendation = this.handleAddRecommendation.bind(this);
        this.handleTextAreaChanged = this.handleTextAreaChanged.bind(this);
    }

    componentDidMount() {
        if (this.props.recommendationType === 'CAMPAIGN_CORE_SETTINGS_RECOMMENDATIONS') {
            CancelOnUnmount.track(this, CampaignCoreSettingsRecommendationService
                .getAllRecommendations(this.props.campaignId)
                .then(recommendations => {
                    this.setState({
                        recommendations: recommendations
                    })
                }));
        } else if (this.props.recommendationType === 'CAMPAIGN_GEO_RECOMMENDATIONS') {
            CancelOnUnmount.track(this, CampaignGeoRecommendationService
                .getAllRecommendations(this.props.campaignId)
                .then(recommendations => {
                    this.setState({
                        recommendations: recommendations
                    })
                }));

        } else if (this.props.recommendationType === 'CAMPAIGN_ADFORMAT_RECOMMENDATIONS') {
            CancelOnUnmount.track(this, CampaignAdFormatRecommendationService
                .getAllRecommendations(this.props.campaignId)
                .then(recommendations => {
                    this.setState({
                        recommendations: recommendations
                    })
                }));
        }
    }

    componentWillUnmount() {
        CancelOnUnmount.handleUnmount(this);
    }

    handleTextAreaChanged(e) {
        this.setState({ newRecommendationText: e.target.value });
    }

    handleAddRecommendation() {
        const recommendationText = this.state.newRecommendationText;

        this.setState({ newRecommendationText: '' });

        if (this.props.recommendationType === 'CAMPAIGN_CORE_SETTINGS_RECOMMENDATIONS') {
            CancelOnUnmount.track(this, CampaignCoreSettingsRecommendationService
                .addRecommendation(this.props.campaignId, recommendationText )
                .then(recommendation => {
                    this.setState({ recommendations: this.state.recommendations.concat(recommendation) })
                })
                .catch(() => {
                    alert('Couldn\'t add recommendation, please try again.');
                }));
        } else if (this.props.recommendationType === 'CAMPAIGN_ADFORMAT_RECOMMENDATIONS') {
            CancelOnUnmount.track(this, CampaignAdFormatRecommendationService
                .addRecommendation(this.props.campaignId, recommendationText )
                .then(recommendation => {
                    this.setState({ recommendations: this.state.recommendations.concat(recommendation) })
                })
                .catch(() => {
                    alert('Couldn\'t add recommendation, please try again.');
                }));
        }
    }

    renderAddRecommendation(){
        return (
            <div>
                <div>
                    <textarea value={this.state.newRecommendationText} onChange={this.handleTextAreaChanged}/>
                </div>
                <div>
                    <button onClick={this.handleAddRecommendation}>Add</button>
                </div>
            </div>
        )
    }
    renderSingleRecommendation(id, recommendationText) {
        return (
            <div key={id} className="recommendations__single">
                {recommendationText}
            </div>
        );
    }

    render() {
        return (
            <div className="recommendations">
                <div>
                    {this.state.recommendations.map(r => this.renderSingleRecommendation(r.id || r.auto_optimizer_id, r.text || r.suggestion, r.username || 'auto_optimizer'))}
                </div>
                { (this.props.canAddRecommendation) ? this.renderAddRecommendation() : "" }
            </div>
        );
    }
}