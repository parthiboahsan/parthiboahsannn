(function() {
    // ==== এই অংশে আপনার এলাকা/শহর পরিবর্তন করুন ====
    var city = "Jessore";       // আপনার শহরের ইংরেজি নাম
    var country = "Bangladesh"; // দেশ
    var method = 1;             // ১ = University of Islamic Sciences, Karachi
    // ===============================================

    var container = document.getElementById('prayer-times-container');
    if (!container) return;

    // তারিখ ও বার দেখানোর জন্য আলাদা বার (HTML-এ এই আইডি থাকতে হবে)
    var dateBar = document.getElementById('prayer-date-bar');

    // API থেকে ডেটা আনুন
    var apiUrl = 'https://api.aladhan.com/v1/timingsByCity?city=' +
                 encodeURIComponent(city) + '&country=' +
                 encodeURIComponent(country) + '&method=' + method;

    fetch(apiUrl)
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (!data || !data.data || !data.data.timings) {
                container.innerHTML = '<p style="text-align:center; color:#888; font-size:13px;">সময়সূচি লোড করা যায়নি।</p>';
                if (dateBar) dateBar.textContent = 'তারিখ লোড করা যায়নি';
                return;
            }

            // ============ আজকের তারিখ ও বার ============
            if (dateBar && data.data.date && data.data.date.gregorian) {
                var greg = data.data.date.gregorian;
                var hijri = data.data.date.hijri;

                var bnMonths = {
                    'January': 'জানুয়ারি', 'February': 'ফেব্রুয়ারি', 'March': 'মার্চ',
                    'April': 'এপ্রিল', 'May': 'মে', 'June': 'জুন',
                    'July': 'জুলাই', 'August': 'আগস্ট', 'September': 'সেপ্টেম্বর',
                    'October': 'অক্টোবর', 'November': 'নভেম্বর', 'December': 'ডিসেম্বর'
                };

                var bnWeekdays = {
                    'Sunday': 'রবিবার', 'Monday': 'সোমবার', 'Tuesday': 'মঙ্গলবার',
                    'Wednesday': 'বুধবার', 'Thursday': 'বৃহস্পতিবার',
                    'Friday': 'শুক্রবার', 'Saturday': 'শনিবার'
                };

                var hijriMonths = {
                    'Muharram': 'মুহাররম', 'Safar': 'সফর',
                    'Rabi al-awwal': 'রবিউল আউয়াল', 'Rabi al-thani': 'রবিউস সানি',
                    'Jumada al-awwal': 'জমাদিউল আউয়াল', 'Jumada al-thani': 'জমাদিউস সানি',
                    'Rajab': 'রজব', 'Shaban': 'শাবান', 'Ramadan': 'রমজান',
                    'Shawwal': 'শাওয়াল', 'Dhu al-Qidah': 'জিলকদ', 'Dhu al-Hijjah': 'জিলহজ'
                };

                // ইংরেজি সংখ্যা → বাংলা সংখ্যা
                function toBn(num) {
                    var bn = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
                    return String(num).replace(/\d/g, function(d) { return bn[d]; });
                }

                var dayBn     = toBn(greg.day);
                var monthBn   = bnMonths[greg.month.en] || greg.month.en;
                var yearBn    = toBn(greg.year);
                var weekdayBn = bnWeekdays[greg.weekday.en] || greg.weekday.en;

                var dateText = weekdayBn + ', ' + dayBn + ' ' + monthBn + ' ' + yearBn + 'ইং';

                // হিজরি তারিখ যোগ (ঐচ্ছিক)
                if (hijri) {
                    var hijriText = toBn(hijri.day) + ' ' +
                                    (hijriMonths[hijri.month.en] || hijri.month.en) + ' ' +
                                    toBn(hijri.year) + ' হিজরি';
                    dateText += ' | ' + hijriText;
                }

                dateBar.textContent = dateText;
            }

            // ============ নামাজের সময় ============
            var timings = data.data.timings;

            var prayerRows = [
                { name: 'ফজর',    key: 'Fajr' },
                { name: 'জোহর',   key: 'Dhuhr' },
                { name: 'আসর',    key: 'Asr' },
                { name: 'মাগরিব', key: 'Maghrib' },
                { name: 'এশা',    key: 'Isha' }
            ];

            var html = '';
            for (var i = 0; i < prayerRows.length; i++) {
                var time = timings[prayerRows[i].key] || '--:--';

                // 24-hour → 12-hour ফরম্যাট
                var time12 = time;
                if (time && time.indexOf(':') > -1) {
                    var parts = time.split(':');
                    var hour = parseInt(parts[0], 10);
                    var minute = parts[1];
                    var ampm = hour >= 12 ? 'PM' : 'AM';
                    hour = hour % 12;
                    hour = hour ? hour : 12;
                    time12 = hour + ':' + minute + ' ' + ampm;
                }

                html += '<div class="prayer-row">';
                html += '<span class="prayer-name">' + prayerRows[i].name + '</span>';
                html += '<span class="prayer-time">' + time12 + '</span>';
                html += '</div>';
            }
            container.innerHTML = html;
        })
        .catch(function(error) {
            console.error('Prayer times error:', error);
            container.innerHTML = '<p style="text-align:center; color:#888; font-size:13px;">সংযোগে সমস্যা হয়েছে।</p>';
            if (dateBar) dateBar.textContent = 'সংযোগে সমস্যা হয়েছে';
        });
})();
//]]>
