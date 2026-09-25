(function (global) {
  'use strict';

  var PROXY_URL = 'https://www.djc.pe/static/www/history-proxy.html';
  var PROXY_ORIGIN = 'https://www.djc.pe';
  var VID_COOKIE = 'DJC_VID';
  var FLAG = '__djcHistoryLoaded';

  if (global[FLAG]) return;
  global[FLAG] = true;

  function readCookie(name) {
    var m = document.cookie.match('(?:^|; )' + name + '=([^;]*)');
    return m ? decodeURIComponent(m[1]) : '';
  }

  function getDeviceId() {
    var id = readCookie(VID_COOKIE);
    if (!id) {
      id = 'vid-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
      document.cookie = VID_COOKIE + '=' + encodeURIComponent(id) +
        '; path=/; max-age=63072000; domain=.djc.pe; SameSite=Lax' +
        (location.protocol === 'https:' ? '; Secure' : '');
    }
    return id;
  }

  function send(msg) {
    var iframe = document.createElement('iframe');
    iframe.src = PROXY_URL;
    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    iframe.style.cssText = 'display:none;width:0;height:0;border:0;';
    iframe.addEventListener('load', function () {
      iframe.contentWindow.postMessage(msg, PROXY_ORIGIN);
    });
    document.body.appendChild(iframe);
  }

  function record(extra) {
    var payload = {
      host: location.host,
      page: location.pathname + location.search,
      title: document.title,
      ts: Date.now(),
      referrer: document.referrer || '',
      vid: getDeviceId()
    };
    if (extra) {
      for (var k in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, k)) payload[k] = extra[k];
      }
    }
    send({ type: 'DJC_HISTORY', payload: payload });
  }

  function clear() {
    send({ type: 'DJC_HISTORY_CLEAR' });
  }

  global.DJCHistory = { record: record, clear: clear };

  function autoRecord() {
    record();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoRecord);
  } else {
    autoRecord();
  }
})(window);