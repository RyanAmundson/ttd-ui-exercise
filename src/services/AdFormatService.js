import MockServer from './util/MockServer.js'
import { allAdFormats } from './data/AdFormatData.js'

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


export default class AdFormatService {
    static getAllAvailableAdFormats() {
        // For our example, all ad formats are available to all campaigns
        // so the "campaignId" is ignored.
        return MockServer.request(() => {
            return [].concat(allAdFormats);
        });
    }

    static getPagedAvailableAdFormats(startIndex, count) {
        // For our example, all ad formats are available to all campaigns
        // so the "campaignId" is ignored.
        return MockServer.request(() => {
            return allAdFormats.slice(startIndex, startIndex+count);
        });
    }
}
