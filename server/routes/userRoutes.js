const router = require("express").Router();
const User = require("../models/userDetails");
const Student = require("../models/studentDetails");
const Supervisor = require("../models/supervisorDetails");
const Admin = require("../models/adminDetails");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
// var nodemailer = require('nodemailer');
const { SendEmail } = require("../MailUtils/EmailConf");




// JWT sceret key
const JWT_secret = process.env.JWT_SECRET;

//API for User Registeration
router.post("/registration", async (req, res) => {
    const { userName, userId, email, password, userType } = req.body;

    const encryptedPasssword = await bcrypt.hash(password, 8)
    try {

        const existingUserEmail = await User.findOne({ email })
        const existingUserID = await User.findOne({ userId })

        if (existingUserEmail || existingUserID) {

            return res.send({ error: "User Exists" })
        }
        await User.create({
            userName,
            userId,
            email,
            password: encryptedPasssword,
            userType


        })

        res.send({ status: "ok" })
    }
    catch (error) {
        res.send({ status: "error" })
    }


})


//API for User login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;


    const userExist = await User.findOne({ email })

    if (!userExist) {
        return res.json({ error: "User Not Found" })
    }
    if (await bcrypt.compare(password, userExist.password)) {
        const token = jwt.sign({ email: userExist.email }, JWT_secret, { expiresIn: "30m" })

        if (res.status(201)) {
            return res.json({ status: "ok", data: token })

        } else {
            return response.json({ error: "error" })
        }
    }
    res.json({ status: "error", error: "Invalid Credentials" })


})

//API for UserData
router.post("/data", async (req, res) => {
    const { token } = req.body;


    const studentEmail = "student.le.ac.uk";
    const superviserEmail = "leicester.ac.uk";
    const adminEmail = "admin.leicester.ac.uk";

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

        if (userEmail.includes(adminEmail)) {

            Admin.findOne({ email: userEmail })
                .then((data) => {

                    res.send({ status: "ok", data: data })
                })
                .catch((error) => {
                    res.send({ status: "error", data: error })
                })

        }
        else if (userEmail.includes(studentEmail)) {
            Student.findOne({ email: userEmail })
                .then((data) => {


                    res.send({ status: "ok", data: data })
                })
                .catch((error) => {
                    res.send({ status: "error", data: error })
                })

        }
        else if (userEmail.includes(superviserEmail)) {
            Supervisor.findOne({ email: userEmail })
                .then((data) => {
                    res.send({ status: "ok", data: data })
                })
                .catch((error) => {
                    res.send({ status: "error", data: error })
                })

        }

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



router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    const studentEmail = "student.le.ac.uk";
    const superviserEmail = "leicester.ac.uk";
    const adminEmail = "admin.leicester.ac.uk";
    if (email.includes(studentEmail)) {

        try {
            const student = await Student.findOne({ email });
            if (!student) {
                return res.json({ status: "User Not Found" });

            }
            const secret = JWT_secret + student.password;
            const token = jwt.sign({ email: student.email, id: student._id }, secret, { expiresIn: '5m', });
            const link = `http://localhost:4000/user/reset-password/${student._id}/${token}/${student.email}`;
            // console.log(link);

            await SendEmail("Reset password", `
            <a href="${link}">Reset password </a>
            `, ["hag5@student.le.ac.uk"])
            //pass the email field
            // var transporter = nodemailer.createTransport({
            //     service: 'gmail',
            //     auth: {
            //         user: 'harshithaiyanniraganesh@gmail.com',
            //         pass: 'cleopatraharshith'
            //     }
            // });

            // var mailOptions = {
            //     from: 'youremail@gmail.com',
            //     to: 'hag5@student.le.ac.uk',
            //     subject: 'Reset Password',
            //     text: link,
            // };

            // transporter.sendMail(mailOptions, function (error, info) {
            //     if (error) {
            //         console.log(error);
            //     } else {
            //         console.log('Email sent: ' + info.response);
            //     }
            // });
            return res.json({ status: "Email sent" });

        } catch (error) {
            console.log(error);

        }
    }

    else if (email.includes(superviserEmail)) {

        try {
            const supervisor = await Supervisor.findOne({ email });
            if (!supervisor) {
                return res.json({ status: "User Not Found" });

            }
            const secret = JWT_secret + supervisor.password;
            const token = jwt.sign({ email: supervisor.email, id: supervisor._id }, secret, { expiresIn: '5m', });
            const link = `http://localhost:4000/user/reset-password/${supervisor._id}/${token}/${supervisor.email}`;
            console.log(link);

            // await SendEmail("Reset password", `
            // <a href="${link}">Reset password </a>
            // `, ["hag5@student.le.ac.uk"])

            // var transporter = nodemailer.createTransport({
            //     service: 'gmail',
            //     auth: {
            //         user: 'harshithaiyanniraganesh@gmail.com',
            //         pass: 'cleopatraharshith'
            //     }
            // });

            // var mailOptions = {
            //     from: 'youremail@gmail.com',
            //     to: 'hag5@student.le.ac.uk',
            //     subject: 'Reset Password',
            //     text: link,
            // };

            // transporter.sendMail(mailOptions, function (error, info) {
            //     if (error) {
            //         console.log(error);
            //     } else {
            //         console.log('Email sent: ' + info.response);
            //     }
            // });
            return res.json({ status: "Email sent" });

        } catch (error) {
            console.log(error);

        }
    }

    else if (email.includes(adminEmail)) {

        try {
            const admin = await Admin.findOne({ email });
            if (!admin) {
                return res.json({ status: "User Not Found" });

            }
            const secret = JWT_secret + admin.password;
            const token = jwt.sign({ email: admin.email, id: admin._id }, secret, { expiresIn: '5m', });
            const link = `http://localhost:4000/user/reset-password/${admin._id}/${token}/${admin.email}`;
            // console.log(link);

            await SendEmail("Reset password", `
            <a href="${link}">Reset password </a>
            `, ["hag5@student.le.ac.uk"])

            // var transporter = nodemailer.createTransport({
            //     service: 'gmail',
            //     auth: {
            //         user: 'harshithaiyanniraganesh@gmail.com',
            //         pass: 'cleopatraharshith'
            //     }
            // });

            // var mailOptions = {
            //     from: 'youremail@gmail.com',
            //     to: 'hag5@student.le.ac.uk',
            //     subject: 'Reset Password',
            //     text: link,
            // };

            // transporter.sendMail(mailOptions, function (error, info) {
            //     if (error) {
            //         console.log(error);
            //     } else {
            //         console.log('Email sent: ' + info.response);
            //     }
            // });
            return res.json({ status: "Email sent" });

        } catch (error) {
            console.log(error);

        }
    }

})

