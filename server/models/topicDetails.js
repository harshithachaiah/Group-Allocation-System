const mongoose = require("mongoose")
const TopicDetailsScehma = new mongoose.Schema(
    {
        supervisor: {
            type: String,
        },
        // supervisor: {
        //     type: mongoose.Schema.Types.ObjectId,
        // ref:"SupervisorInformation"
        // },

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

        },
        code: {
            type: String,


        },
        capacity: {
            type: Number,

        },
        approved: {
            type: Boolean,

        },
        allocatedstudents: {
            type: Array,
        },

        date:
        {
            type: Date,
            default: Date.now
        }

    }, {
    collection: "TopicInformation",
}
);



module.exports = mongoose.model("TopicInformation", TopicDetailsScehma)