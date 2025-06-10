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
        showToastSuccess("Data Transaksi Pembelian Berhasil Direfresh");
    });

    //load data pembelian
    function getPembelian() {
        // Datatable
        if ($('#pembelianTable').length > 0) {
            tablePembelian = $('#pembelianTable').DataTable({
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
                    url: `/api/pembelian/getPembelian`, // Ganti dengan URL endpoint server Anda
                    type: 'GET', // Metode HTTP (GET/POST)
                    dataSrc: 'Data', // Jalur data di response JSON
                    beforeSend: function (xhr) {
                        const token = localStorage.getItem('token');
                        if (token) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                        }
                    },
                    error: function (xhr) {
                        const msg = xhr.responseJSON?.message || 'Gagal mengambil data pembelian';
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
                        data: "kodepembelian",
                    },
                    {
                        data: "tanggal",
                    },
                    {
                        data: null,
                        render: function (data, type, row) {
                            if (row.suplier_id === null && row.pelanggan_id === null && row.nonsuplierdanpembeli !== null) {
                                // Jika bukan dari suplier/pelanggan, tampilkan input bebas (nonsuplierdanpembeli)
                                return row.nonsuplierdanpembeli;
                            } else if (row.suplier_id !== null && row.suplier && row.suplier.suplier) {
                                // Jika ada suplier_id dan objek suplier valid
                                return row.suplier.suplier;
                            } else if (row.pelanggan_id !== null && row.pelanggan && row.pelanggan.nama) {
                                // Jika ada pelanggan_id dan objek pelanggan valid
                                return row.pelanggan.nama;
                            } else {
                                return "-";
                            }
                        }
                    },
                    {
                        data: "total_harga",
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
                        className: "action-table-data justify-content-center",
                        render: function (data, type, row, meta) {
                            if (row.status === 1) {
                                return `
                                    <div class="edit-delete-action">
                                        <a class="me-2 edit-icon p-2 btn-detail" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="DETAIL TRANSAKSI">
                                            <i data-feather="eye" class="action-eye"></i>
                                        </a>
                                        <a class="me-2 p-2 confirm-payment" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="KONFIRMASI PEMBAYARAN">
                                            <i data-feather="check-circle" class="feather-edit"></i>
                                        </a>
                                        <a class="cancel-payment p-2" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="BATALKAN PEMBAYARAN">
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
    getPembelian();

    // ketika button hapus di tekan
    $(document).on("click", ".confirm-payment", function () {
        const deleteID = $(this).data("id");
        const token = localStorage.getItem('token');
        // SweetAlert2 untuk konfirmasi
        Swal.fire({
            title: "Konfirmasi Pembelian",
            text: "Pembelian Sudah Dilakukan ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Sudah!",
            cancelButtonText: "Batal",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                // Kirim permintaan hapus (gunakan itemId)
                fetch(`/api/pembelian/konfirmasiPembelian/${deleteID}`, {
                    method: "GET",
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                })
                    .then((response) => {
                        return response.json().then((data) => {
                            if (response.ok) {
                                showToastSuccess(data.message || "Pembelian berhasil dikonfirmasi.");
                                // Reload DataTables (misal pakai tableJabatan)
                                tablePembelian.ajax.reload(null, false);
                            } else {
                                showToastError(data.message || "Terjadi kesalahan saat konfirmasi pembelian.");
                            }
                        });
                    })
                    .catch((error) => {
                        showToastError("Terjadi kesalahan dalam konfirmasi pembelian.");
                    });
            } else {
                // Jika batal, beri tahu pengguna
                showToastError("Dibatalkan, Pembelian tidak dikonfirmasi.");
            }
        });
    });

    // ketika button hapus di tekan
    $(document).on("click", ".cancel-payment", function () {
        const deleteID = $(this).data("id");
        const token = localStorage.getItem('token');
        // SweetAlert2 untuk konfirmasi
        Swal.fire({
            title: "Pembatalan Pembelian",
            text: "Konfirmasi Pembatalan pembelian ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Batalkan!",
            cancelButtonText: "Batal",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                // Kirim permintaan hapus (gunakan itemId)
                fetch(`/api/pembelian/konfirmasiPembatalanPembelian/${deleteID}`, {
                    method: "GET",
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                })
                    .then((response) => {
                        return response.json().then((data) => {
                            if (response.ok) {
                                showToastSuccess(data.message);
                                // Reload DataTables (misal pakai tableJabatan)
                                tablePembelian.ajax.reload(null, false);
                            } else {
                                showToastError("Terjadi kesalahan saat konfirmasi pembatalan pembelian");
                            }
                        });
                    })
                    .catch((error) => {
                        showToastError("Terjadi kesalahan dalam konfirmasi pembatalan pembelian.");
                    });
            } else {
                // Jika batal, beri tahu pengguna
                showToastError("Dibatalkan, Pembatalan Pembelian tidak dikonfirmasi.");
            }
        });
    });

    //ketika button edit di tekan
    $(document).on("click", ".btn-detail", function () {
        const produkID = $(this).data("id");
        const token = localStorage.getItem('token');
        $.ajax({
            url: `/api/pembelian/getPembelianByID/${produkID}`, // Endpoint untuk mendapatkan data pegawai
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                //Ambil data pertama
                let data = response.Data[0];

                if (data.pelanggan !== null) {
                    $("#namapelanggan").text(data.pelanggan.nama);
                    $("#alamatpelanggan").text(data.pelanggan.alamat);
                    $("#kontakpelanggan").text(data.pelanggan.kontak);
                } else if (data.suplier !== null) {
                    $("#namapelanggan").text(data.suplier.suplier); // jika menggunakan field "suplier"
                    $("#alamatpelanggan").text(data.suplier.alamat ?? "-");
                    $("#kontakpelanggan").text(data.suplier.kontak ?? "-");
                } else {
                    // fallback jika tidak ada pelanggan/suplier (misalnya dari luar)
                    $("#namapelanggan").text(data.nonsuplierdanpembeli ?? "-");
                    $("#alamatpelanggan").text("-");
                    $("#kontakpelanggan").text("-");
                }

                $("#kodetransaksi").text(data.kodepembelian);
                let tanggalAsli = data.tanggal; // misalnya "2025-04-07"
                let tanggalBaru = new Date(tanggalAsli);

                $("#cetakkodepembelian").attr("data-kodepembelian", data.kodepembelian);

                if (data.status == 0) {
                    $("#cetakkodepembelian").closest("li").hide(); // sembunyikan jika status BATAL
                } else {
                    $("#cetakkodepembelian").closest("li").show(); // tampilkan kalau status 1 atau 2
                }

                // Format: 7 April 2025
                let tanggalFormatted = new Intl.DateTimeFormat('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }).format(tanggalBaru);

                $("#tanggaltransaksi").text(tanggalFormatted);

                let statusHTML = "";

                if (data.status == 1) {
                    statusHTML = `<span class="badge bg-warning fw-medium fs-10"><b>BELUM DIBAYAR</b></span>`;
                } else if (data.status == 2) {
                    statusHTML = `<span class="badge bg-success fw-medium fs-10"><b>DIBAYAR</b></span>`;
                } else {
                    statusHTML = `<span class="badge bg-danger fw-medium fs-10"><b>BATAL</b></span>`;
                }

                $("#statustransaksi").html(statusHTML);
                $("#oleh").text(data.user.pegawai.nama);

                // Kosongkan isi tbody dulu
                $("#pembelianProduk tbody").empty();

                let subtotalharga = 0;
                let totalHargaBeli = 0;

                // Loop setiap item dalam keranjang
                data.pembelianproduk.forEach(function (item) {
                    let hargaBeli = Number(item.harga_beli);
                    let subtotal = Number(item.subtotalharga);

                    totalHargaBeli += hargaBeli;
                    subtotalharga += subtotal;

                    // let tombolPrint = "";
                    // if (data.status != 0) {
                    //     tombolPrint = `<a href="javascript:void(0);" id="printSuratBarang" data-kodetransaksi="${data.kodepembelian}" data-kodeproduk="${item.kodeproduk}" class="btn btn-icon btn-sm btn-soft-secondary rounded-pill"><i class="feather-printer"></i></a>`;
                    // }


                    let row = `
                        <tr>
                            <td>${item.kodeproduk}</td>
                            <td>${item.nama}</td>
                            <td>${parseFloat(item.berat).toFixed(1)} gram</td>
                            <td>Rp ${hargaBeli.toLocaleString('id-ID')}</td>
                            <td>Rp ${subtotal.toLocaleString('id-ID')}</td>
                        </tr>
                    `;

                    $("#pembelianProduk tbody").append(row);
                });

                // Format ke mata uang rupiah
                let formatRupiah = angka => "Rp " + angka.toLocaleString('id-ID');

                // Tampilkan ke elemen HTML
                $("#subtotal").next("h5").text(formatRupiah(subtotalharga));
                $("#diskon").next("h5").text(`0 %`);
                $("#totalharga").next("h5").text(formatRupiah(data.total_harga));

                // Tampilkan modal edit
                $("#detailPembelian").modal("show");
            },
            error: function () {
                showToastError("Tidak dapat mengambil data pembelian.");
            },
        });
    });

    $(document).on("click", "#cetakkodepembelian", function (e) {
        e.preventDefault();

        const kodeTransaksi = $(this).data("kodepembelian");
        const token = localStorage.getItem('token');

        fetch('/api/report/cetakNotaPembelian', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/pdf'
            },
            body: JSON.stringify({
                kodepembelian: kodeTransaksi, // FIX: gunakan variabel yang benar
            })
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text); });
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank');
                setTimeout(() => window.URL.revokeObjectURL(url), 10000);
            })
            .catch(error => {
                console.error('Gagal mencetak nota pembelian:', error);
                showToastError("Gagal mencetak nota pembelian: " + error.message);
            });
    });
})