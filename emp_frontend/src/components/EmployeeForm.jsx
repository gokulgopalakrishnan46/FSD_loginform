import React, { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "bootstrap/dist/css/bootstrap.min.css";

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    employeeId: "",
    email: "",
    phone: "",
    department: "",
    dateOfJoining: "",
    role: "",
  });

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dateOfJoining: date,
    });
  };

  const [errors, setErrors] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState(""); 

  const departments = ["HR", "Engineering", "Marketing", "Sales"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    const {
      firstName,
      lastName,
      employeeId,
      email,
      phone,
      department,
      dateOfJoining,
      role,
    } = formData;

    if (!firstName.trim()) newErrors.firstName = "First Name is required.";
    else if (!/^[a-zA-Z\s]+$/.test(firstName)) newErrors.firstName = "First Name must contain only letters.";

    if (!lastName.trim()) newErrors.lastName = "Last Name is required.";
    else if (!/^[a-zA-Z\s]+$/.test(lastName)) newErrors.lastName = "Last Name must contain only letters.";

    if (!employeeId.trim()) newErrors.employeeId = "Employee ID is required.";
    else if (employeeId.length > 10) newErrors.employeeId = "Employee ID must be at most 10 characters.";

    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format.";

    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^\d{10}$/.test(phone)) newErrors.phone = "Phone number must be 10 digits.";

    if (!department.trim()) newErrors.department = "Department is required.";

    if (!dateOfJoining) newErrors.dateOfJoining = "Date of Joining is required.";
    else if (new Date(dateOfJoining) > new Date()) newErrors.dateOfJoining = "Date of Joining cannot be in the future.";

    if (!role.trim()) newErrors.role = "Role is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setFeedbackMessage("Employee added successfully!");
        setFeedbackType("success");
        setFormData({
          firstName: "",
          lastName: "",
          employeeId: "",
          email: "",
          phone: "",
          department: "",
          dateOfJoining: "",
          role: "",
        });
      } else {
        setFeedbackMessage(data.message || "Failed to add employee.");
        setFeedbackType("error");
      }
    } catch (err) {
      setFeedbackMessage("An error occurred. Please try again.");
      setFeedbackType("error");
    }
  };

  return (
    <div className="container-fluid p-5"
    style={{ backgroundColor: "#f0f8ff", minHeight: "100vh" }}>
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white text-center">
          <h2 className="mb-0">Add Employee</h2>
        </div>
        <div className="card-body bg-light">
          {feedbackMessage && (
            <div
              className={`alert ${
                feedbackType === "success" ? "alert-success" : "alert-danger"
              } text-center`}
            >
              {feedbackMessage}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
              />
              {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
              />
              {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="employeeId" className="form-label">
                Employee ID
              </label>
              <input
                type="text"
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className={`form-control ${errors.employeeId ? "is-invalid" : ""}`}
              />
              {errors.employeeId && <div className="invalid-feedback">{errors.employeeId}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="department" className="form-label">
                Department
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`form-select ${errors.department ? "is-invalid" : ""}`}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && <div className="invalid-feedback">{errors.department}</div>}
            </div>

            <div className="mb-3">
                <label htmlFor="dateOfJoining" className="form-label d-block">
                    Date of Joining
                </label>
                <DatePicker
                    selected={formData.dateOfJoining ? new Date(formData.dateOfJoining) : null}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    className={`form-control ${errors.dateOfJoining ? "is-invalid" : ""}`}
                    placeholderText="Select a date"
                />
                {errors.dateOfJoining && <div className="invalid-feedback">{errors.dateOfJoining}</div>}
            </div>


            <div className="mb-3">
              <label htmlFor="role" className="form-label">
                Role
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`form-control ${errors.role ? "is-invalid" : ""}`}
              />
              {errors.role && <div className="invalid-feedback">{errors.role}</div>}
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  setFormData({
                    firstName: "",
                    lastName:"",
                    employeeId: "",
                    email: "",
                    phone: "",
                    department: "",
                    dateOfJoining: "",
                    role: "",
                  })
                }
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;
