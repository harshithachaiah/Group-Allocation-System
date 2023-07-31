const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Supervisor = require("../models/supervisorDetails");
const Topics = require("../models/topicDetails")
const jwt = require("jsonwebtoken");
const Announcement = require("../models/announcementDetails");
const { SendEmail } = require("../MailUtils/EmailConf");

// JWT sceret key
const JWT_secret = process.env.JWT_SECRET;

// API for supervisor registration
router.post("/registration", async (req, res) => {
    const { firstName, surName, email, password, department, userType } = req.body;




    const encryptedPasssword = await bcrypt.hash(password, 13)
    try {

        const existingSupervisorEmail = await Supervisor.findOne({ email })


        if (existingSupervisorEmail) {

            return res.send({ error: "User Exists" })
        }
        await Supervisor.create({


            firstName,
            surName,

            email,
            password: encryptedPasssword,
            department,
            userType,
            userStatus: true

        })

        res.send({ status: "ok" })

    }
    catch (error) {
        console.log(error);
        res.send({ status: "error" })
    }


})



//API for Supervisor Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;


    const supervisorExist = await Supervisor.findOne({ email })

    if (!supervisorExist) {
        return res.json({ error: "User Not Found" })
    }
    if (supervisorExist.userStatus == true) {

        if (await bcrypt.compare(password, supervisorExist.password)) {
            const token = jwt.sign({ email: supervisorExist.email }, JWT_secret, { expiresIn: "30m" })

            if (res.status(201)) {

                return res.json({ status: "ok", data: token })

            } else {

                return response.json({ error: "error" })
            }
        }

        res.json({ status: "error", error: "Invalid Credentials" })


    }
    else {
        res.json({ status: "error", error: "Temporary Disabled" })
    }


})

// API to get  supervisor data
router.post("/data", async (req, res) => {
    const { token } = req.body;

    try {
        const superviser = jwt.verify(token, JWT_secret, (err, res) => {
            if (err) {
                return "token expired";
            }
            return res;

        })

        if (superviser == "token expired") {
            return res.send({ status: "error", data: "token expired" });
        }

        const supervisorEmail = superviser.email;


        Supervisor.findOne({ email: supervisorEmail })
            .then((data) => {
                res.send({ status: "ok", data: data })
            })
            .catch((error) => {
                res.send({ status: "error", data: error })
            })

    } catch (error) {
        res.send({ status: "error" })
    }
})

// Api to get all the Supervisor
router.get("/getallsupervisors", async (req, res) => {
    try {
        const allSupervisor = await Supervisor.find({}).sort({ email: 1 });
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit);

        const beginIndex = (page - 1) * limit;
        const endIndex = (page) * limit;

        const results = {}
        results.totalSuperviser = allSupervisor.length;
        results.pageCount = Math.ceil(allSupervisor.length / limit)

        if (endIndex < allSupervisor.length) {
            results.next = {
                page: page + 1
            }
        }


        if (beginIndex > 0) {
            results.prev = {
                page: page - 1
            }
        }


        results.result = allSupervisor.slice(beginIndex, endIndex)

        // res.send({ status: "ok", data: allSupervisor });
        res.send(results);

    } catch (error) {
        console.log(error);
        res.send({ status: "error" })

    }
})

//Api to get all the topics
router.get("/gettopics", async (req, res) => {

    try {
        const allTopics = await Topics.find({ approved: true });
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const beginIndex = (page - 1) * limit
        const endIndex = (page) * limit

        const results = {}
        results.totalTopics = allTopics.length;
        results.pageCount = Math.ceil(allTopics.length / limit)

        if (endIndex < allTopics.length) {
            results.next = {
                page: page + 1,
            }

        }

        if (beginIndex > 0) {
            results.prev = {
                page: page - 1,
            }

        }


        results.result = allTopics.slice(beginIndex, endIndex);


        res.json(results)


    } catch (error) {

        console.log(error);
        res.send({ status: "error" })

    }
})


