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


const data = {
    '1': [{
        id: '1',
        text: 'You should consider increasing your daily budget in order to spend your total budget by the campaign\'s end.',
        username: 'Abby'
    },{
        id: '2',
        text: 'Turn the "Pace Evenly" feature on in order to spread your advertisement purchasing out over the course of the day.',
        username: 'Ted'
    }]
};

export default class CampaignCoreSettingsRecommendationService {
    // Dismiss a recommendation.
    static dismissRecommendation(campaignId, recommendationId) {
        return MockServer.request(() => {
            const recommendations = data[campaignId];

            data[campaignId] = recommendations.filter(recommendation => {
                return recommendation.id !== recommendationId;
            });

            return recommendationId;
        });
    }

    // Add a recommendation to the store.
    static addRecommendation(campaignId, text) {
        return MockServer.request(() => {
            const recommendations = data[campaignId];

            const id = Math.random().toString();
            const newRecommendation = {
                id: id,
                text: text,
                username: 'You'
            };

            recommendations.unshift(newRecommendation);

            return newRecommendation;
        });
    }

    // Get a subset of the recommendations for the specified ID.
    static getRecommendations(campaignId, startIndex, count) {
        return MockServer.request(() => {
            const recommendations = data[campaignId] || [];

            return recommendations.slice(startIndex, startIndex+count);
        });
    }

    static getAllRecommendations(campaignId) {
        return MockServer.request(() => {
            return data[campaignId] || [];
        });
    }
}