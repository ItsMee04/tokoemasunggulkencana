$(document).ready(function(){
    $(document).ready(function() {
        let path = window.location.pathname;
        let segments = path.split('/');
        let rolePrefix = segments[1]; // "admin" atau "owner"
        let secondSegment = segments[2]; // Misalnya "nampan"

        $('#sidebar a').each(function() {
            let linkHref = $(this).attr('href'); // misal: "/admin/nampan"

            // Cek apakah link mengandung role + segment kedua
            let expectedHref = '/' + rolePrefix + '/' + secondSegment;

            if (linkHref === expectedHref) {
                $(this).addClass('active');
                $(this).parent('li').addClass('active');

                // Buka parent submenu jika ada
                let closestSubmenu = $(this).closest('ul');
                if (closestSubmenu.length > 0 && closestSubmenu.parent('li').length > 0) {
                    closestSubmenu.css('display', 'block');
                    // Tidak tambahkan 'subdrop' jika tidak diperlukan
                }
            }
        });
    });
})