require('dotenv').config()
const Patients = require('../models/Patients');
const Doctors = require('../models/Doctors');
const Appointments = require('../models/Appointment');
const jwt = require('jsonwebtoken');

exports.setpatients = async (req, res)=> {
    const { name, phone, gender, dob, height, weight, houseaddr, bloodgroup, allergies, medication, address, report } = req.body;

    if (!name || !phone || !gender || !dob || !height || !weight || !houseaddr || !bloodgroup || !allergies || !medication || !address || !report) {
        return res.status(422).json({error:"Please enter all the fields"})
    }
    try {
        const patients = new Patients({
            name, 
            phone, 
            gender, 
            dob, 
            height, 
            weight, 
            houseaddr, 
            bloodgroup, 
            allergies, 
            medication, 
            address, 
            report
        })

        // patients.save().then( patients => {
        //     console.log(patients);
        //     return res.json({
        //         message: "User Details added Successfully",
        //         patientId: patients._id.toString(),
        //     });
        // })


        const savedPatient = await patients.save();
        const secretKey = process.env.JWT_SECRET_KEY ||'yourDefaultSecretKey';
        const token = jwt.sign({ _id: savedPatient.id }, secretKey);
        console.log('Bearer ', token);
        console.log(savedPatient);
        return res.json({
            message: "Patient Details added Successfully",
            patientId: savedPatient._id.toString(),
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

exports.editpatients = async (req, res) => {
    const { name, phone, gender, dob, height, weight, houseaddr, bloodgroup, allergies, medication, address, report } = req.body;

    try {
        const patients = new Patients({
            name,
            phone,
            gender,
            dob,
            height,
            weight,
            houseaddr,
            bloodgroup,
            allergies,
            medication,
            address,
            report: report || ''  // Provide a default or empty value
        });

        const savedPatient = await patients.save();
        console.log(savedPatient);

        return res.json({
            message: "Patient Details added Successfully",
            patientId: savedPatient._id.toString(),
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}


exports.setdoctors = async (req, res) => {
    const { license, name, phone, gender, dob, qualification, major, specialization, address } = req.body;

    if (!license || !name || !phone || !gender || !dob || !qualification || !major || !specialization || !address) {
        return res.status(422).json({ error: "Please enter all the fields" });
    }

    try {
        const doctors = new Doctors({
            license,
            name,
            phone,
            gender,
            dob,
            qualification,
            major,
            specialization,
            address
        });

        const savedDoctor = await doctors.save();
        const secretKey = process.env.JWT_SECRET_KEY ||'yourDefaultSecretKey';
        const token = jwt.sign({ _id: savedDoctor.id }, secretKey);
        console.log('Bearer ', token);
        console.log(savedDoctor);
        return res.json({
            message: "Doctor Details added Successfully",
            doctorId: savedDoctor._id.toString(),
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.editdoctors = async (req, res) => {
    const { license, name, phone, gender, dob, qualification, major, specialization, address } = req.body;

    try {
        const doctors = new Doctors({
            license,
            name,
            phone,
            gender,
            dob,
            qualification,
            major,
            specialization,
            address
        });

        const savedDoctor = await doctors.save();
        const secretKey = process.env.JWT_SECRET_KEY || 'yourDefaultSecretKey';
        const token = jwt.sign({ _id: savedDoctor.id }, secretKey);
        console.log('Bearer ', token);
        console.log(savedDoctor);
        return res.json({
            message: "Doctor Details added Successfully",
            doctorId: savedDoctor._id.toString(),
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


exports.setappointments = async (req, res) => {
    const { address_patient, address_doctor, prescription, description, diagnosis, status, major} = req.body;

    if (!address_patient|| !address_doctor|| !prescription|| !description|| !diagnosis|| !status|| !major) {
        return res.status(422).json({ error: "Please enter all the fields" })
    }
    try {
        const appointments = new Appointments({
            address_patient, 
            address_doctor, 
            prescription, 
            description, 
            diagnosis, 
            status, 
            major
        })

        // appointments.save().then(async appointments => {
        //     return res.json({
        //         message: "Appliaction set Successfully",
        //         appointmentId: appointments._id.toString(),
        //     });
        // })

        const savedAppointment = await appointments.save();
        const secretKey = process.env.JWT_SECRET_KEY ||'yourDefaultSecretKey';
        const token = jwt.sign({ _id: savedAppointment.id }, secretKey);
        console.log('Bearer ', token);
        console.log(savedAppointment);
        return res.json({
            message: "Patient Details added Successfully",
            appointmentId: savedAppointment._id.toString(),
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

exports.editappointments = async (req, res) => {
    const { address_patient, address_doctor, prescription, description, diagnosis, status, major } = req.body;
    try {
        const appointments = new Appointments({
            address_patient,
            address_doctor,
            prescription,
            description,
            diagnosis,
            status,
            major
        })

        // appointments.save().then(async appointments => {
        //     return res.json({
        //         message: "Appliaction set Successfully",
        //         appointmentId: appointments._id.toString(),
        //     });
        // })

        const savedAppointment = await appointments.save();
        const secretKey = process.env.JWT_SECRET_KEY || 'yourDefaultSecretKey';
        const token = jwt.sign({ _id: savedAppointment.id }, secretKey);
        console.log('Bearer ', token);
        console.log(savedAppointment);
        return res.json({
            message: "Patient Details added Successfully",
            appointmentId: savedAppointment._id.toString(),
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

exports.getpatients = async (req, res) => {
    try {
        const patientlist = await Patients.find({});
        return res.json(patientlist);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

exports.getdoctors = async (req, res) => {
    try {
        const doctorlist = await Doctors.find({});
        return res.json(doctorlist);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

exports.getappointments = async (req, res) => {
    try {
        const appointmentlist = await Appointments.find({});
        return res.json(appointmentlist);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}