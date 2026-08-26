// Shared light/dark theme control for every Kollect site page.
//
// The <head> of each page runs a tiny pre-paint snippet that sets
// data-theme on <html> from localStorage (or the OS preference on first
// visit) so there is no flash of the wrong theme. This file wires up the
// toggle button, keeps the icon + logo in sync, and remembers the choice.
(function () {
    var root = document.documentElement;

    function currentTheme() {
        return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    // Logos flagged with .site-logo carry the dark-mode variant filename;
    // swap the src so the mark stays legible on the active background.
    function syncLogos(theme) {
        var logos = document.querySelectorAll('img.site-logo');
        for (var i = 0; i < logos.length; i++) {
            var el = logos[i];
            var light = el.getAttribute('data-logo-light');
            var dark = el.getAttribute('data-logo-dark');
            if (light && dark) el.src = theme === 'dark' ? dark : light;
        }
    }

    function syncToggle(theme) {
        var btns = document.querySelectorAll('.theme-toggle');
        for (var i = 0; i < btns.length; i++) {
            var icon = theme === 'dark' ? 'fa-sun' : 'fa-moon';
            btns[i].innerHTML = '<i class="fas ' + icon + '"></i>';
            btns[i].setAttribute(
                'aria-label',
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            );
        }
    }

    function apply(theme) {
        root.setAttribute('data-theme', theme);
        try { localStorage.setItem('theme', theme); } catch (e) { /* ignore */ }
        syncToggle(theme);
        syncLogos(theme);
    }

    function toggle() {
        apply(currentTheme() === 'dark' ? 'light' : 'dark');
    }

    document.addEventListener('DOMContentLoaded', function () {
        var theme = currentTheme();
        syncToggle(theme);
        syncLogos(theme);
        var btns = document.querySelectorAll('.theme-toggle');
        for (var i = 0; i < btns.length; i++) {
            btns[i].addEventListener('click', toggle);
        }
    });
})();