router.patch("/update-userDetails", async (req, res) => {
    const { id } = req.body;
    try {

        const updateFields = {};
        if (req.body.firstName) {
            updateFields.firstName = req.body.firstName;
        }
        if (req.body.surName) {
            updateFields.surName = req.body.surName;
        }

        if (req.body.Id) {
            updateFields.supervisorId = req.body.Id;
        }

        if (req.body.department) {
            updateFields.department = req.body.department;
        }

        const admin = await Supervisor.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        );

        if (!admin) {
            return res.status(404).send('User not found');
        }

        res.send({ data: "Profile Updated" });

    } catch (error) {

        console.error(error);
        res.status(500).send('Server error');

    }


})


router.post("/uploadtopic", async (req, res) => {
    const { title, description, email, name, code } = req.body;
    const codeExist = await Topics.findOne({ code })
    console.log(codeExist);

    if (codeExist) {

        return res.send({ error: "Code Exists" })
    }
    else {
        try {

            await Topics.create({
                supervisor: name,
                title,
                description,
                email,
                code,
                approved: true,
                capacity: 0,
                allocatedstudents: []

            })
            res.send({ status: "Topic updated" })

        } catch (error) {
            console.log(error);
            res.send({ status: "error", error: "Unable to change the status" })
        }
    }



})

router.post("/deletetopic", async (req, res) => {

    const { topicId, email } = req.body;

    try {
        const topicToBeDeleted = await Topics.findOne({ _id: topicId });
        if (topicToBeDeleted.email === email) {

            await Topics.deleteOne({ _id: topicId });
            return res.send({ status: "ok", data: "Topic Removed" });

        }
        else {
            return res.send({ status: "error", data: "Cannot remove!! Topic uploaded by someone else" });

        }




    } catch (error) {
        console.log(error);
        res.send({ status: "error", error: "Unable to delete the topic" })
    }

})

router.get("/getdashboard-details", async (req, res) => {


    await Announcement.find({ user: "Supervisor", announced: true })
        .then((data) => {
            res.send({ status: "ok", data: data })
        })
        .catch((error) => {
            res.send({ status: "error", data: error })
        })
})

router.post("/supervisortopiccheck", async (req, res) => {

    const { topicId, email } = req.body;

    try {
        const topicToBeChecked = await Topics.findOne({ _id: topicId });
        if (topicToBeChecked.email === email) {


            return res.send({ status: "ok", data: "Valid Supervisor" });

        }
        else {
            return res.send({ status: "error", data: "Cannot Edit!! Topic uploaded by someone else" });

        }




    } catch (error) {
        console.log(error);
        res.send({ status: "error", error: "Unable to Edit the topic" })
    }
})




router.patch("/updatetopic", async (req, res) => {
    const { id } = req.body;
    console.log();
    try {

        const updateFields = {};
        if (req.body.title) {
            updateFields.title = req.body.title;
        }


        if (req.body.description) {
            updateFields.description = req.body.description;
        }

        const Topic = await Topics.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        );

        if (!Topic) {
            return res.status(404).send('Topic not found');
        }

        res.send({ data: "Topic Updated" });

    } catch (error) {

        console.error(error);
        res.status(500).send('Server error');

    }


})

//API to get the topic to set preference
router.get("/getpreftopics", async (req, res) => {

    try {
        Topics.find({})
            .then((data) => {
                res.send({ status: "ok", data: data })
            })
            .catch((error) => {
                res.send({ status: "error", data: error })
            })



    } catch (error) {

        console.log(error);
        res.send({ status: "error" })

    }
})


// API to get individual preference
router.post("/getsupervisorpreference", async (req, res) => {
    const { token } = req.body;


    const supervisorEmail = "leicester.ac.uk";

    try {
        const user = jwt.verify(token, JWT_secret, (err, res) => {
            if (err) {
                return "token expired";
            }
            return res;

        })

        if (user == "token expired") {
            return res.send({ status: "error", data: "token expired" });
        }

        const userEmail = user.email;
        if (userEmail.includes(supervisorEmail)) {
            Supervisor.findOne({ email: userEmail })
                .then((data) => {


                    res.send({ status: "ok", preference1: data.preference1[1], preference2: data.preference2[1], preference3: data.preference3[1] })
                })
                .catch((error) => {
                    res.send({ status: "error", data: error })
                })

        }


    } catch (error) {
        res.send({ status: "error" })
    }
})



