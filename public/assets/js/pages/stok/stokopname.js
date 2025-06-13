$(document).ready(function () {

    const token = localStorage.getItem('token');

    $.ajax({
        url: "/api/nampan/getNampan", // Endpoint untuk mendapatkan data jabatan
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (response) {
            let options = `<option value="">-- Pilih Nampan --</option>`; // Tambahkan opsi default
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

    function tampilkanStokOpnameDenganPagination(data, page = 1, perPage = 5) {
        const listEl = $("#list-so");
        const paginationEl = $("#pagination-so");
        const infoEl = $("#info-so");

        listEl.empty();
        paginationEl.empty();
        infoEl.empty();

        const total = data.length;
        const totalPages = Math.ceil(total / perPage);
        const start = (page - 1) * perPage;
        const end = Math.min(start + perPage, total);
        const slicedData = data.slice(start, end);

        // Render List
        slicedData.forEach(item => {
            const statusClass = item.status === "Final" ? 'bg-success' :
                item.status === "Dibatalkan" ? 'bg-warning' : 'bg-secondary';

            const listItem = `
            <li class="list-group-item d-flex justify-content-between align-items-start">
                <div class="ms-2 me-auto">
                    <div class="fw-bold">Periode SO: ${item.periode}</div>
                    ${item.created_at}
                </div>
                <span class="badge ${statusClass} rounded-pill">${item.status}</span>
            </li>`;
            listEl.append(listItem);
        });

        // Placeholder
        const placeholders = perPage - slicedData.length;
        for (let i = 0; i < placeholders; i++) {
            listEl.append(`<li class="list-group-item list-placeholder">&nbsp;</li>`);
        }

        // Info
        infoEl.text(`Menampilkan ${start + 1} sampai ${end} dari ${total} data`);

        // Render Pagination
        // Previous
        paginationEl.append(`
        <li class="page-item ${page === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${page - 1}" aria-label="Sebelumnya">
                &laquo;
            </a>
        </li>`);

        // Pages
        for (let i = 1; i <= totalPages; i++) {
            const activeClass = (i === page) ? "active" : "";
            paginationEl.append(`
            <li class="page-item ${activeClass}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>`);
        }

        // Next
        paginationEl.append(`
        <li class="page-item ${page === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${page + 1}" aria-label="Selanjutnya">
                &raquo;
            </a>
        </li>`);

        // Klik Event
        $(".page-link").on("click", function (e) {
            e.preventDefault();
            const selectedPage = parseInt($(this).data("page"));
            if (!isNaN(selectedPage) && selectedPage >= 1 && selectedPage <= totalPages) {
                tampilkanStokOpnameDenganPagination(data, selectedPage, perPage);
            }
        });
    }

    const dataSO = [
        { periode: "2025-06-14", created_at: "2025-06-14 03:51:20", status: "Final" },
        { periode: "2025-06-13", created_at: "2025-06-13 12:11:05", status: "Dibatalkan" },
        { periode: "2025-06-12", created_at: "2025-06-12 08:33:20", status: "Final" },
        { periode: "2025-06-11", created_at: "2025-06-11 19:55:10", status: "Final" },
        { periode: "2025-06-10", created_at: "2025-06-10 15:22:50", status: "Dibatalkan" },
        { periode: "2025-06-09", created_at: "2025-06-09 10:41:25", status: "Final" },
        { periode: "2025-06-08", created_at: "2025-06-08 09:30:00", status: "Final" }
    ];

    tampilkanStokOpnameDenganPagination(dataSO, 1, 5); // halaman pertama, 5 per halaman

})