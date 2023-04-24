function getMsg(msg) {
    var m = locales[lang][msg];
    if (m == null) {
        console.log("undefined message: " + msg);
        return msg;
    }
    return m.message;
}

var lang = 'ro';
// if (navigator.language) {
//     var browser_lang = navigator.language.toLowerCase();
//     if (browser_lang == 'en' || browser_lang.startsWith('en-')) {
//         lang = 'en';
//     }
// }
// var url_lang = location.search.substr(1)
// if (url_lang == 'en') {
//     lang = url_lang;
// }