import MockServer from './util/MockServer.js'
import { cityList } from './data/CityData.js'

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

function sortCities(cities, sortBy, descending) {
    let shouldReverse = !!descending;
    let sortFunction;

    if (sortBy === 'city_name') {
        sortFunction = geo => geo.city;
    } else if (sortBy === 'state_name') {
        sortFunction = geo => geo.state;
    } else if (sortBy === 'rank') {
        sortFunction = geo => geo.rank;
    } else if (sortBy === 'growth') {
        sortFunction = geo => geo.growth_from_2000_to_2013;
    } else {
        throw new Error("Unrecognized 'sortBy'. Expected options: city_name, state_name, rank, or growth.");
    }

    const result = [].concat(cities).sort(function(a, b) {
        const comp_a = sortFunction(a);
        const comp_b = sortFunction(b);

        if (comp_a < comp_b) return -1;
        if (comp_a > comp_b) return 1;

        return 0;
    });

    if (shouldReverse) {
        result.reverse();
    }

    return result;
}

export default class GeoService {

    static getAllCities(sortBy, descending) {
        return MockServer.request(() => {
            return sortCities(cityList, sortBy, descending);
        });
    }

    static getCitiesPaged(filterText, sortBy, descending, startIndex, count) {
        return MockServer.request(() => {
            const result = cityList;
            const filterParts = filterText.toLowerCase().split(/[,]+/);
            const citySearch = filterParts.length > 0 ? filterParts[0].trim() : '';
            const stateSearch = filterParts.length > 1 ? filterParts[1].trim() : '';
            
            function filter(item) {
                // If the search doesn't match the city, return false.
                if (citySearch !== '' && !item.city.toLowerCase().startsWith(citySearch)) {
                    return false;
                }

                // If the search doesn't match the state, return false.
                if (stateSearch !== '' && !item.state.toLowerCase().startsWith(stateSearch)) {
                    return false;
                }
                
                // Otherwise, return true.
                return true;
            }

            return sortCities(
                result.filter(filter), 
                sortBy, 
                descending).slice(
                    startIndex, 
                    startIndex + count);
        });
    }
}
