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
        canAddRecommendation: PropTypes.bool.isRequired,
        recommendationService: PropTypes.any.isRequired

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
        CancelOnUnmount.track(this,
            this.props.recommendationService
                .getAllRecommendations(this.props.campaignId)
                .then(recommendations => {
                    this.setState({
                        recommendations: recommendations
                    })
                }).catch((err) => {
                    console.error("failed to get all recommendations: " + err);
                }));
    }

    componentWillUnmount() {
        CancelOnUnmount.handleUnmount(this);
    }

    handleTextAreaChanged(e) {
        this.setState({ newRecommendationText: e.target.value });
    }

    handleAddRecommendation() {
        console.log(this.state.newRecommendationText, this.props.recommendationService)
        if (this.state.newRecommendationText == "" || null) return;
        
        CancelOnUnmount.track(this,this.props.recommendationService
            .addRecommendation(this.props.campaignId, this.state.newRecommendationText)
            .then(recommendation => {
                this.setState({ recommendations: this.state.recommendations.concat(recommendation) });
                this.setState({ newRecommendationText: '' });
            })
            .catch(() => {
                alert('Couldn\'t add recommendation, please try again.');
            }));

    }

    renderAddRecommendation() {
        return (
            <div>
                <div>
                    <textarea value={this.state.newRecommendationText} onChange={this.handleTextAreaChanged} />
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
                {(this.props.canAddRecommendation) ? this.renderAddRecommendation() : ""}
            </div>
        );
    }
}