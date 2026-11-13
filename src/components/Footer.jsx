import React from 'react';
import { Container } from 'react-bootstrap';

// =========================================================================
// FOOTER: BOTTOM PAGE FOOTER
// =========================================================================
export default function Footer() {
  // -----------------------------------------------------------------------
  // [MODIFY HERE]: UNIVERSITY COPYRIGHT TEXT
  // - PURPOSE: Displays the copyright notice centered at the bottom of all screens.
  // - IMPACT: Checked under Section 1.2 "User Interface & Coding Conventions".
  // - EXAMPLES:
  //   * "© 2026 FU University" or "@ 2026 FU University"
  // -----------------------------------------------------------------------
  const FOOTER_TEXT = "© 2026 FU University";

  return (
    <footer className="bg-light border-top py-3 mt-auto text-center text-muted">
      <Container>
        <small className="fw-semibold">{FOOTER_TEXT}</small>
      </Container>
    </footer>
  );
}
