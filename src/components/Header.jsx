import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

// =========================================================================
// HEADER: TOP NAVIGATION BAR
// =========================================================================
export default function Header() {
  // ==================== [START: MODIFY 1 - SYSTEM TITLE] ====================
  // - PURPOSE: Displays system title on top-left of Navbar (matches Section 1.1 of exam)
  // - EXAMPLES: "Employee Management System" | "Restaurant Management" | "Shoes Management"
  const APP_TITLE = "Employee Management System";
  // ==================== [END OF MODIFY 1] ====================

  // PURPOSE: Formats current system date as 'yyyy-MM-dd' on the top-right per rubric.
  // Automatically computed from the client environment; no change required.
  const today = new Date().toISOString().split('T')[0];

  return (
    <Navbar bg="primary" variant="dark" className="shadow-sm py-2">
      <Container>
        <Navbar.Brand className="fw-bold fs-5">
          {APP_TITLE}
        </Navbar.Brand>
        <Navbar.Text className="text-white fw-semibold">
          {today}
        </Navbar.Text>
      </Container>
    </Navbar>
  );
}
