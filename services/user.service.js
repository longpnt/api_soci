const UserModel = require("../model/User");
const updateUserOnline = async(userId) => {
    try {
        const isUpdate = await UserModel.findByIdAndUpdate(userId, {
            $set: {
                onlineTime: new Date
            },
        });
        return isUpdate
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    updateUserOnline
}