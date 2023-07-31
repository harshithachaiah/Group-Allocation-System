const mongoose = require("mongoose")
const SupervisorDetailsScehma = new mongoose.Schema(
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

        department: {
            type: String,
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
        userStatus: {
            type: Boolean,
            required: true
        },
        date:
        {
            type: Date,
            default: Date.now
        }

    }, {
    collection: "SupervisorInformation",
}
);



module.exports = mongoose.model("SupervisorInformation", SupervisorDetailsScehma);