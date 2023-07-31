const mongoose = require("mongoose")
const AllocationDetailsScehma = new mongoose.Schema(
    {

        code: {
            type: String,

        },

        topic: {
            type: String,

        },
        supervisor: {
            name: {
                type: String,
            },
            email: {
                type: String,
            },

        },

        groupmembers: [{
            type: [],

            member1: {
                name: {
                    type: String,
                },
                email: {
                    type: String,
                },

            },
            member2: {
                name: {
                    type: String,
                },
                email: {
                    type: String,
                },
            },
            member3: {
                name: {
                    type: String,
                },
                email: {
                    type: String,
                },

            },
            member4: {
                name: {
                    type: String,
                },
                email: {
                    type: String,
                },

            },
        }],



        date:
        {
            type: Date,
            default: Date.now
        }

    }, {
    collection: "AllocationInformation",
}
);



module.exports = mongoose.model("AllocationInformation", AllocationDetailsScehma);