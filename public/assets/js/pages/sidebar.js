$(document).ready(function () {
    // Ambil segmen kedua setelah "/admin", misalnya: '/admin/produk/detailProduk/1' → 'produk'
    let segments = window.location.pathname.split("/"); // ['', 'admin', 'produk', 'detailProduk', '1']
    let path = segments[2]; // 'produk'

    $('#sidebar a').each(function () {
        let href = $(this).attr('href'); // href sidebar: "produk", "dashboard", dst.

        if (href && href !== "javascript:void(0);" && href === path) {
            let parentLi = $(this).closest('li');
            let grandParentLi = parentLi.closest('li.submenu');

            if (grandParentLi.length) {
                $(this).addClass('active');
                grandParentLi.children('a').addClass('active subdrop');
                grandParentLi.children('ul').css('display', 'block');
            } else {
                parentLi.addClass('active');
            }
        }
    });
});
