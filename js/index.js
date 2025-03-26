const KEY_LOCAL = "arrSinhVien";
let arrNhanVien = getDataNhanVienLocal();
let searchKeyword = "";
// console.log(arrNhanVien);
renderListNhanVien();

// Lấy dữ liệu từ form nhờ thuộc tính name của các thẻ trong form
function layDataForm(form) {
    let formData = new FormData(form);
    return Object.fromEntries(formData);
}

// Thêm nhân viên
document.getElementById("btnThemNV").onclick = function (e) {
    let formDataNhanVien = document.getElementById("formDataNhanVien");
    let nhanVien = layDataForm(formDataNhanVien);
    // console.log(nhanVien);
    arrNhanVien.push(nhanVien);
    // console.log(arrNhanVien);
    saveDataNhanVienLocal();
    renderListNhanVien();
    resetDataForm();
};

// Lưu data vào Local storage
function saveDataNhanVienLocal() {
    let dataString = JSON.stringify(arrNhanVien);
    // console.log(dataString);
    localStorage.setItem(KEY_LOCAL, dataString);
}

// Lấy data từ Local storage
function getDataNhanVienLocal() {
    let dataLocal = localStorage.getItem(KEY_LOCAL);
    // console.log(dataLocal);
    return dataLocal ? JSON.parse(dataLocal) : [];
}

// reset form (ẩn model)
function resetDataForm() {
    $("#myModal").modal("hide");
}

// Hiển thị danh sách nhân viên
function renderListNhanVien(arr = arrNhanVien) {
    if (searchKeyword) {
        arr = arrNhanVien.filter((item) => {
            let loaiNhanVien = removeVietnameseTones(xepLoaiNhanVien(item.gioLam).toLowerCase());
            return loaiNhanVien.includes(searchKeyword);
        });
    }

    let content = "";
    for (const nhanVien of arr) {
        let { tk, name, email, password, ngayLam, luongCB, chucVu, gioLam } = nhanVien;
        content += `<tr>
										<td>${tk}</td>
										<td>${name}</td>
										<td>${email}</td>
										<td>${ngayLam}</td>
										<td>${chucVu}</td>
										<td>${tinhTongLuong(luongCB, chucVu, gioLam)}</td>
										<td>${xepLoaiNhanVien(gioLam)}</td>
                                        <td>
                                            <button type="button" class="btn btn-warning" onclick="layThongTinNhanVien('${tk}')">Sửa</button>
                                            <button type="button" class="btn btn-danger" onclick="xoaNhanVien('${tk}')">Xoá</button>
                                        </td>
									</tr>`;
    }
    document.getElementById("tableDanhSach").innerHTML = content;
}

// Tính lương nhân viên
function tinhTongLuong(luongCB, chucVu, gioLam) {
    let tongLuong = 0;
    switch (chucVu) {
        case "Sếp":
            tongLuong = luongCB * 3 * gioLam;
            break;
        case "Trưởng phòng":
            tongLuong = luongCB * 2 * gioLam;
            break;
        default:
            tongLuong = luongCB * gioLam;
            break;
    }
    return tongLuong.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

// xếp loại nhân viên:
function xepLoaiNhanVien(gioLam) {
    let loaiNhanVien = "";
    if (gioLam >= 192) {
        return (loaiNhanVien = "Xuất sắc");
    } else if (gioLam >= 176) {
        return (loaiNhanVien = "Giỏi");
    } else if (gioLam >= 160) {
        return (loaiNhanVien = "Khá");
    } else {
        return (loaiNhanVien = "Trung bình");
    }
}

// Xoá nhân viên
function xoaNhanVien(tk) {
    let viTri = arrNhanVien.findIndex((item, index) => {
        return item.tk === tk;
    });

    if (viTri != -1) {
        arrNhanVien.splice(viTri, 1);
        saveDataNhanVienLocal();
        renderListNhanVien();
    }
}

// Lấy thông tin sinh viên
function layThongTinNhanVien(tk) {
    $("#myModal").modal("show");
    let nhanVien = arrNhanVien.find((item, index) => {
        return item.tk === tk;
    });
    if (nhanVien) {
        // console.log(nhanVien);
        let arrField = document.querySelectorAll("#formDataNhanVien input, #formDataNhanVien select");
        for (const field of arrField) {
            // console.log(field);
            let { name } = field;
            field.value = nhanVien[name];

            if (name === "tk") {
                field.readOnly = true;
            }
        }
        document.getElementById("btnThemNV").disabled = true;
    }
}

// Cập nhật thông tin nhân viên
document.getElementById("btnCapNhat").onclick = updateNhanVien;
function updateNhanVien() {
    let formDataNhanVien = document.getElementById("formDataNhanVien");
    let nhanVien = layDataForm(formDataNhanVien);

    let viTri = arrNhanVien.findIndex((item, index) => {
        return item.tk === nhanVien.tk;
    });

    if (viTri != -1) {
        arrNhanVien[viTri] = nhanVien;
        saveDataNhanVienLocal();
        renderListNhanVien();
        resetDataForm();
    }
}

// Model ẩn thì đặt lại toàn bộ dữ liệu trên form
$("#myModal").on("hidden.bs.modal", function () {
    document.getElementById("formDataNhanVien").reset();
    document.getElementById("btnThemNV").disabled = false;
    document.getElementById("tknv").readOnly = false;
});

// Search nhân viên
document.getElementById("btnTimNV").addEventListener("click", function (e) {
    // Lấy giá trị của input searchName
    searchKeyword = removeVietnameseTones(document.getElementById("searchName").value.toLowerCase());
    // console.log(searchKeyword);

    let arrField = arrNhanVien.filter((item) => {
        let loaiNhanVien = removeVietnameseTones(xepLoaiNhanVien(item.gioLam).toLowerCase());
        // console.log(loaiNhanVien);
        return loaiNhanVien.includes(searchKeyword);
    });
    // console.log(arrField);
    renderListNhanVien(arrField);
});

document.getElementById("resetSearch").onclick = function () {
    document.getElementById("searchName").value = "";
    searchKeyword = "";
    renderListNhanVien();
};
