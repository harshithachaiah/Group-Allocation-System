const mongoose = require("mongoose")
const AnouncementDetailsScehma = new mongoose.Schema(
    {


        subject: {
            type: String,
            required: true
        },
        announcement: {
            type: String,
            required: true
        },
        user: {
            type: String,
            required: true
        },
        announced: {
            type: Boolean,
            required: true

        },

        date:
        {
            type: Date,
            default: Date.now
        }

    }, {
    collection: "AnouncementInformation",
}
);



module.exports = mongoose.model("AnouncementInformation", AnouncementDetailsScehma);