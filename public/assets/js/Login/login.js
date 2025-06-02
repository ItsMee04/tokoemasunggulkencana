$(document).ready(function () {
    const csrfToken = $('meta[name="csrf-token"]').attr('content');

    // Setup default header AJAX untuk CSRF token
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': csrfToken
        }
    });

    const flashContainer = document.querySelector('div[data-flash-error]');

    if (flashContainer) {
        const errorMessage = flashContainer.dataset.flashError;

        if (errorMessage && errorMessage.trim() !== "") {
            showToastError(errorMessage);
        }
    }

    // toggle-password
    if ($('.toggle-password').length > 0) {
        $(document).on('click', '.toggle-password', function () {
            $(this).toggleClass("fa-eye fa-eye-slash");
            var input = $(".pass-input");
            if (input.attr("type") == "password") {
                input.attr("type", "text");
            } else {
                input.attr("type", "password");
            }
        });
    }

    if (localStorage.getItem("remember") === "true") {
        $('#email').val(localStorage.getItem("email"));
        $('#password').val(localStorage.getItem("password"));
        $('#rememberMe').prop('checked', true);
    }


    // Reset form saat checkbox di-uncheck
    $('#rememberMe').on('change', function () {
        if (!$(this).is(':checked')) {
            // Reset isi form
            $('#email').val('');
            $('#password').val('');
            // Hapus localStorage juga
            localStorage.removeItem("email");
            localStorage.removeItem("password");
            localStorage.setItem("remember", false);
        }
    });

    $('#formLogin').on('submit', function (e) {
        e.preventDefault();

        let isValid = true;

        // Reset error
        $('#emailError, #passwordError').text('');
        $('#email, #password').removeClass('is-invalid');

        const email = $('#email').val().trim();
        const password = $('#password').val().trim();

        // Validasi email
        if (email === '') {
            $('#emailError').text('Email wajib diisi.');
            $('#email').addClass('is-invalid');
            isValid = false;
        }

        // Validasi password
        if (password === '') {
            $('#passwordError').text('Password wajib diisi.');
            $('#password').addClass('is-invalid');
            isValid = false;
        }

        if (isValid) {
            // Jika semua valid, submit form
            $.ajax({
                url: '/pushlogin', // endpoint kamu
                method: 'POST',
                data: {
                    email: email,
                    password: password
                },
                success: function (response) {
                    if (response.success) {
                        localStorage.setItem('token', response.access_token);
                        showToastSuccess(response.message);
                        setTimeout(() => {
                            window.location.href = response.redirect;
                        }, 500); // kasih jeda biar toast sempat tampil
                    } else {
                        showToastError(response.message);
                    }
                },
                error: function (xhr) {
                    const msg = xhr.responseJSON?.message || 'Login gagal';
                    showToastError(msg);
                }
            });
        }

        if ($('#rememberMe').is(':checked')) {
            localStorage.setItem("email", $('#email').val());
            localStorage.setItem("password", $('#password').val());
            localStorage.setItem("remember", true);
        } else {
            localStorage.removeItem("email");
            localStorage.removeItem("password");
            localStorage.setItem("remember", false);
        }
    });
})