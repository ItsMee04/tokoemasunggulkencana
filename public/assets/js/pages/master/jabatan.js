$(document).ready(function () {
    
    // Inisialisasi tooltip Bootstrap
    function initializeTooltip() {
        $('[data-bs-toggle="tooltip"]').tooltip();
    }

    //function refresh
    $(document).on("click", "#refreshButton", function () {
        if (tableJabatan) {
            tableJabatan.ajax.reload(null, false); // Reload data dari server
        }
        showToastSuccess("Data Jabatan Berhasil Direfresh")
    });

    //load data jabatan
    function getJabatan() {
        // Datatable
        if ($('#jabatanTable').length > 0) {
            tableJabatan = $('#jabatanTable').DataTable({
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
                    url: `/api/jabatan/getJabatan`, // Ganti dengan URL endpoint server Anda
                    type: 'GET', // Metode HTTP (GET/POST)
                    dataSrc: 'Data', // Jalur data di response JSON
                    beforeSend: function (xhr) {
                        const token = localStorage.getItem('token');
                        if (token) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                        }
                    },
                    error: function (xhr) {
                        const msg = xhr.responseJSON?.message || 'Gagal mengambil data jabatan';
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
                        data: "jabatan",
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

    //panggul function getJabatan
    getJabatan();

    //ketika button tambah di tekan
    $("#btnTambahJabatan").on("click", function () {
        $("#mdTambahJabatan").modal("show");
    });

    //ketika submit form tambah jabatan
    $("#formTambahJabatan").on("submit", function (event) {
        event.preventDefault(); // Mencegah form submit secara default
        // Ambil elemen input file

        // Buat objek FormData
        const formData = new FormData(this);
        const token = localStorage.getItem('token');
        $.ajax({
            url: "/api/jabatan/storeJabatan", // Endpoint Laravel untuk menyimpan pegawai
            type: "POST",
            data: formData,
            processData: false, // Agar data tidak diubah menjadi string
            contentType: false, // Agar header Content-Type otomatis disesuaikan
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                showToastSuccess(response.message)
                $("#mdTambahJabatan").modal("hide"); // Tutup modal
                $("#formTambahJabatan")[0].reset(); // Reset form
                tableJabatan.ajax.reload(null, false); // Reload data dari server
            },
            error: function (xhr) {
                const errors = xhr.responseJSON?.errors;
                if (errors) {
                    let errorList = "<ul style='text-align:left;'>"; // opsional: rata kiri
                    for (let key in errors) {
                        errorList += `<li>${errors[key][0]}</li>`;
                    }
                    errorList += "</ul>";

                    showToastError(errorList)
                } else {
                    const message = xhr.responseJSON?.message || "Terjadi kesalahan saat memproses permintaan.";
                    showToastError(message)
                }
            },
        });
    });

    // Ketika modal ditutup, reset semua field
    $("#mdTambahJabatan").on("hidden.bs.modal", function () {
        // Reset form input (termasuk gambar dan status)
        $("#formTambahJabatan")[0].reset();
    });

    //ketika button edit di tekan
    $(document).on("click", ".btn-edit", function () {
        const jabatanID = $(this).data("id");
        const token = localStorage.getItem('token');
        $.ajax({
            url: `/api/jabatan/getJabatan/${jabatanID}`, // Endpoint untuk mendapatkan data pegawai
            type: "GET",
            success: function (response) {
                // Ambil data pertama
                let data = response.Data[0];

                // Isi modal dengan data pegawai
                $("#editid").val(data.id);
                $("#editjabatan").val(data.jabatan);

                // Tampilkan modal edit
                $("#mdEditJabatan").modal("show");
            },
            error: function () {
                showToastError("Tidak dapat mengambil data jabatan")
            },
        });
    });

    // Ketika modal ditutup, reset semua field
    $("#mdEditJabatan").on("hidden.bs.modal", function () {
        // Reset form input (termasuk gambar dan status)
        $("#formEditJabatan")[0].reset();
    });

    // // Kirim data ke server saat form disubmit
    $(document).on("submit", "#formEditJabatan", function (e) {
        e.preventDefault(); // Mencegah form submit secara default

        // Buat objek FormData
        const formData = new FormData(this);
        // Ambil ID dari form
        const idJabatan = formData.get("id"); // Mengambil nilai input dengan name="id"

        // Kirim data ke server menggunakan AJAX
        $.ajax({
            url: `/admin/jabatan/updateJabatan/${idJabatan}`, // URL untuk mengupdate data pegawai
            type: "POST", // Gunakan metode POST (atau PATCH jika route mendukung)
            data: formData, // Gunakan FormData
            processData: false, // Jangan proses FormData sebagai query string
            contentType: false, // Jangan set Content-Type secara manual
            success: function (response) {
                // Tampilkan toast sukses
                Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: response.message,
                    showConfirmButton: false,
                    timer: 1000
                });
                $("#mdEditJabatan").modal("hide"); // Tutup modal
                tableJabatan.ajax.reload(null, false); // Reload data dari server
            },
            error: function (xhr) {
                const errors = xhr.responseJSON?.errors;
                if (errors) {
                    let errorList = "<ul style='text-align:left;'>"; // opsional: rata kiri
                    for (let key in errors) {
                        errorList += `<li>${errors[key][0]}</li>`;
                    }
                    errorList += "</ul>";

                    Swal.fire({
                        icon: "error",
                        title: "Validasi Gagal",
                        html: errorList, // gunakan html, bukan text
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    const message = xhr.responseJSON?.message || "Terjadi kesalahan saat memproses permintaan.";
                    Swal.fire({
                        icon: "error",
                        title: "Gagal",
                        text: message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            },
        });
    });

    // ketika button hapus di tekan
    $(document).on("click", ".confirm-text", function () {
        const deleteID = $(this).data("id");

        // SweetAlert2 untuk konfirmasi
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data ini akan dihapus secara permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                // Kirim permintaan hapus (gunakan itemId)
                fetch(`/admin/jabatan/deleteJabatan/${deleteID}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                            "content"
                        ),
                    },
                })
                    .then((response) => {
                        if (response.ok) {
                            Swal.fire(
                                "Dihapus!",
                                "Data berhasil dihapus.",
                                "success"
                            );
                            tableJabatan.ajax.reload(null, false); // Reload data dari server
                        } else {
                            Swal.fire(
                                "Gagal!",
                                "Terjadi kesalahan saat menghapus data.",
                                "error"
                            );
                        }
                    })
                    .catch((error) => {
                        Swal.fire(
                            "Gagal!",
                            "Terjadi kesalahan dalam penghapusan data.",
                            "error"
                        );
                    });
            } else {
                // Jika batal, beri tahu pengguna
                Swal.fire("Dibatalkan", "Data tidak dihapus.", "info");
            }
        });
    });
})