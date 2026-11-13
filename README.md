# SBA301 FRONTEND MASTER BOILERPLATE (VITE + REACT + REACT-BOOTSTRAP)

## 1. Quick Setup (First 10 Minutes with Internet)
Open a terminal in this directory and execute:
```bash
npm install
npm run dev
```
The application will start at: `http://localhost:5173/`

---

## 2. Exam Screen to Source File Mapping

| Exam Requirement | Source File | Purpose |
| :--- | :--- | :--- |
| **Top Navigation** | `src/components/Header.jsx` | System title and formatted current date (`yyyy-MM-dd`) |
| **Footer** | `src/components/Footer.jsx` | University copyright text |
| **Screen 1 — List** | `src/pages/ListPage.jsx` | Table, name filter, category dropdown, server pagination |
| **Screen 2 — Delete** | `src/components/DeleteConfirmModal.jsx` | Confirmation modal dialog before deletion |
| **Screen 3 — View Details**| `src/pages/DetailPage.jsx` | Read-only details display with Back button |
| **Screen 4 — Add New** | `src/pages/AddPage.jsx` | Form inputs, red validation text, POST submission |

---

## 3. How to Customize for a New Exam in 3 Minutes

### Screen 1 (`src/pages/ListPage.jsx`):
- Line 16: Update `API_BASE` (e.g., `/api/restaurants`), `API_SECONDARY` (e.g., `/api/categories`), and `ID_FIELD`.
- Line 155: Update search input labels (`Employee Name` -> `Restaurant Name`) and category dropdown (`Department` -> `Category`).
- Line 195: Update `<th>` table headers and `<td>` table data fields.

### Screen 2 (`src/components/DeleteConfirmModal.jsx`):
- Line 11: Change `ENTITY_LABEL` (e.g., `'restaurant'` or `'ingredient'`).

### Screen 3 (`src/pages/DetailPage.jsx`):
- Line 16: Update `API_BASE`.
- Line 55: Match the `<Row>` fields with the exam's mock-up specification.

### Screen 4 (`src/pages/AddPage.jsx`):
- Line 16: Update `API_BASE` and `API_SECONDARY`.
- Line 20: Define form state keys in `formData`.
- Line 75: Write validation rules in `validate()` matching MS codes (MS01 - MS12).
- Line 200: Adjust `<Form.Group>` input controls.

---

## 4. EOS Submission Guidelines (Mandatory to avoid 0 points)
1. Verify `jsconfig.json` exists in project root:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "*": ["../../node_modules/*"]
    }
  }
}
```
2. Rename project root folder per exam convention:
   `<ClassName>_<StudentID>_<ProjectCode>_PE` (e.g., `SE1910_HE180000_EMS_PE`).
3. **DELETE `node_modules` FOLDER** before zipping.
4. Right click project folder -> **Send to** -> **Compressed (zipped) folder**.
5. Upload `.zip` to EOS exam client.
