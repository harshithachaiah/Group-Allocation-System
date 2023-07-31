const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Admin = require("../models/adminDetails");
const Announcement = require("../models/announcementDetails")
const jwt = require("jsonwebtoken");
const Student = require("../models/studentDetails");
const Supervisor = require("../models/supervisorDetails");
const Topics = require("../models/topicDetails")
const Subject = require("../models/subjectDetails")
const Timeline = require("../models/timelineDetails")
const { SendEmail } = require("../MailUtils/EmailConf");


// JWT sceret key
const JWT_secret = process.env.JWT_SECRET;

// API for admin registration Done through postman UI unavailable
router.post("/registration", async (req, res) => {
    const { firstName, surName, Id, email, password } = req.body;


    const encryptedPasssword = await bcrypt.hash(password, 13)
    try {

        const existingAdminEmail = await Admin.findOne({ email })
        const existingAdminID = await Admin.findOne({ Id })

        if (existingAdminEmail || existingAdminID) {

            return res.send({ error: "User Exists" })
        }
        await Admin.create({


            firstName,
            surName,
            Id,
            email,
            password: encryptedPasssword,
            userType: "Admin"

        })

        res.send({ status: "ok" })

    }
    catch (error) {
        console.log(error);
        res.send({ status: "error" })
    }


})



//API for admin Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const adminExist = await Admin.findOne({ email })

    if (!adminExist) {
        return res.json({ error: "User Not Found" })
    }
    if (await bcrypt.compare(password, adminExist.password)) {
        const token = jwt.sign({ email: adminExist.email }, JWT_secret, { expiresIn: "30m" })

        if (res.status(201)) {
            return res.json({ status: "ok", data: token })

        } else {
            return response.json({ error: "error" })
        }
    }
    res.json({ status: "error", error: "Invalid Credentials" })


})

