import React from 'react';
import PropTypes from 'prop-types';
import CancelOnUnmount from '../../services/CancelOnUnmount.js'
import CampaignCoreSettingsRecommendationService from '../../services/CampaignCoreSettingsRecommendationService';
import CampaignGeoRecommendationService from '../../services/CampaignGeoRecommendationService';
import CampaignAdFormatRecommendationService from '../../services/CampaignAdFormatRecommendationService';
import './Recommendations.scss'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIgloo, faCaretRight, faCaretLeft, faPlus } from '@fortawesome/free-solid-svg-icons'
import { ScrollUtil } from '../../services/util/ScrollUtil.js';

library.add(faCaretRight);
library.add(faCaretLeft);
library.add(faPlus);

export default class Recommendations extends React.Component {
    static propTypes = {
        recommendationType: PropTypes.string.isRequired,
        campaignId: PropTypes.string.isRequired,
        canAddRecommendation: PropTypes.bool.isRequired,
        recommendationService: PropTypes.any.isRequired

    };

    constructor(props) {
        super(props);

        this.scrollBox = React.createRef();
        this.state = {
            newRecommendationText: '',
            recommendations: [],
            addingRec: false
        };

        this.handleAddRecommendation = this.handleAddRecommendation.bind(this);
        this.handleTextAreaChanged = this.handleTextAreaChanged.bind(this);
        this.handleScrollLeft = this.handleScrollLeft.bind(this);
        this.handleScrollRight = this.handleScrollRight.bind(this);
        this.handleShowAddRecommendation = this.handleShowAddRecommendation.bind(this);
        this.handleHideAddRecommendation = this.handleHideAddRecommendation.bind(this);
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

    handleShowAddRecommendation(){
        this.setState({ addingRec: true });
        ScrollUtil.sideScroll(this.scrollBox.current, 'right', 10, 1000, 10);
    }

    handleHideAddRecommendation(){
        this.setState({addingRec: false});
    }

    handleTextAreaChanged(e) {
        this.setState({ newRecommendationText: e.target.value });
    }

    handleAddRecommendation() {
        if (this.state.newRecommendationText == "" || null) return;

        CancelOnUnmount.track(this, this.props.recommendationService
            .addRecommendation(this.props.campaignId, this.state.newRecommendationText)
            .then(recommendation => {
                this.setState({ recommendations: this.state.recommendations.concat(recommendation) });
                this.setState({ newRecommendationText: '' });
                ScrollUtil.sideScroll(this.scrollBox.current, 'right', 10, 1000, 10);
                this.setState({addingRec: false});
            })
            .catch(() => {
                alert('Couldn\'t add recommendation, please try again.');
            }));

    }

    handleScrollLeft(e) {
        ScrollUtil.sideScroll(this.scrollBox.current, 'left', 10, 200, 10);
        this.render();
    }

    handleScrollRight(e) {
        ScrollUtil.sideScroll(this.scrollBox.current, 'right', 10, 200, 10);
        this.render();
    }

    renderAddRecommendation() {
        return (
            <div className="add-recommendation">
                    <textarea value={this.state.newRecommendationText} onChange={this.handleTextAreaChanged} />
                    <div className="buttons">
                    <div className="div-button" onClick={this.handleAddRecommendation}>ok</div>
                    <div className="div-button" onClick={this.handleHideAddRecommendation}>close</div>
                    </div>
            </div>
        )
    }
    renderSingleRecommendation(id, recommendationText) {
        return (
            <div key={id} className="single-recommendation flip-in">
                {recommendationText}
            </div>
        );
    }

    render() {
        console.log(this.scrollBox)
        let entry = null;
        if (!this.state.addingRec && this.props.canAddRecommendation) {
            entry = 
            <div className="plus-sign" onClick={this.handleShowAddRecommendation}>
                <FontAwesomeIcon icon="plus" />
            </div>
        } else if(this.state.addingRec && this.props.canAddRecommendation){
            entry = this.renderAddRecommendation();
        }
        // let rightScrollClasses, leftScrollClasses;
        if(this.scrollBox.current != null) {
            console.log(this.scrollBox.current.scrollLeft, this.scrollBox.current.scrollWidth )
            // leftScrollClasses = classNames('scroll-left',{'disabled':this.scrollBox.current.scrollLeft == 0});
            // rightScrollClasses = (this.scrollBox.current.scrollLeft >= (this.scrollBox.current.scrollWidth - 10)) ? "scroll-right disabled" : "scroll-right" ;
        }
        // console.log(leftScrollClasses)


        return ( 
            <div className="recommendations"> 
                <div className="recommendation-scroller">
                    <span onClick={this.handleScrollLeft} >
                        <FontAwesomeIcon icon="caret-left" />
                    </span>
                    <div className="recommendation-list" ref={this.scrollBox}>
                        {
                            this.state.recommendations.map
                                (
                                    r => this.renderSingleRecommendation(r.id || r.auto_optimizer_id, r.text || r.suggestion, r.username || 'auto_optimizer')
                                )
                        }
                        {
                            entry
                        }
                        &nbsp;
                        &nbsp;
                    </div>

                    <span onClick={this.handleScrollRight}>
                        <FontAwesomeIcon icon="caret-right" />
                    </span>
                </div>
                <div>
                    <a href="" >Add Recommendation</a>
                </div>

            </div>
        );
    }
}