router.get('/reset-password/:id/:token/:email', async (req, res) => {
    const { id, token, email } = req.params;
    console.log(req.params);
    const studentEmail = "student.le.ac.uk";
    const superviserEmail = "leicester.ac.uk";
    const adminEmail = "admin.leicester.ac.uk";
    if (email.includes(studentEmail)) {


        const student = await Student.findOne({ _id: id });
        if (!student) {
            return res.json({ status: "User Not Found" });

        }
        const secret = JWT_secret + student.password;
        try {
            const verify = jwt.verify(token, secret);
            res.render("index", { email: verify.email, status: "Not Verified" })
        }
        catch (error) {
            res.send("Not verified")

        }
    }

    else if (email.includes(superviserEmail)) {


        const supervisor = await Supervisor.findOne({ _id: id });
        if (!supervisor) {
            return res.json({ status: "User Not Found" });

        }
        const secret = JWT_secret + supervisor.password;
        try {
            const verify = jwt.verify(token, secret);
            res.render("index", { email: verify.email, status: "Not Verified" })
        }
        catch (error) {
            res.send("Not verified")

        }

    }

    else if (email.includes(adminEmail)) {


        const admin = await Admin.findOne({ _id: id });
        if (!admin) {
            return res.json({ status: "User Not Found" });

        }
        const secret = JWT_secret + admin.password;
        try {
            const verify = jwt.verify(token, secret);
            res.render("index", { email: verify.email, status: "Not Verified" })
        }
        catch (error) {
            res.send("Not verified")

        }

    }

})

router.post('/reset-password/:id/:token/:email', async (req, res) => {
    const { id, token, email } = req.params;
    const { password } = req.body;
    const studentEmail = "student.le.ac.uk";
    const superviserEmail = "leicester.ac.uk";
    const adminEmail = "admin.leicester.ac.uk";

    if (email.includes(studentEmail)) {
        const student = await Student.findOne({ _id: id });
        if (!student) {
            return res.json({ status: "User Not Found" });

        }
        const secret = JWT_secret + student.password;
        try {
            const verify = jwt.verify(token, secret);
            const encryptedPasssword = await bcrypt.hash(password, 8)
            await Student.updateOne(
                {
                    _id: id,
                },
                {
                    $set: {
                        password: encryptedPasssword,
                    },
                }
            )
            // res.json({ status: "Password Updated" })
            res.render("index", { email: verify.email, status: "Verified" })
        }
        catch (error) {
            console.log(error);
            res.json({ status: "Something went wrong" })

        }
    }

    else if (email.includes(superviserEmail)) {
        const superviser = await Supervisor.findOne({ _id: id });
        if (!superviser) {
            return res.json({ status: "User Not Found" });

        }
        const secret = JWT_secret + superviser.password;
        try {
            const verify = jwt.verify(token, secret);
            const encryptedPasssword = await bcrypt.hash(password, 8)
            await Supervisor.updateOne(
                {
                    _id: id,
                },
                {
                    $set: {
                        password: encryptedPasssword,
                    },
                }
            )
            // res.json({ status: "Password Updated" })
            res.render("index", { email: verify.email, status: "Verified" })
        }
        catch (error) {
            console.log(error);
            res.json({ status: "Something went wrong" })

        }
    }

    else if (email.includes(adminEmail)) {
        const admin = await Admin.findOne({ _id: id });
        if (!admin) {
            return res.json({ status: "User Not Found" });

        }
        const secret = JWT_secret + admin.password;
        try {
            const verify = jwt.verify(token, secret);
            const encryptedPasssword = await bcrypt.hash(password, 8)
            await Admin.updateOne(
                {
                    _id: id,
                },
                {
                    $set: {
                        password: encryptedPasssword,
                    },
                }
            )
            // res.json({ status: "Password Updated" })
            res.render("index", { email: verify.email, status: "Verified" })
        }
        catch (error) {
            console.log(error);
            res.json({ status: "Something went wrong" })

        }
    }

})

module.exports = router;