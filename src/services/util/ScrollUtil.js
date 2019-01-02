export class ScrollUtil {

    static sideScroll(element, direction, speed, distance, step) {
        let scrollAmount = 0;
        var slideTimer = setInterval(function() {
            if (direction == 'left') {
                element.scrollLeft -= step;
            } else {
                element.scrollLeft += step;
            }
            scrollAmount += step;
            if (scrollAmount >= distance) {
                window.clearInterval(slideTimer);
            }
        }, speed);
    }

    static scrollToElement(element) {
        element.scrollIntoView();
    }
}