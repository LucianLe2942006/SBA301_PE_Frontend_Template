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

  // ==================== [START: MODIFY 1 - API & PRIMARY KEY] ====================
  // 🚨 [BACKEND CHECK 1]: API ENDPOINTS & PRIMARY KEY ID
  // - ENDPOINT TRAP: Check Java Controller @GetMapping methods.
  //   * If search has a separate route (e.g. '/api/shoes/search'), you MUST call it!
  //   * If base route (e.g. '/api/shoes') ignores params, calling it won't filter!
  // - ID_FIELD: Check Entity / Response DTO for the exact key name:
  //   * Examples: 'employeeId' | 'shoesId' | 'id' (Wrong name breaks View/Delete!)
  // =========================================================================
  const API_BASE = '/api/employees';
  const API_SECONDARY = '/api/departments';
  const ID_FIELD = 'employeeId';
  const SCREEN_TITLE = 'Employee List';
  // ==================== [END OF MODIFY 1] ====================

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

  // Helper: Format raw backend date (ISO string/timestamp) to 'YYYY-MM-DD' for table display
  const formatDate = (val) => {
    if (!val) return '';
    const d = new Date(val);
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
  };

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

      // ==================== [START: MODIFY 2 - CATEGORY FILTER PARAM] ====================
      // 🚨 [BACKEND CHECK 2]: CATEGORY FILTER QUERY PARAM NAME
      // - Check Java Controller @RequestParam name:
      //   * Examples: 'departmentId', 'categoryId', or just 'category'?
      //   * If wrong: Backend ignores the filter and returns all un-filtered data!
      // =========================================================================
      if (secId) {
        params.departmentId = secId;
      }
      // ==================== [END OF MODIFY 2] ====================

      const res = await axiosClient.get(API_BASE, { params });
      const data = res.data;

      // ==================== [START: MODIFY 3 - PAGINATION RESPONSE] ====================
      // 🚨 [BACKEND CHECK 3]: PAGINATION CURRENT PAGE (PREVENTS PAGE 1 STUCK)
      // - Check Java PageResponse / PageDTO field name:
      //   * Is it 'currentPage', 'pageNumber', or 'number'?
      //   * If wrong: data.pageNumber is undefined -> resets to 0 (cannot go to page 2)!
      //   * Safe fallback: data.currentPage ?? data.pageNumber ?? data.number ?? 0
      // =========================================================================
      if (data && Array.isArray(data.content)) {
        setItems(data.content);
        const pageIndex = data.currentPage ?? data.pageNumber ?? data.number ?? 0;
        setCurrentPage(pageIndex);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } else {
        setItems([]);
        setTotalPages(0);
        setTotalElements(0);
      }
      // ==================== [END OF MODIFY 3] ====================
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
              {/* ==================== [START: MODIFY 4 - NAME INPUT LABEL] ==================== */}
              {/* - Match the exact label from Screen 1 mockup (e.g., 'Employee Name' | 'Restaurant Name') */}
              <Form.Label className="fw-semibold">Employee Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name to filter..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              {/* ==================== [END OF MODIFY 4] ==================== */}
            </Form.Group>
          </Col>

          {/* Department / Category dropdown filter */}
          <Col md={3} sm={12}>
            <Form.Group controlId="filterSecondary">
              {/* ==================== [START: MODIFY 5 - DROPDOWN LABEL] ==================== */}
              {/* - Match the exact label from Screen 1 mockup (e.g., 'Department' | 'Category') */}
              <Form.Label className="fw-semibold">Department</Form.Label>
              {/* ==================== [END OF MODIFY 5] ==================== */}
              <Form.Select
                value={selectedSecondaryId}
                onChange={(e) => setSelectedSecondaryId(e.target.value)}
              >
                <option value="">-- All --</option>
                {secondaryList.map((sec) => (
                  /* ==================== [START: MODIFY 6 - DROPDOWN OPTION VALUE] ==================== */
                  /* 
                    =========================================================================
                    🚨 [BACKEND CHECK 4]: DROPDOWN VALUE (FILTER BY ID OR NAME?)
                    - Check Java Service / Repository method:
                      * If Java filters by ID (Long):     value={sec.id || sec.categoryId}
                      * If Java filters by Name (String): value={sec.categoryName || sec.departmentName}
                      * Trap: If backend matches category name, sending numeric ID returns 0 rows!
                    =========================================================================
                  */
                  <option key={sec.id || sec.departmentId || sec.categoryId} value={sec.departmentId || sec.categoryId || sec.id}>
                    {sec.departmentName || sec.categoryName}
                  </option>
                  /* ==================== [END OF MODIFY 6] ==================== */
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
              {/* ==================== [START: MODIFY 7 - TABLE HEADERS] ==================== */}
              {/* - PURPOSE: Defines visible column headers matching exam paper */}
              <th>Full Name</th>
              <th>Department</th>
              <th>Position</th>
              <th>Email</th>
              <th>Phone</th>
              {/* ==================== [END OF MODIFY 7] ==================== */}
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

                    {/* ==================== [START: MODIFY 8 - TABLE DATA CELLS] ==================== */}
                    {/* - PURPOSE: Pulls matching properties from backend object 'item' */}
                    <td>{item.fullName}</td>
                    <td>
                      <Badge bg="info" text="dark" className="px-2 py-1">
                        {item.departmentName}
                      </Badge>
                    </td>
                    <td>{item.position}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                    {/* ==================== [END OF MODIFY 8] ==================== */}

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
