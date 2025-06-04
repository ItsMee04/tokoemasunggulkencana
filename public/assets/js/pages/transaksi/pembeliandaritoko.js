$(document).ready(function () {
    // Inisialisasi tooltip Bootstrap
    function initializeTooltip() {
        $('[data-bs-toggle="tooltip"]').tooltip();
    }

    const kode = localStorage.getItem('kodepembelianproduk');

    if (kode) {
        $('#kodepembelianproduk').val(kode);
    } else {
        $('#kodepembelianproduk').val('');
    }

    //function refresh
    $(document).on("click", "#refreshButton", function () {
        if (tableProdukPembelianCustomer) {
            tableProdukPembelianCustomer.ajax.reload(null, false); // Reload data dari server
        }
        showToastSuccess("Data Pembelian Berhasil Direfresh")
    });

    let tableProdukPembelianCustomer;

    // Load data pembelian
    function getProdukPembelianTransaksiPelanggan() {
        const token = localStorage.getItem('token');
        if ($('#produkTransaksiTable').length > 0) {
            tableProdukPembelianCustomer = $('#produkTransaksiTable').DataTable({
                "scrollX": false,
                "bFilter": false,
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
                    url: `/api/pembelian/pembeliandaritoko/getTransaksiByKodeTransaksi`,
                    type: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    data: function (d) {
                        d.kodetransaksi = $('input[name="kodetransaksi"]').val();
                    },
                    dataSrc: function (json) {
                        if (json.success && json.Data.length > 0) {
                            const transaksi = json.Data[0];

                            // Tampilkan toast sukses
                            showToastSuccess(json.message || "Pembelian berhasil dikonfirmasi.");

                            // Set nilai input pelanggan
                            $("#detailpelanggan").val(transaksi.pelanggan.nama);
                            $("#idpelanggan").val(transaksi.pelanggan.id);

                            // Load kondisi
                            $.ajax({
                                url: "/api/kondisi/getKondisi",
                                type: "GET",
                                headers: {
                                    'Authorization': 'Bearer ' + token
                                },
                                success: function (response) {
                                    let options = "";
                                    response.Data.forEach((item) => {
                                        options += `<option value="${item.id}">${item.kondisi}</option>`;
                                    });
                                    $("#kondisi").html(options);
                                },
                                error: function () {
                                    showToastError("Tidak dapat mengambil data kondisi.");
                                }
                            });

                            // Kembalikan data keranjang
                            return transaksi.keranjang;
                        } else {
                            // Tampilkan toast gagal
                            showToastError(json.message);
                            return [];
                        }
                    }
                },
                columns: [
                    { data: "produk.kodeproduk" },
                    { data: "produk.nama" },
                    {
                        data: "produk.berat",
                        render: function (data) {
                            return data ? parseFloat(data).toFixed(1) + " gram" : "-";
                        }
                    },
                    { data: "produk.kondisi.kondisi" },
                    {
                        data: "produk.harga_jual",
                        render: function (data) {
                            return data != null
                                ? new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(data)
                                : "-";
                        }
                    },
                    {
                        data: null,
                        orderable: false,
                        className: "action-table-data justify-content-center",
                        render: function (data, type, row) {
                            return `
                            <div class="edit-delete-action">
                                <a class="me-2 p-2 btn-pilihproduk" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="PILIH PRODUK">
                                    <i data-feather="plus-circle" class="feather-edit"></i>
                                </a>
                            </div>
                        `;
                        }
                    }
                ],
                initComplete: function () {
                    $('.dataTables_filter').appendTo('#tableSearch');
                    $('.dataTables_filter').appendTo('.search-input');
                },
                drawCallback: function () {
                    feather.replace();
                    initializeTooltip();
                }
            });
        }
    }

    getProdukPembelianTransaksiPelanggan();

    //ketika button tambah di tekan
    $("#btnTambahPembelian").on("click", function () {
        $("#mdPembelianDariToko").modal("show");
    });

    // Handle submit form cari
    $('#formCariByKodeTransaksi').on('submit', function (e) {
        e.preventDefault();
        let kode = $('input[name="kodetransaksi"]').val().trim();
        if (kode !== '') {
            tableProdukPembelianCustomer.ajax.reload();
            $('#mdPembelianDariToko').modal('hide');
        } else {
            Swal.fire({
                icon: "error",
                title: "Terjadi Kesalahan",
                text: "Masukkan Kode Transaksi terlebih dahulu!",
                showConfirmButton: false,
                timer: 1000
            });
        }
    });

    // Ketika modal ditutup, reset semua field
    $("#mdPembelianDariToko").on("hidden.bs.modal", function () {
        // Reset form input (termasuk gambar dan status)
        $("#formCariByKodeTransaksi")[0].reset();
    });

    function getProdukPembelianTable() {
        const token = localStorage.getItem('token');
        if ($('#produkPembelianTable').length > 0) {
            if ($.fn.DataTable.isDataTable('#produkPembelianTable')) {
                $('#produkPembelianTable').DataTable().destroy();
            }

            $('#produkPembelianTable').DataTable({
                scrollX: false,
                bFilter: false,
                sDom: 'fBtlpi',
                ordering: true,
                language: {
                    search: ' ',
                    sLengthMenu: '_MENU_',
                    searchPlaceholder: "Search",
                    info: "_START_ - _END_ of _TOTAL_ items",
                    paginate: {
                        next: ' <i class="fa fa-angle-right"></i>',
                        previous: '<i class="fa fa-angle-left"></i>'
                    },
                },
                ajax: {
                    url: `/api/pembelian/pembeliandaritoko/getPembelianProduk`,
                    type: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    dataSrc: 'Data'
                },
                columns: [
                    { data: "kodeproduk" },
                    { data: "nama" },
                    {
                        data: "berat",
                        render: data => `${parseFloat(data).toFixed(1)} gram`
                    },
                    { data: "kondisi.kondisi" },
                    {
                        data: "harga_beli",
                        render: function (data) {
                            if (data != null) {
                                return new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(data);
                            } else {
                                return "-";
                            }
                        },
                    },
                    {
                        data: null,
                        orderable: false,
                        className: "action-table-data justify-content-center",
                        render: (data, type, row) => `
                            <div class="edit-delete-action">
                                <a class="me-2 p-2 btn-edit-harga" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="EDIT PRODUK YANG DIBELI">
                                    <i data-feather="edit" class="feather-edit"></i>
                                </a>
                                <a class="p-2 btn-delete-produk" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="BATALKAN PRODUK">
                                    <i data-feather="trash-2"></i>
                                </a>
                            </div>
                        `
                    }
                ],
                drawCallback: function () {
                    feather.replace();
                    initializeTooltip();
                }
            });
        }
    }

    getProdukPembelianTable();

    // Event ketika tombol pilih produk diklik
    $(document).on("click", ".btn-pilihproduk", function () {
        const idProduk = $(this).data("id");
        const token = localStorage.getItem('token');
        const kodeSudahAda = localStorage.getItem('kodepembelianproduk');

        Swal.fire({
            title: "Pilih Produk Ini?",
            text: "Produk akan ditambahkan ke dalam pembelian.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, Pilih",
            cancelButtonText: "Batal"
        }).then((result) => {
            if (result.isConfirmed) {
                // Jika kode sudah ada di localStorage
                if (kodeSudahAda) {
                    $('#kodepembelianproduk').val(kodeSudahAda);

                    // Tetap kirim data produk ke server karena produk tetap harus ditambahkan
                    $.ajax({
                        url: "/api/pembelian/pembeliandaritoko/storeProdukToPembelianProduk",
                        type: "POST",
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },
                        data: {
                            id: idProduk
                        },
                        success: function (response) {
                            if (response.success) {
                                showToastSuccess(response.message);
                                if ($.fn.DataTable.isDataTable('#produkPembelianTable')) {
                                    $('#produkPembelianTable').DataTable().ajax.reload();
                                }
                            } else {
                                showToastError(response.message);
                            }
                        },
                        error: function () {
                            showToastError("Tidak dapat menambahkan produk");
                        }
                    });

                } else {
                    // Kode belum ada, simpan setelah response
                    $.ajax({
                        url: "/api/pembelian/pembeliandaritoko/storeProdukToPembelianProduk",
                        type: "POST",
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },
                        data: {
                            id: idProduk
                        },
                        success: function (response) {
                            if (response.success) {
                                showToastSuccess(response.message);

                                localStorage.setItem('kodepembelianproduk', response.kode);
                                $('#kodepembelianproduk').val(response.kode);

                                if ($.fn.DataTable.isDataTable('#produkPembelianTable')) {
                                    $('#produkPembelianTable').DataTable().ajax.reload();
                                }
                            } else {
                                showToastError(response.message);
                            }
                        },
                        error: function () {
                            showToastError("Tidak dapat menambahkan produk");
                        }
                    });
                }
            }
        });
    });


    //ketika button edit di tekan
    $(document).on("click", ".btn-edit-harga", function () {
        const produkID = $(this).data("id");
        const token = localStorage.getItem('token');
        $.ajax({
            url: `/api/pembelian/pembeliandaritoko/showPembelianProduk/${produkID}`, // Endpoint untuk mendapatkan data pegawai
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                // Ambil data pertama
                let data = response.Data;

                // Isi modal dengan data
                $("#editid").val(data.id);
                $("#editharga").val(data.harga_beli);

                // Muat opsi kondisi
                $.ajax({
                    url: "/api/kondisi/getKondisi",
                    type: "GET",
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    success: function (kondisiResponse) {
                        let options
                        kondisiResponse.Data.forEach((item) => {
                            const selected =
                                item.id === data.kondisi_id
                                    ? "selected"
                                    : "";
                            options += `<option value="${item.id}" ${selected}>${item.kondisi}</option>`;
                        });
                        $("#editkondisi").html(options);
                    },
                });

                // Tampilkan modal edit
                $("#mdEditHargaBeli").modal("show");
            },
            error: function () {
                showToastError("Tidak dapat mengambil data harga");
            },
        });
    });

    // Ketika modal ditutup, reset semua field
    $("#mdEditHargaBeli").on("hidden.bs.modal", function () {
        // Reset form input (termasuk gambar dan status)
        $("#formUpdateHargaBeli")[0].reset();
    });

    // // Kirim data ke server saat form disubmit
    $(document).on("submit", "#formUpdateHargaBeli", function (e) {
        e.preventDefault(); // Mencegah form submit secara default
        const token = localStorage.getItem('token');
        // Buat objek FormData
        const formData = new FormData(this);
        // Ambil ID dari form
        const idProdukPembelian = formData.get("id"); // Mengambil nilai input dengan name="id"

        // Kirim data ke server menggunakan AJAX
        $.ajax({
            url: `/api/pembelian/pembeliandaritoko/updatehargaPembelianProduk/${idProdukPembelian}`, // URL untuk mengupdate data pegawai
            type: "POST", // Gunakan metode POST (atau PATCH jika route mendukung)
            data: formData, // Gunakan FormData
            processData: false, // Jangan proses FormData sebagai query string
            contentType: false, // Jangan set Content-Type secara manual
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                // Tampilkan toast sukses
                showToastSuccess(response.message);
                localStorage.removeItem('kodepembelianproduk');
                $("#mdEditHargaBeli").modal("hide"); // Tutup modal
                // Reload DataTable pembelian_produk (pastikan sudah diinisialisasi sebelumnya)
                if ($.fn.DataTable.isDataTable('#produkPembelianTable')) {
                    $('#produkPembelianTable').DataTable().ajax.reload();
                }
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
                    showToastError(errorList);

                } else if (xhr.responseJSON && xhr.responseJSON.message) {
                    showToastError(xhr.responseJSON.message);
                } else {
                    showToastError("Tidak dapat memproses permintaan. Silakan coba lagi.");
                }
            },
        });
    });

    // ketika button hapus di tekan
    $(document).on("click", ".btn-delete-produk", function () {
        const deleteID = $(this).data("id");
        const token = localStorage.getItem('token');
        // SweetAlert2 untuk konfirmasi
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Produk ini akan dibatalkan",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Batal!",
            cancelButtonText: "Batal",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                // Kirim permintaan hapus (gunakan itemId)
                fetch(`/api/pembelian/pembeliandaritoko/deletePembelianProduk/${deleteID}`, {
                    method: "DELETE",
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                })
                    .then((response) => {
                        return response.json().then((data) => {
                            if (response.ok) {
                                showToastSuccess(data.message || "Produk berhasil dibatalkan.");
                                // Reload DataTables (misal pakai tablePembelian)
                                localStorage.removeItem('kodepembelianproduk');
                                $('#kodepembelianproduk').val('');
                                if ($.fn.DataTable.isDataTable('#produkPembelianTable')) {
                                    $('#produkPembelianTable').DataTable().ajax.reload();
                                }
                            } else {
                                showToastError(data.message || "Terjadi kesalahan saat membatalkan produk.");
                            }
                        });
                    })
                    .catch((error) => {
                        showToastError("Terjadi kesalahan dalam pembatalan produk.");
                    });
            } else {
                // Jika batal, beri tahu pengguna
                Swal.fire("Dibatalkan", "Produk tidak dibatalkan.", "info");
                showToastError("Dibatalkan, Produk tidak dibatalkan.");
            }
        });
    });

    // // Kirim data ke server saat form disubmit
    $(document).on("submit", "#storePembelianPelanggan", function (e) {
        e.preventDefault(); // Mencegah form submit secara default
        const token = localStorage.getItem('token');
        // Buat objek FormData
        const formData = new FormData(this);

        // Kirim data ke server menggunakan AJAX
        $.ajax({
            url: `/api/pembelian/pembeliandaritoko/storePembelianPelanggan`, // URL untuk mengupdate data pegawai
            type: "POST", // Gunakan metode POST (atau PATCH jika route mendukung)
            data: formData, // Gunakan FormData
            processData: false, // Jangan proses FormData sebagai query string
            contentType: false, // Jangan set Content-Type secara manual
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                // Tampilkan toast sukses
                showToastSuccess(response.message);
                localStorage.removeItem('kodepembelianproduk');
                $('#kodepembelianproduk').val('');
                if ($.fn.DataTable.isDataTable('#produkPembelianTable')) {
                    $('#produkPembelianTable').DataTable().ajax.reload();
                }
                $("#storePembelianPelanggan")[0].reset();
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
                    showToastError(errorList);

                } else if (xhr.responseJSON && xhr.responseJSON.message) {
                    showToastError(xhr.responseJSON.message);
                } else {
                    showToastError("Tidak dapat memproses permintaan. Silakan coba lagi.");
                }
            },
        });
    });
})