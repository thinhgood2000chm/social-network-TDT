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
const NOTIFICATION_NOT_FOUND = "notification not found"
const FRIEND_REQUEST_NOT_FOUND = "friend request not found"
const CASTERROR = "CastError"
const REFERENCEERROR = "ReferenceError"
const HOST = 'https://social-network-backend-tdt.herokuapp.com/'
const localhost = 'http://localhost:8080'

const REGEXP_ID_YOUTUBE = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/

const TDT_LOGO_WHITE_BG_URL = 'https://res.cloudinary.com/drxflbnoa/image/upload/v1659001720/TDTU/LogoTDTBgWhite2_nfnkop.png'


const EXIST_SHARE_POST = 0 
const LIMIT_PAGING = 5
const LIMIT_MESSAGE = 20
module.exports = {PORT: PORT, BAD_REQUEST: BAD_REQUEST, FORBIDDEN:FORBIDDEN,
    USER_NOT_FOUND:USER_NOT_FOUND, GET_SOME_ERROR_WHEN_UPDATE: GET_SOME_ERROR_WHEN_UPDATE,
    SUCCESS_OK:SUCCESS_OK, NOT_THING_CHANGE: NOT_THING_CHANGE, POST_NOT_FOUND: POST_NOT_FOUND,
    CASTERROR: CASTERROR, REFERENCEERROR: REFERENCEERROR, EXIST_SHARE_POST: EXIST_SHARE_POST,
    NOTIFICATION_NOT_FOUND: NOTIFICATION_NOT_FOUND, LIMIT_PAGING: LIMIT_PAGING,
    FRIEND_REQUEST_NOT_FOUND: FRIEND_REQUEST_NOT_FOUND, REGEXP_ID_YOUTUBE, HOST: HOST, TDT_LOGO_WHITE_BG_URL
}