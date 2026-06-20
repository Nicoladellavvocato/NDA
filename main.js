/* =================================================================
   Nicola Dell'Avvocato — portfolio
   Shared script. Every block is guarded so the same file is safe
   on the home page and on the project pages.
   ================================================================= */
(function () {
  "use strict";

  /* ---- starfield ---- */
  var sky = document.getElementById("stars");
  if (sky) {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < 150; i++) {
      var s = document.createElement("span");
      var size = Math.random() < 0.85 ? 1 : 2;
      s.style.cssText =
        "position:absolute;left:" + (Math.random() * 100).toFixed(2) +
        "%;top:" + (Math.random() * 78).toFixed(2) +
        "%;width:" + size + "px;height:" + size +
        "px;border-radius:50%;background:#fff;opacity:" +
        (0.15 + Math.random() * 0.7).toFixed(2) + ";";
      if (Math.random() < 0.16) s.className = "tw";
      frag.appendChild(s);
    }
    sky.appendChild(frag);
  }

  /* ---- nav scrolled state ---- */
  var nav = document.querySelector(".nav");
  if (nav) {
    window.addEventListener("scroll", function () {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    }, { passive: true });
    if (window.scrollY > 40) nav.classList.add("scrolled");
  }

  /* ---- mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- current year in footer ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- map graticule + labels (tracker pages only) ---- */
  var grat = document.getElementById("grat");
  if (grat) {
    var g = "";
    for (var x = 60; x < 720; x += 60) g += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="360"/>';
    for (var y = 60; y < 360; y += 60) g += '<line x1="0" y1="' + y + '" x2="720" y2="' + y + '"/>';
    grat.innerHTML = g;
  }
  var maplab = document.getElementById("maplab");
  if (maplab) {
    var lons = [[-180, 4], [-90, 182], [0, 362], [90, 542], [180, 712]];
    var lats = [[60, 64], [0, 184], [-60, 304]];
    var ml = "";
    lons.forEach(function (p) { ml += '<text x="' + p[1] + '" y="354" text-anchor="middle">' + p[0] + "\u00B0</text>"; });
    lats.forEach(function (p) { ml += '<text x="6" y="' + p[1] + '">' + p[0] + "\u00B0</text>"; });
    maplab.innerHTML = ml;
  }

  /* ---- UTC clock ---- */
  function tickUTC() {
    var el = document.getElementById("utc");
    if (el) el.textContent = new Date().toISOString().slice(11, 19) + " UTC";
  }
  if (document.getElementById("utc")) { tickUTC(); setInterval(tickUTC, 1000); }

  /* ---- ISS live position ---- */
  if (document.getElementById("issMap")) {
    var ISS_URL = "https://api.wheretheiss.at/v1/satellites/25544";
    var W = 720, H = 360, trail = [];
    function setText(id, v) { var e = document.getElementById(id); if (e) e.textContent = v; }
    function fmtLat(v) { return Math.abs(v).toFixed(4) + "\u00B0 " + (v >= 0 ? "N" : "S"); }
    function fmtLon(v) { return Math.abs(v).toFixed(4) + "\u00B0 " + (v >= 0 ? "E" : "W"); }
    function proj(lat, lon) { return [(lon + 180) / 360 * W, (90 - lat) / 180 * H]; }
    function setStatus(ok) {
      var d = document.getElementById("issDot"), t = document.getElementById("issState");
      if (!d || !t) return;
      if (ok) { d.classList.remove("lost"); t.textContent = "LIVE"; }
      else { d.classList.add("lost"); t.textContent = "SIGNAL LOST — RETRYING"; }
    }
    function drawTrail() {
      var p = document.getElementById("issTrail"); if (!p) return;
      var d = "", prev = null;
      for (var i = 0; i < trail.length; i++) {
        var pt = trail[i];
        if (prev && Math.abs(pt[0] - prev[0]) > W / 2) { d += " M " + pt[0].toFixed(1) + " " + pt[1].toFixed(1); }
        else { d += (d ? " L " : "M ") + pt[0].toFixed(1) + " " + pt[1].toFixed(1); }
        prev = pt;
      }
      p.setAttribute("d", d);
    }
    function updateISS() {
      fetch(ISS_URL, { cache: "no-store" }).then(function (r) {
        if (!r.ok) throw new Error("http");
        return r.json();
      }).then(function (d) {
        var lat = parseFloat(d.latitude), lon = parseFloat(d.longitude);
        setText("lat", fmtLat(lat));
        setText("lon", fmtLon(lon));
        setText("alt", parseFloat(d.altitude).toFixed(1) + " km");
        setText("vel", Math.round(parseFloat(d.velocity)).toLocaleString("en-US") + " km/h");
        setText("vis", d.visibility === "daylight" ? "DAYLIGHT" : "ECLIPSE");
        var ml = document.getElementById("issMapLink");
        if (ml) ml.setAttribute("href", "https://www.google.com/maps?q=" + lat.toFixed(5) + "," + lon.toFixed(5) + "&z=4");
        var c = proj(lat, lon);
        var m = document.getElementById("issMarker");
        if (m) m.setAttribute("transform", "translate(" + c[0].toFixed(1) + " " + c[1].toFixed(1) + ")");
        var fp = document.getElementById("issFoot");
        if (fp && d.footprint) { var rpx = ((parseFloat(d.footprint) / 2) / 111) * 2; fp.setAttribute("r", Math.max(8, Math.min(60, rpx)).toFixed(1)); }
        trail.push(c); if (trail.length > 90) trail.shift(); drawTrail();
        setStatus(true);
      }).catch(function () { setStatus(false); });
    }
    updateISS();
    setInterval(updateISS, 5000);
  }

  /* ---- newsletter ----
     The form posts its subscriber's email to the endpoint in the form's
     action attribute. It is pre-wired for a Formspree AJAX endpoint
     (https://formspree.io — free, no backend): create a form there, then
     replace YOUR_FORM_ID in the markup. To use a managed list instead
     (Mailchimp / Buttondown), point the action at that provider and keep
     the email field name they expect.                                   */
  var nf = document.getElementById("newsForm");
  if (nf) {
    var status = document.getElementById("newsStatus");
    var input = nf.querySelector('input[type="email"]');
    function say(msg, kind) {
      if (!status) return;
      status.textContent = msg;
      status.className = "news-status" + (kind ? " " + kind : "");
    }
    nf.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = (input.value || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        say("Enter a valid email address.", "err");
        input.focus();
        return;
      }
      var action = nf.getAttribute("action") || "";
      if (action.indexOf("YOUR_FORM_ID") !== -1 || !action) {
        // Not connected yet — tell the owner, don't fake a success.
        say("Newsletter endpoint not configured yet.", "err");
        return;
      }
      nf.classList.add("busy");
      say("Sending…");
      fetch(action, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(nf)
      }).then(function (r) {
        nf.classList.remove("busy");
        if (r.ok) { nf.reset(); say("You're on the list — thanks.", "ok"); }
        else { say("Something went wrong. Email me directly.", "err"); }
      }).catch(function () {
        nf.classList.remove("busy");
        say("Network error. Email me directly.", "err");
      });
    });
  }
})();
