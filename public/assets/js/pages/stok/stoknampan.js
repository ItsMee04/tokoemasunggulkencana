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
        if ($('#nampanStokTable').length > 0) {
            tableNampan = $('#nampanStokTable').DataTable({
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
                    url: `/api/stoknampan/getNampanStok`, // Ganti dengan URL endpoint server Anda
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
                        data: "nampan.nampan",
                    },
                    {
                        data: "nampan.tanggal",
                    },
                    {
                        data: "nampan.jenis_produk.jenis_produk",
                    },
                    {
                        data: "stokprodukawal",
                        className: "text-center", // Tengah
                        render: function (data, type, row) {
                            return `${data} pcs`;
                        }
                    },
                    {
                        data: "stokawalberat",
                        className: "text-center", // Tengah
                        render: function (data) {
                            if (!data) return '0 gram';
                            const number = Number(data);
                            return `${parseFloat(number.toFixed(2))} gram`;
                        }
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
                                <a class="me-2 edit-icon p-2 btn-detail" data-id="${row.nampan_id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="DETAIL DATA">
                                    <i data-feather="file-text" class="action-eye"></i>
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

    //panggul function getKondisi
    getNampan();

    // Ketika tombol detail produk ditekan
    $(document).on("click", ".btn-detail", function () {
        const nampanProdukID = $(this).data("id");
        const urlNampanProduk = `detailstoknampan`; // tanpa query param
        openIframeModal(urlNampanProduk, nampanProdukID);
    });

    function openIframeModal(url, nampanProdukID) {
        $('#iframePage').attr('src', url);
        $('#popupIframeContent').fadeIn();

        // Setelah iframe selesai dimuat, kirim data
        $('#iframePage').on('load', function () {
            const iframeWindow = this.contentWindow;
            iframeWindow.postMessage({ nampanProdukID }, '*'); // bisa ganti '*' dengan origin jika mau aman
        });
    }

    window.addEventListener('message', function (event) {
        const data = event.data;

        if (data.action === 'closeIframeModal') {
            $('#iframePage').attr('src', '');
            $('#popupIframeContent').fadeOut();
        }
    });
});