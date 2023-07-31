const mongoose = require("mongoose")
const AdminDetailsScehma = new mongoose.Schema(
    {

        firstName: {
            type: String,
            required: true
        },

        surName: {
            type: String,
            required: true
        },

        Id: {
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
    collection: "AdminInformation",
}
);



module.exports = mongoose.model("AdminInformation", AdminDetailsScehma);