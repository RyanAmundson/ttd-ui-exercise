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
        suggestion: 'The 300x250 ad format is a classic. You should be sure to give it a try.',
        username: 'Mike'
    }]
};

export default class CampaignAdFormatRecommendationService {
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
    static addRecommendation(campaignId, suggestion) {
        return MockServer.request(() => {
            const recommendations = data[campaignId];

            const id = Math.random().toString();
            const newRecommendation = {
                id: id,
                suggestion: suggestion,
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