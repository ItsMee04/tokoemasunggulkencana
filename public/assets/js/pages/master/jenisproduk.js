$(document).ready(function () {
    // Inisialisasi tooltip Bootstrap
    function initializeTooltip() {
        $('[data-bs-toggle="tooltip"]').tooltip();
    }

    //function refresh
    $(document).on("click", "#refreshButton", function () {
        if (tableJenis) {
            tableJenis.ajax.reload(null, false); // Reload data dari server
        }
        showToastSuccess("Data Jenis Produk Berhasil Direfresh")
    });

    //load data pegawai
    function getJenisProduk() {
        // Datatable
        if ($('#jenisProdukTable').length > 0) {
            tableJenis = $('#jenisProdukTable').DataTable({
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
                    url: `/api/jenisproduk/getJenisProduk`, // Ganti dengan URL endpoint server Anda
                    type: 'GET', // Metode HTTP (GET/POST)
                    dataSrc: 'Data', // Jalur data di response JSON
                    beforeSend: function (xhr) {
                        const token = localStorage.getItem('token');
                        if (token) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                        }
                    },
                    error: function (xhr) {
                        const msg = xhr.responseJSON?.message || 'Gagal mengambil data jenis produk';
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
                        data: "image_jenis_produk", // Nama field dari API
                        render: function (data, type, row) {
                            let timestamp = new Date().getTime(); // Gunakan timestamp untuk cache busting
                            return `
                            <div class="d-flex align-items-center">
                                <a href="javascript:void(0);" class="avatar avatar-sm me-2">
                                    <img src="/storage/icon/${data}?t=${timestamp}" alt="user">
                                </a>
                                <a href="javascript:void(0);">${row.jenis_produk}</a>
                            </div>
                        `;
                        },
                        orderable: false,
                        searchable: false
                    },
                    {
                        data: 'status',
                        render: function (data, type, row) {
                            // Menampilkan badge sesuai dengan status
                            if (data == 1) {
                                return `<span class="badge bg-success fw-medium fs-10"><b>ACTIVE</b></span>`;
                            } else if (data == 2) {
                                return `<span class="badge bg-danger fw-medium fs-10"><b>IN ACTIVE</b></span>`;
                            } else {
                                return `<span class="badge bg-secondary fw-medium fs-10"><b>UNKNOWN</b></span>`;
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
                                <a class="me-2 p-2 btn-edit" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="EDIT DATA">
                                    <i data-feather="edit" class="feather-edit"></i>
                                </a>
                                <a class="confirm-text p-2" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="HAPUS DATA">
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

    getJenisProduk();

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
                img.style.width = "100%";
                img.style.height = "100%";
                img.style.objectFit = "cover"; // Agar rapi dalam div
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

    //ketika button tambah di tekan
    $("#btnTambahJenisProduk").on("click", function () {
        // Panggil fungsi untuk setiap input gambar
        uploadImage("imageJenisProduk", "imageJenisProdukPreview");
        $("#mdTambahJenisProduk").modal("show");
    });

    // Ketika modal ditutup, reset semua field
    $("#mdTambahJenisProduk").on("hidden.bs.modal", function () {
        // Reset form input (termasuk gambar dan status)
        $("#formTambahJenisProduk")[0].reset();
        $("#imageJenisProdukPreview").empty();
    });

    // Fungsi untuk menangani submit form jenis produk
    $("#formTambahJenisProduk").on("submit", function (event) {
        event.preventDefault(); // Mencegah form submit secara default
        // Ambil elemen input file
        const fileInput = $("#imageJenisProduk")[0];
        const file = fileInput.files[0];
        const token = localStorage.getItem('token');
        // Buat objek FormData
        const formData = new FormData(this);
        formData.delete("imageJenisProduk"); // Hapus field 'image' bawaan form
        formData.append("imageJenisProduk", file); // Tambahkan file baru
        $.ajax({
            url: "/api/jenisproduk/storeJenisProduk", // Endpoint Laravel untuk menyimpan jenis produk
            type: "POST",
            data: formData,
            processData: false, // Agar data tidak diubah menjadi string
            contentType: false, // Agar header Content-Type otomatis disesuaikan
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                showToastSuccess(response.message)
                $("#mdTambahJenisProduk").modal("hide"); // Tutup modal
                tableJenis.ajax.reload(null, false);
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

    //ketika button edit di tekan
    $(document).on("click", ".btn-edit", function () {
        const jenisprodukID = $(this).data("id");
        const token = localStorage.getItem('token');
        $.ajax({
            url: `/api/jenisproduk/getJenisProdukByID/${jenisprodukID}`, // Endpoint untuk mendapatkan data pegawai
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                editUploadImage("editImageJenisProduk", "editImageJenisProdukPreview");
                // Ambil data pertama
                let data = response.Data[0];

                // Isi modal dengan data pegawai
                $("#editid").val(data.id);
                $("#editjenisproduk").val(data.jenis_produk);

                // Update preview gambar dengan background-image
                let imageSrc = data.image_jenis_produk
                    ? `/storage/icon/${data.image_jenis_produk}`
                    : `/assets/img/notfound.png`;

                $("#editImageJenisProdukPreview").css({
                    "background-image": `url('${imageSrc}')`,
                    "background-size": "cover",
                    "background-position": "center",
                });

                // Tampilkan modal edit
                $("#mdEditJenisProduk").modal("show");
            },
            error: function () {
                showToastError("Tidak dapat memproses permintaan. Silakan coba lagi")
            },
        });
    });

    // Ketika modal ditutup, reset semua field
    $("#mdEditJenisProduk").on("hidden.bs.modal", function () {
        // Reset form input (termasuk gambar dan status)
        $("#formEditJenisProduk")[0].reset();
        $("#editImageJenisProdukPreview").empty();
    });

    //kirim data ke server <i class=""></i>
    $("#formEditJenisProduk").on("submit", function (event) {
        event.preventDefault(); // Mencegah form submit secara default

        // Buat objek FormData
        const formData = new FormData(this);
        // Ambil ID dari form
        const idJenisProduk = formData.get("id"); // Mengambil nilai input dengan name="id"
        const token = localStorage.getItem('token');
        $.ajax({
            url: `/api/jenisproduk/updateJenisProduk/${idJenisProduk}`, // Endpoint Laravel untuk menyimpan pegawai
            type: "POST",
            data: formData,
            processData: false, // Agar data tidak diubah menjadi string
            contentType: false, // Agar header Content-Type otomatis disesuaikan
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                showToastSuccess(response.message)
                $("#mdEditJenisProduk").modal("hide"); // Tutup modal
                tableJenis.ajax.reload(null, false);
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
            text: "Data ini akan dihapus!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                // Kirim permintaan hapus (gunakan itemId)
                fetch(`/api/jenisproduk/deleteJenisProduk/${deleteID}`, {
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
                                tableJenis.ajax.reload(null, false);
                            } else {
                                showToastError(data.message || "Terjadi kesalahan saat menghapus data.");
                            }
                        });
                    })
                    .catch((error) => {
                        showToastError("Terjadi kesalahan dalam penghapusan data.");
                    });
            } else {
                // Jika batal, beri tahu pengguna
                showToastError("Dibatalkan, Data tidak dihapus.");
            }
        });
    });
})