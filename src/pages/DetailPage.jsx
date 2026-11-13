import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import SystemAlert from '../components/SystemAlert';

// =========================================================================
// SCREEN 3: DETAILS SCREEN (VIEW DETAILS - READ-ONLY MODE)
// =========================================================================
export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // -----------------------------------------------------------------------
  // [MODIFY HERE 1]: API ENDPOINT & SCREEN TITLE
  // - API_BASE: Fetches the single entity by ID via GET ${API_BASE}/${id}.
  //   * Impact: If incorrect, detail view fails with 404 Not Found.
  //   * Examples: '/api/employees' | '/api/restaurants' | '/api/ingredients'
  // - TITLE: The page heading matching Screen 3 mockup (e.g., 'Employee Details' | 'VIEW DETAILS').
  // -----------------------------------------------------------------------
  const API_BASE = '/api/employees';
  const TITLE = 'Employee Details';

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axiosClient.get(`${API_BASE}/${id}`);
        setItem(res.data);
      } catch (err) {
        console.error('Fetch detail error:', err);
        setAlert({
          type: 'error',
          message: 'Internal system error, please contact the administrator.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, API_BASE]);

  return (
    <Container className="main-content">
      <h3 className="fw-bold text-primary mb-3">{TITLE}</h3>

      {/* System alert for errors */}
      <SystemAlert alert={alert} onClose={() => setAlert(null)} />

      <Card className="shadow-sm border">
        <Card.Body className="p-4">
          {loading ? (
            <p className="text-muted">Loading details...</p>
          ) : !item ? (
            <p className="text-danger">Item not found.</p>
          ) : (
            <div>
              {/* 
                [MODIFY HERE 2]: DETAIL DISPLAY ROWS (<Row>)
                - PURPOSE: Renders all attributes in read-only mode per the Screen 3 mockup.
                - STRUCTURE:
                  * Col sm={4}: Field title / label (bold).
                  * Col sm={8}: Field value retrieved from 'item'.
              */}
              <Row className="py-2 border-bottom">
                <Col sm={4} className="fw-bold text-secondary">Full Name:</Col>
                <Col sm={8}>{item.fullName}</Col>
              </Row>

              <Row className="py-2 border-bottom">
                <Col sm={4} className="fw-bold text-secondary">Employee ID:</Col>
                <Col sm={8}>{item.employeeCode || item.employeeId}</Col>
              </Row>

              <Row className="py-2 border-bottom">
                <Col sm={4} className="fw-bold text-secondary">Department:</Col>
                <Col sm={8}>
                  <Badge bg="info" text="dark" className="px-2 py-1">
                    {item.departmentName}
                  </Badge>
                </Col>
              </Row>

              <Row className="py-2 border-bottom">
                <Col sm={4} className="fw-bold text-secondary">Position:</Col>
                <Col sm={8}>{item.position}</Col>
              </Row>

              <Row className="py-2 border-bottom">
                <Col sm={4} className="fw-bold text-secondary">Email:</Col>
                <Col sm={8}>{item.email}</Col>
              </Row>

              <Row className="py-2 border-bottom">
                <Col sm={4} className="fw-bold text-secondary">Phone:</Col>
                <Col sm={8}>{item.phone}</Col>
              </Row>

              <Row className="py-2 border-bottom">
                <Col sm={4} className="fw-bold text-secondary">Date of Birth:</Col>
                <Col sm={8}>{item.dateOfBirth}</Col>
              </Row>

              <Row className="py-2 border-bottom">
                <Col sm={4} className="fw-bold text-secondary">Start Date:</Col>
                <Col sm={8}>{item.startDate}</Col>
              </Row>

              <Row className="py-2 border-bottom">
                <Col sm={4} className="fw-bold text-secondary">Salary (VND):</Col>
                <Col sm={8}>
                  {item.salary !== undefined ? Number(item.salary).toLocaleString() : ''}
                </Col>
              </Row>

              {/* 
              [RESTAURANT EXAMPLE (SP26)]:
              <Row className="py-2 border-bottom">
                <Col sm={4} className="fw-bold">Restaurant Name:</Col>
                <Col sm={8}>{item.restaurantName}</Col>
              </Row>
              <Row className="py-2 border-bottom">
                <Col sm={4} className="fw-bold">Owner name:</Col>
                <Col sm={8}>{item.ownerName}</Col>
              </Row>
              <Row className="py-2 border-bottom">
                <Col sm={4} className="fw-bold">Category:</Col>
                <Col sm={8}><Badge bg="info">{item.categoryName}</Badge></Col>
              </Row>
              <Row className="py-2 border-bottom">
                <Col sm={4} className="fw-bold">Price range (đ):</Col>
                <Col sm={8}>{item.priceFrom} – {item.priceTo}</Col>
              </Row>
              <Row className="py-2 border-bottom">
                <Col sm={4} className="fw-bold">Address:</Col>
                <Col sm={8}>{item.address}</Col>
              </Row>
              <Row className="py-2 border-bottom">
                <Col sm={4} className="fw-bold">Open Date:</Col>
                <Col sm={8}>{item.openDate}</Col>
              </Row>
              */}
            </div>
          )}

          {/* Return to List screen button */}
          <div className="mt-4 pt-2">
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/')}
              className="px-4 fw-semibold"
            >
              ← Back
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
