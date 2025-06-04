$(document).ready(function () {
    // Inisialisasi tooltip Bootstrap
    function initializeTooltip() {
        $('[data-bs-toggle="tooltip"]').tooltip();
    }

    //function refresh
    $(document).on("click", "#refreshButton", function () {
        if (tableNampan) {
            tableNampan.ajax.reload(null, false); // Reload data dari server
        }
        showToastSuccess("Data Nampan Berhasil Direfresh")
    });

    //load data nampan
    function getNampan() {
        // Datatable
        if ($('#nampanTable').length > 0) {
            tableNampan = $('#nampanTable').DataTable({
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
                    url: `/api/nampan/getNampan`, // Ganti dengan URL endpoint server Anda
                    type: 'GET', // Metode HTTP (GET/POST)
                    dataSrc: 'Data', // Jalur data di response JSON
                    beforeSend: function (xhr) {
                        const token = localStorage.getItem('token');
                        if (token) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                        }
                    },
                    error: function (xhr) {
                        const msg = xhr.responseJSON?.message || 'Gagal mengambil data nampan';
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
                        data: "nampan",
                    },
                    {
                        data: "jenis_produk.jenis_produk",
                    },
                    {
                        data: 'status',
                        render: function (data, type, row) {
                            // Menampilkan badge sesuai dengan status
                            if (data == 1) {
                                return `<span class="badge bg-success fw-medium fs-10"><b>NAMPAN AKTIF</b></span>`;
                            } else if (data == 2) {
                                return `<span class="badge bg-danger fw-medium fs-10"><b>TUTUP NAMPAN</b></span>`;
                            } else {
                                return `<span class="badge bg-secondary fw-medium fs-10"><b>DIHAPUS</b></span>`;
                            }
                        }
                    },
                    {
                        data: 'status_final',        // Kolom aksi
                        orderable: false,  // Aksi tidak perlu diurutkan
                        className: "action-table-data",
                        render: function (data, type, row, meta) {
                            if (data == 1) {
                                return `
                                    <div class="edit-delete-action">
                                        <a class="me-2 edit-icon p-2 btn-detail" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="DETAIL DATA">
                                            <i data-feather="eye" class="action-eye"></i>
                                        </a>
                                        <a class="me-2 p-2 btn-edit" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="EDIT DATA">
                                            <i data-feather="edit" class="feather-edit"></i>
                                        </a>
                                        <a class="me-2 final-nampan p-2" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="FINAL NAMPAN">
                                            <i data-feather="check" class="feather-print"></i>
                                        </a>
                                    </div>
                                `;
                            } else {
                                return `
                                    <div class="edit-delete-action">
                                        <a class="me-2 edit-icon p-2 btn-detail" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="DETAIL DATA">
                                            <i data-feather="eye" class="action-eye"></i>
                                        </a>
                                        <a class="tutup-nampan p-2" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="TUTUP NAMPAN">
                                            <i data-feather="x-square" class="feather-trash-2"></i>
                                        </a>
                                    </div>
                                `;
                            }
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

    //panggul function getKondisi
    getNampan();

    //ketika button tambah di tekan
    $("#btnTambahNampan").on("click", function () {
        const token = localStorage.getItem('token');
        $.ajax({
            url: "/api/jenisproduk/getJenisProduk", // Endpoint untuk mendapatkan data jabatan
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                let options
                response.Data.forEach((item) => {
                    options += `<option value="${item.id}">${item.jenis_produk}</option>`;
                });
                $("#jenisProduk").html(options); // Masukkan data ke select
            },
            error: function () {
                showToastError("Tidak dapat mengambil data jenis produk")
            },
        });
        $("#mdTambahNampan").modal("show");
    });

    //ketika submit form tambah nampan
    $("#formTambahNampan").on("submit", function (event) {
        event.preventDefault(); // Mencegah form submit secara default
        // Ambil elemen input file
        const token = localStorage.getItem('token');
        // Buat objek FormData
        const formData = new FormData(this);
        $.ajax({
            url: "/api/nampan/storeNampan", // Endpoint Laravel untuk menyimpan pegawai
            type: "POST",
            data: formData,
            processData: false, // Agar data tidak diubah menjadi string
            contentType: false, // Agar header Content-Type otomatis disesuaikan
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                showToastSuccess(response.message)
                $("#mdTambahNampan").modal("hide"); // Tutup modal
                tableNampan.ajax.reload(null, false); // Reload data dari server
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
                    showToastSuccess(errorList)
                } else if (xhr.responseJSON && xhr.responseJSON.message) {
                    showToastError(xhr.responseJSON.message)
                } else {
                    showToastError("Tidak dapat memproses permintaan. Silakan coba lagi")
                }
            },
        });
    });

    // Ketika modal ditutup, reset semua field
    $("#mdTambahNampan").on("hidden.bs.modal", function () {
        // Reset form input (termasuk gambar dan status)
        $("#formTambahNampan")[0].reset();
    });

    //ketika button edit di tekan
    $(document).on("click", ".btn-edit", function () {
        const nampanID = $(this).data("id");
        const token = localStorage.getItem('token');
        $.ajax({
            url: `/api/nampan/getNampanByID/${nampanID}`, // Endpoint untuk mendapatkan data pegawai
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                // Ambil data pertama
                let data = response.Data[0];

                // Isi modal dengan data pegawai
                $("#editid").val(data.id);
                $("#editnampan").val(data.nampan);
                // Muat opsi jenis produk
                $.ajax({
                    url: "/api/jenisproduk/getJenisProduk",
                    type: "GET",
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    success: function (jenisProdukResponse) {
                        let options
                        jenisProdukResponse.Data.forEach((item) => {
                            const selected =
                                item.id === data.jenisproduk_id
                                    ? "selected"
                                    : "";
                            options += `<option value="${item.id}" ${selected}>${item.jenis_produk}</option>`;
                        });
                        $("#editJenisProduk").html(options);
                    },
                });

                // Tampilkan modal edit
                $("#mdEditNampan").modal("show");
            },
            error: function () {
                showToastError("Tidak dapat mengambil data")
            },
        });
    });

    // Ketika modal ditutup, reset semua field
    $("#mdEditNampan").on("hidden.bs.modal", function () {
        // Reset form input (termasuk gambar dan status)
        $("#formEditNampan")[0].reset();
    });

    // // Kirim data ke server saat form disubmit
    $(document).on("submit", "#formEditNampan", function (e) {
        e.preventDefault(); // Mencegah form submit secara default
        const token = localStorage.getItem('token');
        // Buat objek FormData
        const formData = new FormData(this);
        // Ambil ID dari form
        const idNampan = formData.get("id"); // Mengambil nilai input dengan name="id"

        // Kirim data ke server menggunakan AJAX
        $.ajax({
            url: `/api/nampan/updateNampan/${idNampan}`, // URL untuk mengupdate data pegawai
            type: "POST", // Gunakan metode POST (atau PATCH jika route mendukung)
            data: formData, // Gunakan FormData
            processData: false, // Jangan proses FormData sebagai query string
            contentType: false, // Jangan set Content-Type secara manual
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                // Tampilkan toast sukses
                showToastSuccess(response.message)
                $("#mdEditNampan").modal("hide"); // Tutup modal
                tableNampan.ajax.reload(null, false); // Reload data dari server
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

                    Swal.fire({
                        icon: "error",
                        title: "Validasi Gagal",
                        html: errorList,
                        showConfirmButton: false,
                        timer: 1000
                    });
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
    $(document).on("click", ".final-nampan", function () {
        const deleteID = $(this).data("id");
        const token = localStorage.getItem('token');
        // SweetAlert2 untuk konfirmasi
        Swal.fire({
            title: "Konfirmasi Final Nampan",
            text: "Nampan Akan Difinal!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Final!",
            cancelButtonText: "Batal",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                // Kirim permintaan hapus (gunakan itemId)
                fetch(`/api/nampan/finalNampan/${deleteID}`, {
                    method: "GET",
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                })
                    .then((response) => {
                        return response.json().then((data) => {
                            if (response.ok) {
                                showToastSuccess(data.message || "Data berhasil Difinal.");
                                tableNampan.ajax.reload(null, false);
                            } else {
                                showToastError(data.message || "Terjadi kesalahan saat memfinal nampan.");
                            }
                        });
                    })
                    .catch((error) => {
                        showToastError("Terjadi kesalahan dalam memfinal nampan.");
                    });
            } else {
                // Jika batal, beri tahu pengguna
                showToastSuccess("Dibatalkan, Data tidak dihapus.");
            }
        });
    });

    // ketika button hapus di tekan
    $(document).on("click", ".tutup-nampan", function () {
        const deleteID = $(this).data("id");
        const token = localStorage.getItem('token');
        // SweetAlert2 untuk konfirmasi
        Swal.fire({
            title: "Konfirmasi Tutup Nampan?",
            text: "Nampan Akan Ditutup ?!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Tutup!",
            cancelButtonText: "Batal",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                // Kirim permintaan hapus (gunakan itemId)
                fetch(`/admin/nampan/tutupNampan/${deleteID}`, {
                    method: "GET",
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                })
                    .then((response) => {
                        return response.json().then((data) => {
                            if (response.ok) {
                                showToastSuccess(data.message || "Nampan berhasil Ditutup.");
                                tableNampan.ajax.reload(null, false);
                            } else {
                                showToastError(data.message || "Terjadi kesalahan saat menutup nampan.");
                            }
                        });
                    })
                    .catch((error) => {
                        showToastError("Terjadi kesalahan dalam penutupan nampan.");
                    });
            } else {
                // Jika batal, beri tahu pengguna
                showToastError("Dibatalkan, Nampan tidak ditutup.");
            }
        });
    });

    // Ketika tombol detail produk ditekan
    $(document).on("click", ".btn-detail", function () {
        const produkID = $(this).data("id");
        const urlNampanProduk = `nampan/NampanProduk`; // tanpa query param
        openIframeModal(urlNampanProduk, produkID);
    });

    $(document).on("click", "#closeFrame", function () {
        closeIframeModal();
    });

    function openIframeModal(url, produkID) {
        $('#iframePage').attr('src', url);
        $('#popupIframeContent').fadeIn();

        // Setelah iframe selesai dimuat, kirim data
        $('#iframePage').on('load', function () {
            const iframeWindow = this.contentWindow;
            iframeWindow.postMessage({ produkID }, '*'); // bisa ganti '*' dengan origin jika mau aman
        });
    }

    function closeIframeModal() {
        $('#iframePage').attr('src', '');
        $('#popupIframeContent').fadeOut();
    }
})