import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Row, Col, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import SystemAlert from '../components/SystemAlert';

// =========================================================================
// SCREEN: EDIT / UPDATE SCREEN (FETCH BY ID + VALIDATION + PUT SUBMISSION)
// =========================================================================
export default function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ==================== [START: MODIFY 1 - API ENDPOINTS & SCREEN TITLE] ====================
  // - API_BASE: Target endpoint for GET single entity and PUT update.
  // - API_SECONDARY: Endpoint for fetching department/category dropdown.
  // - TITLE: Heading displayed at the top of the update page.
  const API_BASE = '/api/employees';
  const API_SECONDARY = '/api/departments';
  const TITLE = 'Update Employee';
  // ==================== [END OF MODIFY 1] ====================

  // Helper: Format raw backend date (ISO string/timestamp) to 'YYYY-MM-DD' for <input type="date">
  const formatDate = (val) => {
    if (!val) return '';
    const d = new Date(val);
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
  };

  // ==================== [START: MODIFY 2 - FORM STATE INITIALIZATION] ====================
  // - PURPOSE: Holds the state keys corresponding to the input form.
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
  // ==================== [END OF MODIFY 2] ====================

  const [errors, setErrors] = useState({});
  const [secondaryList, setSecondaryList] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch dropdown options (Department / Category)
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

  // 2. Fetch existing entity data by ID to pre-populate the form
  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const res = await axiosClient.get(`${API_BASE}/${id}`);
        const data = res.data;
        if (data) {
          // Pre-fill form fields with fetched data (wrap dates in formatDate for <input type="date">)
          setFormData({
            fullName: data.fullName || '',
            email: data.email || '',
            phone: data.phone || '',
            departmentId: data.departmentId || '',
            position: data.position || '',
            dateOfBirth: formatDate(data.dateOfBirth),
            startDate: formatDate(data.startDate),
            salary: data.salary || ''

            /*
            [RESTAURANT EXAMPLE (SP26)]:
            restaurantName: data.restaurantName || '',
            priceFrom: data.priceFrom || '',
            priceTo: data.priceTo || '',
            address: data.address || '',
            ownerName: data.ownerName || '',
            categoryId: data.categoryId || '',
            openDate: data.openDate || ''
            */
          });
        }
      } catch (err) {
        console.error('Fetch existing error:', err);
        setAlert({
          type: 'error',
          message: 'Failed to load existing record for editing.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExisting();
  }, [id, API_BASE]);

  // Handle keystroke input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when user retypes
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // ==================== [START: MODIFY 3 - CLIENT-SIDE VALIDATION] ====================
  // - Same validation logic as AddPage to guarantee input data integrity.
  const validate = () => {
    const newErrors = {};

    // 1. Full Name check
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    } else if (formData.fullName.trim().length > 100) {
      newErrors.fullName = 'Full Name must not exceed 100 characters.';
    }

    // 2. Email format check
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Email is invalid format.';
    }

    // 3. Phone digits check
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required.';
    } else if (!/^\d{9,11}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone must contain only digits (9-11 characters).';
    }

    // 4. Department / Category selection
    if (!formData.departmentId) {
      newErrors.departmentId = 'Department is required.';
    }

    // 5. Position check
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required.';
    }

    // 6. Age requirement (at least 18 years old)
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

    // 7. Future date check
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

    // 8. Number range check
    if (!formData.salary) {
      newErrors.salary = 'Salary is required.';
    } else {
      const sal = Number(formData.salary);
      if (isNaN(sal) || sal < 1000000 || sal > 100000000) {
        newErrors.salary = 'Salary must be between 1,000,000 and 100,000,000.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // ==================== [END OF MODIFY 3] ====================

  // ==================== [START: MODIFY 4 - PAYLOAD CASTING & PUT DISPATCH] ====================
  // - Sends HTTP PUT request: PUT ${API_BASE}/${id}
  // - Cast numeric fields with Number(...) to match Spring Boot DTO!
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

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
        salary: Number(formData.salary),
        departmentId: Number(formData.departmentId)

        /*
        [RESTAURANT EXAMPLE (SP26)]:
        restaurantName: formData.restaurantName.trim(),
        priceFrom: Number(formData.priceFrom),
        priceTo: Number(formData.priceTo),
        address: formData.address.trim(),
        ownerName: formData.ownerName.trim(),
        categoryId: Number(formData.categoryId),
        openDate: formData.openDate
        */
      };

      // Call HTTP PUT endpoint to update
      await axiosClient.put(`${API_BASE}/${id}`, payload);
  // ==================== [END OF MODIFY 4] ====================

      setAlert({
        type: 'success',
        message: 'Updated successfully.'
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Update error:', err);
      const res = err.response;
      if (res?.status === 409 || res?.status === 226) {
        setAlert({
          type: 'error',
          message: res.data?.message || 'Item with this name or email already exists.'
        });
      } else if (res?.status === 400) {
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
        setAlert({
          type: 'error',
          message: 'Network error: Cannot reach backend server (port 8080) or CORS blocked.'
        });
      } else {
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

      {/* System alert banner */}
      <SystemAlert alert={alert} onClose={() => setAlert(null)} />

      <Card className="shadow-sm border">
        <Card.Body className="p-4">
          {loading ? (
            <p className="text-muted">Loading existing data...</p>
          ) : (
            <Form onSubmit={handleSubmit} noValidate>
              <Row className="g-3">
                {/* ==================== [START: MODIFY 5 - FORM INPUT CONTROLS] ==================== */}
                {/* - Replicates form fields with pre-filled state */}

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
                {/* ==================== [END OF MODIFY 5] ==================== */}
              </Row>

              {/* Save changes and Back buttons */}
              <div className="d-flex gap-2 mt-4 pt-2">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={submitting}
                  className="px-4 fw-semibold"
                >
                  {submitting ? 'Updating...' : 'Update'}
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
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
