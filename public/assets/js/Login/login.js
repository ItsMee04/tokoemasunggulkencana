$(document).ready(function () {
    // Ambil token CSRF dari meta tag
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

    function showToastSuccess(message) {
        const toast = document.createElement("div");
        toast.style.display = "flex";
        toast.style.alignItems = "center";
        toast.style.gap = "8px";
        toast.style.color = "white";

        const icon = document.createElement("i");
        icon.className = "fas fa-check-circle"; // icon centang success
        icon.style.fontSize = "16px";

        toast.appendChild(icon);

        const textSpan = document.createElement("span");
        textSpan.textContent = message || "Berhasil!";
        toast.appendChild(textSpan);

        Toastify({
            node: toast,
            duration: 2500,
            gravity: "top",
            position: "right",
            background: "linear-gradient(to right, #00b09b, #96c93d)",
            close: false,
            stopOnFocus: true,
        }).showToast();
    }

    function showToastError(message) {
        const toast = document.createElement("div");
        toast.style.display = "flex";
        toast.style.alignItems = "center";
        toast.style.gap = "8px";
        toast.style.color = "white";

        const icon = document.createElement("i");
        icon.className = "fas fa-exclamation-circle"; // icon tanda seru error
        icon.style.fontSize = "16px";

        toast.appendChild(icon);

        const textSpan = document.createElement("span");
        textSpan.textContent = message || "Terjadi kesalahan!";
        toast.appendChild(textSpan);

        Toastify({
            node: toast,
            duration: 2500,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)", // merah ke oranye
            close: false,
            stopOnFocus: true,
        }).showToast();
    }

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
                url: '/api/pushlogin', // endpoint kamu
                method: 'POST',
                data: {
                    email: email,
                    password: password
                },
                success: function (response) {
                    if (response.success) {
                        localStorage.setItem('token', response.access_token);
                        showToastSuccess(response.message);
                        window.location.href = response.redirect;
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