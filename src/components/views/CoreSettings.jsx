import React from "react";
import PropTypes from "prop-types";
import InputField from "../controls/InputField.jsx";
import InputForm from "../controls/InputForm.jsx";
import CancelOnUnmount from "../../services/CancelOnUnmount.js";
import CampaignService from "../../services/CampaignService.js";
import Recommendations from "../controls/Recommendations.jsx";
import CampaignCoreSettingsRecommendationService from "../../services/CampaignCoreSettingsRecommendationService.js";

export default class CoreSettings extends React.Component {
  static propTypes = {
    campaignId: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSaveButtonClicked = this.handleSaveButtonClicked.bind(this);
    this.handleRetry = this.handleRetry.bind(this);
    this.requestState = this.requestState.bind(this);

    this.state = {
      isLoading: true,
      isSaving: false,
      isError: false,
      onRetry: this.requestState,
      model: {}
    };
  }

  requestState() {
    this.setState({ isLoading: true });
    CancelOnUnmount.track(
      this,
      CampaignService.getCoreSettings(this.props.campaignId)
        .then(settings => {
          this.setState({ isLoading: false, model: settings });
        })
        .catch(() => {
          this.setState({
            isLoading: false,
            isError: true,
            onRetry: this.requestState
          });
        })
    );
  }

  componentDidMount() {
    this.requestState();
  }

  handleInputChange(event) {
    this.setState({
      model: {
        ...this.state.model,
        [event.target.name]: event.target.value
      }
    });
  }

  handleRetry() {
    this.setState({
      isError: false
    });

    this.state.onRetry();
  }

  handleSaveButtonClicked() {
    this.setState({ isSaving: true });
    CancelOnUnmount.track(
      this,
      CampaignService.saveCoreSettings(this.props.campaignId, this.state.model)
        .catch(() => {
          this.setState({
            isError: true,
            onRetry: this.handleSaveButtonClicked
          });
        })
        .finally(() => {
          this.setState({ isSaving: false });
        })
    );
  }

  componentWillUnmount() {
    CancelOnUnmount.handleUnmount(this);
  }

  render() {
    return (
      <div>
        <label>Recommendations</label>
        <Recommendations
          recommendationType="CAMPAIGN_CORE_SETTINGS_RECOMMENDATIONS"
          campaignId={this.props.campaignId}
          canAddRecommendation={true}
          recommendationService={CampaignCoreSettingsRecommendationService}
        />
        <InputForm
          isError={this.state.isError}
          isSaving={this.state.isSaving}
          isLoading={this.state.isLoading}
          onSubmit={this.handleSaveButtonClicked}
          onRetry={this.handleRetry}
        >
          <InputField label="Name">
            <input
              type="text"
              value={this.state.model.name}
              name="name"
              onChange={this.handleInputChange}
            />
          </InputField>
          <InputField label="Total Budget">
            <input
              type="text"
              value={this.state.model.totalBudget}
              name="totalBudget"
              onChange={this.handleInputChange}
            />
          </InputField>
          <InputField label="Daily Budget">
            <input
              type="text"
              value={this.state.model.dailyBudget}
              name="dailyBudget"
              onChange={this.handleInputChange}
            />
          </InputField>
        </InputForm>
      </div>
    );
  }
}
