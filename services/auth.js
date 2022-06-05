const jwt = require("jsonwebtoken");
const moment = require('moment')

const decodeToken = (token) => {
    const decoded = new Promise(async(resolve, reject) => {
        try {
            const payload = await jwt.decode(token, 'mySecretKey')

            if (payload.exp < moment().unix()) {
                reject({
                    status: 401,
                    message: 'The token has expired',
                    error: 'Token Expired'
                })
            }
            resolve(payload)
        } catch (err) {
            reject({
                status: 500,
                message: 'Invalid Token',
                error: err
            })
        }
    })
    return decoded
}
module.exports = {
    decodeToken
}