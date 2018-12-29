import React from 'react'
import PropTypes from 'prop-types'
import InputForm from '../controls/InputForm.jsx'
import CancelOnUnmount from '../../services/CancelOnUnmount.js'
import CampaignService from '../../services/CampaignService.js'
import AdFormatService from '../../services/AdFormatService.js'
import AdFormatCheckboxList from '../controls/AdFormatCheckboxList.jsx'
import Recommendations from '../controls/Recommendations.jsx'
import CampaignAdFormatRecommendationService from '../../services/CampaignAdFormatRecommendationService.js';

export default class AdFormatTargeting extends React.Component {

    static propTypes = {
        campaignId: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            isError: false,
            isSaving:  false,
            isLoadingAdFormats: true,
            isLoadingSelectedAdFormatIds: true,
            selectedAdFormatIds: [],
            allAdFormats: []
        };

        this.handleSaveButtonClicked = this.handleSaveButtonClicked.bind(this);
        this.handleToggleAdFormat = this.handleToggleAdFormat.bind(this);
        this.handleGetIsAdFormatChecked = this.handleGetIsAdFormatChecked.bind(this);
        this.handleRetry = this.handleRetry.bind(this);
        this.initialLoad = this.initialLoad.bind(this);
    }

    initialLoad() {
        this.setState({
            isLoadingAdFormats: true,
            isLoadingSelectedAdFormatIds: true
        });

        const getAllAdFormatsPromise = AdFormatService
            .getAllAvailableAdFormats(this.props.campaignId)
            .then(allAdFormats => {
                this.setState({
                    allAdFormats: allAdFormats,
                    isLoadingAdFormats: false
                })
            });

        const getAllSelectedAdFormatsPromise = CampaignService
            .getSelectedAdFormatIds(this.props.campaignId)
            .then(selectedIds => {
                this.setState({
                    selectedAdFormatIds: selectedIds,
                    isLoadingSelectedAdFormatIds: false
                });
            });

            CancelOnUnmount
            .track(this, Promise
                .all([getAllAdFormatsPromise, getAllSelectedAdFormatsPromise])
                .catch(() => {
                    this.setState({
                        isError: true,
                        onRetry: this.initialLoad
                    });
                }));
    }

    componentDidMount() {
        this.initialLoad();
    }

    componentWillUnmount() {
        CancelOnUnmount.handleUnmount(this);
    }

    handleToggleAdFormat(item) {
        const ids = this.state.selectedAdFormatIds;

        if (ids.indexOf(item.id) >= 0) {
            this.setState({
                selectedAdFormatIds: ids.filter(id => id !== item.id)
            });
        } else {
            this.setState({
                selectedAdFormatIds: ids.concat(item.id)
            });
        }
    }

    handleGetIsAdFormatChecked(item) {
        return this.state.selectedAdFormatIds.indexOf(item.id) >= 0;
    }

    handleRetry() {
        this.setState({
            isError: false
        });

        this.state.onRetry();
    }

    handleSaveButtonClicked() {
        this.setState({
            isSaving: true
        });

        CancelOnUnmount
            .track(
                this,
                CampaignService
                    .saveSelectedAdFormatIds(this.props.campaignId, this.state.selectedAdFormatIds)
                    .catch(() => {
                        this.setState({
                            isError: true,
                            onRetry: this.handleSaveButtonClicked
                        });
                    })
                    .finally(() => {
                        this.setState({
                            isSaving: false
                        })
                    }));
    }

    render() {
        return (
            <div>
                <InputForm
                    onSubmit={this.handleSaveButtonClicked}
                    onRetry={this.handleRetry}
                    isError={this.state.isError}
                    isLoading={this.state.isLoadingAdFormats || this.state.isLoadingSelectedAdFormatIds}
                    isSaving={this.state.isSaving}>
                    <AdFormatCheckboxList
                        items={this.state.allAdFormats}
                        onToggleItem={this.handleToggleAdFormat}
                        getIsChecked={this.handleGetIsAdFormatChecked}
                    />
                </InputForm>
                <Recommendations 
                    recommendationType='CAMPAIGN_ADFORMAT_RECOMMENDATIONS' 
                    campaignId={this.props.campaignId} 
                    canAddRecommendation={true}
                    recommendationService={CampaignAdFormatRecommendationService}
                />
            </div>
        );
    }
}
