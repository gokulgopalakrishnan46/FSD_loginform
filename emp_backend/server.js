const express = require('express');
const cors = require("cors");
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(cors());

app.use(bodyParser.json());

const sequelize = new Sequelize('employeeDB', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

sequelize
  .authenticate()
  .then(() => console.log('MySQL connected...'))
  .catch((err) => console.error('Unable to connect to the database:', err));

const Employee = sequelize.define('Employee', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  employeeId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateOfJoining: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize.sync({ force: true })
  .then(() => console.log('Database & tables synced!'))
  .catch((error) => console.error('Error syncing database:', error));

app.post('/api/employees', async (req, res) => {
  try {
    const { firstName, lastName, employeeId, email, phone, department, dateOfJoining, role } = req.body;

    if (!firstName || !lastName || !employeeId || !email || !phone || !department || !dateOfJoining || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingEmployeeId = await Employee.findOne({ where: { employeeId } });
    if (existingEmployeeId) {
      return res.status(409).json({
        message: `An employee with the Employee ID ${employeeId} already exists.`
      });
    }

    const existingEmail = await Employee.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({
        message: `An employee with the email ${email} already exists.`
      });
    }

    const newEmployee = await Employee.create({
      firstName,
      lastName,
      employeeId,
      email,
      phone,
      department,
      dateOfJoining,
      role,
    });

    res.status(201).json({ message: 'Employee added successfully', employee: newEmployee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add employee', error });
  }
});

app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch employees', error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
