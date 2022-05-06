const PORT = 8080;
const BAD_REQUEST = 400;
const SUCCESS_OK = 200;
const NOT_FOUND = 404;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403 
const SERVER_ERROR = 500;


const USER_NOT_FOUND = "user not found"
const POST_NOT_FOUND = "post not found"
const GET_SOME_ERROR_WHEN_UPDATE = "get some error when update"
const NOT_THING_CHANGE = "not thing change"

const CASTERROR = "CastError"
const REFERENCEERROR = "ReferenceError"

const REGEXP_ID_YOUTUBE = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/

module.exports = {PORT: PORT, BAD_REQUEST: BAD_REQUEST, FORBIDDEN:FORBIDDEN,
    USER_NOT_FOUND:USER_NOT_FOUND, GET_SOME_ERROR_WHEN_UPDATE: GET_SOME_ERROR_WHEN_UPDATE,
    SUCCESS_OK:SUCCESS_OK, NOT_THING_CHANGE: NOT_THING_CHANGE, POST_NOT_FOUND: POST_NOT_FOUND,
    CASTERROR: CASTERROR, REFERENCEERROR: REFERENCEERROR, REGEXP_ID_YOUTUBE
}