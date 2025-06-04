$(document).ready(function () {

    // Inisialisasi tooltip Bootstrap
    function initializeTooltip() {
        $('[data-bs-toggle="tooltip"]').tooltip();
    }

    //ketika button tambah di tekan
    $("#btnTambahPelanggan").on("click", function () {
        $("#mdTambahPelanggan").modal("show");
    });

    //function refresh
    $(document).on("click", "#refreshButton", function () {
        getKeranjang();
        getNampanProduk('all');
        getNampan();
        showToastSuccess("Data Keranjang Berhasil Direfresh")
    });

    function getNampan() {
        const token = localStorage.getItem('token');
        $.ajax({
            url: '/api/nampan/getNampan',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                const $container = $("#daftarNampan");
                $container.trigger('destroy.owl.carousel'); // Hancurkan instance lama
                $container.empty(); // Kosongkan isi dulu

                // Tambahkan "All Categories"
                $container.append(`
                    <li id="all">
                        <a href="javascript:void(0);">
                            <img src="/assets/img/categories/category-01.png" alt="All Categories">
                        </a>
                        <h6><a href="javascript:void(0);">SEMUA NAMPAN</a></h6>
                        <span>${response.Total} Items</span>
                    </li>
                `);

                // Tambahkan item dari database
                $.each(response.Data, function (key, item) {
                    const imgSrc = item.jenis_produk?.image_jenis_produk
                        ? `/storage/icon/${item.jenis_produk.image_jenis_produk}`
                        : '/assets/img/notfound.png';

                    const title = item.jenis_produk?.jenis_produk || 'Tanpa Jenis';
                    const jumlahProduk = item.produk_count || 0; // <-- ambil dari withCount

                    $container.append(`
                        <li id="${item.id}">
                            <a href="javascript:void(0);">
                                <img src="${imgSrc}" alt="${title}">
                            </a>
                            <h6><a href="javascript:void(0);">${item.nampan}</a></h6>
                            <span>${jumlahProduk} Items</span>
                        </li>
                    `);
                });

                // Re-init Owl Carousel setelah data ditambahkan
                $container.owlCarousel({
                    items: 6,
                    loop: false,
                    margin: 8,
                    nav: true,
                    dots: false,
                    autoplay: false,
                    smartSpeed: 1000,
                    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
                    responsive: {
                        0: {
                            items: 2
                        },
                        500: {
                            items: 3
                        },
                        768: {
                            items: 4
                        },
                        991: {
                            items: 5
                        },
                        1200: {
                            items: 6
                        },
                        1401: {
                            items: 6
                        }
                    }
                });
            },
            error: function (xhr) {
                const message = xhr.responseJSON?.message || "Gagal memuat data nampan.";
                showToastError(message)
            }
        });
    }

    getNampan();

    function getNampanProduk(nampan) {
        const token = localStorage.getItem('token');
        $.ajax({
            url: `/api/nampan/nampanProduk/getNampanProduk/${nampan}`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                if (response.success) {
                    const produkContainer = $("#daftarProduk");
                    produkContainer.empty(); // Hapus semua tab_content yang lama

                    let tabContent = `
                        <div class="tab_content active" data-tab="${nampan}">
                            <div class="row">
                    `;

                    if (response.Data.length === 0) {
                        tabContent += `
                            <div class="alert alert-secondary d-flex align-items-center text-center" role="alert">
                                <i class="feather-info flex-shrink-0 me-2"></i>
                                <div>
                                    <b>Produk tidak ditemukan.</b>
                                </div>
                            </div>
                        `;
                    } else {
                        $.each(response.Data, function (index, item) {
                            const formatter = new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0
                            });

                            const hargajual = formatter.format(item.produk.hargatotal);

                            tabContent += `
                                <div class="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                                    <div class="product-info default-cover card">
                                        <a href="javascript:void(0);" class="img-bg">
                                            <img src="/storage/produk/${item.produk.image_produk}" alt="Products" width="100px" height="100px">
                                        </a>
                                        <h6 class="cat-name"><a href="javascript:void(0);">KODE: ${item.produk.kodeproduk}</a></h6>
                                        <h6 class="product-name"><a href="javascript:void(0);">NAMA: ${item.produk.nama}</a></h6>
                                        <div class="d-flex align-items-center justify-content-between price">
                                            <span>BERAT: ${parseFloat(item.produk.berat).toFixed(1)} gram</span>
                                            <p>${hargajual}</p>
                                        </div>
                                        <div class="align-items-center justify-content-between price text-center">
                                            <button data-id="${item.produk.id}" data-berat="${item.produk.berat}" data-karat="${item.produk.karat}" data-harga="${item.produk.harga_jual}" data-lingkar="${item.produk.lingkar}" data-panjang="${item.produk.panjang}" class="btn btn-sm btn-secondary  mr-2 add-to-cart ">ADD TO CART
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `;
                        });
                    }

                    tabContent += `</div></div>`; // Tutup row & tab_content
                    produkContainer.append(tabContent);

                    // Feather icon replace (kalau pakai Feather)
                    if (typeof feather !== 'undefined') {
                        feather.replace();
                    }
                } else {
                    showToastError("Data kosong atau gagal")
                }
            },
            error: function (xhr) {
                const message = xhr.responseJSON?.message || "Gagal memuat data produk dari nampan.";
                showToastError(message)
            }
        });
    }

    $(document).on('click', '#daftarNampan li', function () {
        var $this = $(this);
        var $theTab = $this.attr('id');

        if ($this.hasClass('active')) {
            // Sudah aktif, tidak lakukan apa-apa
            return;
        }

        // Hapus 'active' dari semua tab dan konten
        $this.closest('.tabs_wrapper').find('ul.tabs li, .tabs_container .tab_content').removeClass('active');

        // Tambahkan 'active' ke tab yang diklik dan konten terkait
        $('.tabs_container .tab_content[data-tab="' + $theTab + '"], ul.tabs li[id="' + $theTab + '"]').addClass('active');

        getNampanProduk($theTab)
    });

    getNampanProduk('all')

    let totalHargaKeranjang = 0

    function getKeranjang() {
        const token = localStorage.getItem('token');
        $.ajax({
            url: `/api/keranjang/getKeranjang`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                if (response.success) {
                    let html = '';
                    $.each(response.Data, function (index, item) {
                        const hargaFormatted = parseInt(item.total).toLocaleString('id-ID');
                        html += `
                            <div class="product-list d-flex align-items-center justify-content-between">
                                <div class="d-flex align-items-center product-info">
                                    <a href="javascript:void(0);" class="img-bg">
                                        <img src="/storage/produk/${item.produk.image_produk}" alt="Products" width="50">
                                    </a>
                                    <div class="info">
                                        <span>${item.produk.kodeproduk}</span>
                                        <h6><a href="javascript:void(0);">${item.produk.nama}</a></h6>
                                        <p>Rp${hargaFormatted}</p>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center action">
                                    <a class="btn-icon delete-icon confirm-text" href="javascript:void(0);" data-id="${item.id}">
                                        <i data-feather="trash-2" class="feather-14"></i>
                                    </a>
                                </div>
                            </div>
                        `;
                    });

                    totalHargaKeranjang = Number(response.TotalHargaKeranjang);

                    // Format Grand Total ke dalam format mata uang Rupiah
                    const subtotalHarga = totalHargaKeranjang.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0
                    });

                    $('.product-wrap').html(html);
                    $('#keranjangCount').text(response.TotalKeranjang); // update jumlah produk
                    $('#subtotal').text(subtotalHarga); // update jumlah produk
                    $('#total').text(subtotalHarga); // update jumlah produk
                    $('#grandTotal').text(subtotalHarga); // update jumlah produk


                    $.ajax({
                        url: "/api/transaksi/getKodeTransaksi", // Endpoint untuk mendapatkan data pelanggan
                        type: "GET",
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },
                        success: function (response) {
                            $("#kodetransaksi").html(response.kodetransaksi); // Masukkan data ke select
                        },
                        error: function () {
                            showToastError('Tidak dapat mengambil data kodetransaksi')
                        },
                    });

                    $.ajax({
                        url: "/api/pelanggan/getPelanggan", // Endpoint untuk mendapatkan data pelanggan
                        type: "GET",
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },
                        success: function (response) {
                            let options
                            response.Data.forEach((item) => {
                                options += `<option value="${item.id}">${item.nama}</option>`;
                            });
                            $("#pelanggan").html(options); // Masukkan data ke select
                        },
                        error: function () {
                            showToastError("Tidak dapat mengambil data pelanggan")
                        },
                    });

                    $.ajax({
                        url: "/api/diskon/getDiskon", // Endpoint untuk mendapatkan data pelanggan
                        type: "GET",
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },
                        success: function (response) {
                            let options
                            response.Data.forEach((item) => {
                                options += `<option value="${item.id}" data-nilai="${item.nilai + " %"}">${item.diskon}</option>`;
                            });
                            $("#diskon").html(options); // Masukkan data ke select
                            $('#diskonDipilih').text(0 + " %"); // update jumlah produk
                        },
                        error: function () {
                            showToastError("Tidak dapat mengambil data diskon")
                        },
                    });

                    feather.replace(); // refresh feather icon
                }
            }
        });
    }

    getKeranjang();

    // Event listener untuk perubahan dropdown
    $(document).on("change", "#diskon", function getDiscount() {
        const diskonPersen = parseFloat($(this).find(':selected').data('nilai')) || 0;
        const diskonDesimal = diskonPersen / 100;
        const grandTotal = totalHargaKeranjang * (1 - diskonDesimal);

        // Format Grand Total ke dalam format mata uang Rupiah
        const grandTotalFormatted = grandTotal.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        });

        $('#diskonDipilih').text(diskonPersen + "%");
        $('#total').text(grandTotalFormatted);
        $('#grandTotal').text(grandTotalFormatted);
    });

    // Event listener untuk tombol "Tambah ke Keranjang"
    $(document).on("click", ".add-to-cart", function () {
        const produkId = $(this).data("id");
        const dataBerat = $(this).data("berat");
        const dataKarat = $(this).data("karat");
        const dataHarga = $(this).data("harga");
        const dataLingkar = $(this).data("lingkar");
        const dataPanjang = $(this).data("panjang");
        const token = localStorage.getItem('token');
        $.ajax({
            url: "/api/keranjang/addToCart",
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {
                id: produkId,
                berat: dataBerat,
                karat: dataKarat,
                harga_jual: dataHarga,
                lingkar: dataLingkar,
                panjang: dataPanjang
            },
            success: function (response) {
                if (response.success === true) {
                    // Menampilkan notifikasi sukses menggunakan Bootstrap Toast
                    showToastSuccess(response.message)
                    getKeranjang();
                } else if (response.status === "error") {
                    // Menampilkan notifikasi error menggunakan Bootstrap Toast
                    showToastError(response.message)
                }
            },
            error: function () {
                showToastError("Terjadi kesalahan pada server")
            }
        });
    });

    // ketika button hapus di tekan
    $(document).on("click", "#deleteSemua", function () {
        const token = localStorage.getItem('token');
        // SweetAlert2 untuk konfirmasi
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Produk ini akan dibatalkan semua ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Batalkan!",
            cancelButtonText: "Batal",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                // Kirim permintaan hapus (gunakan itemId)
                fetch(`/api/keranjang/deleteKeranjangAll`, {
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
                                getKeranjang();
                                getNampan();
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

    // ketika button hapus di tekan
    $(document).on("click", ".confirm-text", function () {
        const deleteID = $(this).data("id");
        const token = localStorage.getItem('token');
        // SweetAlert2 untuk konfirmasi
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Produk ini akan dibatalkan?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Batal!",
            cancelButtonText: "Batal",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                // Kirim permintaan hapus (gunakan itemId)
                fetch(`/api/keranjang/deleteKeranjangByID/${deleteID}`, {
                    method: "DELETE",
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                })
                    .then((response) => {
                        if (response.ok) {
                            showToastSuccess(data.message || "Data berhasil dihapus.");
                            getKeranjang();
                            getNampan();
                        } else {
                            showToastError(data.message || "Terjadi kesalahan saat menghapus data.");
                        }
                    })
                    .catch((error) => {
                        showToastError(data.message || "Terjadi kesalahan saat menghapus data.");
                    });
            } else {
                // Jika batal, beri tahu pengguna
                showToastError("Dibatalkan, Data tidak dihapus.");
            }
        });
    });

    //ketika submit form tambah kondisi
    $("#formTambahPelanggan").on("submit", function (event) {
        event.preventDefault(); // Mencegah form submit secara default
        // Ambil elemen input file
        const token = localStorage.getItem('token');
        // Buat objek FormData
        const formData = new FormData(this);
        $.ajax({
            url: "/api/pelanggan/storePelanggan", // Endpoint Laravel untuk menyimpan pegawai
            type: "POST",
            data: formData,
            processData: false, // Agar data tidak diubah menjadi string
            contentType: false, // Agar header Content-Type otomatis disesuaikan
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                showToastSuccess(response.message);
                $("#mdTambahPelanggan").modal("hide"); // Tutup modal

                $.ajax({
                    url: "/api/pelanggan/getPelanggan", // Endpoint untuk mendapatkan data pelanggan
                    type: "GET",
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    success: function (response) {
                        let options
                        response.Data.forEach((item) => {
                            options += `<option value="${item.id}">${item.nama}</option>`;
                        });
                        $("#pelanggan").html(options); // Masukkan data ke select
                    },
                    error: function () {
                        showToastError("Tidak dapat mengambil data pelanggan");
                    },
                });
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

    // Ketika button payment ditekan
    $(document).on("click", "#payment", function (e) {
        e.preventDefault();

        Swal.fire({
            title: "Konfirmasi Pembayaran",
            text: "Apakah kamu yakin ingin melanjutkan ke pembayaran?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Lanjutkan!",
            cancelButtonText: "Batal",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                prosesCheckout(); // Panggil fungsi pembayaran
            } else {
                Swal.fire("Dibatalkan", "Transaksi belum diproses.", "info");
            }
        });
    });

    function prosesCheckout() {
        const csrfToken = $('meta[name="csrf-token"]').attr("content");
        const pelanggan = $("#pelanggan").val();
        const diskon = $("#diskon").val();
        const transaksi_id = $("#kodetransaksi").text();
        const grandTotalText = $("#grandTotal").text();

        if (!pelanggan || !diskon || pelanggan === "Walk in Customer" || diskon === "zero") {
            showToast("danger", "Pelanggan atau diskon belum dipilih.");
            return;
        }

        const grandTotal = parseInt(grandTotalText.replace(/[^\d]/g, ""), 10); // Hapus format Rp
        const token = localStorage.getItem('token');
        // Ambil kodekeranjang dulu
        $.ajax({
            url: "/api/keranjang/getKodeKeranjang",
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (res) {
                if (res.success && res.kode) {
                    const kodekeranjang = res.kode;

                    // Kirim data pembayaran lengkap
                    $.ajax({
                        url: "/api/transaksi/payment",
                        type: "POST",
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },
                        data: {
                            pelangganID: pelanggan,
                            diskonID: diskon,
                            transaksiID: transaksi_id,
                            kodeKeranjangID: kodekeranjang,
                            total: grandTotal,
                        },
                        success: function (res) {
                            if (res.success) {
                                showToastSuccess(res.message);

                                // Reset tampilan
                                getKeranjang();
                                getNampanProduk('all');
                                getNampan();
                                $("#grandTotal").text("Rp0");
                                $("#total").text("Rp0");
                                $("#subtotal").text("Rp0");
                                $("#diskonDipilih").text("0 %");
                                $("#pelanggan").val("");
                                $("#diskon").val("");

                                // window.open(`/admin/transaksi/cetak/${res.transaksi_id}`, "_blank"); // jika ingin cetak otomatis
                            } else {
                                showToastError(res.message || "Terjadi kesalahan saat memproses transaksi.")
                            }
                        },
                        error: function (xhr) {
                            let errorMsg = "Gagal memproses pembayaran.";
                            if (xhr.responseJSON && xhr.responseJSON.message) {
                                errorMsg = xhr.responseJSON.message;
                            }
                            showToastError(errorMsg)
                        }
                    });

                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Terjadi Kesalahan",
                        text: "Gagal mengambil kode keranjang.",
                        showConfirmButton: true
                    });
                    showToastError(errorMsg)
                }
            },
            error: function () {
                showToastError("Terjadi kesalahan saat mengambil kode keranjang.")
            }
        });
    }


    //load data pelanggan
    function getTransaksi() {
        // Datatable
        if ($('#transaksiTable').length > 0) {
            tableTransaksi = $('#transaksiTable').DataTable({
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
                    url: `/api/transaksi/getTransaksi`, // Ganti dengan URL endpoint server Anda
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
                        data: "tanggal",
                    },
                    {
                        data: "kodetransaksi",
                    },
                    {
                        data: "pelanggan.nama",
                    },
                    {
                        data: "total",
                        render: function (data, type, row) {
                            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(data);
                        }
                    },
                    {
                        data: 'status',
                        render: function (data, type, row) {
                            // Menampilkan badge sesuai dengan status
                            if (data == 1) {
                                return `<span class="badge bg-warning fw-medium fs-10"><b>BELUM DIBAYAR</b></span>`;
                            } else if (data == 2) {
                                return `<span class="badge bg-success fw-medium fs-10"><b>DIBAYAR</b></span>`;
                            } else {
                                return `<span class="badge bg-danger fw-medium fs-10"><b>BATAL</b></span>`;
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
                                    <a class="me-2 edit-icon p-2 btn-detail" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="CETAK TRANSAKSI">
                                        <i class="fas fa-print"></i>
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



    //ketika button tambah di tekan
    $("#modalTransaksi").on("click", function () {
        if ($.fn.DataTable.isDataTable('#transaksiTable')) {
            $('#transaksiTable').DataTable().clear().destroy();
        }
        getTransaksi();
        $("#mdTransaksi").modal("show");
    });

})