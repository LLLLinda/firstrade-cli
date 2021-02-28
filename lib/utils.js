'use strict';
const { LOGIN_REASON } = require("./const");

function removeExcess(cookies) {
    return Object.values(cookies).map(cookie => ({ key: cookie.key, value: cookie.value }));
}
/** @returns {{result: false|1|2|3|4|5|6, desc}} */
function isAuthError(req) {
    const re = /<script>window.location = "\/cgi-bin\/login\?reason=([0-9])"<\/script>/g;
    const responseText = req.data;
    const ret = re.test(responseText);
    if (!ret)
        return { result: ret }
    const failedReason = parseInt(/[0-9]/.exec(responseText)[0]);
    return {
        result: failedReason + 1, desc: LOGIN_REASON[failedReason]
    }
}

const stringifyCookies = cookies => cookies.map(cookie => `${cookie.key}=${cookie.value};`).join(" ")

function isCookies(credential) {
    return Array.isArray(credential) && credential.length > 0 && credential[0]["key"] != null && credential[0]["value"] != null
}

function isCredential(credential) {
    return credential["username"] != null && credential["password"] != null && credential["pin"] != null
}

function parseMoney(value) {
    if (null == value)
        return undefined
    return parseFloat(value.replace(/\$/, '').replace(/,/, '')) || 0;
}

module.exports = {
    removeExcess,
    isAuthError,
    isCookies,
    isCredential,
    parseMoney,
    stringifyCookies
};
