$(document).ready(function () {
    // Inisialisasi tooltip Bootstrap
    function initializeTooltip() {
        $('[data-bs-toggle="tooltip"]').tooltip();
    }

    //function refresh
    $(document).on("click", "#refreshButton", function () {
        if (tableProduk) {
            tableProduk.ajax.reload(null, false); // Reload data dari server
        }
        showToastSuccess("Data Produk Berhasil Direfresh")
    });

    //load data produk
    function getProduk() {
        // Datatable
        if ($('#produkTable').length > 0) {
            tableProduk = $('#produkTable').DataTable({
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
                    url: `/api/produk/getProduk`, // Ganti dengan URL endpoint server Anda
                    type: 'GET', // Metode HTTP (GET/POST)
                    dataSrc: 'Data', // Jalur data di response JSON
                    beforeSend: function (xhr) {
                        const token = localStorage.getItem('token');
                        if (token) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                        }
                    },
                    error: function (xhr) {
                        const msg = xhr.responseJSON?.message || 'Gagal mengambil data produk';
                        showToastError(msg);
                    }
                },
                columns: [
                    {
                        data: null, // Kolom nomor urut
                        render: function (data, type, row, meta) {
                            return meta.row + 1 + "."; // Nomor urut dimulai dari 1
                        },
                        orderable: false,
                    },
                    {
                        data: "kodeproduk",
                    },
                    {
                        data: "image_produk", // Nama field dari API
                        render: function (data, type, row) {
                            let timestamp = new Date().getTime(); // Gunakan timestamp untuk cache busting
                            return `
                            <div class="productimgname">
                                <a href="javascript:void(0);" class="product-img stock-img">
                                    <img src="/storage/produk/${data}?t=${timestamp}" alt="produk">
                                </a>
                                <a href="javascript:void(0);">${row.nama}</a>
                            </div>
                        `;
                        },
                        orderable: false,
                        searchable: false
                    },
                    {
                        data: "berat",
                        render: function (data, type, row) {
                            return parseFloat(data).toFixed(1) + " gram"; // Menampilkan 1 angka desimal
                        }
                    },
                    {
                        data: "karat",
                        render: function (data, type, row) {
                            return data + " K"; // Menampilkan K
                        }
                    },
                    {
                        data: "harga_jual",
                        render: function (data, type, row) {
                            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(data);
                        }
                    },
                    {
                        data: 'status',
                        render: function (data, type, row) {
                            // Menampilkan badge sesuai dengan status
                            if (data == 1) {
                                return `<span class="badge bg-success fw-medium fs-10"><b>IN STOCK</b></span>`;
                            } else if (data == 2) {
                                return `<span class="badge bg-danger fw-medium fs-10"><b>SOLD</b></span>`;
                            } else {
                                return `<span class="badge bg-secondary fw-medium fs-10"><b>TIDAK AKTIF</b></span>`;
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
                                <a class="me-2 edit-icon p-2 btn-detail" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="DETAIL PRODUK">
                                    <i data-feather="eye" class="action-eye"></i>
                                </a>
                                <a class="me-2 p-2 btn-edit" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="EDIT PRODUK">
                                    <i data-feather="edit" class="feather-edit"></i>
                                </a>
                                <a class="confirm-text p-2" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="HAPUS PRODUK">
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

    //panggul function getProduk
    getProduk();

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

    //ketika button tambah di tekan
    $("#btnTambahProduk").on("click", function () {
        uploadImage("imageproduk", "imageProdukPreview");
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
                $("#jenisproduk").html(options); // Masukkan data ke select
            },
            error: function () {
                showToastError("Tidak dapat mengambil data jenis produk.")
            },
        });

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
                showToastError("Tidak dapat mengambil data kondisi.")
            },
        });

        $("#mdTambahProduk").modal("show");

    });

    //ketika submit form tambah produk
    $("#formTambahProduk").on("submit", function (event) {
        event.preventDefault(); // Mencegah form submit secara default
        // Ambil elemen input file
        const token = localStorage.getItem('token');
        // Buat objek FormData
        const formData = new FormData(this);
        $.ajax({
            url: "/api/produk/storeProduk", // Endpoint Laravel untuk menyimpan pegawai
            type: "POST",
            data: formData,
            processData: false, // Agar data tidak diubah menjadi string
            contentType: false, // Agar header Content-Type otomatis disesuaikan
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                showToastSuccess(response.message)
                $("#mdTambahProduk").modal("hide"); // Tutup modal
                tableProduk.ajax.reload(null, false); // Reload data dari server
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

    // Ketika modal ditutup, reset semua field
    $("#mdTambahProduk").on("hidden.bs.modal", function () {
        // Reset form input (termasuk gambar dan status)
        $("#formTambahProduk")[0].reset();
    });

    //ketika button edit di tekan
    $(document).on("click", ".btn-edit", function () {
        const produkID = $(this).data("id");
        const token = localStorage.getItem('token');
        $.ajax({
            url: `/api/produk/getProdukByID/${produkID}`, // Endpoint untuk mendapatkan data pegawai
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                // Ambil data pertama
                let data = response.Data[0];

                editUploadImage("editImageproduk", "editImageProdukPreview");
                // Isi modal dengan data produk
                $("#editid").val(data.id);
                $("#editkodeprouk").val(data.kodeproduk);

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

                $("#editnama").val(data.nama);
                $("#editberat").val(data.berat);
                $("#editkarat").val(data.karat);
                $("#editlingkar").val(data.lingkar);
                $("#editpanjang").val(data.panjang);
                $("#edithargajual").val(data.harga_jual);
                $("#edithargabeli").val(data.harga_beli);
                $("#editketerangan").val(data.keterangan);

                // Update preview gambar dengan background-image
                let imageSrc = data.image_produk
                    ? `/storage/produk/${data.image_produk}`
                    : `/assets/img/notfound.png`;

                $("#editImageProdukPreview").css({
                    "background-image": `url('${imageSrc}')`,
                    "background-size": "cover",
                    "background-position": "center",
                });

                // Tampilkan modal edit
                $("#mdEditProduk").modal("show");
            },
            error: function () {
                showToastError("Tidak dapat mengambil data kondisi")
            },
        });
    });

    // Ketika modal ditutup, reset semua field
    $("#mdEditProduk").on("hidden.bs.modal", function () {
        // Reset form input (termasuk gambar dan status)
        $("#formEditProduk")[0].reset();
    });

    // // Kirim data ke server saat form disubmit
    $(document).on("submit", "#formEditProduk", function (e) {
        e.preventDefault(); // Mencegah form submit secara default

        // Buat objek FormData
        const formData = new FormData(this);
        // Ambil ID dari form
        const idProduk = formData.get("id"); // Mengambil nilai input dengan name="id"
        const token = localStorage.getItem('token');
        // Kirim data ke server menggunakan AJAX
        $.ajax({
            url: `/api/produk/updateProduk/${idProduk}`, // URL untuk mengupdate data pegawai
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
                $("#mdEditProduk").modal("hide"); // Tutup modal
                tableProduk.ajax.reload(null, false); // Reload data dari server
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
                fetch(`/api/produk/deleteProduk/${deleteID}`, {
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
                                tableProduk.ajax.reload(null, false);
                            } else {
                                showToastError(data.message || "Terjadi kesalahan saat menghapus data.");
                            }
                        });
                    })
                    .catch((error) => {
                        showToastError("Terjadi kesalahan dalam penghapusan data");
                    });
            } else {
                // Jika batal, beri tahu pengguna
                showToastError("Dibatalkan, Data tidak dihapus.");
            }
        });
    });

    // Ketika tombol detail produk ditekan
    $(document).on("click", ".btn-detail", function () {
        const produkID = $(this).data("id");
        const token = localStorage.getItem('token');
        // Mengambil data produk berdasarkan ID
        $.ajax({
            url: `/api/produk/getProdukByID/${produkID}`, // Sesuaikan dengan route API Laravel
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                // Ambil data pertama
                let data = response.Data[0];
                // Menampilkan data produk pada elemen yang sesuai
                $('#detailkodeproduk').text(data.kodeproduk);
                $('#detailnamaImage').text(data.nama);
                $('#detailjenisproduk').text(data.jenisproduk.jenis_produk);
                $('#detailberat').text(data.berat);
                $('#detailkarat').text(data.karat);
                $('#detaillingkar').text(data.lingkar);
                $('#detailpanjang').text(data.panjang);
                $('#detailharga').text(formatRupiah(data.harga_jual));
                // Menentukan status produk
                if (data.status == 1) {
                    $('#detailstatus').html('<span class="badge badge-success"><b>IN STOCK</b></span>'); // Menampilkan badge sukses
                } else {
                    $('#detailstatus').html('<span class="badge badge-danger"><b>OUT STOCK</b></span>'); // Menampilkan badge danger
                }
                $('#detailketerangan').text(data.keterangan);

                // Menampilkan barcode gambar
                if (data.image_produk) {
                    $('#detailbarcode').attr('src', `/storage/barcode/${data.image_produk}`);
                } else {
                    $('#detailbarcode').attr('src', '/assets/img/notfound.png');
                }

                // Menampilkan gambar
                if (data.image_produk) {
                    $('#detailimageProduk').attr('src', `/storage/produk/${data.image_produk}`);
                } else {
                    $('#detailimageProduk').attr('src', '/assets/img/notfound.png');
                }

                $('#modalDetailProduk').modal('show');
            },
            error: function (xhr, status, error) {
                const errors = xhr.responseJSON.errors;
                if (errors) {
                    let errorMessage = "";
                    for (let key in errors) {
                        errorMessage += `${errors[key][0]}\n`;
                    }
                    const dangertoastExamplee =
                        document.getElementById("dangerToast");
                    const toast = new bootstrap.Toast(dangertoastExamplee);
                    $(".toast-body").text(errorMessage);
                    toast.show();
                }
            }
        });

        // Fungsi untuk format angka menjadi Rupiah
        function formatRupiah(angka) {
            // Membulatkan angka ke bilangan bulat dan menghilangkan angka di belakang koma
            angka = Math.floor(angka);

            // Mengubah angka menjadi format Rupiah dengan titik sebagai pemisah ribuan
            return "Rp. " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
    });
})