$(document).ready(function () {
    // Inisialisasi tooltip Bootstrap
    function initializeTooltip() {
        $('[data-bs-toggle="tooltip"]').tooltip();
    }

    //function refresh
    $(document).on("click", "#refreshButton", function () {
        if (tablePegawai) {
            tablePegawai.ajax.reload(null, false); // Reload data dari server
        }
        showToastSuccess("Data Pegawai Berhasil Direfresh")
    });

    //load data pegawai
    function getPegawai() {
        // Datatable
        if ($('#pegawaiTable').length > 0) {
            tablePegawai = $('#pegawaiTable').DataTable({
                "scrollX": false, // Jangan aktifkan scroll horizontal secara paksa
                "bFilter": true,
                "sDom": 'fBtlpi',
                "ordering": true,
                "language": {
                    search: ' ',
                    sLengthMenu: '_MENU_',
                    searchPlaceholder: "Search",
                    info: "_START_ - _END_ of _TOTAL_ items",
                    paginate: {
                        next: ' <i class=" fa fa-angle-right"></i>',
                        previous: '<i class="fa fa-angle-left"></i> '
                    },
                },
                ajax: {
                    url: `/api/pegawai/getPegawai`, // Ganti dengan URL endpoint server Anda
                    type: 'GET', // Metode HTTP (GET/POST)
                    dataSrc: 'Data', // Jalur data di response JSON
                    beforeSend: function (xhr) {
                        const token = localStorage.getItem('token');
                        if (token) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                        }
                    },
                    error: function (xhr) {
                        const msg = xhr.responseJSON?.message || 'Gagal mengambil data pegawai';
                        showToastError(msg);
                    }
                },
                columns: [
                    {
                        data: null, // Kolom nomor urut
                        render: function (data, type, row, meta) {
                            return meta.row + 1; // Nomor urut dimulai dari 1
                        },
                        orderable: false,
                    },
                    {
                        data: "nip",
                    },
                    {
                        data: "image_pegawai", // Nama field dari API
                        render: function (data, type, row) {
                            let timestamp = new Date().getTime(); // Gunakan timestamp untuk cache busting
                            return `
                            <div class="d-flex align-items-center">
                                <a href="javascript:void(0);" class="avatar avatar-sm me-2">
                                    <img src="/storage/avatar/${data}?t=${timestamp}" alt="user">
                                </a>
                                <a href="javascript:void(0);">${row.nama}</a>
                            </div>
                        `;
                        },
                        orderable: false,
                        searchable: false
                    },
                    {
                        data: "jabatan.jabatan",
                    },
                    {
                        data: 'status',
                        render: function (data, type, row) {
                            // Menampilkan badge sesuai dengan status
                            if (data == 1) {
                                return `<span class="badge bg-success fw-medium fs-10">ACTIVE</span>`;
                            } else if (data == 2) {
                                return `<span class="badge bg-danger fw-medium fs-10">IN ACTIVE</span>`;
                            } else {
                                return `<span class="badge bg-secondary fw-medium fs-10">UNKNOWN</span>`;
                            }
                        }
                    },
                    {
                        data: null,        // Kolom aksi
                        orderable: false,  // Aksi tidak perlu diurutkan
                        className: "action-table-data",
                        render: function (data, type, row, meta) {
                            return `
                            <div class="edit-delete-action">
                                <a class="me-2 p-2 btn-edit" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit Data">
                                    <i data-feather="edit" class="feather-edit"></i>
                                </a>
                                <a class="confirm-text p-2" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Hapus Data">
                                    <i data-feather="trash-2" class="feather-trash-2"></i>
                                </a>
                            </div>
                        `;
                        }
                    }
                ],
                initComplete: (settings, json) => {
                    $('.dataTables_filter').appendTo('#tableSearch');
                    $('.dataTables_filter').appendTo('.search-input');
                },
                drawCallback: function () {
                    // Re-inisialisasi Feather Icons setelah render ulang DataTable
                    feather.replace();
                    // Re-inisialisasi tooltip Bootstrap setelah render ulang DataTable
                    initializeTooltip();
                }
            });
        }
    }

    getPegawai();

    function uploadImage(inputId, previewId) {
        const inputFile = document.getElementById(inputId);
        const previewContainer = document.getElementById(previewId);

        inputFile.addEventListener("change", () => {
            const file = inputFile.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                previewContainer.innerHTML = "";
                const img = document.createElement("img");
                img.src = reader.result;
                previewContainer.appendChild(img);
            };

            reader.readAsDataURL(file);
        });
    }

    function editUploadImage(inputId, previewId) {
        const inputFile = document.getElementById(inputId);
        const previewContainer = $("#" + previewId); // Gunakan jQuery

        inputFile.addEventListener("change", () => {
            const file = inputFile.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                // Hapus background image
                previewContainer.css("background-image", "");

                // Masukkan gambar ke dalam preview div
                previewContainer.html(""); // Hapus isi sebelumnya
                const img = document.createElement("img");
                img.src = reader.result;
                img.style.width = "100%";
                img.style.height = "100%";
                img.style.objectFit = "cover"; // Agar rapi dalam div
                previewContainer.append(img);
            };

            reader.readAsDataURL(file);
        });
    }


    // Fungsi untuk memuat data jabatan
    function loadJabatan() {
        const token = localStorage.getItem('token');
        $.ajax({
            url: "/api/jabatan/getJabatan", // Endpoint untuk mendapatkan data jabatan
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                let options
                response.Data.forEach((item) => {
                    options += `<option value="${item.id}">${item.jabatan}</option>`;
                });
                $("#jabatan").html(options); // Masukkan data ke select
            },
            error: function () {
                showToastError("Tidak dapat mengambil data jabatan");
            },
        });
    }

    //ketika button tambah di tekan
    $("#btnTambahPegawai").on("click", function () {
        // Panggil fungsi untuk setiap input gambar
        uploadImage("imagePegawai", "imagePegawaiPreview");
        loadJabatan();
        $("#mdTambahPegawai").modal("show");
    });

    // Ketika modal ditutup, reset semua field
    $("#mdTambahPegawai").on("hidden.bs.modal", function () {
        // Reset form input (termasuk gambar dan status)
        $("#formTambahPegawai")[0].reset();
        $("#imagePegawaiPreview").empty();
    });

    // Fungsi untuk menangani submit form pegawai
    $("#formTambahPegawai").on("submit", function (event) {
        event.preventDefault(); // Mencegah form submit secara default
        // Ambil elemen input file
        const token = localStorage.getItem('token');
        const fileInput = $("#imagePegawai")[0];
        const file = fileInput.files[0];

        // Buat objek FormData
        const formData = new FormData(this);
        formData.delete("imagePegawai"); // Hapus field 'image' bawaan form
        formData.append("imagePegawai", file); // Tambahkan file baru
        $.ajax({
            url: "/api/pegawai/storePegawai", // Endpoint Laravel untuk menyimpan pegawai
            type: "POST",
            data: formData,
            processData: false, // Agar data tidak diubah menjadi string
            contentType: false, // Agar header Content-Type otomatis disesuaikan
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                showToastSuccess(response.message)
                $("#mdTambahPegawai").modal("hide"); // Tutup modal
                tablePegawai.ajax.reload(null, false);
            },
            error: function (xhr) {
                if (xhr.responseJSON && xhr.responseJSON.errors) {
                    const errors = xhr.responseJSON.errors;
                    let errorList = "<ul style='text-align: left; padding-left: 20px;'>";

                    for (let key in errors) {
                        if (errors.hasOwnProperty(key)) {
                            errorList += `<li><span class="text-danger ms-1">* ${errors[key][0]}</span></li>`;
                        }
                    }

                    errorList += "</ul>";

                    showToastError(errorList)

                } else if (xhr.responseJSON && xhr.responseJSON.message) {
                    showToastError(xhr.responseJSON.message);

                } else {
                    const message = xhr.responseJSON?.message || "Terjadi kesalahan saat memproses permintaan.";
                    showToastError(message)
                }
            },
        });
    });

    //ketika button edit di tekan
    $(document).on("click", ".btn-edit", function () {
        const pegawaiID = $(this).data("id");
        const token = localStorage.getItem('token');
        $.ajax({
            url: `/api/pegawai/getPegawaiByID/${pegawaiID}`, // Endpoint untuk mendapatkan data pegawai
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                editUploadImage("editimagePegawai", "editimagePegawaiPreview");
                // Ambil data pertama
                let data = response.Data[0];

                // Isi modal dengan data pegawai
                $("#editnip").val(data.nip);
                $("#editnama").val(data.nama);
                $("#editalamat").val(data.alamat);
                $("#editkontak").val(data.kontak);
                // Muat opsi jabatan
                $.ajax({
                    url: "/api/jabatan/getJabatan",
                    type: "GET",
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    success: function (jabatanResponse) {
                        let options
                        jabatanResponse.Data.forEach((item) => {
                            const selected =
                                item.id === data.jabatan_id
                                    ? "selected"
                                    : "";
                            options += `<option value="${item.id}" ${selected}>${item.jabatan}</option>`;
                        });
                        $("#editjabatan").html(options);
                    },
                });

                // Update preview gambar dengan background-image
                let imageSrc = data.image_pegawai
                    ? `/storage/avatar/${data.image_pegawai}`
                    : `/assets/img/notfound.png`;

                $("#editimagePegawaiPreview").css({
                    "background-image": `url('${imageSrc}')`,
                    "background-size": "cover",
                    "background-position": "center",
                });

                // Tampilkan modal edit
                $("#mdEditPegawai").modal("show");
            },
            error: function () {
                showToastError("Tidak dapat mengambil data jabatan.")
            },
        });
    });

    // Ketika modal ditutup, reset semua field
    $("#mdEditPegawai").on("hidden.bs.modal", function () {
        // Reset form input (termasuk gambar dan status)
        $("#formEditPegawai")[0].reset();
        $("#editimagePegawaiPreview").empty();
    });

    //kirim data ke server <i class=""></i>
    $("#formEditPegawai").on("submit", function (event) {
        event.preventDefault(); // Mencegah form submit secara default
        const token = localStorage.getItem('token');
        // Buat objek FormData
        const formData = new FormData(this);
        // Ambil ID dari form
        const nipPegawai = formData.get("nip"); // Mengambil nilai input dengan name="id"

        $.ajax({
            url: `/api/pegawai/updatePegawai/${nipPegawai}`, // Endpoint Laravel untuk menyimpan pegawai
            type: "POST",
            data: formData,
            processData: false, // Agar data tidak diubah menjadi string
            contentType: false, // Agar header Content-Type otomatis disesuaikan
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                showToastSuccess(response.message)
                $("#mdEditPegawai").modal("hide"); // Tutup modal
                tablePegawai.ajax.reload(null, false);
            },
            error: function (xhr) {
                if (xhr.responseJSON && xhr.responseJSON.errors) {
                    const errors = xhr.responseJSON.errors;
                    let errorList = "<ul style='text-align: left; padding-left: 20px;'>";

                    for (let key in errors) {
                        if (errors.hasOwnProperty(key)) {
                            errorList += `<li><span class="text-danger ms-1">* ${errors[key][0]}</span></li>`;
                        }
                    }

                    errorList += "</ul>";
                    showToastError(errorList)
                } else if (xhr.responseJSON && xhr.responseJSON.message) {
                    showToastError(xhr.responseJSON.message)
                } else {
                    showToastError("Tidak dapat memproses permintaan. Silakan coba lagi")
                }
            },
        });
    });

    // ketika button hapus di tekan
    $(document).on("click", ".confirm-text", function () {
        const deleteID = $(this).data("id");
        const token = localStorage.getItem('token');
        // SweetAlert2 untuk konfirmasi
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data ini akan dihapus !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                // Kirim permintaan hapus (gunakan itemId)
                fetch(`/api/pegawai/deletePegawai/${deleteID}`, {
                    method: "DELETE",
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                })
                    .then((response) => {
                        return response.json().then((data) => {
                            if (response.ok) {
                                showToastSuccess(data.message || "Data berhasil dihapus.");
                                // Reload DataTables (misal pakai tableJabatan)
                                tablePegawai.ajax.reload(null, false);
                            } else {
                                showToastError(data.message || "Terjadi kesalahan saat menghapus data.");
                            }
                        });
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        showToastError("Terjadi kesalahan dalam penghapusan data.");
                    });
            } else {
                // Jika batal, beri tahu pengguna
                showToastError("Dibatalkan, Data tidak dihapus.");
            }
        });
    });
})