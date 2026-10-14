(function() {
    var btn = document.getElementById('backToTopBtn');
    if (!btn) return;

    var isHomepage = document.body.classList.contains('home') ||
                     location.pathname === '/' ||
                     location.pathname === '/index.html';

    function toggleButton() {
        if (!isHomepage) return;
        if (window.pageYOffset > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    }

    window.addEventListener('scroll', toggleButton, { passive: true });
    toggleButton();

    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();
