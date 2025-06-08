$(document).ready(function () {
    // Inisialisasi tooltip Bootstrap
    function initializeTooltip() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl, {
                trigger: 'hover focus', // Hover: tampil saat mouse masuk | Focus: sembunyi saat klik
                placement: 'top'
            });
        });
    }

    $(document).on('click', '[data-bs-toggle="tooltip"]', function () {
        const tooltip = bootstrap.Tooltip.getInstance(this);
        if (tooltip) {
            tooltip.hide();
        }
    });


    $('#produk-input').on('input', function () {
        const query = $(this).val();

        if (query.length < 2) {
            $('#autocomplete-results').hide();
            return;
        }

        $.ajax({
            url: '/api/produk/getProdukBySearch',
            method: 'GET',
            data: { q: query },
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            success: function (data) {
                const results = $('#autocomplete-results');
                results.empty();

                if (data.length === 0) {
                    results.append('<div>Tidak ditemukan</div>');
                } else {
                    data.forEach(item => {
                        results.append(`<div data-id="${item.id}"  data-kodeproduk="${item.kodeproduk}" data-nama="${item.nama}">${item.nama}</div>`);
                    });
                }

                results.show();
            }
        });
    });

    // Klik salah satu hasil
    $('#autocomplete-results').on('click', 'div', function () {
        const nama = $(this).data('nama');
        const id = $(this).data('id');
        const kodeproduk = $(this).data('kodeproduk');

        $('#produk-input').val(nama);
        $('#produk_id').val(id);
        $('#autocomplete-results').hide();

        // Cek apakah produk ID sudah ada di tabel
        let exists = false;
        $('#tableProdukCetakBarcode tbody tr').each(function () {
            if ($(this).find('td:nth-child(2)').text() === id) {
                exists = true;
                return false; // break
            }
        });

        if (!exists) {
            let newRow = `
            <tr>
                <td>${id}</td>
                <td>${nama}</td>
                <td>${kodeproduk}</td>
                <td class="text-center">
                    <a href="javascript:void(0);" class="btn btn-sm delete-row" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="BATAL CETAK">
                        <i class="fas fa-trash"></i>
                    </a>
                </td>
            </tr>
        `;
            $('#tableProdukCetakBarcode tbody').append(newRow);
            feather.replace();
            initializeTooltip();
        } else {
            alert("Produk sudah ditambahkan.");
        }
    });

    // Klik di luar autocomplete => tutup
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.autocomplete-wrapper').length) {
            $('#autocomplete-results').hide();
        }
    });

    $(document).on('click', '.delete-row', function () {
        $(this).closest('tr').remove();
    });

    $('#cetakbarcode').on('click', function () {
        let kodeProdukArray = [];

        $('#tableProdukCetakBarcode tbody tr').each(function () {
            let kodeproduk = $(this).find('td:nth-child(3)').text().trim();
            if (kodeproduk) {
                kodeProdukArray.push(kodeproduk);
            }
        });

        const token = localStorage.getItem('token');

        fetch('/api/report/cetakBarcodeProduk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ kodeproduk: kodeProdukArray })
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
                return response.blob();  // ambil isi file sebagai blob
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'CetakBarcodeProduk.pdf';  // nama file
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url); // bersihkan object URL
            })
            .catch(error => {
                console.error('Error:', error);
                showToastError('Gagal mencetak barcode: ' + error.message);
            });
    });


});