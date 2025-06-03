$(document).ready(function () {

    let lastScannedCode = null;

    function onScanSuccess(decodedText, decodedResult) {
        if (decodedText === lastScannedCode) return;
        lastScannedCode = decodedText;

        $("#result").val(decodedText);
        let kodeProduk = decodedText;
        var CSRF_TOKEN = $('meta[name="csrf-token"]').attr("content");
        const token = localStorage.getItem('token');
        $.ajax({
            url: `/api/scanbarcode/getProdukByScanbarcode/${kodeProduk}`,
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (data) {
                if (data.success == true) {
                    let produk = data.Data; // ✅ Ambil data dari 'Data'

                    $('#kodeproduk').text(produk.kodeproduk);
                    $('#namaImage').text(produk.nama);
                    $('#jenisproduk').text(produk.jenisproduk ? produk.jenisproduk.jenis_produk : '-');
                    $('#berat').text(parseFloat(produk.berat).toFixed(1) + " gram");
                    $('#karat').text(produk.karat + " K");
                    $('#lingkar').text(produk.lingkar + " cm");
                    $('#panjang').text(produk.panjang + " cm");
                    $('#harga').text(formatRupiah(produk.harga_jual));

                    $('#status').html(
                        produk.status == 1
                            ? '<span class="badge badge-success">READY</span>'
                            : '<span class="badge badge-danger">NON READY</span>'
                    );

                    $('#keterangan').text(produk.keterangan);

                    $('#barcode').attr('src', produk.image_produk ? `/storage/barcode/${produk.image_produk}` : '/assets/img/notfound.png');
                    $('#imageProduk').attr('src', produk.image_produk ? `/storage/produk/${produk.image_produk}` : '/assets/img/notfound.png');

                    showToastSuccess(data.message)

                    setTimeout(() => {
                        lastScannedCode = null;
                    }, 3000);
                } else {
                    showToastError(data.message || "Terjadi kesalahan saat memproses data.")

                    // Reset scanner
                    setTimeout(() => {
                        lastScannedCode = null;
                    }, 3000);
                }
            },
            error: function (jqXHR) {
                // Tangani error dari server (404, 500, dsb)
                let errorMessage = "Terjadi kesalahan saat memproses permintaan.";
                if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
                    errorMessage = jqXHR.responseJSON.message;
                }

                showToastError(errorMessage)

                // Reset scanner
                setTimeout(() => {
                    lastScannedCode = null;
                }, 3000);
            }
        });
    }


    // Fungsi untuk format angka menjadi Rupiah
    function formatRupiah(angka) {
        // Membulatkan angka ke bilangan bulat dan menghilangkan angka di belakang koma
        angka = Math.floor(angka);

        // Mengubah angka menjadi format Rupiah dengan titik sebagai pemisah ribuan
        return "Rp. " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function onScanFailure(error) {
        // boleh log jika perlu
    }

    const html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        {
            fps: 10,
            qrbox: {
                width: 250,
                height: 250,
            },
        },
        false
    );

    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
});
