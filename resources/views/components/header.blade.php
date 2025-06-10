<!-- Header -->
<div class="header">

    <!-- Logo -->
    <div class="header-left active">
        <a href="index.html" class="logo logo-normal">
            <img src="{{ asset('assets/img/logo.png') }}" alt="">
        </a>
        <a href="index.html" class="logo-small">
            <img src="{{ asset('assets/img/logo-small.png') }}" alt="">
        </a>
        <a id="toggle_btn" href="javascript:void(0);">
            <i data-feather="chevrons-left" class="feather-16"></i>
        </a>
    </div>
    <!-- /Logo -->

    <a id="mobile_btn" class="mobile_btn" href="#sidebar">
        <span class="bar-icon">
            <span></span>
            <span></span>
            <span></span>
        </span>
    </a>

    <!-- Header Menu -->
    <ul class="nav user-menu">

        <!-- Search -->
        <li class="nav-item nav-searchinputs">
            <div class="top-nav-search">
                <a href="javascript:void(0);" class="responsive-search">
                    <i class="fa fa-search"></i>
                </a>
                <form action="#" class="dropdown">
                    <div class="searchinputs dropdown-toggle" id="dropdownMenuClickable" data-bs-toggle="dropdown"
                        data-bs-auto-close="false">
                        <input type="text" id="search-input" placeholder="Search">
                        <div class="search-addon">
                            <span><i data-feather="x-circle" class="feather-14"></i></span>
                        </div>
                    </div>
                    <div class="dropdown-menu search-dropdown" aria-labelledby="dropdownMenuClickable">
                        <div class="search-info">
                            <h6><span><i data-feather="search" class="feather-16"></i></span>Pencarian Menu
                            </h6>
                            <ul class="search-tags">
                            </ul>
                        </div>
                    </div>
                </form>
            </div>
        </li>
        <!-- /Search -->

        <li style="width: 950px">
            <marquee><b class="text-secondary">TOKO EMAS UNGGUL KENCANA, RUKO N0. 8, JL. PATIMURA, KARANGLEWAS,
                    PURWOKERTO, BANYUMAS, JAWA TENGAH, 0822-2537-7888</b></marquee>
        </li>

        <li class="nav-item nav-item-box">
            <a href="javascript:void(0);" id="btnFullscreen">
                <i data-feather="maximize"></i>
            </a>
        </li>

        <li class="nav-item nav-item-box">
            <a href="email.html">
                <i data-feather="mail"></i>
                <span class="badge rounded-pill">1</span>
            </a>
        </li>

        <li class="nav-item dropdown has-arrow main-drop">
            <a href="javascript:void(0);" class="dropdown-toggle nav-link userset" data-bs-toggle="dropdown">
                <span class="user-info">
                    <span class="user-letter">
                        <img src="{{ asset('storage/avatar/' . Auth::user()->pegawai->image_pegawai) }}" alt=""
                            class="img-fluid">
                    </span>
                    <span class="user-detail">
                        <span class="user-name">{{ Auth::user()->pegawai->nama }}</span>
                        <span class="user-role">{{ Auth::user()->role->role }}</span>
                    </span>
                </span>
            </a>
            <div class="dropdown-menu menu-drop-user">
                <div class="profilename">
                    <div class="profileset">
                        <span class="user-img"><img
                                src="{{ asset('storage/avatar/' . Auth::user()->pegawai->image_pegawai) }}"
                                alt="">
                            <span class="status online"></span></span>
                        <div class="profilesets">
                            <h6>{{ Auth::user()->pegawai->nama }}</h6>
                            <h5>{{ Auth::user()->role->role }}</h5>
                        </div>
                    </div>
                    <hr class="m-0">
                    <a class="dropdown-item" href="profile.html"> <i class="me-2" data-feather="user"></i> My
                        Profile</a>
                    <a class="dropdown-item" href="general-settings.html"><i class="me-2"
                            data-feather="settings"></i>Settings</a>
                    <hr class="m-0">
                    <a class="dropdown-item logout pb-0"><img src="{{ asset('assets/img/icons/log-out.svg') }}"
                            class="me-2" alt="img">Logout</a>
                </div>
            </div>
        </li>
    </ul>
    <!-- /Header Menu -->

    <!-- Mobile Menu -->
    <div class="dropdown mobile-user-menu">
        <a href="javascript:void(0);" class="nav-link dropdown-toggle" data-bs-toggle="dropdown"
            aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
        <div class="dropdown-menu dropdown-menu-right">
            <a class="dropdown-item" href="profile.html">My Profile</a>
            <a class="dropdown-item" href="general-settings.html">Settings</a>
            <a class="dropdown-item">Logout</a>
        </div>
    </div>
    <!-- /Mobile Menu -->
</div>
<!-- /Header -->

<style>
    .search-dropdown .search-tags {
        width: auto;
        min-width: 300px;
        /* Agar tidak terlalu kecil */
        max-width: 50%;
        /* Tidak membatasi panjang maksimum */
    }

    .search-dropdown .search-tags li a {
        white-space: nowrap;
    }
</style>

<script src="{{ asset('assets') }}/js/jquery-3.7.1.min.js" type="text/javascript"></script>
<script src="{{ asset('assets/js/pages/header.js') }}"></script>
