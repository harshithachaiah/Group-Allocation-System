const mongoose = require("mongoose")
const Topic = require("./topicDetails")
const StudentDetailsScehma = new mongoose.Schema(
    {


        firstName: {
            type: String,
            required: true
        },

        surName: {
            type: String,
            required: true
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

        degreeType: {
            type: String,
            required: true
        },
        department: {
            type: String,
            required: true
        },
        userStatus: {
            type: Boolean,
            required: true
        },


        preference1: {
            id: {
                type: String,


            },
            preference: {
                type: String,


            }
        },
        preference2: {
            id: {
                type: String,


            },
            preference: {
                type: String,


            }
        },
        preference3: {
            id: {
                type: String,


            },
            preference: {
                type: String,


            }
        },
        preference4: {
            id: {
                type: String,


            },
            preference: {
                type: String,

            }
        },
        date:
        {
            type: Date,
            default: Date.now
        },
        topicAssigned: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TopicInformation"
        }
    }, {
    collection: "StudentInformation",
}
);



module.exports = mongoose.model("StudentInformation", StudentDetailsScehma);