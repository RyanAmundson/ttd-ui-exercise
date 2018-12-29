const AVERAGE_RESPONSE_TIME_MS = 1000;

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

import Promise from 'bluebird';
import lodash from 'lodash';

// Configure promises so that they are cancellable.
Promise.config({
    cancellation:  true
});

export default class MockServer {
    static request(callback) {
        return new Promise(function(resolve, reject) {
            const responseTime = (Math.random() * AVERAGE_RESPONSE_TIME_MS) + (AVERAGE_RESPONSE_TIME_MS / 2);
            setTimeout(function() {
                // Resolve the promise, which will result in calling the callback.
                resolve();
            }, responseTime);
        }).then(callback).then(data => lodash.cloneDeep(data));
    }
}
