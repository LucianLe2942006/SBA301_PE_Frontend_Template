import React from 'react';
import { Modal, Button } from 'react-bootstrap';

// =========================================================================
// SCREEN 2: DELETE CONFIRMATION DIALOG (MODAL POPUP)
// =========================================================================
export default function DeleteConfirmModal({ show, item, onConfirm, onCancel }) {
  if (!item) return null;

  // -----------------------------------------------------------------------
  // [MODIFY HERE 1]: ENTITY NOUN / LABEL
  // - PURPOSE: Sets the entity noun in: "Are you sure you want to delete <entity> "<Name>"?"
  // - IMPACT: Ensures the dialog prompt matches the Screen 2 mockup exactly.
  // - EXAMPLES:
  //   * Employee: 'employee'
  //   * Restaurant: 'restaurant'
  //   * Ingredient: 'ingredient'
  // -----------------------------------------------------------------------
  const ENTITY_LABEL = 'employee';

  // -----------------------------------------------------------------------
  // [MODIFY HERE 2]: DISPLAY NAME PROPERTY
  // - PURPOSE: Extracts the human-readable name of the target row to display inside quotes.
  // - EXAMPLES:
  //   * Employee: item.fullName
  //   * Restaurant: item.restaurantName
  //   * Ingredient: item.ingredientName
  // -----------------------------------------------------------------------
  const itemName = item.fullName || item.restaurantName || item.ingredientName || '';

  return (
    <Modal show={show} onHide={onCancel} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="fs-5 fw-bold text-danger">
          ⚠ Confirmation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-1">
          Are you sure you want to delete {ENTITY_LABEL} <strong>"{itemName}"</strong>?
        </p>
        <p className="text-muted small mb-0">This action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onConfirm} className="px-4">
          Yes
        </Button>
        <Button variant="secondary" onClick={onCancel} className="px-4">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
