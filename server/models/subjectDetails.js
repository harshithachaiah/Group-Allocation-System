const mongoose = require("mongoose")
const SubjectDetailsScehma = new mongoose.Schema(
    {

        supervisor: {
            type: String,
        },

        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true

        },

        date:
        {
            type: Date,
            default: Date.now
        }

    }, {
    collection: "SubjectInformation",
}
);



module.exports = mongoose.model("SubjectInformation", SubjectDetailsScehma);