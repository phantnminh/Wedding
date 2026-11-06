(function () {
  'use strict';

  var details = window.WEDDING;
  // These must match the answer choices in the Google Form exactly.
  var ATTEND_TEXT = { yes: 'Có, tôi sẽ đến', no: 'Rất tiếc, tôi không đến được' };
  var MAX_GUESTS = 10;
  var WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  var MONTHS = ['Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu', 'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'];
  var TIMELINE_ICONS = ['#icon-heart', '#icon-rings', '#icon-glass'];

  function byId(id) {
    return document.getElementById(id);
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  // Reads "2026-12-12". Returns null for an empty or mistyped date.
  function readDate(text) {
    var match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec((text || '').trim());
    if (!match) {
      return null;
    }
    var year = Number(match[1]);
    var month = Number(match[2]) - 1;
    var day = Number(match[3]);
    var date = new Date(year, month, day);
    if (date.getMonth() !== month || date.getDate() !== day) {
      return null;
    }
    return { year: year, month: month, day: day, date: date };
  }

  // The guest's name comes from a personal link such as ?to=Minh.
  // It is always written with textContent, so it cannot inject markup.
  var guestName = (new URLSearchParams(location.search).get('to') || '').trim();

  /* ---------- Fill in the details ---------- */

  var fields = {
    groomShort: details.groom.shortName,
    brideShort: details.bride.shortName,
    groomFull: details.groom.fullName,
    brideFull: details.bride.fullName,
    groomFather: details.groom.father,
    groomMother: details.groom.mother,
    groomRole: details.groom.role,
    brideRole: details.bride.role,
    groomAddress: details.groom.address,
    brideAddress: details.bride.address,
    brideFather: details.bride.father,
    brideMother: details.bride.mother,
    quoteTitle: details.quoteTitle,
    quoteText: details.quoteText,
    thankYou: details.thankYou,
    rsvpBy: details.rsvpBy
  };
  document.querySelectorAll('[data-field]').forEach(function (el) {
    el.textContent = fields[el.getAttribute('data-field')];
  });

  // A family lists only the parents who have a name in wedding-details.js.
  document.querySelectorAll('[data-if]').forEach(function (el) {
    el.hidden = !fields[el.getAttribute('data-if')];
  });

  document.title = 'Thiệp mời cưới ' + details.groom.shortName + ' và ' + details.bride.shortName;
  byId('dear').textContent = details.groom.shortName + ' & ' + details.bride.shortName;
  byId('guest-line').textContent = guestName || 'Quý khách';
  byId('rsvp-name').value = guestName;

  // The circle uses the first letter of the last word of each name.
  function initial(name) {
    var last = (name || '').trim().split(/\s+/).pop();
    var match = last.match(/\p{L}/u);
    return match ? match[0].toUpperCase() : '';
  }
  byId('monogram-1').textContent = initial(details.groom.shortName);
  byId('monogram-2').textContent = initial(details.bride.shortName);

  /* ---------- Events ---------- */

  details.events.forEach(function (event) {
    var node = byId('event-template').content.cloneNode(true);
    var date = readDate(event.date);
    function set(name, value) {
      node.querySelector('[data-e="' + name + '"]').textContent = value;
    }
    set('title', event.title);
    set('time', event.time);
    set('day', date ? pad(date.day) : '[ngày]');
    set('month', date ? pad(date.month + 1) : '[tháng]');
    set('year', date ? String(date.year).slice(-2) : '[năm]');
    set('weekday', date ? WEEKDAYS[date.date.getDay()] : '');
    set('venue', event.venue);
    set('address', event.address);
    node.querySelector('[data-e="address"]').hidden = !event.address;
    var lunar = node.querySelector('[data-e="lunarDate"]');
    lunar.textContent = event.lunarDate ? 'Nhằm ngày ' + event.lunarDate : '';
    lunar.hidden = !event.lunarDate;
    var map = node.querySelector('[data-e="map"]');
    if (event.mapLink) {
      map.href = event.mapLink;
    } else {
      map.hidden = true;
    }
    byId('event-list').appendChild(node);
  });

  /* ---------- Timeline ---------- */

  details.timeline.forEach(function (step, index) {
    var node = byId('timeline-template').content.cloneNode(true);
    node.querySelector('[data-t="time"]').textContent = step.time;
    node.querySelector('[data-t="label"]').textContent = step.label;
    node.querySelector('[data-t="icon"]').setAttribute('href', TIMELINE_ICONS[index % TIMELINE_ICONS.length]);
    byId('timeline-list').appendChild(node);
  });

  /* ---------- Calendar and countdown ---------- */

  var wedding = readDate(details.date);

  function buildCalendar() {
    byId('hero-date').textContent = pad(wedding.day) + '.' + pad(wedding.month + 1) + '.' + wedding.year;
    byId('cal-year').textContent = String(wedding.year);
    byId('cal-month').textContent = MONTHS[wedding.month];
    var grid = byId('cal-days');
    // Monday comes first, so Sunday (0) moves to the end of the row.
    var blanks = (new Date(wedding.year, wedding.month, 1).getDay() + 6) % 7;
    var total = new Date(wedding.year, wedding.month + 1, 0).getDate();
    for (var i = 0; i < blanks; i += 1) {
      grid.appendChild(document.createElement('span'));
    }
    for (var day = 1; day <= total; day += 1) {
      var cell = document.createElement('div');
      var number = document.createElement('span');
      cell.className = day === wedding.day ? 'cal-day is-wedding' : 'cal-day';
      number.textContent = String(day);
      cell.appendChild(number);
      grid.appendChild(cell);
    }
  }

  function startCountdown() {
    var clock = /^(\d{1,2}):(\d{2})$/.exec((details.time || '').trim());
    var hour = clock ? Number(clock[1]) : 0;
    var minute = clock ? Number(clock[2]) : 0;
    // The wedding is on Vietnam time (UTC+7), wherever the guest is reading.
    var target = Date.UTC(wedding.year, wedding.month, wedding.day, hour - 7, minute);
    function tick() {
      var seconds = Math.max(0, Math.floor((target - Date.now()) / 1000));
      byId('count-days').textContent = pad(Math.floor(seconds / 86400));
      byId('count-hours').textContent = pad(Math.floor(seconds / 3600) % 24);
      byId('count-minutes').textContent = pad(Math.floor(seconds / 60) % 60);
      byId('count-seconds').textContent = pad(seconds % 60);
      return seconds;
    }
    tick();
    var timer = setInterval(function () {
      if (tick() === 0) {
        clearInterval(timer);
      }
    }, 1000);
  }

  if (wedding) {
    buildCalendar();
    startCountdown();
  } else {
    byId('hero-date').textContent = '[ngày.tháng.năm]';
    byId('calendar').hidden = true;
  }

  /* ---------- Connection to Google Form ---------- */

  // The Google script made a link with marker answers. The markers show
  // which entry number belongs to which question. They stay in English
  // because they are only labels in that link, not answers guests send.
  function readRsvpLink(link) {
    var markers = {
      'NAME': 'name',
      'MESSAGE': 'message',
      'Yes, gladly': 'attending',
      '1': 'guests'
    };
    var url;
    try {
      url = new URL(link);
    } catch (err) {
      return null;
    }
    var entries = {};
    url.searchParams.forEach(function (value, key) {
      if (key.indexOf('entry.') === 0 && markers[value]) {
        entries[markers[value]] = key;
      }
    });
    if (!entries.name || !entries.attending) {
      return null;
    }
    return {
      action: url.origin + url.pathname.replace(/\/viewform$/, '/formResponse'),
      entries: entries
    };
  }

  var form = readRsvpLink(details.rsvpLink);
  if (!form) {
    var note = details.rsvpLink
      ? 'Chế độ thử: đường dẫn RSVP trong wedding-details.js chưa đúng nên phản hồi không được lưu.'
      : 'Chế độ thử: biểu mẫu chưa kết nối với Google Form nên phản hồi không được lưu.';
    document.querySelectorAll('[data-test-note]').forEach(function (el) {
      el.textContent = note;
      el.hidden = false;
    });
  }

  function sendReply(reply) {
    if (!form) {
      return Promise.resolve();
    }
    var body = new URLSearchParams();
    function add(field, value) {
      if (form.entries[field] && value) {
        body.append(form.entries[field], value);
      }
    }
    add('name', reply.name);
    add('attending', ATTEND_TEXT[reply.attending]);
    add('message', reply.message);
    if (reply.attending === 'yes') {
      add('guests', String(reply.guests));
    }
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, 15000);
    // Google does not let a page read its answer, so this only fails when
    // the network fails. A wrong link has to be caught by checking the Sheet.
    return fetch(form.action, {
      method: 'POST',
      mode: 'no-cors',
      body: body,
      signal: controller.signal
    }).finally(function () {
      clearTimeout(timer);
    });
  }

  /* ---------- Thank-you panel ---------- */

  // Nothing is remembered: opening the card again always shows the form.
  function showThanks(reply) {
    byId('thanks-title').textContent = 'Cảm ơn ' + reply.name;
    byId('thanks-line').textContent = reply.attending === 'yes'
      ? 'Rất mong được đón tiếp quý khách.'
      : 'Rất tiếc vì không được gặp quý khách trong ngày vui.';
    byId('rsvp-panel').hidden = true;
    byId('thanks-panel').hidden = false;
  }

  function showForm() {
    byId('thanks-panel').hidden = true;
    byId('rsvp-panel').hidden = false;
  }

  /* ---------- Scroll animations ---------- */

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function startReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (reducedMotion || !('IntersectionObserver' in window)) {
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    document.documentElement.classList.add('reveal-ready');
    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  /* ---------- Music ---------- */

  var music = byId('bg-music');
  var musicToggle = byId('music-toggle');
  var musicOn = false;

  function showMusicButton() {
    musicToggle.classList.toggle('is-off', !musicOn);
    musicToggle.setAttribute('aria-pressed', String(musicOn));
    musicToggle.setAttribute('aria-label', musicOn ? 'Tắt nhạc' : 'Bật nhạc');
  }

  function playMusic() {
    var playing = music.play();
    if (playing) {
      playing.catch(function () {
        musicOn = false;
        showMusicButton();
      });
    }
  }

  // Phones only allow sound that begins during a tap. So the track starts
  // silently on the seal tap, and becomes audible once the letter is open.
  function startMusicSilently() {
    if (!details.music.file) {
      return;
    }
    music.src = details.music.file;
    music.volume = 0.6;
    music.muted = true;
    musicOn = true;
    playMusic();
  }

  function revealMusic() {
    if (!details.music.file) {
      return;
    }
    musicToggle.hidden = false;
    showMusicButton();
    music.muted = false;
    if (!music.paused) {
      music.currentTime = 0;
    }
  }

  musicToggle.addEventListener('click', function () {
    musicOn = !musicOn;
    if (musicOn) {
      playMusic();
    } else {
      music.pause();
    }
    showMusicButton();
  });

  // Stops while the guest is in another app, such as their banking app.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      music.pause();
    } else if (musicOn) {
      playMusic();
    }
  });

  /* ---------- Envelope ---------- */

  var stage = byId('view-card');
  var card = byId('card');
  var OPEN_MS = reducedMotion ? 20 : 1200;

  card.inert = true;

  byId('seal').addEventListener('click', function () {
    startMusicSilently();
    stage.classList.add('is-open');
    card.inert = false;
    setTimeout(function () {
      stage.classList.add('is-settled');
      startReveal();
      revealMusic();
      card.querySelector('h1').focus({ preventScroll: true });
    }, OPEN_MS);
  });

  /* ---------- RSVP form ---------- */

  var attending = null;
  var guests = 1;

  function pickAttending(value) {
    attending = value;
    byId('attend-yes').setAttribute('aria-pressed', String(value === 'yes'));
    byId('attend-no').setAttribute('aria-pressed', String(value === 'no'));
    byId('yes-details').hidden = value !== 'yes';
    showError('');
  }

  function setGuests(value) {
    guests = Math.min(MAX_GUESTS, Math.max(1, value));
    byId('guests-count').textContent = String(guests);
  }

  function showError(text) {
    byId('rsvp-error').textContent = text;
    byId('rsvp-error').hidden = !text;
  }

  byId('attend-yes').addEventListener('click', function () { pickAttending('yes'); });
  byId('attend-no').addEventListener('click', function () { pickAttending('no'); });
  byId('guests-less').addEventListener('click', function () { setGuests(guests - 1); });
  byId('guests-more').addEventListener('click', function () { setGuests(guests + 1); });

  byId('rsvp-form').addEventListener('submit', function (event) {
    event.preventDefault();
    var name = byId('rsvp-name').value.trim();
    if (!name) {
      showError('Vui lòng nhập họ và tên.');
      return;
    }
    if (!attending) {
      showError('Vui lòng cho biết quý khách có đến dự không.');
      return;
    }
    var send = byId('rsvp-send');
    send.disabled = true;
    send.textContent = 'Đang gửi...';
    showError('');
    var reply = {
      name: name,
      attending: attending,
      guests: guests,
      message: byId('rsvp-message').value.trim()
    };
    sendReply(reply).then(function () {
      showThanks(reply);
      byId('rsvp').scrollIntoView();
      byId('thanks-title').focus({ preventScroll: true });
    }).catch(function () {
      showError('Chưa gửi được phản hồi. Vui lòng kiểm tra kết nối mạng rồi thử lại.');
    }).finally(function () {
      send.disabled = false;
      send.textContent = 'Gửi xác nhận';
    });
  });

  byId('reply-again').addEventListener('click', function () {
    byId('rsvp-name').value = guestName;
    byId('rsvp-message').value = '';
    pickAttending(null);
    setGuests(1);
    showForm();
    byId('rsvp').scrollIntoView();
  });

  /* ---------- Gift popup ---------- */

  var COPY_LABEL = 'Sao chép số tài khoản';
  var COPY_FAILED = 'Không sao chép được. Vui lòng tự nhập số tài khoản.';
  var giftDialog = byId('gift-dialog');
  var giftAccount = '';

  function openGift(person, title) {
    var bank = details.bank[person];
    giftAccount = bank.accountNumber;
    byId('gift-title').textContent = title;
    byId('qr-missing').hidden = true;
    byId('qr-image').hidden = false;
    byId('qr-image').src = bank.qrImage;
    byId('copy-account').textContent = COPY_LABEL;
    // Phones older than 2022 have no showModal, so the popup opens plainly.
    if (giftDialog.showModal) {
      giftDialog.showModal();
    } else {
      giftDialog.setAttribute('open', '');
    }
  }

  function closeGift() {
    if (giftDialog.close) {
      giftDialog.close();
    } else {
      giftDialog.removeAttribute('open');
    }
  }

  byId('qr-image').addEventListener('error', function () {
    byId('qr-image').hidden = true;
    byId('qr-missing').hidden = false;
  });
  byId('gift-groom').addEventListener('click', function () {
    openGift('groom', 'Gửi quà cho chú rể');
  });
  byId('gift-bride').addEventListener('click', function () {
    openGift('bride', 'Gửi quà cho cô dâu');
  });
  byId('gift-close').addEventListener('click', closeGift);
  // A tap on the dimmed area outside the box also closes the popup.
  giftDialog.addEventListener('click', function (event) {
    if (event.target === giftDialog) {
      closeGift();
    }
  });

  byId('copy-account').addEventListener('click', function () {
    var button = byId('copy-account');
    if (!navigator.clipboard) {
      button.textContent = COPY_FAILED;
      return;
    }
    navigator.clipboard.writeText(giftAccount).then(function () {
      button.textContent = 'Đã sao chép';
    }, function () {
      button.textContent = COPY_FAILED;
    });
  });
})();
