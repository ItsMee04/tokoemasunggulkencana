$(document).ready(function () {
    const csrfToken = $('meta[name="csrf-token"]').attr('content');

    // Setup default header AJAX untuk CSRF token
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': csrfToken
        }
    });

    $('.logout').on('click', function (e) {
        e.preventDefault();

        const token = localStorage.getItem('token'); // ambil dari localStorage

        if (!token) {
            alert('Token tidak ditemukan, silakan login ulang.');
            return;
        }

        // 1. Hapus token di backend (API Sanctum)
        $.ajax({
            url: '/api/logout',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function () {
                // 2. Hapus token dari localStorage
                localStorage.removeItem('token');

                // 3. Logout session (Web)
                $.ajax({
                    url: '/logout',
                    type: 'POST',
                    success: function () {
                        showToastSuccess('Logout berhasil!');
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 500); // kasih jeda biar toast sempat tampil
                    },
                    error: function (xhr) {
                        const msg = xhr.responseJSON?.message || 'Logout session gagal';
                        showToastError(msg);
                    }
                });
            },
            error: function (xhr) {
                const msg = xhr.responseJSON?.message || 'Logout token gagal';
                showToastError(msg);
            }
        });
    });
});