// API to get  admin data
router.post("/data", async (req, res) => {
    const { token } = req.body;

    try {
        const admin = jwt.verify(token, JWT_secret, (err, res) => {
            if (err) {
                return "token expired";
            }
            return res;

        })

        if (admin == "token expired") {
            return res.send({ status: "error", data: "token expired" });
        }

        const adminEmail = admin.email;


        Admin.findOne({ email: adminEmail })
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


// API to delete user
router.post("/deleteuser", async (req, res) => {
    const { userid, name, userType } = req.body;

    try {
        if (userType === "Student") {

            await Student.deleteOne({ _id: userid });
            return res.send({ status: "ok", data: "Deleted" });
        }
        else if (userType === "Supervisor") {
            await Supervisor.deleteOne({ _id: userid });

            return res.send({ status: "ok", data: "Deleted" });

        }


    } catch (error) {
        console.log(error);
    }
})


//Api to update the user activity status by the admin
router.post("/activitystatus", async (req, res) => {
    const { userid, name, userType } = req.body;

    try {

        if (userType === "Student") {
            const userStatus = await Student.findOne({ _id: userid })
            await Student.findOneAndUpdate({ _id: userid }, { userStatus: !userStatus.userStatus })
            return res.send({ status: "ok", userStatus: userStatus.userStatus });
        }
        else if (userType === "Supervisor") {
            const userStatus = await Supervisor.findOne({ _id: userid })
            await Supervisor.findOneAndUpdate({ _id: userid }, { userStatus: !userStatus.userStatus })
            return res.send({ status: "ok", userStatus: userStatus.userStatus });

        }


    } catch (error) {
        res.send({ status: "error", error: "Unable to change the status" })
        console.log(error);

    }


})

//Upload topic (unused)
router.post("/uploadtopic", async (req, res) => {
    const { title, description } = req.body;
    console.log(title, description);

    try {

        await Topics.create({

            title,
            description

        })
        res.send({ status: "Topic updated" })

    } catch (error) {
        console.log(error);
        res.send({ status: "error", error: "Unable to change the status" })
    }

})

router.post("/deletetopic", async (req, res) => {
    const { topicId } = req.body;

    try {
        await Topics.deleteOne({ _id: topicId });
        return res.send({ status: "ok", data: "Topic Removed" });



    } catch (error) {
        console.log(error);
        res.send({ status: "error", error: "Unable to delete the topic" })
    }
})

//Get the topics uploaded by the supervisors
router.get("/gettopics", async (req, res) => {
    try {

        const allTopics = await Topics.find({});
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

// Update the user details by editing the details
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
            updateFields.Id = req.body.Id;
        }

        const admin = await Admin.findByIdAndUpdate(
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

//API to Announce the dashboard notifications
router.post("/announcement", async (req, res) => {
    try {
        const { user, subject, announcement } = req.body;

        await Announcement.create({


            user,
            subject,
            announcement,
            announced: true


        })
        SendEmail(subject, announcement, ["hag5@student.le.ac.uk"])

        return res.send({ status: "ok", data: "Announced" })

    } catch (error) {
        console.log(error);
        return res.send({ status: "error" })


    }
})


//Get all the announcement made for students and supervisors
router.get("/getannouncement", async (req, res) => {

    // Announcement.find({})
    //     .then((data) => {
    //         res.send({ status: "ok", data: data })
    //     })
    //     .catch((error) => {
    //         res.send({ status: "error", data: error })
    //     })





    try {

        const allAnnouncement = await Announcement.find({});
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const beginIndex = (page - 1) * limit
        const endIndex = (page) * limit

        const results = {}
        results.totalAnnouncement = allAnnouncement.length;
        results.pageCount = Math.ceil(allAnnouncement.length / limit)

        if (endIndex < allAnnouncement.length) {
            results.next = {
                page: page + 1,
            }

        }

        if (beginIndex > 0) {
            results.prev = {
                page: page - 1,
            }

        }
        results.result = allAnnouncement.slice(beginIndex, endIndex);


        res.json(results)


    } catch (error) {

        console.log(error);
        res.send({ status: "error" })

    }

})

//Api to remove the announcement
router.post("/deleteannouncement", async (req, res) => {
    const { announcementId } = req.body;

    try {
        await Announcement.deleteOne({ _id: announcementId });
        return res.send({ status: "ok", data: "Announcement Removed" });



    } catch (error) {
        console.log(error);
        res.send({ status: "error", error: "Unable to delete the Announcement" })
    }
})



//Edit and update the announcement
router.patch("/updateannouncement", async (req, res) => {
    const { id } = req.body;
    console.log();
    try {

        const updateFields = {};
        if (req.body.subject) {
            updateFields.subject = req.body.subject;
        }
        if (req.body.user) {
            updateFields.user = req.body.user;
        }

        if (req.body.announcement) {
            updateFields.announcement = req.body.announcement;
        }

        const Announce = await Announcement.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        );

        if (!Announce) {
            return res.status(404).send('Announcement not found');
        }

        res.send({ data: "Announcement Updated" });

    } catch (error) {

        console.error(error);
        res.status(500).send('Server error');

    }


})


//API to change the announcement status
router.post("/announcementstatus", async (req, res) => {
    const { announcementid } = req.body;

    try {


        const announcemenetStatus = await Announcement.findOne({ _id: announcementid })
        await Announcement.findOneAndUpdate({ _id: announcementid }, { announced: !announcemenetStatus.announced })
        return res.send({ status: "ok" });



    } catch (error) {
        res.send({ status: "error", error: "Unable to change the status" })
        console.log(error);

    }


})

//API to update the topic
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

//API to upload the topic
router.post("/uploadtopic", async (req, res) => {
    const { title, description, email, name } = req.body;
    console.log(title, description, email, name);

    try {

        await Topics.create({
            supervisor: name,
            title,
            description,
            email

        })
        res.send({ status: "Topic updated" })

    } catch (error) {
        console.log(error);
        res.send({ status: "error", error: "Unable to change the status" })
    }

})
//Test API
router.post("/test", async (req, res) => {
    const { title, description, email, name, code } = req.body;
    console.log(title, description, email, name, code);

    const codeExist = await Subject.findOne({ code })


    if (codeExist) {

        return res.send({ error: "Code Exists" })
    }
    else {
        try {

            await Subject.create({
                supervisor: name,
                title,
                description,
                email,
                code


            })
            res.send({ status: "Subject updated" })

        } catch (error) {
            console.log(error);
            res.send({ status: "error", error: "Unable to change the status" })
        }
    }




})

//test API
router.post("/allocategroup", async (req, res) => {

    let myArray1 = [];

    try {
        const students = await Student.find({});

        for (var i = 0; i < students.length; i++) {
            //console.log(students[i].preference1.id);

            var preferences = [
                students[i].preference1,
                students[i].preference2,
                students[i].preference3,
                students[i].preference4
            ];

            for (var j = 0; j < preferences.length; j++) {
                if (preferences[j].id) {


                    var id = preferences[j].id;
                    if (preferences[j].id) {
                        const topics = await Topics.findById({ _id: id })
                        console.log(topics.allocatedstudents);

                        try {
                            if (topics.allocatedstudents.length >= 4) {
                                const currentStudents = topics.studentsAllocated

                            }
                        } catch (error) {
                            console.error(error);
                        }



                        // if (len(topics.currentStudents) <= 4) {

                        //     /**
                        //      * const currentStudents = topics.studentsAllocated //array
                        //      * currentStudent.push(student[i])
                        //      * topics.findOneAndUpdate({_id:id},{topics.studentsAllocated: currentStudents}) 
                        //      */

                        //     break;



                        // }
                        // else {
                        //     j++;
                        // }


                    }








                }
            }





        }

        res.send({ status: "Ok", data: myArray1 })


    }
    catch (error) {
        console.log(error);
        res.send({ status: "error", error: "Unable to change the status" })
    }



})

//Create timeline
router.post("/timeline", async (req, res) => {
    const { setstudentprefernce, setsupervisorprefernce, supervisoraddtopic, viewallocation } = req.body
    try {
        await Timeline.create({
            setstudentprefernce: false,
            setsupervisorprefernce: false,
            supervisoraddtopic: false,
            viewallocation: false

        })
        res.send({ status: "ok" })

    } catch (error) {
        console.log(error);
        res.send({ status: "error", error: "Unable to set timeline" })
    }
})


//edit and save student preference
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

        res.send({ data: "Student Preference Set" });

    } catch (error) {

        console.error(error);
        res.status(500).send('Server error');

    }



})


//get all the timeline
router.get("/gettimeline", async (req, res) => {

    try {
        await Timeline.findOne({})
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

//Toggle timeline
router.post('/toggle-timeline', async (req, res) => {
    const { val } = req.body;

    const timeline = await Timeline.findOne({})


    if (val === "viewallocation") {
        const toggle = (!timeline.viewallocation)
        await Timeline.findOneAndUpdate({ _id: "643e6eba32f5eb36d1b9522d" }, { viewallocation: toggle })
        return res.send({ status: "ok", val: timeline.viewallocation });

    }
    else if (val === "setstudentprefernce") {
        const toggle = (!timeline.setstudentprefernce)
        await Timeline.findOneAndUpdate({ _id: "643e6eba32f5eb36d1b9522d" }, { setstudentprefernce: toggle })
        return res.send({ status: "ok", val: timeline.setstudentprefernce });

    }
    else if (val === "setsupervisorprefernce") {
        const toggle = (!timeline.setsupervisorprefernce)
        await Timeline.findOneAndUpdate({ _id: "643e6eba32f5eb36d1b9522d" }, { setsupervisorprefernce: toggle })
        return res.send({ status: "ok", val: timeline.setsupervisorprefernce });

    }
    else if (val === "supervisoraddtopic") {
        const toggle = (!timeline.supervisoraddtopic)
        await Timeline.findOneAndUpdate({ _id: "643e6eba32f5eb36d1b9522d" }, { supervisoraddtopic: toggle })
        return res.send({ status: "ok", val: timeline.supervisoraddtopic });

    }




})

//Algorithm to allocation students
router.post('/allocate-stud', async (req, res) => {

    const startTime = new Date();
    const { groupSize } = req.body;
    const students = await Student.find().sort({ date: 1 })
    const numStud = students.length;
    for (var i = 0; i < students.length; i++) {

        //store student preferences in an array
        var preferences = [
            students[i].preference1,
            students[i].preference2,
            students[i].preference3,
            students[i].preference4
        ];


        for (var j = 0; j < preferences.length; j++) {
            if (preferences[j].id) {
                const topic = await Topics.find({ _id: preferences[j].id })
                var currentCapacity = topic[0]?.capacity;
                if (topic[0]?.capacity > (groupSize - 1)) {

                }
                else {
                    topic[0]?.allocatedstudents.push(students[i].email)
                    var updatedcap = currentCapacity + 1;
                    const updatedCapacity = await Topics.findOneAndUpdate({ _id: preferences[j].id }, { capacity: updatedcap })
                    const updatedStudent = await Topics.findOneAndUpdate({ _id: preferences[j].id }, { allocatedstudents: topic[0]?.allocatedstudents })
                    students[i].topicAssigned = topic[0]._id
                    await students[i].save()
                    break;
                }

            }

        }

    }

    const unallocatedStudents = await Student.find({ topicAssigned: { $exists: false } })
    const randomstud = shuffle(unallocatedStudents)
    function shuffle(array) {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    for (var i = 0; i < randomstud.length; i++) {

        const TopicsWithIncompleteGrp = await Topics.find({ capacity: { $lt: (groupSize) }, approved: true, capacity: { $gt: 0 } })
        for (var j = 0; j < TopicsWithIncompleteGrp.length; j++) {
            var currentCap = TopicsWithIncompleteGrp[j].capacity;

            if (TopicsWithIncompleteGrp[j].capacity > (groupSize - 1)) {

            }
            else {

                TopicsWithIncompleteGrp[j].allocatedstudents.push(randomstud[i].email)
                var updCap = currentCap + 1;
                const updatedCapacity = await Topics.findOneAndUpdate({ _id: TopicsWithIncompleteGrp[j]._id }, { capacity: updCap })
                const updatedStudent = await Topics.findOneAndUpdate({ _id: TopicsWithIncompleteGrp[j]._id }, { allocatedstudents: TopicsWithIncompleteGrp[j].allocatedstudents })
                randomstud[i].topicAssigned = TopicsWithIncompleteGrp[j]._id
                await randomstud[i].save()
                break;

            }


        }

    }


    const unallocatedStudentsSecondItr = await Student.find({ topicAssigned: { $exists: false } })
    const randomstudSecondItr = shuffle(unallocatedStudentsSecondItr)
    function shuffle(array) {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    for (var i = 0; i < randomstudSecondItr.length; i++) {

        const TopicsWithIncompleteGrprSecondItr = await Topics.find({ capacity: { $lt: (groupSize) }, approved: true })
        for (var j = 0; j < TopicsWithIncompleteGrprSecondItr.length; j++) {
            var currentCap = TopicsWithIncompleteGrprSecondItr[j].capacity;

            if (TopicsWithIncompleteGrprSecondItr[j].capacity > (groupSize - 1)) {

            }
            else {

                TopicsWithIncompleteGrprSecondItr[j].allocatedstudents.push(randomstudSecondItr[i].email)
                var updCap = currentCap + 1;
                const updatedCapacity = await Topics.findOneAndUpdate({ _id: TopicsWithIncompleteGrprSecondItr[j]._id }, { capacity: updCap })
                const updatedStudent = await Topics.findOneAndUpdate({ _id: TopicsWithIncompleteGrprSecondItr[j]._id }, { allocatedstudents: TopicsWithIncompleteGrprSecondItr[j].allocatedstudents })
                randomstudSecondItr[i].topicAssigned = TopicsWithIncompleteGrprSecondItr[j]._id
                await randomstudSecondItr[i].save()
                break;

            }


        }

    }

    const endTime = new Date();
    const executionTime = endTime - startTime;
    console.log(`Execution time: ${executionTime}ms`);
    await Topics.find({})
        .then((data) => {
            res.send({ status: "ok", data: data, numStud })
        })
        .catch((error) => {
            res.send({ status: "error", data: error })
        })

})

router.post('/allocate-stud-preferred-topic', async (req, res) => {

    const startTime = new Date();
    const { groupSize } = req.body;
    const studentscount = await Student.find().sort({ date: 1 })
    const numStud = studentscount.length;

    for (var k = 0; k < 4; k++) {
        const students = await Student.find({ topicAssigned: { $exists: false } })
        const numStud = students.length;

        for (var i = 0; i < students.length; i++) {

            //store student preferences in an array 4
            // 4n + n2 + n2
            var preferences = [
                students[i].preference1,
                students[i].preference2,
                students[i].preference3,
                students[i].preference4
            ];

            if (preferences[k].id) {
                const topic = await Topics.find({ _id: preferences[k].id })
                var currentCapacity = topic[0]?.capacity;
                if (topic[0]?.capacity > (groupSize - 1)) {

                }
                else {
                    topic[0]?.allocatedstudents.push(students[i].email)
                    var updatedcap = currentCapacity + 1;
                    const updatedCapacity = await Topics.findOneAndUpdate({ _id: preferences[k].id }, { capacity: updatedcap })
                    const updatedStudent = await Topics.findOneAndUpdate({ _id: preferences[k].id }, { allocatedstudents: topic[0]?.allocatedstudents })
                    students[i].topicAssigned = topic[0]._id
                    await students[i].save()


                }

            }

        }
    }


    const unallocatedStudents = await Student.find({ topicAssigned: { $exists: false } })
    const randomstud = shuffle(unallocatedStudents)
    function shuffle(array) {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    for (var i = 0; i < randomstud.length; i++) {

        const TopicsWithIncompleteGrp = await Topics.find({ capacity: { $lt: (groupSize) }, approved: true, capacity: { $gt: 0 } })
        for (var j = 0; j < TopicsWithIncompleteGrp.length; j++) {
            var currentCap = TopicsWithIncompleteGrp[j].capacity;

            if (TopicsWithIncompleteGrp[j].capacity > (groupSize - 1)) {

            }
            else {

                TopicsWithIncompleteGrp[j].allocatedstudents.push(randomstud[i].email)
                var updCap = currentCap + 1;
                const updatedCapacity = await Topics.findOneAndUpdate({ _id: TopicsWithIncompleteGrp[j]._id }, { capacity: updCap })
                const updatedStudent = await Topics.findOneAndUpdate({ _id: TopicsWithIncompleteGrp[j]._id }, { allocatedstudents: TopicsWithIncompleteGrp[j].allocatedstudents })
                randomstud[i].topicAssigned = TopicsWithIncompleteGrp[j]._id
                await randomstud[i].save()
                break;

            }


        }

    }


    const unallocatedStudentsSecondItr = await Student.find({ topicAssigned: { $exists: false } })
    const randomstudSecondItr = shuffle(unallocatedStudentsSecondItr)
    function shuffle(array) {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    for (var i = 0; i < randomstudSecondItr.length; i++) {

        const TopicsWithIncompleteGrprSecondItr = await Topics.find({ capacity: { $lt: (groupSize) }, approved: true })
        for (var j = 0; j < TopicsWithIncompleteGrprSecondItr.length; j++) {
            var currentCap = TopicsWithIncompleteGrprSecondItr[j].capacity;

            if (TopicsWithIncompleteGrprSecondItr[j].capacity > (groupSize - 1)) {

            }
            else {

                TopicsWithIncompleteGrprSecondItr[j].allocatedstudents.push(randomstudSecondItr[i].email)
                var updCap = currentCap + 1;
                const updatedCapacity = await Topics.findOneAndUpdate({ _id: TopicsWithIncompleteGrprSecondItr[j]._id }, { capacity: updCap })
                const updatedStudent = await Topics.findOneAndUpdate({ _id: TopicsWithIncompleteGrprSecondItr[j]._id }, { allocatedstudents: TopicsWithIncompleteGrprSecondItr[j].allocatedstudents })
                randomstudSecondItr[i].topicAssigned = TopicsWithIncompleteGrprSecondItr[j]._id
                await randomstudSecondItr[i].save()
                break;

            }


        }

    }

    const endTime = new Date();
    const executionTime = endTime - startTime;
    console.log(`Execution time: ${executionTime}ms`);
    await Topics.find({})
        .then((data) => {
            res.send({ status: "ok", data: data, numStud })
        })
        .catch((error) => {
            console.log(error);
            res.send({ status: "error", data: error })
        })



})

//Algorithm to allocation students sequentially
router.post('/allocate-stud-sequentials', async (req, res) => {

    const { groupSize } = req.body;
    console.log(groupSize);
    const startTime = new Date();
    const students = await Student.find().sort({ date: 1 })
    const numStud = students.length;
    for (var i = 0; i < students.length; i++) {

        //store student preferences in an array
        var preferences = [
            students[i].preference1,
            students[i].preference2,
            students[i].preference3,
            students[i].preference4
        ];


        for (var j = 0; j < preferences.length; j++) {
            if (preferences[j].id) {
                const topic = await Topics.find({ _id: preferences[j].id })
                // console.log(topic[0]?.allocatedstudents.length)
                var currentCapacity = topic[0]?.capacity;
                // console.log(currentCapacity, topic[0]?.title);

                if (topic[0]?.capacity > (groupSize - 1)) {

                }
                else {
                    topic[0]?.allocatedstudents.push(students[i].email)
                    var updatedcap = currentCapacity + 1;

                    // console.log(currentCapacity);
                    const updatedCapacity = await Topics.findOneAndUpdate({ _id: preferences[j].id }, { capacity: updatedcap })
                    const updatedStudent = await Topics.findOneAndUpdate({ _id: preferences[j].id }, { allocatedstudents: topic[0]?.allocatedstudents })
                    students[i].topicAssigned = topic[0]._id
                    await students[i].save()
                    break;
                }

            }

        }

    }

    const unallocatedStudents = await Student.find({ topicAssigned: { $exists: false } })
    const randomstud = shuffle(unallocatedStudents)
    function shuffle(array) {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }


    for (var i = 0; i < randomstud.length; i++) {
        // console.log(unallocatedStudents[i].email);

        const TopicsWithIncompleteGrp = await Topics.find({ capacity: { $lt: 5 }, approved: true })
        for (var j = 0; j < TopicsWithIncompleteGrp.length; j++) {
            var currentCap = TopicsWithIncompleteGrp[j].capacity;

            if (TopicsWithIncompleteGrp[j].capacity > (groupSize - 1)) {

            }
            else {

                TopicsWithIncompleteGrp[j].allocatedstudents.push(randomstud[i].email)
                var updCap = currentCap + 1;
                const updatedCapacity = await Topics.findOneAndUpdate({ _id: TopicsWithIncompleteGrp[j]._id }, { capacity: updCap })
                const updatedStudent = await Topics.findOneAndUpdate({ _id: TopicsWithIncompleteGrp[j]._id }, { allocatedstudents: TopicsWithIncompleteGrp[j].allocatedstudents })
                randomstud[i].topicAssigned = TopicsWithIncompleteGrp[j]._id
                await randomstud[i].save()
                break;

            }


        }

    }
    const endTime = new Date();

    const executionTime = endTime - startTime;

    console.log(`Execution time: ${executionTime}ms`);
    await Topics.find({})
        .then((data) => {
            res.send({ status: "ok", data: data, numStud })
        })
        .catch((error) => {
            res.send({ status: "error", data: error })
        })



    // res.status(200).send("Successful")
})




router.get('/get-sorted-stud', async (req, res) => {
    await Student.find().sort({ date: 1 })
        .then((data) => {
            res.send({ status: "ok", data: data })
        })
        .catch((error) => {
            res.send({ status: "error", data: error })
        })

})

router.get('/get-search-topic/:content', async (req, res) => {

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


router.get('/search-students/:content', async (req, res) => {

    const contentToSearch = req.params.content;



    try {
        const allStudents = await Student.find({ firstName: { $regex: contentToSearch, $options: 'i' } })
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

router.get('/search-supervisors/:content', async (req, res) => {

    const contentToSearch = req.params.content;



    try {
        const allSupervisor = await Supervisor.find({ firstName: { $regex: contentToSearch, $options: 'i' } })
        // res.send({ status: "ok", data: allStudents });

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const beginIndex = (page - 1) * limit;
        const endIndex = (page) * limit;


        const results = {}
        results.totalSupervisor = allSupervisor.length;
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
        results.result = allSupervisor.slice(beginIndex, endIndex);

        res.json(results)
    } catch (error) {
        console.log(error);

    }


})










router.put('/reset-allocation', async (req, res) => {


    const update = { $set: { capacity: 0, allocatedstudents: [] } };
    // Topics.updateMany({}, update)
    //     .then(result => {
    //         res.send({ status: "ok", data: result })

    //     })
    //     .catch(err => {
    //         res.send({ status: "ok", data: err })
    //         console.error(err);

    //     });

    try {
        const topics = await Topics.updateMany({}, update)
        const students = await Student.updateMany({}, { $unset: { topic: "", topicAssigned: "" } })
        res.send({ status: "ok", topics, students })
    } catch (e) {
        res.send(e)
    }





})

router.post("/email-notify", async (req, res) => {
    const { userType, subject, announcement } = req.body;
    try {


        if (userType === "Student") {
            await Student.find({})
                .then((data) => {
                    return data
                })
                .then((docs) => {
                    const emails = docs.map((doc) => doc.email);
                    SendEmail(subject, announcement, ["hag5@student.le.ac.uk"])
                    // await SendEmail(subject, announcement, emails)
                    res.send({ status: "ok", data: "Notified" })
                })
                .catch((err) => {
                    res.send({ status: "error", data: err })
                });
        }

        else if (userType === "Supervisor") {
            await Supervisor.find({})
                .then((data) => {
                    return data
                })
                .then((docs) => {
                    const emails = docs.map((doc) => doc.email);
                    SendEmail(subject, announcement, ["hag5@student.le.ac.uk"])
                    // await SendEmail(subject, announcement, emails)
                    res.send({ status: "ok", data: "Notified" })
                })
                .catch((err) => {
                    res.send({ status: "error", data: err })
                });
        }






    } catch (error) {
        console.log(error);
        res.send({ status: "error", data: error })


    }
    // try {
    //     await SendEmail(subject, announcement, ["hag5@student.le.ac.uk"])
    //     res.send({ status: "ok", data: "Notified" })

    // } catch (error) {
    //     console.log(error);
    //     res.send({ status: "error", data: "Unable to send email" })

    // }






    // try {
    //     await SendEmail(subject, announcement, ["hag5@student.le.ac.uk"])
    //     res.send({ status: "ok", data: "Notified" })

    // } catch (error) {
    //     console.log(error);
    //     res.send({ status: "error", data: "Unable to send email" })

    // }



})

router.get('/get-unallocated-stud', async (req, res) => {
    const unallocatedStudents = await Student.find({ topicAssigned: { $exists: false } })

    const TopicsWithIncompleteGrp = await Topics.find({ capacity: { $lt: 5 } })
    for (var i = 0; i < unallocatedStudents.length; i++) {
        for (var j = 0; j < TopicsWithIncompleteGrp.length; j++) {
            var currentCap = TopicsWithIncompleteGrp[j].capacity;

            if (TopicsWithIncompleteGrp[j].capacity > 4) {

            }
            else {
                console.log(TopicsWithIncompleteGrp[j]._id);
                // TopicsWithIncompleteGrp[j]._id
                // TopicsWithIncompleteGrp[j].allocatedstudents.push(unallocatedStudents[i].email)
                // var updCap = currentCap + 1;
                // const updatedCapacity = await Topics.findOneAndUpdate({ _id: TopicsWithIncompleteGrp[j]._id }, { capacity: updCap })
                // const updatedStudent = await Topics.findOneAndUpdate({ _id: TopicsWithIncompleteGrp[j]._id }, { allocatedstudents: TopicsWithIncompleteGrp[j].allocatedstudents })
                // students[i].topicAssigned = TopicsWithIncompleteGrp[j]._id
                // await students[i].save()
                // break;

            }


        }

    }

    //     .then((data) => {
    //     console.log(data.length);
    //     res.send({ status: "ok", data: data })
    // })
    //     .catch((error) => {
    //         res.send({ status: "error", data: error })
    //     })

})

router.get('/notify-allocation', async (req, res) => {
    // const students = await Student.find().sort({ date: 1 })
    const students = await Student.find({ email: "hag5@student.le.ac.uk" })
    const numStud = students.length;
    for (var i = 0; i < 1; i++) {
        const studentTopicId = students[i].topicAssigned;
        const studentTopicDetails = await Topics.findOne({ _id: studentTopicId })
        const announcement = "Hi " +
            students[i].firstName + "\n" + "\n"
            + "\n This is to inform you that group has been formed" + "\n" +
            " Topic Title : " + studentTopicDetails.title + "\n" +
            " Supervisor : " + studentTopicDetails.supervisor +
            "\n  Group members : " + studentTopicDetails.allocatedstudents;
        const subject = "Group Allocation Information"

        // SendEmail(subject, announcement, students[i].email)
        SendEmail(subject, announcement, ["hag5@student.le.ac.uk"])



    }
    const topics = await Topics.findOne({ email: "david@leicester.ac.uk" })
    const subject = "Group Allocation Information"
    const announcement = "Hi " +
        topics.supervisor + "\n"
        + "\n This is to inform you that group has been formed" + "\n" +
        " Topic Title : " + topics.title + "\n" +

        "\n  Group members : " + topics.allocatedstudents;
    // console.log(topics);
    SendEmail(subject, announcement, ["hag5@student.le.ac.uk"])

    res.send({ status: "ok", data: "Notified" })

})












module.exports = router;