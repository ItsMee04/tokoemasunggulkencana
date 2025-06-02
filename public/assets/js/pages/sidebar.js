$(document).ready(function () {
    let path = window.location.pathname.split("/").pop(); // contoh: 'dashboard' atau 'users'

    $('#sidebar a').each(function () {
        let href = $(this).attr('href');

        if (href && href !== "javascript:void(0);" && href === path) {
            let parentLi = $(this).closest('li');
            let grandParentLi = parentLi.closest('li.submenu'); // untuk submenu

            if (grandParentLi.length) {
                // Kalau ada parent li dengan class submenu (menu dengan submenu)
                $(this).addClass('active'); // aktifkan link yang sesuai
                grandParentLi.children('a').addClass('active subdrop'); // buka submenu induk
                grandParentLi.children('ul').css('display', 'block'); // tampilkan submenu
            } else {
                // Menu tanpa submenu (misal dashboard)
                parentLi.addClass('active'); // aktifkan li langsung
            }
        }
    });
});
