(function () {
  'use strict';

  var DB_NAME = 'djc-history';
  var STORE = 'visits';

  function openDB() {
    return new Promise(function (resolve, reject) {
      var stored = indexedDB.open(DB_NAME, 1);
      stored.onsuccess = function () { resolve(stored.result); };
      stored.onerror = function () { reject(stored.error); };
    });
  }

  function getAll(db) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction(STORE, 'readonly');
      var req = tx.objectStore(STORE).index('byTime').openCursor(null, 'prev');
      var list = [];
      req.onsuccess = function () {
        var cursor = req.result;
        if (cursor) {
          list.push(cursor.value);
          cursor['continue']();
        } else {
          resolve(list);
        }
      };
      req.onerror = function () { reject(req.error); };
    });
  }

  function clearDB(db) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).clear();
      tx.oncomplete = resolve;
      tx.onerror = function () { reject(tx.error); };
    });
  }

  function dayLabel(ts) {
    var now = new Date();
    var d = new Date(ts);
    var startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    var startDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    var diffDays = Math.round((startToday - startDay) / 86400000);
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    return d.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  function timeLabel(ts) {
    return new Date(ts).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  }

  function hostColor(host) {
    var colors = ['#e5f774', '#8ab4f8', '#f28ba8', '#ffb86c', '#7ee7a8', '#c8a7ff'];
    var sum = 0;
    for (var i = 0; i < host.length; i++) sum += host.charCodeAt(i);
    return colors[sum % colors.length];
  }

  function hostChip(host) {
    var chip = document.createElement('span');
    chip.className = 'history__chip';
    chip.style.borderColor = hostColor(host);
    chip.style.color = hostColor(host);
    chip.textContent = host;
    return chip;
  }

  function render(list) {
    var mount = document.getElementById('djcHistory');
    if (!mount) return;
    mount.textContent = '';

    var header = document.createElement('div');
    header.className = 'history__head';
    var title = document.createElement('h2');
    title.textContent = 'Historial del ecosistema';
    var clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'history__clear';
    clearBtn.textContent = 'Limpiar';
    header.appendChild(title);
    header.appendChild(clearBtn);

    var wrap = document.createElement('div');
    wrap.appendChild(header);

    if (!list.length) {
      var empty = document.createElement('p');
      empty.className = 'history__empty';
      empty.textContent = 'Aún no hay historial. Visitá algunas páginas de djc.pe y aparecerán acá.';
      wrap.appendChild(empty);
      mount.appendChild(wrap);
      return;
    }

    var groups = {};
    list.forEach(function (v) {
      var label = dayLabel(v.ts);
      if (!groups[label]) groups[label] = [];
      groups[label].push(v);
    });

    Object.keys(groups).forEach(function (label) {
      var day = document.createElement('div');
      day.className = 'history__day';
      var dayTitle = document.createElement('h3');
      dayTitle.textContent = label;
      day.appendChild(dayTitle);

      var ul = document.createElement('ul');
      ul.className = 'history__list';

      groups[label].forEach(function (v) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.className = 'history__link';
        a.href = 'https://' + v.host + v.page;
        a.target = '_blank';
        a.rel = 'noopener';

        var time = document.createElement('span');
        time.className = 'history__time';
        time.textContent = timeLabel(v.ts);

        var body = document.createElement('span');
        body.className = 'history__body';
        var name = document.createElement('span');
        name.className = 'history__title';
        name.textContent = v.title || v.host;
        var path = document.createElement('span');
        path.className = 'history__path';
        path.textContent = v.page;
        body.appendChild(name);
        body.appendChild(path);

        li.appendChild(time);
        li.appendChild(hostChip(v.host));
        li.appendChild(body);
        ul.appendChild(li);
      });

      day.appendChild(ul);
      wrap.appendChild(day);
    });

    mount.appendChild(wrap);

    clearBtn.addEventListener('click', function () {
      if (!confirm('¿Borrar todo el historial de djc.pe?')) return;
      openDB().then(clearDB).then(function () {
        render([]);
      });
    });
  }

  function init() {
    if (!document.getElementById('djcHistory')) return;
    openDB()
      .then(getAll)
      .then(render)
      .catch(function (err) {
        if (window.console && console.error) console.error('DJC History view:', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();