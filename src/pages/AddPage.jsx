import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import SystemAlert from '../components/SystemAlert';

// =========================================================================
// SCREEN 4: ADD NEW SCREEN (FORM CREATION + INPUT VALIDATION)
// =========================================================================
export default function AddPage() {
  const navigate = useNavigate();

  // -----------------------------------------------------------------------
  // [MODIFY HERE 1]: API ENDPOINTS & SCREEN TITLE
  // - API_BASE: Target URL for sending the HTTP POST request to create a record.
  // - API_SECONDARY: URL to fetch options for the category/department dropdown.
  // - TITLE: Heading matching Screen 4 mockup (e.g., 'Add New Employee' | 'Add New Restaurant').
  // -----------------------------------------------------------------------
  const API_BASE = '/api/employees';
  const API_SECONDARY = '/api/departments';
  const TITLE = 'Add New Employee';

  // -----------------------------------------------------------------------
  // [MODIFY HERE 2]: FORM STATE INITIALIZATION
  // - PURPOSE: Holds the state for two-way data binding with form inputs.
  // - MECHANISM: Every key here corresponds to the 'name' attribute of an input field.
  // - EXAMPLES:
  //   * Employee: fullName, email, phone, departmentId, position, dateOfBirth, startDate, salary
  //   * Restaurant: restaurantName, priceFrom, priceTo, address, ownerName, categoryId, openDate
  // -----------------------------------------------------------------------
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    departmentId: '',
    position: '',
    dateOfBirth: '',
    startDate: '',
    salary: ''
  });

  // Validation error state for individual fields
  const [errors, setErrors] = useState({});

  // Dropdown list (Department or Category)
  const [secondaryList, setSecondaryList] = useState([]);

  // Top banner alert state (success / error)
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Load dropdown categories upon mounting
  useEffect(() => {
    const fetchSecondary = async () => {
      try {
        const res = await axiosClient.get(API_SECONDARY);
        setSecondaryList(res.data || []);
      } catch (err) {
        console.error('Failed to load dropdown options:', err);
      }
    };
    fetchSecondary();
  }, [API_SECONDARY]);

  // Update input values on keystroke and clear individual field errors
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when user retypes in that input field
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // -----------------------------------------------------------------------
  // [MODIFY HERE 3]: CLIENT-SIDE VALIDATION FUNCTION (RUBRIC COMPLIANT)
  // - PURPOSE: Runs on "Save" click before sending data to the server.
  // - HOW IT WORKS:
  //   * If any condition fails, write the error message into 'newErrors.<fieldName>'.
  //   * React-Bootstrap automatically highlights the invalid field in red
  //     and displays the error message text immediately beneath it.
  //   * Error text MUST match the Message List (MS01 - MS12) in the exam prompt!
  // -----------------------------------------------------------------------
  const validate = () => {
    const newErrors = {};

    // 1. Mandatory check (MS01: "<Field> is required.")
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    } else if (formData.fullName.trim().length > 100) {
      newErrors.fullName = 'Full Name must not exceed 100 characters.';
    }

    // 2. Email format check (MS07: "Email is invalid format.")
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Email is invalid format.';
    }

    // 3. Phone digits check (MS09: "Phone must contain only digits (9-11 characters).")
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required.';
    } else if (!/^\d{9,11}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone must contain only digits (9-11 characters).';
    }

    // 4. Department / Category dropdown: Required selection
    if (!formData.departmentId) {
      newErrors.departmentId = 'Department is required.';
    }

    // 5. Position: Required
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required.';
    }

    // 6. Age requirement (MS10: "Employee must be at least 18 years old.")
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of Birth is required.';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 18) {
        newErrors.dateOfBirth = 'Employee must be at least 18 years old.';
      }
    }

    // 7. Future date check (MS11: "Start Date must not be in the future.")
    if (!formData.startDate) {
      newErrors.startDate = 'Start Date is required.';
    } else {
      const startDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (startDate > today) {
        newErrors.startDate = 'Start Date must not be in the future.';
      }
    }

    // 8. Number range check (MS02: "<Field> must be between <Y> and <Z>.")
    if (!formData.salary) {
      newErrors.salary = 'Salary is required.';
    } else {
      const sal = Number(formData.salary);
      if (isNaN(sal) || sal < 1000000 || sal > 100000000) {
        newErrors.salary = 'Salary must be between 1,000,000 and 100,000,000.';
      }
    }

    /*
    -------------------------------------------------------------------------
    [RESTAURANT VALIDATION EXAMPLE (SP26 / SP26 Retake)]:
    -------------------------------------------------------------------------
    if (!formData.restaurantName.trim()) {
      newErrors.restaurantName = 'Restaurant name is required.';
    }
    
    // Price from check
    const pFrom = Number(formData.priceFrom);
    if (!formData.priceFrom) {
      newErrors.priceFrom = 'Price from is required.';
    } else if (pFrom <= 1000 || pFrom >= 1000000) {
      newErrors.priceFrom = 'Price from must be greater than 1000 and less than 1000000.';
    }

    // Price to check + Comparison check (priceTo must be > priceFrom)
    const pTo = Number(formData.priceTo);
    if (!formData.priceTo) {
      newErrors.priceTo = 'Price to is required.';
    } else if (pTo <= 1000 || pTo >= 1000000) {
      newErrors.priceTo = 'Price to must be greater than 1000 and less than 1000000.';
    } else if (pTo <= pFrom) {
      newErrors.priceTo = 'Price to must be greater than "Price from"';
    }

    if (!formData.openDate) {
      newErrors.openDate = 'Open date is required.';
    } else if (new Date(formData.openDate) > new Date()) {
      newErrors.openDate = 'Open date must not be in the future.';
    }
    -------------------------------------------------------------------------
    */

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -----------------------------------------------------------------------
  // [MODIFY HERE 4]: PAYLOAD CASTING & POST DISPATCH
  // - PURPOSE: HTML inputs always store strings (e.g. "15000").
  // - VITAL: Spring Boot DTO requires real numbers (Long, Integer, Float).
  //   Always wrap numeric fields in Number(...) before sending.
  //   If you forget Number(), Spring Boot returns "400 Bad Request / Type Mismatch"!
  // -----------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    // Stop execution if client validation fails
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        position: formData.position.trim(),
        dateOfBirth: formData.dateOfBirth,
        startDate: formData.startDate,
        salary: Number(formData.salary),           // Cast string to number
        departmentId: Number(formData.departmentId) // Cast dropdown string to number
      };

      await axiosClient.post(API_BASE, payload);

      // Display green success alert banner (MS04)
      setAlert({
        type: 'success',
        message: 'Created new employee successfully.'
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Create error:', err);
      const res = err.response;
      if (res?.status === 409 || res?.status === 226) {
        // Handle server-side duplicate check (MS12)
        setAlert({
          type: 'error',
          message: res.data?.message || 'Record already exists.'
        });
      } else if (res?.status === 400) {
        // Handle Spring Boot validation or bad request errors
        if (res.data?.errors && Array.isArray(res.data.errors) && res.data.errors.length > 0) {
          setAlert({
            type: 'error',
            message: res.data.errors.join(' | ')
          });
        } else if (res.data?.message) {
          setAlert({
            type: 'error',
            message: res.data.message
          });
        } else {
          setAlert({
            type: 'error',
            message: 'Duplicate record name or invalid input data.'
          });
        }
      } else if (!res) {
        // Network / CORS / Backend unreachable
        setAlert({
          type: 'error',
          message: 'Network error: Cannot reach backend server (port 8080) or CORS blocked.'
        });
      } else {
        // Generic server error (MS06)
        setAlert({
          type: 'error',
          message: 'Internal system error, please contact the administrator.'
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="main-content">
      <h3 className="fw-bold text-primary mb-3">{TITLE}</h3>

      {/* System alert banner: green for success / red for error */}
      <SystemAlert alert={alert} onClose={() => setAlert(null)} />

      <Card className="shadow-sm border">
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit} noValidate>
            <Row className="g-3">
              {/* 
                [MODIFY HERE 5]: FORM INPUT CONTROLS (<Form.Group>)
                - Each input field has:
                  * Form.Label with red asterisk for mandatory fields
                  * Form.Control with matching 'name' and 'value' bound to formData
                  * isInvalid={!!errors[name]} to trigger red outline
                  * Form.Control.Feedback type="invalid" displaying red error text
              */}

              {/* Full Name field */}
              <Col md={12}>
                <Form.Group controlId="fullName">
                  <Form.Label className="fw-semibold">
                    Full Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    isInvalid={!!errors.fullName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fullName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Email field */}
              <Col md={6}>
                <Form.Group controlId="email">
                  <Form.Label className="fw-semibold">
                    Email <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Phone field */}
              <Col md={6}>
                <Form.Group controlId="phone">
                  <Form.Label className="fw-semibold">
                    Phone <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    placeholder="Enter phone"
                    value={formData.phone}
                    onChange={handleChange}
                    isInvalid={!!errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Department dropdown */}
              <Col md={6}>
                <Form.Group controlId="departmentId">
                  <Form.Label className="fw-semibold">
                    Department <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleChange}
                    isInvalid={!!errors.departmentId}
                  >
                    <option value="">-- Select Department --</option>
                    {secondaryList.map((sec) => (
                      <option
                        key={sec.departmentId || sec.categoryId}
                        value={sec.departmentId || sec.categoryId}
                      >
                        {sec.departmentName || sec.categoryName}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.departmentId}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Position field */}
              <Col md={6}>
                <Form.Group controlId="position">
                  <Form.Label className="fw-semibold">
                    Position <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="position"
                    placeholder="Enter position"
                    value={formData.position}
                    onChange={handleChange}
                    isInvalid={!!errors.position}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.position}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Date of Birth field */}
              <Col md={6}>
                <Form.Group controlId="dateOfBirth">
                  <Form.Label className="fw-semibold">
                    Date of Birth <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    isInvalid={!!errors.dateOfBirth}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.dateOfBirth}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Start Date field */}
              <Col md={6}>
                <Form.Group controlId="startDate">
                  <Form.Label className="fw-semibold">
                    Start Date <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    isInvalid={!!errors.startDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.startDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Salary field */}
              <Col md={6}>
                <Form.Group controlId="salary">
                  <Form.Label className="fw-semibold">
                    Salary (VND) <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="salary"
                    placeholder="Enter salary"
                    value={formData.salary}
                    onChange={handleChange}
                    isInvalid={!!errors.salary}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.salary}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Save and Back buttons */}
            <div className="d-flex gap-2 mt-4 pt-2">
              <Button
                variant="primary"
                type="submit"
                disabled={submitting}
                className="px-4 fw-semibold"
              >
                {submitting ? 'Saving...' : 'Save'}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => navigate('/')}
                className="px-4 fw-semibold"
              >
                Back
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
