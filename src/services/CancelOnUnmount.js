const eventTrackerMap = new WeakMap();

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

// The purpose of this service is to help components cancel their outstanding
// promises when the component is unmounted.
export default class CancelOnUnmount {
    static track(owner, promise) {
        if (!eventTrackerMap.has(owner)) {
            eventTrackerMap.set(owner, []);
        }

        eventTrackerMap.get(owner).push(promise);
    }

    static handleUnmount(owner) {
        if (eventTrackerMap.has(owner)) {
            eventTrackerMap.get(owner).forEach(promise => {
                if (promise.cancel) {
                    promise.cancel();
                }
            });
        }
    }
}
