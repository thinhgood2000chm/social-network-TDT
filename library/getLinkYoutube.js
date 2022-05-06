const { REGEXP_ID_YOUTUBE } = require('./constant')

// get link video from url youtube
module.exports = function (linkYoutube) {
    // use regExp to split link id
    let regExp = new RegExp(REGEXP_ID_YOUTUBE)
    let match = linkYoutube.match(regExp)
    let id = (match && match[7].length == 11) ? match[7] : false;

    if (id)
        return linkVideo = 'https://www.youtube.com/embed/' + id
    return null
}

