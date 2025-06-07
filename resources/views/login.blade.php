<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>LOGIN - TOKO EMAS UNGGUL KENCANA</title>
    <!-- Icon -->
    <link rel="shortcut icon" type="image/x-icon" href="{{ asset('assets/img/favicon.png') }}">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="{{ asset('assets/css/bootstrap.min.css') }}">
    <!-- FontAwesome -->
    <link rel="stylesheet" href="{{ asset('assets/plugins/fontawesome/css/fontawesome.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/plugins/fontawesome/css/all.min.css') }}">
    <!-- Toast CSS -->
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
</head>

<body class="account-page">
    <div id="global-loader">
        <div class="whirly-loader"> </div>
    </div>

    <div class="main-wrapper">
        <div class="account-content">
            <div class="login-wrapper login-new">
                <div class="container">
                    <div class="login-content user-login">
                        <div class="login-logo">
                            <img src="{{ asset('assets/img/logo.png') }}" alt="img">
                        </div>
                        <form id="formLogin">
                            <div class="login-userset">
                                <div class="login-userheading">
                                    <h3>Sign In</h3>
                                    <h4>Access the App panel using your email and passcode.</h4>
                                </div>
                                <div class="form-login">
                                    <label class="form-label">Email Address</label>
                                    <div class="form-addons">
                                        <input type="text" name="email" id="email" class="form-control">
                                        <img src="assets/img/icons/mail.svg" alt="img">
                                    </div>
                                    <small class="text-danger d-block" id="emailError"></small>
                                </div>
                                <div class="form-login">
                                    <label>Password</label>
                                    <div class="pass-group">
                                        <input type="password" name="password" id="password" class="pass-input">
                                        <span class="fas toggle-password fa-eye-slash"></span>
                                    </div>
                                    <small class="text-danger d-block" id="passwordError"></small>
                                </div>
                                <div class="form-login authentication-check">
                                    <div class="row">
                                        <div class="col-6">
                                            <div class="custom-control custom-checkbox">
                                                <label class="checkboxs ps-4 mb-0 pb-0 line-height-1">
                                                    <input type="checkbox" id="rememberMe">
                                                    <span class="checkmarks"></span>Remember me
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-login">
                                    <button class="btn btn-login" type="submit">Sign In</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="my-4 d-flex justify-content-center align-items-center copyright-text">
                        <p>Copyright &copy; 2023 Trifecta. All rights reserved</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div data-flash-error="{{ session('error') ?? '' }}" data-flash-success="{{ session('success') ?? '' }}"></div>

    <!-- JQuery JS -->
    <script src="{{ asset('assets/js/jquery-3.7.1.min.js') }}" type="text/javascript"></script>
    <!-- Feather Icon JS -->
    <script src="{{ asset('assets/js/feather.min.js') }}" type="text/javascript"></script>
    <!-- Bootstrap JS -->
    <script src="{{ asset('assets/js/bootstrap.bundle.min.js') }}" type="text/javascript"></script>
    <!-- SweetAlert 2 -->
    <script src="{{ asset('assets/plugins/sweetalert/sweetalert2.all.min.js') }}" type="text/javascript"></script>
    <script src="{{ asset('assets/plugins/sweetalert/sweetalerts.min.js') }}" type="text/javascript"></script>
    <!-- Toast JS -->
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
    <!-- Custom JS -->
    <script src="{{ asset('assets/js/login/login.js') }}" type="text/javascript"></script>
    <script src="{{ asset('assets/js/pages/customtoastfy.js') }}" type="text/javascript"></script>
    <script src="{{ asset('assets/js/script.js') }}" type="text/javascript"></script>
</body>

</html>
