# CẨM NANG HƯỚNG DẪN THI PE SBA301 (FRONTEND REACT + SPRING BOOT)
> **Dành cho sinh viên thi PE môn SBA301**  
> *Mục tiêu: Đọc đề -> Xác định đúng 4 màn hình -> Sửa code trong 5-10 phút -> Đạt điểm tối đa.*

---

## MỤC LỤC
1. [Bản đồ kiến trúc: Đề thi tương ứng với File nào?](#1-bản-đồ-kiến-trúc)
2. [10 phút đầu giờ (Khi phòng thi có mạng)](#2-10-phút-đầu-giờ-có-mạng)
3. [Quy trình chỉnh sửa chi tiết 4 Màn hình](#3-quy-trình-chỉnh-sửa-chi-tiết-4-màn-hình)
   - [Top Bar & Footer](#30-top-bar--footer)
   - [Screen 1: Màn hình danh sách & Tìm kiếm & Phân trang](#31-screen-1-listpagejsx)
   - [Screen 2: Popup Modal xác nhận xóa](#32-screen-2-deleteconfirmmodaljsx)
   - [Screen 3: Màn hình xem chi tiết (Read-only)](#33-screen-3-detailpagejsx)
   - [Screen 4: Form thêm mới & Validation bắt lỗi](#34-screen-4-addpagejsx)
4. [Bảng tra cứu mã lỗi chuẩn đề thi (MS01 -> MS12)](#4-bảng-tra-cứu-mã-lỗi-chuẩn-đề-thi)
5. [Xử lý trường hợp đặc biệt: Price From & Price To](#5-xử-lý-đặc-biệt-price-from--price-to)
6. [Quy tắc nộp bài EOS (Tuyệt đối không để bị 0 điểm)](#6-quy-tắc-nộp-bài-eos-bắt-buộc)
7. [Checklist kiểm tra 2 phút trước khi nộp bài](#7-checklist-kiểm-tra-trước-khi-nộp-bài)

---

## 1. BẢN ĐỒ KIẾN TRÚC

Mọi đề PE môn SBA301 (SP26, SP26 Retake, SU26,...) đều có cấu trúc **4 màn hình giống hệt nhau**.  
Mỗi màn hình trong đề thi đã được nối dây ăn khớp 1-1 với đúng 1 file trong thư mục `src/`:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   HEADER: src/components/Header.jsx                   │
│         (Hiển thị tên hệ thống bên trái + Ngày yyyy-MM-dd bên phải)     │
├────────────────────────────────────────────────────────────────────────┤
│ ĐƯỜNG DẪN URL      │ FILE PHỤ TRÁCH            │ MÀN HÌNH ĐỀ BÀI      │
│ ───────────────────┼───────────────────────────┼──────────────────────│
│ http://.../        │ src/pages/ListPage.jsx    │ SCREEN 1 (Danh sách) │
│   (Bấm nút Delete) │ src/components/           │ SCREEN 2 (Modal xóa) │
│                    │   DeleteConfirmModal.jsx  │                      │
│ http://.../view/:id│ src/pages/DetailPage.jsx  │ SCREEN 3 (Chi tiết)  │
│ http://.../edit/:id│ src/pages/EditPage.jsx    │ UPDATE (Cập nhật)    │
│ http://.../add     │ src/pages/AddPage.jsx     │ SCREEN 4 (Thêm mới)  │
├────────────────────────────────────────────────────────────────────────┤
│                   FOOTER: src/components/Footer.jsx                   │
│             (Hiển thị bản quyền © 2026 FU University ở đáy trang)     │
└────────────────────────────────────────────────────────────────────────┘
```

> **Nguyên tắc "Ăn khớp":**  
> Khi bạn bấm *Delete* ở Screen 1 ➔ Modal Screen 2 tự nhảy lên.  
> Khi bạn bấm *View* ở Screen 1 ➔ Screen 3 tự mở ra kèm nút *Back* quay về.  
> Khi bạn bấm *+ Add New* ở Screen 1 ➔ Screen 4 tự mở ra kèm nút *Back* quay về.  
> **Bạn không cần viết thêm router hay đấu nối dây, chỉ cần sửa dữ liệu bên trong từng file!**

---

## 2. 10 PHÚT ĐẦU GIỜ (CÓ MẠNG)

1. Sao chép thư mục `PE_FRONTEND_MASTER_TEMPLATE` vào thư mục làm bài thi của bạn.
2. Mở Terminal (PowerShell / CMD) tại thư mục dự án và chạy:
   ```bash
   npm install
   ```
3. Sau khi cài xong, chạy thử dev server:
   ```bash
   npm run dev
   ```
4. Mở trình duyệt vào `http://localhost:5173/`. Nếu trang web hiển thị bảng danh sách là bạn đã sẵn sàng 100%.

---

## 3. QUY TRÌNH CHỈNH SỬA CHI TIẾT 4 MÀN HÌNH

### 3.0 TOP BAR & FOOTER

#### File: `src/components/Header.jsx`
* Tìm đến comment `// [MODIFY HERE 1]`:
  ```javascript
  // Đổi tên hệ thống theo đề (ví dụ "Restaurant Management" hoặc "Inventory Management")
  const APP_TITLE = "Employee Management System";
  ```
  *(Ngày tháng `yyyy-MM-dd` đã được code tự động lấy ngày hiện tại, không cần chỉnh).*

#### File: `src/components/Footer.jsx`
* Tìm đến comment `// [MODIFY HERE]`:
  ```javascript
  const FOOTER_TEXT = "© 2026 FU University"; // hoặc "@ 2026 FU University"
  ```

---

### 3.1 SCREEN 1: `ListPage.jsx`
*(Màn hình danh sách, tìm kiếm theo tên, dropdown danh mục, và phân trang)*

Mở file **`src/pages/ListPage.jsx`**, sửa lần lượt theo các điểm đánh dấu:

* **Điểm 1 (Dòng 16 - Cấu hình API & Khóa chính):**
  ```javascript
  // [MODIFY HERE 1]
  const API_BASE = '/api/employees';        // Đổi thành: '/api/restaurants' hoặc '/api/ingredients'
  const API_SECONDARY = '/api/departments'; // Đổi thành: '/api/categories'
  const ID_FIELD = 'employeeId';            // Đổi thành: 'id'
  const SCREEN_TITLE = 'Employee List';     // Đổi thành: 'Restaurant List'
  ```

* **Điểm 2 (Dòng 80 - Lọc theo danh mục phụ):**
  ```javascript
  // [MODIFY HERE 2]
  if (secId) {
    params.departmentId = secId; // Đổi thành: params.categoryId = secId;
  }
  ```

* **Điểm 3 (Dòng 155 - Nhãn ô Search & Dropdown):**
  - Đổi chữ `<Form.Label>Employee Name</Form.Label>` thành tên tương ứng (ví dụ: `Restaurant Name`).
  - Đổi chữ `<Form.Label>Department</Form.Label>` thành `Category`.
  - Ở thẻ `<option>` của Dropdown:
    ```jsx
    // [MODIFY HERE 5]
    <option key={sec.departmentId || sec.categoryId} value={sec.departmentId || sec.categoryId}>
      {sec.departmentName || sec.categoryName}
    </option>
    ```

* **Điểm 4 (Dòng 195 - Các cột của Bảng danh sách):**
  Nhìn vào bảng mẫu trong đề thi, sửa thẻ `<th>` (tiêu đề cột) và `<td>` (dữ liệu dòng):
  ```jsx
  {/* [MODIFY HERE 6]: Cột tiêu đề */}
  <thead>
    <tr>
      <th style={{ width: '60px' }}>#</th>
      <th>Full Name</th>
      <th>Department</th>
      <th>Position</th>
      <th>Email</th>
      <th>Phone</th>
      <th style={{ width: '160px' }}>Action</th>
    </tr>
  </thead>

  {/* [MODIFY HERE 7]: Dữ liệu từng dòng */}
  <tbody>
    {items.map((item, index) => (
      <tr key={item[ID_FIELD]}>
        <td className="fw-bold">{currentPage * pageSize + index + 1}</td>
        <td>{item.fullName}</td>
        <td><Badge bg="info" text="dark">{item.departmentName}</Badge></td>
        <td>{item.position}</td>
        <td>{item.email}</td>
        <td>{item.phone}</td>
        <td>
          <span className="action-link me-2" onClick={() => navigate(`/view/${item[ID_FIELD]}`)}>View</span>
          <span className="text-muted">|</span>
          <span className="action-link-danger ms-2" onClick={() => handleOpenDelete(item)}>Delete</span>
        </td>
      </tr>
    ))}
  </tbody>
  ```

---

### 3.2 SCREEN 2: `DeleteConfirmModal.jsx`
*(Modal popup xác nhận khi bấm Delete ở một dòng trên Screen 1)*

Mở file **`src/components/DeleteConfirmModal.jsx`**:

* **Điểm duy nhất cần sửa (Dòng 11):**
  ```javascript
  // [MODIFY HERE 1]: Đổi tên đối tượng theo đề bài
  const ENTITY_LABEL = 'employee'; // Đổi thành: 'restaurant' hoặc 'ingredient'
  ```
* Popup sẽ tự động ghép thành câu chuẩn:  
  `Are you sure you want to delete <entity> "<Name>"?`  
  `This action cannot be undone.`  
* Khi bấm `Yes`, nó tự gọi `DELETE API_BASE/{id}`, hiển thị thông báo xanh lá `"Deleted successfully."` (MS08) và tự load lại danh sách.

---

### 3.3 SCREEN 3: `DetailPage.jsx`
*(Màn hình hiển thị chi tiết khi bấm View)*

Mở file **`src/pages/DetailPage.jsx`**:

* **Điểm 1 (Dòng 16):**
  ```javascript
  // [MODIFY HERE 1]
  const API_BASE = '/api/employees'; // Đổi thành: '/api/restaurants'
  const TITLE = 'Employee Details';  // Đổi thành: 'VIEW DETAILS'
  ```

* **Điểm 2 (Dòng 55 trở đi):**
  Nhìn vào ảnh Screen 3 trong đề thi, đề yêu cầu hiển thị những dòng nào thì sửa các cặp `<Row>` tương ứng:
  ```jsx
  {/* [MODIFY HERE 2] */}
  <Row className="py-2 border-bottom">
    <Col sm={4} className="fw-bold text-secondary">Restaurant Name:</Col>
    <Col sm={8}>{item.restaurantName}</Col>
  </Row>
  <Row className="py-2 border-bottom">
    <Col sm={4} className="fw-bold text-secondary">Category:</Col>
    <Col sm={8}><Badge bg="info" text="dark">{item.categoryName}</Badge></Col>
  </Row>
  <Row className="py-2 border-bottom">
    <Col sm={4} className="fw-bold text-secondary">Price range (đ):</Col>
    <Col sm={8}>{item.priceFrom} – {item.priceTo}</Col>
  </Row>
  ```
* Nút `← Back` đã được viết sẵn, bấm vào tự động quay về Screen 1.

---

### 3.4 SCREEN 4: `AddPage.jsx`
*(Màn hình Form thêm mới + Bắt lỗi Validation hiển thị chữ đỏ)*

Mở file **`src/pages/AddPage.jsx`**:

* **Điểm 1 (Dòng 16 - Cấu hình API):**
  ```javascript
  // [MODIFY HERE 1]
  const API_BASE = '/api/employees';
  const API_SECONDARY = '/api/departments';
  const TITLE = 'Add New Employee';
  ```

* **Điểm 2 (Dòng 20 - Khai báo các trường trong Form):**
  ```javascript
  // [MODIFY HERE 2]
  const [formData, setFormData] = useState({
    restaurantName: '',
    priceFrom: '',
    priceTo: '',
    address: '',
    ownerName: '',
    categoryId: '',
    openDate: ''
  });
  ```

* **Điểm 3 (Dòng 75 - Hàm validate bắt lỗi):**
  Đề bài yêu cầu điều kiện gì, viết đúng lệnh `if` gán thông báo lỗi vào `newErrors.<tên_trường>`:
  ```javascript
  // [MODIFY HERE 3]
  const validate = () => {
    const newErrors = {};

    // 1. Kiểm tra bắt buộc nhập (MS01)
    if (!formData.restaurantName.trim()) {
      newErrors.restaurantName = 'Restaurant name is required.';
    }

    // 2. Kiểm tra khoảng số (MS02)
    const pFrom = Number(formData.priceFrom);
    if (!formData.priceFrom) {
      newErrors.priceFrom = 'Price from is required.';
    } else if (pFrom <= 1000 || pFrom >= 1000000) {
      newErrors.priceFrom = 'Price from must be greater than 1000 and less than 1000000.';
    }

    // 3. Kiểm tra so sánh Price to > Price from
    const pTo = Number(formData.priceTo);
    if (!formData.priceTo) {
      newErrors.priceTo = 'Price to is required.';
    } else if (pTo <= 1000 || pTo >= 1000000) {
      newErrors.priceTo = 'Price to must be greater than 1000 and less than 1000000.';
    } else if (pTo <= pFrom) {
      newErrors.priceTo = 'Price to must be greater than "Price from"';
    }

    // 4. Ngày không được ở tương lai (MS11)
    if (!formData.openDate) {
      newErrors.openDate = 'Open Date is required.';
    } else {
      const d = new Date(formData.openDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (d > today) {
        newErrors.openDate = 'Open date must not be in the future.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  ```

* **Điểm 4 (Dòng 140 - Hàm handleSubmit gửi dữ liệu lên Backend):**
  Ép kiểu các trường số trước khi gọi `axiosClient.post`:
  ```javascript
  const payload = {
    restaurantName: formData.restaurantName.trim(),
    priceFrom: Number(formData.priceFrom),
    priceTo: Number(formData.priceTo),
    address: formData.address.trim(),
    ownerName: formData.ownerName.trim(),
    categoryId: Number(formData.categoryId),
    openDate: formData.openDate
  };
  await axiosClient.post(API_BASE, payload);
  ```

* **Điểm 5 (Dòng 200 trở đi - Giao diện Form):**
  Mỗi trường chỉ là một khối `<Form.Group>`:
  ```jsx
  <Col md={6}>
    <Form.Group controlId="restaurantName">
      <Form.Label className="fw-semibold">
        Restaurant Name <span className="text-danger">*</span>
      </Form.Label>
      <Form.Control
        type="text"
        name="restaurantName"
        value={formData.restaurantName}
        onChange={handleChange}
        isInvalid={!!errors.restaurantName}
      />
      <Form.Control.Feedback type="invalid">
        {errors.restaurantName}
      </Form.Control.Feedback>
    </Form.Group>
  </Col>
  ```

---

## 4. BẢNG TRA CỨU MÃ LỖI CHUẨN ĐỀ THI

| Mã | Nội dung thông báo mẫu | Đoạn code kiểm tra tương ứng |
| :--- | :--- | :--- |
| **MS01** | `<Field> is required.` | `if (!formData.name.trim()) newErrors.name = 'Name is required.';` |
| **MS02** | `<Field> must be between <Y> and <Z>.` | `if (num < min \|\| num > max) newErrors.val = '...';` |
| **MS03** | `The input value has an invalid date format.` | `if (isNaN(new Date(formData.date).getTime())) ...` |
| **MS04** | `Created new <entity> successfully.` | Hiện Alert xanh lá khi `POST` thành công. |
| **MS05** | `No records found.` | Hiển thị giữa bảng khi `items.length === 0`. |
| **MS06** | `Internal system error, please contact administrator.` | Hiện Alert đỏ khi API `catch(err)`. |
| **MS07** | `Email is invalid format.` | `if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ...` |
| **MS08** | `Deleted successfully.` | Hiện Alert xanh lá khi `DELETE` thành công. |
| **MS09** | `Phone must contain only digits (9-11 characters).` | `if (!/^\d{9,11}$/.test(phone)) ...` |
| **MS10** | `Employee must be at least 18 years old.` | Tính `age < 18` từ `dateOfBirth`. |
| **MS11** | `Start Date must not be in the future.` | `if (new Date(startDate) > new Date()) ...` |
| **MS12** | `<Field> already exists.` | Bắt khi backend trả về mã `409` hoặc `226`. |

---

## 5. XỬ LÝ ĐẶC BIỆT: PRICE FROM & PRICE TO

1. **Hiển thị ở bảng danh sách (Screen 1):**
   ```jsx
   <td>{item.priceFrom}-{item.priceTo}</td>
   ```
2. **Hiển thị ở trang chi tiết (Screen 3):**
   ```jsx
   <Col sm={8}>{item.priceFrom} – {item.priceTo}</Col>
   ```
3. **Kiểm tra ở Form thêm mới (Screen 4):**
   Bắt buộc ép kiểu `Number()` trước khi so sánh:
   ```javascript
   const from = Number(formData.priceFrom);
   const to = Number(formData.priceTo);
   if (to <= from) {
     newErrors.priceTo = 'Price to must be greater than "Price from"';
   }
   ```

---

## 6. QUY TẮC NỘP BÀI EOS (BẮT BUỘC)

> [!CAUTION]
> **Vi phạm bất kỳ mục nào dưới đây sẽ bị 0 điểm theo Quy chế thi:**

1. **Kiểm tra file `jsconfig.json`:**  
   Đảm bảo file `jsconfig.json` nằm ngay ở thư mục gốc của dự án với nội dung:
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
2. **Đổi tên thư mục dự án theo đúng cú pháp:**  
   `<TênLớp>_<MãSốSinhViên>_<MãĐề>_PE`  
   *Ví dụ:* `SE1910_HE180000_EMS_PE` (hoặc `RMS_PE`, `IMS_PE`).
3. **XÓA THƯ MỤC `node_modules`:**  
   Vào trong thư mục dự án, nhấn chọn thư mục `node_modules` và bấm **Delete** (Xóa vĩnh viễn).
4. **Nén file ZIP:**  
   Ra ngoài thư mục dự án, click chuột phải ➔ chọn **Send to** ➔ **Compressed (zipped) folder**.
5. **Nộp bài:**  
   Tải file `.zip` vừa tạo lên phần mềm EOS và ấn nút Submit.

---

## 7. CHECKLIST KIỂM TRA TRƯỚC KHI NỘP BÀI

Trước khi xóa `node_modules` và nén zip, hãy tự chấm điểm ứng dụng trên trình duyệt:

- [ ] **Header:** Tên hệ thống hiển thị đúng đề, ngày hiển thị dạng `yyyy-MM-dd`.
- [ ] **Footer:** Hiển thị đúng dòng chữ bản quyền trường FU.
- [ ] **Screen 1 (Search & Filter):** Gõ tên bấm Filter lọc được. Chọn dropdown bấm Filter lọc được.
- [ ] **Screen 1 (Phân trang):** Nếu dữ liệu <= 1 trang, thanh phân trang **phải tự động ẩn**.
- [ ] **Screen 2 (Xóa):** Bấm Delete hàng nào hiện đúng tên hàng đó trên Popup. Bấm Yes xóa được và hiện thông báo xanh `Deleted successfully.`.
- [ ] **Screen 3 (Chi tiết):** Bấm View mở đúng thông tin, bấm Back quay lại được.
- [ ] **Screen 4 (Validation):** Để trống bấm Save hiện chữ đỏ dưới các ô bắt buộc. Nhập dữ liệu hợp lệ bấm Save thêm thành công và hiện thông báo xanh.
- [ ] **Không có lỗi Console:** Bấm F12 kiểm tra không có lỗi đỏ nghiêm trọng trong tab Console.
- [ ] Đã xóa thư mục `node_modules` trước khi nén `.zip`.


---

## 8. GIẢI THÍCH CHUYÊN SÂU Ý NGHĨA VÀ TÁC DỤNG CỦA CÁC MỤC [MODIFY HERE]

### 1. `API_BASE` và `API_SECONDARY` (Trong ListPage, DetailPage, AddPage)
- **Ý nghĩa:** Địa chỉ URL endpoint của Spring Boot backend chạy cổng 8080.
- **Tác dụng:** Định tuyến các lệnh gọi HTTP GET, POST, DELETE đến đúng Controller bên Java.
- **Nếu sửa sai/quên sửa:** Trình duyệt nhận lỗi `404 Not Found` ➔ Bảng trắng tinh, không tải được dữ liệu, không thêm xóa được.

### 2. `ID_FIELD` (Trong ListPage)
- **Ý nghĩa:** Tên thuộc tính khóa chính duy nhất của đối tượng (ví dụ: `employeeId` hoặc `id`).
- **Tác dụng:** Dùng để định vị chính xác bản ghi cần View (`/view/${item[ID_FIELD]}`) và cần Delete (`DELETE /api/.../${item[ID_FIELD]}`).
- **Nếu sửa sai:** Biến ID sẽ thành `undefined` ➔ Bấm View URL thành `/view/undefined`, bấm Delete xóa nhầm URL thành `/api/.../undefined` ➔ Không hoạt động!

### 3. `params.departmentId = secId` (Trong ListPage)
- **Ý nghĩa:** Tên tham số query string gửi lên backend khi người dùng bấm Filter.
- **Tác dụng:** Khớp với biến `@RequestParam` bên Java Controller (ví dụ `departmentId` hoặc `categoryId`).
- **Nếu sửa sai:** Backend không nhận diện được tham số lọc ➔ Trả về toàn bộ danh sách mà không lọc được theo danh mục.

### 4. Dropdown option: `sec.departmentId` vs `sec.categoryId` (Trong ListPage & AddPage)
- **Ý nghĩa:** Thuộc tính ID và Name của danh mục phụ trong mảng trả về.
- **Tác dụng:** Cung cấp `value` (ID gửi đi) và `text` (chữ hiển thị cho người dùng đọc).
- **Nếu sửa sai:** Dropdown bị rỗng hoặc khi chọn giá trị gửi đi bị `undefined`.

### 5. `ENTITY_LABEL` (Trong DeleteConfirmModal)
- **Ý nghĩa:** Danh từ chỉ loại đối tượng hiển thị trong câu hỏi xác nhận xóa.
- **Tác dụng:** Khớp chính xác câu hỏi trong Screen 2 mockup: `Are you sure you want to delete <entity> "<Name>"?`.

### 6. `formData` và `validate()` (Trong AddPage)
- **Ý nghĩa:** `formData` là state lưu giá trị người dùng gõ; `validate()` là hàm kiểm tra lỗi client-side.
- **Tác dụng:** Kiểm tra điều kiện đề bài đưa ra (bắt buộc, email, phone, tuổi 18, không tương lai, min-max). Nếu sai sẽ viền đỏ và in câu lỗi chữ đỏ ngay dưới ô nhập.
- **Nếu sửa sai/bỏ qua:** Người dùng nhập bừa bãi vẫn lưu được ➔ Mất 3.5 - 4.0 điểm phần Form Validation.

### 7. Ép kiểu `Number(...)` trong `handleSubmit` (Trong AddPage)
- **Ý nghĩa:** Chuyển đổi chuỗi ký tự từ input HTML thành số thực/số nguyên trước khi đóng gói JSON gửi lên server.
- **Tác dụng:** Khớp với kiểu dữ liệu `Long`, `Integer`, `Float` của Java DTO bên Spring Boot.
- **Nếu quên ép kiểu:** Backend Spring Boot trả về lỗi `400 Bad Request / Type Mismatch` ➔ Thêm mới thất bại.

### 8. 🚨 [CỰC KỲ NGUY HIỂM] Khớp trường Phân trang: `data.currentPage` vs `data.pageNumber` (Trong ListPage)
- **Ý nghĩa:** Tên thuộc tính số trang hiện tại mà DTO của Backend trả về (`PageResponse.java` hoặc `PageDTO.java`).
- **Tác dụng:** Cập nhật trang hiện tại vào state `currentPage` để UI highlight đúng nút trang (Trang 1, 2, 3...) và tính đúng số thứ tự STT.
- **Nếu đặt sai (ví dụ code đọc `data.pageNumber` nhưng backend trả về `currentPage`):**
  - Biến sẽ thành `undefined` ➔ `data.pageNumber || 0` luôn trả về `0`.
  - **Hậu quả:** Người dùng bấm sang Trang 2, nhưng state lập tức bị reset về Trang 0 ➔ **Nút Trang 2 không bao giờ sáng, giao diện vẫn báo `Page 1 / 2`, STT vẫn từ 1-5, nút Prev luôn bị disable!**
- **Giải pháp an toàn tuyệt đối:**
  ```javascript
  const pageIndex = data.currentPage ?? data.pageNumber ?? data.number ?? 0;
  setCurrentPage(pageIndex);
  ```

### 9. 🚨 [BẪY ĐỀ THI] Endpoint tìm kiếm riêng biệt (`/search` vs `/`)
- **Ý nghĩa:** Có những đề PE, Backend viết Controller tách riêng 2 endpoint:
  - `GET /api/shoes`: Chỉ lấy tất cả (hardcode `null, null` cho tìm kiếm, bỏ qua query params).
  - `GET /api/shoes/search`: Mới thực sự nhận `@RequestParam` tìm kiếm và lọc.
- **Cách phòng tránh:** Mở ngay file Controller Java tương ứng (ví dụ `ShoesController.java`), tìm đến phương thức `@GetMapping` để xem method nào nhận `@RequestParam(required = false) String name`. Nếu nó nằm ở `/search` thì gọi endpoint `/search`!

### 10. 🚨 [BẪY ĐỀ THI] Filter Category theo ID hay theo Tên chuỗi (Name)?
- **Ý nghĩa:** Kiểm tra xem Backend lọc theo kiểu dữ liệu gì:
  - Nếu Controller nhận `@RequestParam Long categoryId` hoặc service gọi `findByCategoryId(...)`: Phải gửi ID (`<option value={sec.categoryId}>`).
  - Nếu Controller nhận `@RequestParam String category` hoặc service gọi `findByCategoryCategoryNameContainingIgnoreCase(...)`: Phải gửi TÊN (`<option value={sec.categoryName}>`).
- **Nếu gửi nhầm ID cho method tìm kiếm theo Tên:** Backend sẽ tìm danh mục có tên chứa `"1"`, kết quả trả về rỗng (`No records found`).


---

## 9. HƯỚNG DẪN XÓA / TẮT BỚT CÁC CHỨC NĂNG CRUD (NẾU ĐỀ KHÔNG YÊU CẦU)

Tất cả các vị trí có thể tắt/xóa đều đã được đánh dấu bằng tag:  
👉 `[OPTIONAL - REMOVE IF EXAM DOES NOT REQUIRE...]` trong mã nguồn.

### 1. Nếu đề KHÔNG CÓ chức năng Update (Chỉnh sửa)
Đề bài chỉ yêu cầu Xem danh sách, Thêm mới và Xóa, không có nút Edit:
1. **Trong `src/pages/ListPage.jsx` (Dòng 325):** Xóa chữ Edit và dấu gạch đứng:
   ```jsx
   <span className="action-link me-2 ms-2" onClick={() => navigate(`/edit/${id}`)}>Edit</span>
   <span className="text-muted">|</span>
   ```
2. **Trong `src/App.jsx` (Dòng 30):** Xóa dòng Route:
   ```jsx
   <Route path="/edit/:id" element={<EditPage />} />
   ```

### 2. Nếu đề KHÔNG CÓ chức năng View (Xem chi tiết)
1. **Trong `src/pages/ListPage.jsx` (Dòng 318):** Xóa chữ View và dấu gạch đứng:
   ```jsx
   <span className="action-link me-2" onClick={() => navigate(`/view/${id}`)}>View</span>
   <span className="text-muted">|</span>
   ```
2. **Trong `src/App.jsx` (Dòng 20):** Xóa dòng Route:
   ```jsx
   <Route path="/view/:id" element={<DetailPage />} />
   ```

### 3. Nếu đề KHÔNG CÓ chức năng Add New (Thêm mới)
1. **Trong `src/pages/ListPage.jsx` (Dòng 235):** Xóa khối thẻ nút `+ Add New`:
   ```jsx
   <Col md={3} sm={6} className="text-md-end">
     <Button variant="success" onClick={() => navigate('/add')}>+ Add New</Button>
   </Col>
   ```
2. **Trong `src/App.jsx` (Dòng 25):** Xóa dòng Route:
   ```jsx
   <Route path="/add" element={<AddPage />} />
   ```

### 4. Nếu đề KHÔNG CÓ chức năng Delete (Xóa)
1. **Trong `src/pages/ListPage.jsx` (Dòng 335):** Xóa chữ Delete ở cột Action:
   ```jsx
   <span className="action-link-danger ms-2" onClick={() => handleOpenDelete(item)}>Delete</span>
   ```
2. **Trong `src/pages/ListPage.jsx` (Dòng 385):** Xóa thẻ popup `<DeleteConfirmModal ... />` ở cuối file.
