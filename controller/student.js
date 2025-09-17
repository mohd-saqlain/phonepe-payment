const Student = require("../models/student");
const { Env, MetaInfo, StandardCheckoutPayRequest, StandardCheckoutClient } = require("pg-sdk-node");

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const clientVersion = process.env.CLIENT_VERSION;
const env = Env.SANDBOX;


const phone = "917572082633";
const message = "Please share your payment details here.";
const link = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

const client = StandardCheckoutClient.getInstance(
  clientId,
  clientSecret,
  clientVersion,
  env
);

const amount = 100;
const redirectUrl = link;

const createStudent = async (req, res) => {
  try {
    console.log(clientId, clientSecret, clientVersion);
    console.log(req.body);
    const { fullName, phoneNo, email, refferalCode, attendanceMode } = req.body;
    if (
      !fullName ||
      !phoneNo ||
      fullName.trim() === "" ||
      phoneNo.trim() === "" ||
      !attendanceMode
    ) {
      return res
        .status(400)
        .send("Full Name, Phone Number and Attendance Mode are required");
    }
    const isExist = await Student.findOne({ phoneNo });
    if (isExist) {
      return res
        .status(400)
        .send("Student with this phone number already exists");
    }
    const student = new Student({
      fullName,
      phoneNo,
      email,
      refferalCode,
      attendanceMode,
    });
    await student.save();
    const metaInfo = MetaInfo.builder().udf1("udf1").udf2("udf2").build();

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(student._id.toString())
      .amount(amount)
      .redirectUrl(redirectUrl)
      .metaInfo(metaInfo)
      .build();

    const response = await client.pay(request);
    res.status(201).send({ student, paymentLink: response?.redirectUrl });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message || "Internal Server Error");
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).send(students);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message || "Internal Server Error");
  }
};

module.exports = { createStudent, getStudents };
