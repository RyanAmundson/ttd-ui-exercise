import React from 'react'
import PropTypes from 'prop-types'
import InputForm from '../controls/InputForm.jsx';
import CampaignService from '../../services/CampaignService.js'
import CancelOnUnmount from '../../services/CancelOnUnmount.js'
import GeoService from '../../services/GeoService.js'
import GeoCheckboxList from '../controls/GeoCheckboxList.jsx'
import Recommendations from '../controls/Recommendations.jsx'
import CampaignGeoRecommendationService from '../../services/CampaignGeoRecommendationService.js';

export default class GeoTargeting extends React.Component {

    static propTypes = {
        campaignId: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);

        this.handleSaveButtonClicked = this.handleSaveButtonClicked.bind(this);
        this.handleToggleGeo = this.handleToggleGeo.bind(this);
        this.handleGetIsGeoChecked = this.handleGetIsGeoChecked.bind(this);
        this.handleGeoSearchChanged = this.handleGeoSearchChanged.bind(this);
        this.handleRetry = this.handleRetry.bind(this);
        this.initialCityLoad = this.initialCityLoad.bind(this);


        this.state = {
            isError: false,
            isSaving: false,
            isLoadingGeos: true,
            searchText: '',
            isLoadingSelectedGeos: true,
            selectedGeoIds: [],
            allGeos: [],
            onRetry: this.initialCityLoad
        };
    }

    refreshAllCities() {
        const promise = GeoService.getAllCities('city_name', false).then(allCities => {
            this.setState({
                allGeos: allCities,
                isLoadingGeos: false
            });
        });

        CancelOnUnmount.track(this, promise);

        return promise;
    }

    initialCityLoad() {
        this.setState({
            isLoadingGeos: true,
            isLoadingSelectedGeoIds: true
        });

        const refreshAllPromise = this.refreshAllCities();
        const getSelectedPromise = CampaignService.getSelectedGeoIds(this.props.campaignId).then(selectedIds => {
            this.setState({
                selectedGeoIds: selectedIds,
                isLoadingSelectedGeoIds: false
            });
        });

        CancelOnUnmount.track(this, Promise.all([refreshAllPromise, getSelectedPromise]).catch(() => {
            this.setState({
                isError: true,
                isLoadingGeos: false,
                isLoadingSelectedGeoIds: false,
                onRetry: this.initialCityLoad
            });
        }));
    }


    handleRetry() {
        this.setState({
            isError: false
        });

        this.state.onRetry();
    }

    componentDidMount() {
        this.initialCityLoad();
    }

    componentWillUnmount() {
        CancelOnUnmount.handleUnmount(this);
    }

    handleToggleGeo(item) {
        const ids = this.state.selectedGeoIds;

        if (ids.indexOf(item.geoId) >= 0) {
            this.setState({
                selectedGeoIds: ids.filter(id => id !== item.geoId)
            });
        } else {
            this.setState({
                selectedGeoIds: ids.concat(item.geoId)
            });
        }
    }

    handleGetIsGeoChecked(item) {
        return this.state.selectedGeoIds.indexOf(item.geoId) >= 0;
    }

    handleGeoSearchChanged(newSearch) {
        if (newSearch !== undefined) {
            this.setState({
                searchText: newSearch
            });
        } else {
            newSearch = this.state.searchText;
        }

        if (!newSearch || newSearch.length === 0) {
            this.refreshAllCities().catch(() => {
                this.setState({
                    isError: true,
                    onRetry: this.handleGeoSearchChanged
                });
            });
        } else {
            CancelOnUnmount.track(this, GeoService.getCitiesPaged(newSearch, 'city_name', false, 0, 100).then(someCities => {
                this.setState({
                    allGeos: someCities
                });
            }).catch(() => {
                this.setState({
                    isError: true,
                    onRetry: this.handleGeoSearchChanged
                });
            }));
        }
    }

    handleSaveButtonClicked() {
        this.setState({
            isSaving: true
        });

        CancelOnUnmount.track(
            this,
            CampaignService
                .saveSelectedGeoIds(this.props.campaignId, this.state.selectedGeoIds)
                .catch(() => {
                    this.setState({
                        isError: true,
                        onRetry: this.handleSaveButtonClicked
                    });
                })
                .finally(() => {
                    this.setState({
                        isSaving: false
                    });
                })
        );
    }

    render() {
        return (
            <div>
                <InputForm
                    onSubmit={this.handleSaveButtonClicked}
                    onRetry={this.handleRetry}
                    isError={this.state.isError}
                    isLoading={this.state.isLoadingGeos || this.state.isLoadingSelectedGeoIds}
                    isSaving={this.state.isSaving}>
                    <GeoCheckboxList
                        items={this.state.allGeos}
                        searchText={this.state.searchText}
                        onSearchChanged={this.handleGeoSearchChanged}
                        onToggleItem={this.handleToggleGeo}
                        getIsChecked={this.handleGetIsGeoChecked}
                    />
                </InputForm>
                <Recommendations recommendationType='CAMPAIGN_GEO_RECOMMENDATIONS' 
                                campaignId={this.props.campaignId}  
                                canAddRecommendation={false}
                                recommendationService={CampaignGeoRecommendationService}/>
            </div>
        );
    }
}
