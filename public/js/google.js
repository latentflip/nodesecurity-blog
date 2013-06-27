function addEvent(el, evt_type, func) {
    if (typeof el.addEventListener === 'function') {
        el.addEventListener(evt_type, func, false);
    } else {
        el.attachEvent('on' + evt_type, func);
    }
}

function loadtracking() {
    var _gaq = window._gaq || (window._gaq = []);
        _gaq.push(['_setAccount', 'UA-103128-9']);
        _gaq.push(['_trackPageview']);

        (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();
}

addEvent(window, 'load', loadtracking);