router.patch("/savepreference", async (req, res) => {

    const { id } = req.body;

    try {

        const updateFields = {};
        if (req.body.preference1) {
            updateFields.preference1 = req.body.preference1;
        }
        if (req.body.preference2) {
            updateFields.preference2 = req.body.preference2;
        }

        if (req.body.preference3) {
            updateFields.preference3 = req.body.preference3;
        }

        if (req.body.preference4) {
            updateFields.preference4 = req.body.preference4;
        }

        const superviser = await Supervisor.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        );
        console.log(superviser);

        if (!superviser) {
            return res.status(404).send('User not found');
        }

        res.send({ data: "Preference Set" });

    } catch (error) {

        console.error(error);
        res.status(500).send('Server error');

    }



})



router.get('/get-search-topic/:content', async (req, res) => {

    // const contentToSearch = req.params.content;
    // await Topics.find({ description: { $regex: contentToSearch, $options: 'i' } })
    //     .then((data) => {
    //         res.send({ status: "ok", data: data })
    //     })
    //     .catch((error) => {
    //         res.send({ status: "error", data: error })
    //     })




    const contentToSearch = req.params.content;

    try {
        const allTopics = await Topics.find({ description: { $regex: contentToSearch, $options: 'i' } })
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const beginIndex = (page - 1) * limit
        const endIndex = (page) * limit

        const results = {}
        results.totalTopics = allTopics.length;
        results.pageCount = Math.ceil(allTopics.length / limit)

        if (endIndex < allTopics.length) {
            results.next = {
                page: page + 1,
            }

        }

        if (beginIndex > 0) {
            results.prev = {
                page: page - 1,
            }

        }


        results.result = allTopics.slice(beginIndex, endIndex);


        res.json(results)


    } catch (error) {

        console.log(error);
        res.send({ status: "error" })

    }


})


router.post("/get-allocated-group", async (req, res) => {
    const { email } = req.body;
    try {
        const allTopics = await Topics.find({ email });
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const beginIndex = (page - 1) * limit
        const endIndex = (page) * limit

        const results = {}
        results.totalTopics = allTopics.length;
        results.pageCount = Math.ceil(allTopics.length / limit)

        if (endIndex < allTopics.length) {
            results.next = {
                page: page + 1,
            }

        }

        if (beginIndex > 0) {
            results.prev = {
                page: page - 1,
            }

        }


        results.result = allTopics.slice(beginIndex, endIndex);


        res.json(results)


    } catch (error) {

        console.log(error);
        res.send({ status: "error" })

    }
})


//API to get the topic to set preference
router.get("/get-stud-suggestion", async (req, res) => {

    try {
        const allTopics = await Topics.find({ approved: false });
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const beginIndex = (page - 1) * limit
        const endIndex = (page) * limit

        const results = {}
        results.totalTopics = allTopics.length;
        results.pageCount = Math.ceil(allTopics.length / limit)

        if (endIndex < allTopics.length) {
            results.next = {
                page: page + 1,
            }

        }

        if (beginIndex > 0) {
            results.prev = {
                page: page - 1,
            }

        }


        results.result = allTopics.slice(beginIndex, endIndex);


        res.json(results)


    } catch (error) {

        console.log(error);
        res.send({ status: "error" })

    }
})
router.patch("/approve-suggestion", async (req, res) => {
    const { id } = req.body;



    try {

        const updateFields = {};
        if (req.body.supervisor) {
            updateFields.supervisor = req.body.supervisor;
        }
        if (req.body.email) {
            updateFields.email = req.body.email;
        }

        if (req.body.code) {
            updateFields.code = req.body.code;
        }
        if (req.body.approved) {
            updateFields.approved = req.body.approved;
        }

        const topic = await Topics.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        );
        const subject = "Topic Suggestion accepted";
        const announcement = "Your Topic has been accepted"
        SendEmail(subject, announcement, ["hag5@student.le.ac.uk"])

        if (!topic) {
            return res.status(404).send('topic not found');
        }

        res.send({ data: "Topic Updated" });

    } catch (error) {

        console.error(error);
        res.status(500).send('Server error');

    }

})







module.exports = router;