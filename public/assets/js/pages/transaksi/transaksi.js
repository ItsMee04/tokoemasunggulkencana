$(document).ready(function () {
    // Inisialisasi tooltip Bootstrap
    function initializeTooltip() {
        $('[data-bs-toggle="tooltip"]').tooltip();
    }

    //function refresh
    $(document).on("click", "#refreshButton", function () {
        if (tableTransaksi) {
            tableTransaksi.ajax.reload(null, false); // Reload data dari server
        }
        showToastSuccess("Data Transaksi Berhasil Direfresh")
    });

    //load data transaksi
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
                        data: null, // Kolom nomor urut
                        render: function (data, type, row, meta) {
                            return meta.row + 1; // Nomor urut dimulai dari 1
                        },
                        orderable: false,
                    },
                    {
                        data: "kodetransaksi",
                    },
                    {
                        data: "tanggal",
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

    //panggul function getKondisi
    getTransaksi();

    // ketika button hapus di tekan
    $(document).on("click", ".confirm-payment", function () {
        const deleteID = $(this).data("id");
        const token = localStorage.getItem('token');
        // SweetAlert2 untuk konfirmasi
        Swal.fire({
            title: "Konfirmasi Pembayaran",
            text: "Pembayaran Sudah Dilakukan ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Sudah!",
            cancelButtonText: "Batal",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                // Kirim permintaan hapus (gunakan itemId)
                fetch(`/api/transaksi/konfirmasiPembayaran/${deleteID}`, {
                    method: "GET",
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                })
                    .then((response) => {
                        if (response.ok) {
                            showToastSuccess("Pembayaran berhasil dikonfirmasi.")
                            tableTransaksi.ajax.reload(null, false); // Reload data dari server
                        } else {
                            showToastError("Terjadi kesalahan saat konfirmasi pembayaran.")
                        }
                    })
                    .catch((error) => {
                        showToastError("Terjadi kesalahan dalam konfirmasi pembayaran.")
                    });
            } else {
                // Jika batal, beri tahu pengguna
                showToastError("Dibatalkan, Data tidak dihapus.");
            }
        });
    });

    // ketika button hapus di tekan
    $(document).on("click", ".cancel-payment", function () {
        const deleteID = $(this).data("id");
        const token = localStorage.getItem('token');
        // SweetAlert2 untuk konfirmasi
        Swal.fire({
            title: "Pembatalan Pembayaran",
            text: "Konfirmasi pembayaran dibatalkan ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Batalkan!",
            cancelButtonText: "Batal",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                // Kirim permintaan hapus (gunakan itemId)
                fetch(`/api/transaksi/konfirmasiPembatalanPembayaran/${deleteID}`, {
                    method: "GET",
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                })
                    .then((response) => {
                        if (response.ok) {
                            showToastSuccess("Pembayaran berhasil dibatalkan.")
                            tableTransaksi.ajax.reload(null, false); // Reload data dari server
                        } else {
                            showToastError("Terjadi kesalahan saat pembatalan pembayaran.")
                        }
                    })
                    .catch((error) => {
                        showToastError("Terjadi kesalahan dalam pembatalan pembayaran.")
                    });
            } else {
                // Jika batal, beri tahu pengguna
                showToastError("Dibatalkan, Pembatalan pembayaran tidak dikonfirmasi.");
            }
        });
    });

    //ketika button edit di tekan
    $(document).on("click", ".btn-detail", function () {
        const produkID = $(this).data("id");
        const token = localStorage.getItem('token');
        $.ajax({
            url: `/api/transaksi/getTransaksiByID/${produkID}`, // Endpoint untuk mendapatkan data pegawai
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                // Ambil data pertama
                let data = response.Data[0];

                $("#namapelanggan").text(data.pelanggan.nama);
                $("#alamatpelanggan").text(data.pelanggan.alamat);
                $("#kontakpelanggan").text(data.pelanggan.kontak);
                $("#kodetransaksi").text(data.kodetransaksi);
                let tanggalAsli = data.tanggal; // misalnya "2025-04-07"
                let tanggalBaru = new Date(tanggalAsli);

                $("#cetakkodetransaksi").attr("data-kodetransaksi", data.kodetransaksi);

                if (data.status == 0) {
                    $("#cetakkodetransaksi").closest("li").hide(); // sembunyikan jika status BATAL
                } else {
                    $("#cetakkodetransaksi").closest("li").show(); // tampilkan kalau status 1 atau 2
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
                $("#transaksiProduk tbody").empty();

                // Loop setiap item dalam keranjang
                data.keranjang.forEach(function (item) {
                    let produk = item.produk;

                    let tombolCetak = '';
                    if (data.status != 0) {
                        tombolCetak = `
                        <a href="javascript:void(0);" id="printSuratBarang" data-kodetransaksi="${data.kodetransaksi}" data-kodeproduk="${produk.kodeproduk}" class="btn btn-icon btn-sm btn-soft-secondary rounded-pill">
                            <i class="fas fa-print"></i>
                        </a>`;
                    }

                    let row = `
                        <tr>
                            <td>${produk.kodeproduk}</td>
                            <td>${produk.nama}</td>
                            <td>${parseFloat(item.berat).toFixed(1)} gram</td>
                            <td>Rp ${Number(item.harga_jual).toLocaleString('id-ID')}</td>
                            <td>Rp ${Number(item.total).toLocaleString('id-ID')}</td>
                            <td>
                                <div class="hstack gap-2 fs-15">
                                    ${tombolCetak}
                                </div>
                            </td>
                        </tr>
                    `;

                    $("#transaksiProduk tbody").append(row);
                });

                let subtotal = 0;
                data.keranjang.forEach(function (item) {
                    subtotal += parseFloat(item.total);
                });

                // Ambil nilai diskon dari objek
                let diskonPersen = data.diskon ? parseFloat(data.diskon.nilai) : 0;

                // Hitung nilai diskon dalam rupiah
                let diskonRupiah = subtotal * (diskonPersen / 100);

                // Total harga setelah diskon
                let totalHarga = subtotal - diskonRupiah;

                // Format ke mata uang rupiah
                let formatRupiah = angka => "Rp " + angka.toLocaleString('id-ID');

                // Tampilkan ke elemen HTML
                $("#subtotal").next("h5").text(formatRupiah(subtotal));
                $("#diskon").next("h5").text(`${diskonPersen}% (-${formatRupiah(diskonRupiah)})`);
                $("#totalharga").next("h5").text(formatRupiah(totalHarga));

                // Tampilkan modal edit
                $("#detailTransaksi").modal("show");
            },
            error: function () {
                showToastError("Tidak dapat mengambil data transaksi.")
            },
        });
    });

    $(document).on("click", "#cetakkodetransaksi", function () {
        const kodeTransaksi = $(this).data("kodetransaksi");
        console.log("Kode Transaksi:", kodeTransaksi);

        // Lakukan aksi lainnya, misalnya cetak
        window.open(`/admin/report/cetakTransaksi/${kodeTransaksi}`, '_blank');
    });

    $(document).on("click", "#printSuratBarang", function (e) {
        e.preventDefault();

        const kodetransaksi = $(this).data("kodetransaksi");
        const kodeproduk = $(this).data("kodeproduk");

        const token = localStorage.getItem('token');

        fetch('/api/report/cetakSuratBarang', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/pdf'
            },
            body: JSON.stringify({
                kodetransaksi: kodetransaksi,
                kodeproduk: kodeproduk
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
                window.open(url, '_blank'); // Tampilkan PDF di tab baru
                setTimeout(() => window.URL.revokeObjectURL(url), 10000); // Bersihkan URL
            })
            .catch(error => {
                console.error('Gagal mencetak surat barang:', error);
                alert('Gagal mencetak surat barang: ' + error.message);
            });
    });


})