const mongoose = require("mongoose")
const UserDetailsScehma = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true
        },

        userId: {
            type: Number,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        userType: {
            type: String

        },
        date:
        {
            type: Date,
            default: Date.now
        }

    }, {
    collection: "UserInformation",
}
);



module.exports = mongoose.model("UserInformation", UserDetailsScehma);