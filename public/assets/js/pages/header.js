$(document).ready(function () {
    $('#search-input').on('input', function () {
        let query = $(this).val().toLowerCase();
        let dropdown = $('.search-dropdown .search-tags');
        dropdown.empty();

        if (query.length === 0) {
            dropdown.append('<li><a href="#">Ketik untuk mencari menu...</a></li>');
            return;
        }

        let matches = [];

        $('#sidebar a[data-menu-title]').each(function () {
            let title = $(this).data('menu-title').toLowerCase();
            let href = $(this).attr('href');
            if (title.includes(query)) {
                matches.push(`<li><a href="${href}">${title}</a></li>`);
            }
        });

        if (matches.length > 0) {
            dropdown.append(matches.join(''));
        } else {
            dropdown.append('<li><a href="#">Tidak ditemukan</a></li>');
        }
    });

    // Clear input
    $('.search-addon i').on('click', function () {
        $('#search-input').val('').trigger('input');
    });
});