import MockServer from './util/MockServer.js';

// ************************************************************************
// ************************************************************************
//
//
// PLEASE FEEL FREE TO EXAMINE THE CODE HERE, BUT MODIFYING CODE IN THE
// SERVICES FOLDER IS OUTSIDE THE BOUNDS OF THE EXERCISE.
//
// 
// ************************************************************************
// ************************************************************************


const adFormatSelections = {};
const geoSelections = {};
const coreSettings = {};

export default class CampaignService {
    static getCoreSettings(campaignId) {
        return MockServer.request(() => {
           return coreSettings[campaignId] || {};
        });
    }

    static saveCoreSettings(campaignId, settings) {
        return MockServer.request(() => {
            return coreSettings[campaignId] = settings;
        });
    }

    static getSelectedGeoIds(campaignId) {
        return MockServer.request(() => {
            return geoSelections[campaignId] || [];
        });
    }
    static saveSelectedGeoIds(campaignId, geoIds) {
        return MockServer.request(() => {
            geoSelections[campaignId] = geoIds.map(f => f.toString());
        });
    }

    static getSelectedAdFormatIds(campaignId) {
        return MockServer.request(() => {
            return adFormatSelections[campaignId] || [];
        });
    }

    static saveSelectedAdFormatIds(campaignId, adFormatIds) {
        return MockServer.request(() => {
            // The IDs should be strings already. We do the following 'toString' to
            // prevent the code from accidentally working if the contract is violated
            // (e.g., if the user doesn't just pass back the IDs, but instead entire objects).
            return adFormatSelections[campaignId] = adFormatIds.map(f => f.toString());
        });
    }
}
