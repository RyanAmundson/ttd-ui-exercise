import React from 'react';
import PropTypes from 'prop-types';
import CancelOnUnmount from '../../services/CancelOnUnmount.js'
import './Recommendations.scss'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCaretRight, faCaretLeft, faPlus, faRecycle } from '@fortawesome/free-solid-svg-icons'
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
            addingRec: false,
            disableLeftScroll: true,
            disableRightScroll: false,
            scrollSpeed: 10,
            scrollDistance: 200,
            scrollStep: 10,
            savingNewRec: false,
        };

        this.handleAddRecommendation = this.handleAddRecommendation.bind(this);
        this.handleTextAreaChanged = this.handleTextAreaChanged.bind(this);
        this.handleScrollLeft = this.handleScrollLeft.bind(this);
        this.handleScrollRight = this.handleScrollRight.bind(this);   
        this.handleScrollLeftEnd = this.handleScrollLeftEnd.bind(this);
        this.handleScrollRightEnd = this.handleScrollRightEnd.bind(this);      
        this.handleShowAddRecommendation = this.handleShowAddRecommendation.bind(this);  
        this.handleHideAddRecommendation = this.handleHideAddRecommendation.bind(this);

        setInterval(() => {
            if(this.scrollBox && this.scrollBox.current){
                this.setState({
                    disableLeftScroll: this.scrollBox.current.scrollLeft === 0,
                    disableRightScroll: this.scrollBox.current.clientWidth + this.scrollBox.current.scrollLeft >= (this.scrollBox.current.scrollWidth)
                });
            }
        },500);
    }

    componentDidMount() {
        CancelOnUnmount.track(this,
            this.props.recommendationService
                .getAllRecommendations(this.props.campaignId)
                .then(recommendations => {
                    this.setState({
                        recommendations: recommendations
                    })
                    console.log(recommendations)
                }).catch((err) => {
                    console.error("failed to get all recommendations: " + err);
                }));
    }

    componentWillUnmount() {
        CancelOnUnmount.handleUnmount(this);
    }

    handleHideAddRecommendation(){
        this.setState({addingRec: false});
    }

    handleShowAddRecommendation(){
        this.setState({addingRec: true});
        ScrollUtil.sideScroll(this.scrollBox.current, 'right', this.state.scrollSpeed, this.scrollBox.current.clientWidth, this.state.scrollStep);
    }

    handleTextAreaChanged(e) {
        this.setState({ newRecommendationText: e.target.value });
    }

    handleAddRecommendation() {
        if (this.state.newRecommendationText == "" || null) return;
        this.setState({savingNewRec:true});

        CancelOnUnmount.track(this, this.props.recommendationService
            .addRecommendation(this.props.campaignId, this.state.newRecommendationText)
            .then(recommendation => {
                this.setState({ recommendations: this.state.recommendations.concat(recommendation) });
                this.setState({ newRecommendationText: '' });
                ScrollUtil.sideScroll(this.scrollBox.current, 'right', this.state.scrollSpeed, this.scrollBox.current.clientWidth, this.state.scrollStep);
                this.setState({addingRec: false});
                this.setState({savingNewRec:false});
            })
            .catch(() => {
                alert('Couldn\'t add recommendation, please try again.');
                this.setState({addingRec: true});
                this.setState({savingNewRec:false});
            }));

    }

    handleScrollLeft(e) {
        ScrollUtil.sideScroll(this.scrollBox.current, 'left', this.state.scrollSpeed, this.state.scrollDistance, this.state.scrollStep);
        this.render();
    }

    handleScrollRight(e) {
        ScrollUtil.sideScroll(this.scrollBox.current, 'right', this.state.scrollSpeed, this.state.scrollDistance, this.state.scrollStep);
        this.render();
    }

    handleScrollRightEnd(e) {
        ScrollUtil.sideScroll(this.scrollBox.current, 'right', this.state.scrollSpeed, this.scrollBox.current.clientWidth, this.state.scrollStep);
        this.render();
    }
    handleScrollLeftEnd(e) {
        ScrollUtil.sideScroll(this.scrollBox.current, 'left', this.state.scrollSpeed, this.scrollBox.current.clientWidth, this.state.scrollStep);
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
        let entry;
        if (!this.state.addingRec && this.props.canAddRecommendation) {
            entry = 
            <div className="plus-sign" onClick={this.handleShowAddRecommendation}>
                <FontAwesomeIcon icon="plus" />
            </div>
        } else if(this.state.addingRec && this.props.canAddRecommendation && !this.state.savingNewRec){
            entry = this.renderAddRecommendation();
        } else if (this.state.savingNewRec){
            entry = <div className="add-recommendation loading"> Saving... </div>;

        }


        return ( 
            <div className="recommendations"> 
                <div className="recommendation-scroller">
                    <span className={this.state.disableLeftScroll ? "scroll-left disabled" : "scroll-left"} onClick={this.handleScrollLeft} onDoubleClick={this.handleScrollLeftEnd} >
                        <FontAwesomeIcon icon="caret-left" />
                    </span>
                    <div className="recommendation-list" ref={this.scrollBox}>
                        {
                            this.state.recommendations.map
                                (
                                    r => this.renderSingleRecommendation(r.id || r.auto_optimizer_id, r.text || r.suggestion || r.auto_optimizer_explanation, r.username || 'auto_optimizer')
                                )
                        }
                        {
                            entry
                        }
                        &nbsp;
                        &nbsp;
                    </div>

                    <span className={this.state.disableRightScroll ? "scroll-right disabled" : "scroll-right"} onClick={this.handleScrollRight} onDoubleClick={this.handleScrollRightEnd}>
                        <FontAwesomeIcon icon="caret-right" />
                    </span>
                </div>
            </div>
        );
    }
}