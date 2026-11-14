import React from 'react';
import { Container } from 'react-bootstrap';

// =========================================================================
// FOOTER: BOTTOM PAGE FOOTER
// =========================================================================
export default function Footer() {
  // ==================== [START: MODIFY 1 - FOOTER COPYRIGHT] ====================
  // - PURPOSE: Displays the copyright notice centered at the bottom of all screens
  // - EXAMPLES: "© 2026 FU University" | "@ 2026 FU University"
  const FOOTER_TEXT = "© 2026 FU University";
  // ==================== [END OF MODIFY 1] ====================

  return (
    <footer className="bg-light border-top py-3 mt-auto text-center text-muted">
      <Container>
        <small className="fw-semibold">{FOOTER_TEXT}</small>
      </Container>
    </footer>
  );
}
