$(document).ready(function () {
    const token = localStorage.getItem('token');
    const kode = localStorage.getItem('kodepembelianproduk');

    if (kode) {
        $('#kodepembelianproduk').val(kode);
    } else {
        $('#kodepembelianproduk').val('');
    }
    // Inisialisasi tooltip Bootstrap
    function initializeTooltip() {
        $('[data-bs-toggle="tooltip"]').tooltip();
    }

    //function refresh
    $(document).on("click", "#refreshButton", function () {
        // Reload DataTable pembelian_produk (pastikan sudah diinisialisasi sebelumnya)
        if ($.fn.DataTable.isDataTable('#pembelianProdukTable')) {
            $('#pembelianProdukTable').DataTable().ajax.reload();
        }
        showToastSuccess("Data Transaksi Berhasil Direfresh");
    });


    // Muat opsi pelanggan
    $.ajax({
        url: "/api/pelanggan/getPelanggan", // Endpoint untuk mendapatkan data jabatan
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (response) {
            let options
            response.Data.forEach((item) => {
                options += `<option value="${item.id}">${item.nama}</option>`;
            });
            $("#pelanggan_id").html(options); // Masukkan data ke select
        },
        error: function () {
            showToastError("Tidak dapat mengambil data pelanggan");
        },
    });

    $.ajax({
        url: "/api/suplier/getSuplier", // Endpoint untuk mendapatkan data jabatan
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (response) {
            let options
            response.Data.forEach((item) => {
                options += `<option value="${item.id}">${item.nama}</option>`;
            });
            $("#suplier_id").html(options); // Masukkan data ke select
        },
        error: function () {
            showToastError("Tidak dapat mengambil data suplier");
        },
    });

    // Muat opsi kondisi
    $.ajax({
        url: "/api/kondisi/getKondisi", // Endpoint untuk mendapatkan data jabatan
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (response) {
            let options
            response.Data.forEach((item) => {
                options += `<option value="${item.id}">${item.kondisi}</option>`;
            });
            $("#kondisi").html(options); // Masukkan data ke select
        },
        error: function () {
            showToastError("Tidak dapat mengambil data kondisi");
        },
    });

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
            $("#jenisproduk").html(options); // Masukkan data ke select
        },
        error: function () {
            showToastError("Tidak dapat mengambil data jenis produk");
        },
    });



    function getProdukPembelianTable() {
        if ($('#pembelianProdukTable').length > 0) {
            if ($.fn.DataTable.isDataTable('#pembelianProdukTable')) {
                $('#pembelianProdukTable').DataTable().destroy();
            }

            $('#pembelianProdukTable').DataTable({
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
                    url: `/api/pembelian/pembeliandariluartoko/getPembelianProduk`,
                    type: 'GET',
                    dataSrc: 'Data',
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
                                <a class="me-2 p-2 btn-edit" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="EDIT PRODUK YANG DIBELI">
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

    //ketika submit form tambah kondisi
    $("#storePembelianProduk").on("submit", function (event) {
        event.preventDefault(); // Mencegah form submit secara default
        const kodeSudahAda = localStorage.getItem('kodepembelianproduk');
        // Buat objek FormData
        const formData = new FormData(this);
        $.ajax({
            url: "/api/pembelian/pembeliandariluartoko/storePembelianProduk", // Endpoint Laravel untuk menyimpan pegawai
            type: "POST",
            data: formData,
            processData: false, // Agar data tidak diubah menjadi string
            contentType: false, // Agar header Content-Type otomatis disesuaikan
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                if (response.success) {
                    showToastSuccess(response.message);

                    // Cek dan simpan kodepembelianproduk ke localStorage jika belum ada
                    if (!localStorage.getItem('kodepembelianproduk')) {
                        localStorage.setItem('kodepembelianproduk', response.kode);
                    }

                    // Ambil dari localStorage dan tampilkan di input
                    const kodeLokal = localStorage.getItem('kodepembelianproduk');
                    $('#kodepembelianproduk').val(kodeLokal);

                    // Reload DataTable pembelian_produk (pastikan sudah diinisialisasi sebelumnya)
                    if ($.fn.DataTable.isDataTable('#pembelianProdukTable')) {
                        $('#pembelianProdukTable').DataTable().ajax.reload();
                    }

                    $("#storePembelianProduk")[0].reset();
                } else {
                    showToastError(response.message);
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
                    showToastError("Tidak dapat memproses permintaan. Silakan coba lagi");
                }
            },
        });
    });

    //ketika button edit di tekan
    $(document).on("click", ".btn-edit", function () {
        const idPembelian = $(this).data("id");

        $.ajax({
            url: `/api/pembelian/pembeliandariluartoko/getPembelianByID/${idPembelian}`, // Endpoint untuk mendapatkan data pegawai
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                // Ambil data pertama
                let data = response.Data;

                $("#editid").val(data.id);
                $("#editkodeproduk").val(data.kodeproduk);
                $("#editnama").val(data.nama);
                $("#editberat").val(data.berat);
                $("#editkarat").val(data.karat);
                $("#editlingkar").val(data.lingkar);
                $("#editpanjang").val(data.panjang);
                $("#edithargabeli").val(data.harga_beli);
                $("#editketerangan").val(data.keterangan);

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
                        $("#editjenis").html(options);
                    },
                    error: function () {
                        showToastError('Tidak dapat mengambil data jenis produk');
                    },
                });

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
                $("#mdEditProduk").modal("show");
            },
            error: function () {
                showToastError('Tidak dapat mengambil data kondisi');
            },
        });
    });

    // // Kirim data ke server saat form disubmit
    $(document).on("submit", "#formEditPembelianProduk", function (e) {
        e.preventDefault(); // Mencegah form submit secara default

        // Buat objek FormData
        const formData = new FormData(this);
        // Ambil ID dari form
        const idProdukPembelian = formData.get("id"); // Mengambil nilai input dengan name="id"

        // Kirim data ke server menggunakan AJAX
        $.ajax({
            url: `/api/pembelian/pembeliandariluartoko/updatePembelianByID/${idProdukPembelian}`, // URL untuk mengupdate data pegawai
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
                $("#mdEditProduk").modal("hide"); // Tutup modal
                // Reload DataTable pembelian_produk (pastikan sudah diinisialisasi sebelumnya)
                if ($.fn.DataTable.isDataTable('#pembelianProdukTable')) {
                    $('#pembelianProdukTable').DataTable().ajax.reload();
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
                    showToastError("Tidak dapat memproses permintaan. Silakan coba lagi");
                }
            },
        });
    });

    // ketika button hapus di tekan
    $(document).on("click", ".btn-delete-produk", function () {
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
                fetch(`/api/pembelian/pembeliandariluartoko/deletePembelianProduk/${deleteID}`, {
                    method: "DELETE",
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                })
                    .then((response) => {
                        return response.json().then((data) => {
                            if (response.ok) {
                                showToastSuccess(data.message || "Data berhasil dihapus.");
                                localStorage.removeItem('kodepembelianproduk');
                                // Reload DataTables (misal pakai tabelPembelian)
                                if ($.fn.DataTable.isDataTable('#pembelianProdukTable')) {
                                    $('#pembelianProdukTable').DataTable().ajax.reload();
                                }
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

    // // Kirim data ke server saat form disubmit
    $(document).on("submit", "#storePembelianLuarToko", function (e) {
        e.preventDefault(); // Mencegah form submit secara default

        const form = this;
        const formData = new FormData(form);

        // Dapatkan ID tab yang aktif
        const activePaneId = $(".tab-pane.show.active").attr("id");

        // Kosongkan input dari tab yang tidak aktif
        if (activePaneId !== "pills-home") {
            formData.set("suplier", "");
        }

        if (activePaneId !== "pills-profile") {
            formData.set("pelanggan", "");
        }

        if (activePaneId !== "pills-pembeli") {
            formData.set("nonsuplierdanpembeli", "");
        }

        //Kirim data ke server menggunakan AJAX
        $.ajax({
            url: `/api/pembelian/pembeliandariluartoko/storePembelianLuarToko`, // URL untuk mengupdate data pegawai
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
                if ($.fn.DataTable.isDataTable('#pembelianProdukTable')) {
                    $('#pembelianProdukTable').DataTable().ajax.reload();
                }

                $("#storePembelianLuarToko")[0].reset();
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