import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

// =========================================================================
// HEADER: TOP NAVIGATION BAR
// =========================================================================
export default function Header() {
  // -----------------------------------------------------------------------
  // [MODIFY HERE 1]: SYSTEM TITLE
  // - PURPOSE: Displays the system title on the top-left of the navigation bar.
  // - IMPACT: Must match the project title in Section 1.1 of the exam paper.
  // - EXAMPLES:
  //   * EMS (SU26): "Employee Management System"
  //   * RMS (SP26): "Restaurant Management"
  //   * IMS (SP26 Retake): "Inventory Management"
  // -----------------------------------------------------------------------
  const APP_TITLE = "Employee Management System";

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
