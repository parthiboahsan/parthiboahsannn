<script>
//<![CDATA[
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
//]]>
</script>
  
  <script>
//<![CDATA[
(function() {
    var track = document.getElementById('newsHeadlineTrack');
    if (!track) return;

    var callbackName = 'showHeadlineNews';
    window[callbackName] = function(json) {
        var posts = (json.feed && json.feed.entry) ? json.feed.entry : [];
        if (!posts.length) {
            track.innerHTML = '<a class="news-headline-item active" href="#">কোনো সংবাদ পাওয়া যায়নি।</a>';
            return;
        }

        // প্রথমে সব হেডলাইন তৈরি করি
        var html = '';
        for (var i = 0; i < posts.length && i < 6; i++) {
            var p = posts[i];
            var link = '#';
            for (var j = 0; j < p.link.length; j++) {
                if (p.link[j].rel === 'alternate') { link = p.link[j].href; break; }
            }
            var title = p.title ? p.title.$t : 'শিরোনামহীন';
            var activeClass = (i === 0) ? ' active' : '';
            html += '<a class="news-headline-item' + activeClass + '" href="' + link + '">' + title + '</a>';
        }
        track.innerHTML = html;

        // এখন রোটেশন শুরু করি
        var items = track.querySelectorAll('.news-headline-item');
        if (items.length < 2) return;
        var current = 0;
        setInterval(function() {
            items[current].classList.remove('active');
            current = (current + 1) % items.length;
            items[current].classList.add('active');
        }, 4000); // প্রতি ৪ সেকেন্ডে পরিবর্তন
    };

    var script = document.createElement('script');
    script.src = '/feeds/posts/default?alt=json-in-script&max-results=6&callback=' + callbackName;
    document.body.appendChild(script);
})();
//]]>
</script>
