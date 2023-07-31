const router = require("express").Router();
const Student = require("../models/studentDetails");
const bcrypt = require("bcryptjs")
const Topics = require("../models/topicDetails")
const Announcement = require("../models/announcementDetails")
const jwt = require("jsonwebtoken");
const { SendEmail } = require("../MailUtils/EmailConf");

// JWT sceret key
const JWT_secret = process.env.JWT_SECRET;



//API for Student Registeration
router.post("/registration", async (req, res) => {
    const { firstName, surName, email, password, degreeType, department, userType } = req.body;


    const encryptedPasssword = await bcrypt.hash(password, 13)
    try {

        const existingStudentEmail = await Student.findOne({ email })


        if (existingStudentEmail) {

            return res.send({ error: "User Exists" })
        }
        await Student.create({


            firstName,
            surName,

            email,
            password: encryptedPasssword,
            userType,
            degreeType,
            department,
            userStatus: true,
            preference1: {},
            preference2: {},
            preference3: {},
            preference4: {},


        })

        res.send({ status: "ok" })

    }
    catch (error) {
        console.log(error);
        res.send({ status: "error" })
    }


})



//API for Student Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;


    const studentExist = await Student.findOne({ email })

    if (!studentExist) {
        return res.json({ error: "User Not Found" })
    }

    if (studentExist.userStatus == true) {
        if (await bcrypt.compare(password, studentExist.password)) {
            const token = jwt.sign({ email: studentExist.email }, JWT_secret, { expiresIn: "30m" })

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


//API for UserData
router.post("/data", async (req, res) => {
    const { token } = req.body;

    try {
        const student = jwt.verify(token, JWT_secret, (err, res) => {
            if (err) {
                return "token expired";
            }
            return res;

        })

        if (student == "token expired") {
            return res.send({ status: "error", data: "token expired" });
        }

        const studentEmail = student.email;


        Student.findOne({ email: studentEmail })
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


// Api to get all the students
router.get("/getallstudents", async (req, res) => {
    try {
        const allStudents = await Student.find({}).sort({ email: 1 });
        // res.send({ status: "ok", data: allStudents });

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const beginIndex = (page - 1) * limit;
        const endIndex = (page) * limit;


        const results = {}
        results.totalStudents = allStudents.length;
        results.pageCount = Math.ceil(allStudents.length / limit)

        if (endIndex < allStudents.length) {
            results.next = {
                page: page + 1
            }

        }
        if (beginIndex > 0) {
            results.prev = {
                page: page - 1
            }

        }
        results.result = allStudents.slice(beginIndex, endIndex);

        res.json(results)
    } catch (error) {
        console.log(error);

    }

})


router.get("/gettopics", async (req, res) => {

    // Announcement.find({})
    //     .then((data) => {
    //         res.send({ status: "ok", data: data })
    //     })
    //     .catch((error) => {
    //         res.send({ status: "error", data: error })
    //     })


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
    console.log(req.body.firstName, req.body.surName, req.body.Id, req.body.department);
    try {

        const updateFields = {};
        if (req.body.firstName) {
            updateFields.firstName = req.body.firstName;
        }
        if (req.body.surName) {
            updateFields.surName = req.body.surName;
        }

        if (req.body.Id) {
            updateFields.studentId = req.body.Id;
        }

        if (req.body.department) {
            updateFields.department = req.body.department;
        }

        const admin = await Student.findByIdAndUpdate(
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



router.get("/getdashboard-details", async (req, res) => {


    await Announcement.find({ user: "Student", announced: true })
        .then((data) => {
            res.send({ status: "ok", data: data })
        })
        .catch((error) => {
            res.send({ status: "error", data: error })
        })
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
        updateFields.date = Date.now();

        const student = await Student.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        );


        if (!student) {
            return res.status(404).send('User not found');
        }

        res.send({ data: "Preference Set" });

    } catch (error) {

        console.error(error);
        res.status(500).send('Server error');

    }



})



//API to get the topic to set preference
router.get("/getpreftopics", async (req, res) => {

    try {
        Topics.find({ approved: true })
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
router.post("/getstudentpreference", async (req, res) => {
    const { token } = req.body;


    const studentEmail = "student.le.ac.uk";

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
        if (userEmail.includes(studentEmail)) {
            await Student.findOne({ email: userEmail })
                .then((data) => {


                    res.send({ status: "ok", preference1: data.preference1[1], preference2: data.preference2[1], preference3: data.preference3[1], preference4: data.preference4[1] })
                })
                .catch((error) => {
                    res.send({ status: "error", data: error })
                })

        }


    } catch (error) {
        res.send({ status: "error" })
    }
})

// API to get all preference
router.get("/getallstudentpreference", async (req, res) => {


    try {




        await Student.find({})
            .then((data) => {

                res.send({ status: "ok", preference1: data.preference1[1], preference2: data.preference2[1], preference3: data.preference3[1], preference4: data.preference4[1] })
            })
            .catch((error) => {
                console.log(error);
                res.send({ status: "error", data: error })
            })




    } catch (error) {
        console.log(error);
        res.send({ status: "error" })
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

router.post('/get-stud-group', async (req, res) => {
    try {
        const { email } = req.body;
        const student = await Student.findOne({ email })
        const studentTopicId = student.topicAssigned;

        const studentTopicDetails = await Topics.findOne({ _id: studentTopicId })
            .then((data) => {
                res.send({ status: "ok", data: data })
            })
            .catch((error) => {
                res.send({ status: "error", data: error })
            })



    }

    catch (error) {
        console.log(error);
        res.send({ status: "error" })
    }


})


router.post("/suggest-topic", async (req, res) => {
    const { title, description, email, name } = req.body;


    try {

        await Topics.create({
            supervisor: name,
            title,
            description,
            email,
            code: "Student Suggestion",
            approved: false,
            capacity: 0,
            allocatedstudents: []

        })
        const subject = "Topic Suggested " + name;
        const announcement = "Hi " + name + title + " has been Suggested"
        SendEmail(subject, announcement, ["hag5@student.le.ac.uk"])

        res.send({ status: "Topic updated" })

    } catch (error) {
        console.log(error);
        res.send({ status: "error", error: "Unable to change the status" })
    }




})



router.post("/stud-suggestion", async (req, res) => {

    const { email } = req.body
    console.log(email);

    try {
        Topics.find({ email: email })
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


router.post("/delete-suggested-topic", async (req, res) => {
    const { topicId } = req.body;

    try {
        await Topics.deleteOne({ _id: topicId });
        return res.send({ status: "ok", data: "Topic Removed" });



    } catch (error) {
        console.log(error);
        res.send({ status: "error", error: "Unable to delete the topic" })
    }
})



router.patch("/update-suggested-topic", async (req, res) => {
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



module.exports = router;