const mongoose = require("mongoose")
const TimelineDetailsScehma = new mongoose.Schema(
    {

        setstudentprefernce: {
            type: Boolean,
            required: true
        },
        setsupervisorprefernce: {
            type: Boolean,
            required: true
        },
        supervisoraddtopic: {
            type: Boolean,
            required: true
        },
        viewallocation: {
            type: Boolean,
            required: true
        },
        date:
        {
            type: Date,
            default: Date.now
        }

    }, {
    collection: "TimelineInformation",
}
);



module.exports = mongoose.model("TimelineInformation", TimelineDetailsScehma);