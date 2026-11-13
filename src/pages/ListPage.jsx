import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Table, Badge, Pagination } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import SystemAlert from '../components/SystemAlert';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

// =========================================================================
// SCREEN 1: LIST SCREEN (SEARCH & FILTER & SERVER-SIDE PAGINATION)
// =========================================================================
export default function ListPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // -----------------------------------------------------------------------
  // [MODIFY HERE 1]: API ENDPOINTS & PRIMARY KEY CONFIGURATION
  // - API_BASE: The main REST API endpoint for fetching/deleting entities.
  //   * Impact: If incorrect, browser receives 404 Not Found and table is empty.
  //   * Examples: '/api/employees' | '/api/restaurants' | '/api/ingredients'
  // - API_SECONDARY: Endpoint for populating the category/department dropdown.
  //   * Examples: '/api/departments' | '/api/categories'
  // - ID_FIELD: The unique identifier property name in backend JSON objects.
  //   * Vital Impact: Used for delete requests (/api/.../{id}) and route navigation (/view/{id}).
  //   * If wrong: ID becomes 'undefined', which breaks both View and Delete operations!
  //   * Examples: 'employeeId' (Employee) | 'id' (Restaurant / Ingredient)
  // - SCREEN_TITLE: The heading displayed above the search filter bar.
  // -----------------------------------------------------------------------
  const API_BASE = '/api/employees';
  const API_SECONDARY = '/api/departments';
  const ID_FIELD = 'employeeId';
  const SCREEN_TITLE = 'Employee List';

  // Search & filter state
  const [searchName, setSearchName] = useState('');
  const [selectedSecondaryId, setSelectedSecondaryId] = useState('');
  const [secondaryList, setSecondaryList] = useState([]); // Department or Category list

  // Table data & pagination state
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 0-based index matching Spring Boot PageRequest
  const [pageSize] = useState(5);                    // Records per page (typically 5 or 10 per exam)
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  // System alert & delete modal state
  const [alert, setAlert] = useState(location.state?.alert || null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // 1. Fetch dropdown options for Department / Category
  useEffect(() => {
    const fetchSecondary = async () => {
      try {
        const res = await axiosClient.get(API_SECONDARY);
        setSecondaryList(res.data || []);
      } catch (err) {
        console.error('Failed to load dropdown categories:', err);
      }
    };
    fetchSecondary();
  }, [API_SECONDARY]);

  // 2. Fetch primary entity list from backend with pagination and filters
  const fetchList = useCallback(async (pageToLoad = currentPage, name = searchName, secId = selectedSecondaryId) => {
    setLoading(true);
    try {
      const params = {
        page: pageToLoad,
        size: pageSize
      };

      // Exam requirement: trim whitespace for name search
      if (name.trim()) {
        params.name = name.trim();
      }

      // -------------------------------------------------------------------
      // [MODIFY HERE 2]: CATEGORY FILTER QUERY PARAMETER
      // - PURPOSE: Query param name expected by Spring Boot @RequestParam.
      // - IMPACT:
      //   * Employee: Java controller expects 'departmentId' -> params.departmentId = secId;
      //   * Restaurant / Ingredient: Java expects 'categoryId' -> params.categoryId = secId;
      //   * If wrong: Backend ignores the filter and returns all un-filtered records.
      // -------------------------------------------------------------------
      if (secId) {
        params.departmentId = secId;
      }

      const res = await axiosClient.get(API_BASE, { params });
      const data = res.data;

      // Spring Boot PageDTO structure: { content, pageNumber, totalPages, totalElements }
      if (data && Array.isArray(data.content)) {
        setItems(data.content);
        setCurrentPage(data.pageNumber || 0);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } else {
        setItems([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (err) {
      console.error('API Error:', err);
      setAlert({
        type: 'error',
        message: 'Internal system error, please contact the administrator.' // MS06
      });
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [API_BASE, currentPage, pageSize, searchName, selectedSecondaryId]);

  // Initial load
  useEffect(() => {
    fetchList(0);
  }, []);

  // Handle "Filter" button click: resets to first page (page 0)
  const handleFilter = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchList(0, searchName, selectedSecondaryId);
  };

  // Open delete confirmation modal
  const handleOpenDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  // Execute deletion when user confirms on modal
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const id = itemToDelete[ID_FIELD];

    try {
      await axiosClient.delete(`${API_BASE}/${id}`);
      setDeleteModalOpen(false);
      setItemToDelete(null);
      setAlert({
        type: 'success',
        message: 'Deleted successfully.' // MS08
      });
      // If deleting the last item on current page, step back one page
      const targetPage = items.length === 1 && currentPage > 0 ? currentPage - 1 : currentPage;
      fetchList(targetPage);
    } catch (err) {
      console.error('Delete error:', err);
      setDeleteModalOpen(false);
      setAlert({
        type: 'error',
        message: 'Internal system error, please contact the administrator.'
      });
    }
  };

  // Handle page number change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      fetchList(newPage);
    }
  };

  return (
    <Container className="main-content">
      {/* Screen 1 Title */}
      <h3 className="fw-bold text-primary mb-3">{SCREEN_TITLE}</h3>

      {/* System alert message placed below screen title */}
      <SystemAlert alert={alert} onClose={() => setAlert(null)} />

      {/* ------------------------------------------------------------- */}
      {/* SEARCH & FILTER SECTION */}
      {/* ------------------------------------------------------------- */}
      <Form onSubmit={handleFilter} className="bg-white p-3 rounded shadow-sm border mb-4">
        <Row className="align-items-end g-3">
          {/* Name search field */}
          <Col md={4} sm={12}>
            <Form.Group controlId="searchName">
              {/* 
                [MODIFY HERE 3]: Name input label
                - Match the exact label from Screen 1 mockup (e.g., 'Employee Name' | 'Restaurant Name')
              */}
              <Form.Label className="fw-semibold">Employee Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name to filter..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </Form.Group>
          </Col>

          {/* Department / Category dropdown filter */}
          <Col md={3} sm={12}>
            <Form.Group controlId="filterSecondary">
              {/* 
                [MODIFY HERE 4]: Dropdown label
                - Match the exact label from Screen 1 mockup (e.g., 'Department' | 'Category')
              */}
              <Form.Label className="fw-semibold">Department</Form.Label>
              <Form.Select
                value={selectedSecondaryId}
                onChange={(e) => setSelectedSecondaryId(e.target.value)}
              >
                <option value="">-- All --</option>
                {secondaryList.map((sec) => (
                  /* 
                    [MODIFY HERE 5]: Dropdown option binding
                    - value: The ID sent to the backend when selected.
                    - text: The human-readable name displayed in the dropdown list.
                    - Employee:   value={sec.departmentId} -> text {sec.departmentName}
                    - Restaurant: value={sec.categoryId}   -> text {sec.categoryName}
                  */
                  <option key={sec.departmentId || sec.categoryId} value={sec.departmentId || sec.categoryId}>
                    {sec.departmentName || sec.categoryName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Filter button */}
          <Col md={2} sm={6}>
            <Button variant="primary" type="submit" className="w-100 fw-semibold">
              Filter
            </Button>
          </Col>

          {/* + Add New button */}
          {/* [OPTIONAL - REMOVE IF EXAM DOES NOT REQUIRE "ADD NEW"]: Remove this Col block */}
          <Col md={3} sm={6} className="text-md-end">
            <Button
              variant="success"
              onClick={() => navigate('/add')}
              className="w-100 fw-semibold"
            >
              + Add New
            </Button>
          </Col>
        </Row>
      </Form>

      {/* ------------------------------------------------------------- */}
      {/* MAIN DATA TABLE */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded shadow-sm border p-3">
        <Table responsive striped bordered hover className="mb-0 text-center">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              {/* 
                [MODIFY HERE 6]: Table column headers (<th>)
                - PURPOSE: Defines the visible column headers in the exact order specified by the exam paper.
                - EXAMPLES:
                  * Employee: Full Name, Department, Position, Email, Phone
                  * Restaurant: Restaurant Name, Category, Owner, Address, Price range(đ)
              */}
              <th>Full Name</th>
              <th>Department</th>
              <th>Position</th>
              <th>Email</th>
              <th>Phone</th>
              <th style={{ width: '160px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-4 text-muted">Loading data...</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                {/* Empty list notice (MS05) */}
                <td colSpan={7} className="py-4 text-danger fw-semibold">
                  No records found.
                </td>
              </tr>
            ) : (
              items.map((item, index) => {
                const id = item[ID_FIELD];
                return (
                  <tr key={id || index}>
                    {/* 1-based row index: (currentPage * pageSize + index + 1) */}
                    <td className="fw-bold">{currentPage * pageSize + index + 1}</td>

                    {/* 
                      [MODIFY HERE 7]: Table data cells (<td>)
                      - PURPOSE: Pulls matching properties from backend object 'item' and displays them.
                      - TIPS:
                        * Wrap category/department in <Badge bg="info" text="dark"> for clean badge UI.
                        * For price ranges: {item.priceFrom}-{item.priceTo}
                    */}
                    <td>{item.fullName}</td>
                    <td>
                      <Badge bg="info" text="dark" className="px-2 py-1">
                        {item.departmentName}
                      </Badge>
                    </td>
                    <td>{item.position}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>

                    {/*
                    [RESTAURANT EXAMPLE (SP26)]:
                    <td>{item.restaurantName}</td>
                    <td><Badge bg="info" text="dark">{item.categoryName}</Badge></td>
                    <td>{item.ownerName}</td>
                    <td>{item.address}</td>
                    <td>{item.priceFrom}-{item.priceTo}</td>
                    */}

                    {/* Action column links: View, Edit, and Delete */}
                    <td>
                      {/* [OPTIONAL - REMOVE IF EXAM HAS NO "VIEW"]: */}
                      <span
                        className="action-link me-2"
                        onClick={() => navigate(`/view/${id}`)}
                      >
                        View
                      </span>
                      <span className="text-muted">|</span>

                      {/* [OPTIONAL - REMOVE IF EXAM HAS NO "EDIT"]: */}
                      <span
                        className="action-link me-2 ms-2"
                        onClick={() => navigate(`/edit/${id}`)}
                      >
                        Edit
                      </span>
                      <span className="text-muted">|</span>

                      {/* [OPTIONAL - REMOVE IF EXAM HAS NO "DELETE"]: */}
                      <span
                        className="action-link-danger ms-2"
                        onClick={() => handleOpenDelete(item)}
                      >
                        Delete
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>

        {/* ------------------------------------------------------------- */}
        {/* PAGINATION (Auto-hidden if totalPages <= 1 per exam rubric) */}
        {/* ------------------------------------------------------------- */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
            <span className="text-muted small">
              Page {currentPage + 1} / {totalPages} ({totalElements} records)
            </span>
            <Pagination className="mb-0">
              <Pagination.Prev
                disabled={currentPage === 0}
                onClick={() => handlePageChange(currentPage - 1)}
              />
              {[...Array(totalPages)].map((_, idx) => (
                <Pagination.Item
                  key={idx}
                  active={idx === currentPage}
                  onClick={() => handlePageChange(idx)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={currentPage === totalPages - 1}
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </Pagination>
          </div>
        )}
      </div>

      {/* 
        [OPTIONAL - REMOVE IF EXAM HAS NO "DELETE"]:
        If your exam does not have Screen 2 (Delete Confirmation Modal),
        you can safely remove this <DeleteConfirmModal /> tag below:
      */}
      <DeleteConfirmModal
        show={deleteModalOpen}
        item={itemToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
      />
    </Container>
  );
}
