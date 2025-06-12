$(document).ready(function () {

    const token = localStorage.getItem('token');

    $.ajax({
        url: "/api/nampan/getNampan", // Endpoint untuk mendapatkan data jabatan
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (response) {
            let options
            response.Data.forEach((item) => {
                options += `<option value="${item.id}">${item.nampan}</option>`;
            });
            $("#nampan").html(options); // Masukkan data ke select
        },
        error: function () {
            showToastError("Tidak dapat mengambil data kondisi.")
        },
    });

    $('#nampan').on('change', function () {
        var nampanId = $(this).val();

        if (nampanId) {
            $.ajax({
                url: '/api/stokopname/bynampan/' + nampanId,
                type: 'GET',
                success: function (res) {
                    $('#liststokopname').empty(); // Kosongkan dulu
                    if (res.length === 0) {
                        $('#liststokopname').append('<div class="text-muted">Belum ada stok opname.</div>');
                        return;
                    }

                    res.forEach(function (op) {
                        $('#liststokopname').append(`
                            <div class="row">
                                <div class="mb-3">
                                    <div class="card card-bg-secondary">
                                        <div class="card-body">
                                            <div class="d-flex align-items-center w-100">
                                                <div>
                                                    <div class="fs-15 fw-semibold">
                                                        PERIODE STOK OPNAME (${op.periode})
                                                    </div>
                                                    <p class="mb-0 text-fixed-white op-7 fs-12">
                                                        ${op.tanggal_jam}
                                                    </p>
                                                </div>
                                                <div class="ms-auto">
                                                    <a href="javascript:void(0);" class="text-fixed-white">
                                                        <span class="badge bg-light text-dark">${op.status}</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `);
                    });
                },
                error: function () {
                    showToastError("Gagal mengambil data stok opname");
                }
            });
        }
    });
})