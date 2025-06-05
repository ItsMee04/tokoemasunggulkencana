$(document).ready(function () {
    // Inisialisasi tooltip Bootstrap
    function initializeTooltip() {
        $('[data-bs-toggle="tooltip"]').tooltip();
    }

    //function refresh
    $(document).on("click", "#refreshButton", function () {
        if (tablePembelian) {
            tablePembelian.ajax.reload(null, false); // Reload data dari server
        }
        showToastSuccess("Data Transaksi Pembelian Berhasil Direfresh")
    });

    //load data pembelian
    function getPerbaikan() {
        // Datatable
        if ($('#perbaikanTable').length > 0) {
            tablePembelian = $('#perbaikanTable').DataTable({
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
                    url: `/api/perbaikan/getPerbaikan`, // Ganti dengan URL endpoint server Anda
                    type: 'GET', // Metode HTTP (GET/POST)
                    dataSrc: 'Data', // Jalur data di response JSON
                    beforeSend: function (xhr) {
                        const token = localStorage.getItem('token');
                        if (token) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                        }
                    },
                    error: function (xhr) {
                        const msg = xhr.responseJSON?.message || 'Gagal mengambil data diskon';
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
                        data: "kodeperbaikan",
                    },
                    {
                        data: "produk.kodeproduk",
                    },
                    {
                        data: "kondisi.kondisi",
                        render: function (data, type, row) {
                            // Menampilkan badge sesuai dengan status
                            if (data == "BAIK") {
                                return `<span class="badge bg-success fw-medium fs-10"><b>BAIK</b></span>`;
                            } else if (data == "KUSAM") {
                                return `<span class="badge bg-warning fw-medium fs-10"><b>KUSAM</b></span>`;
                            } else if (data == "RUSAK") {
                                return `<span class="badge bg-danger fw-medium fs-10"><b>RUSAK</b></span>`;
                            }
                        }
                    },
                    {
                        data: "tanggalmasuk",
                    },
                    {
                        data: "keterangan",
                    },
                    {
                        data: 'status',
                        render: function (data, type, row) {
                            // Menampilkan badge sesuai dengan status
                            if (data == 1) {
                                return `<span class="badge bg-warning fw-medium fs-10"><b>DALAM PERBAIKAN</b></span>`;
                            } else if (data == 2) {
                                return `<span class="badge bg-success fw-medium fs-10"><b>SELSAI PERBAIKAN</b></span>`;
                            } else if (data == 0) {
                                return `<span class="badge bg-danger fw-medium fs-10"><b>BATAL TRANSAKSI</b></span>`;
                            }
                        }
                    },
                    {
                        data: null,        // Kolom aksi
                        orderable: false,  // Aksi tidak perlu diurutkan
                        className: "action-table-data justify-content-center",
                        render: function (data, type, row, meta) {
                            if (row.status === 1) {
                                return `
                                    <div class="edit-delete-action">
                                        <a class="me-2 edit-icon p-2 btn-detail" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="DETAIL TRANSAKSI">
                                            <i data-feather="eye" class="action-eye"></i>
                                        </a>
                                        <a class="me-2 p-2 confirm-repair" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="KONFIRMASI PEMBAYARAN">
                                            <i data-feather="check-circle" class="feather-edit"></i>
                                        </a>
                                        <a class="cancel-payment p-2" data-id="${row.produk.kodeproduk}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="BATALKAN PEMBAYARAN">
                                            <i data-feather="x-circle" class="feather-trash-2"></i>
                                        </a>
                                    </div>
                                `;
                            } else {
                                return `
                                    <div class="edit-delete-action">
                                        <a class="me-2 edit-icon p-2 btn-detail" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="DETAIL TRANSAKSI">
                                            <i data-feather="eye" class="action-eye"></i>
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

    //panggil function getPembelian
    getPerbaikan();

    //ketika button edit di tekan
    $(document).on("click", ".btn-detail", function () {
        const produkID = $(this).data("id");
        const token = localStorage.getItem('token');
        $.ajax({
            url: `/api/perbaikan/getPerbaikanByID/${produkID}`, // Endpoint untuk mendapatkan data pegawai
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                if (response.Data && response.Data.length > 0) {
                    let data = response.Data[0];

                    // Isi field input sesuai ID-nya
                    $("#detailkodeperbaikan").val(data.kodeperbaikan);
                    $("#detailkodeproduk").val(data.produk.kodeproduk); // contoh jika ada field nama produk
                    $("#detailkondisi").val(data.kondisi.kondisi); // contoh kondisi produk
                    $("#detailketerangan").val(data.keterangan); // contoh keterangan
                    $("#tanggalmasuk").val(data.tanggalmasuk);
                    $("#tanggalkeluar").val(data.tanggalkeluar ?? "BARANG BELUM KELUAR");

                    // Tampilkan modal
                    $("#mdDetailPerbaikan").modal("show");
                } else {
                    showToastError("Data tidak ditemukan");
                }
            },
            error: function () {
                showToastError("Tidak dapat mengambil data perbaikan")
            },
        });
    });

    // ketika button hapus di tekan
    $(document).on("click", ".confirm-repair", function () {
        const deleteID = $(this).data("id");
        const token = localStorage.getItem('token');
        // SweetAlert2 untuk konfirmasi
        Swal.fire({
            title: "Konfirmasi Perbaikan",
            text: "Produk Sudah Direpair ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Sudah!",
            cancelButtonText: "Batal",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                // Kirim permintaan hapus (gunakan itemId)
                fetch(`/api/perbaikan/konfirmasiPerbaikan/${deleteID}`, {
                    method: "GET",
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                })
                    .then((response) => {
                        return response.json().then((data) => {
                            if (response.ok) {
                                showToastSuccess(data.message || "Produk berhasil dikonfirmasi");
                                // Reload DataTables (misal pakai tableJabatan)
                                if ($.fn.DataTable.isDataTable('#perbaikanTable')) {
                                    $('#perbaikanTable').DataTable().ajax.reload();
                                }
                            } else {
                                showToastError(data.message || "Terjadi kesalahan saat konfirmasi perbaikan.");
                            }
                        });
                    })
                    .catch((error) => {
                        showToastError(data.message || "Terjadi kesalahan dalam konfirmasi perbaikan.");
                    });
            } else {
                // Jika batal, beri tahu pengguna
                showToastError(data.message || "Dibatalkan, Perbaikan tidak dikonfirmasi.");
            }
        });
    });
})