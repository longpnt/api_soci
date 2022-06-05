'use strict'
const {
    updateUserOnline
} = require('../services/user.service')

const updateOnline = (req, res, next) => {
    updateUserOnline(req.user.userId)
    next()
}

module.exports = updateOnline;