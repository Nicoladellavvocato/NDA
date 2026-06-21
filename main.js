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

  /* ---- nav dropdowns (hover on desktop via CSS; click/keyboard here) ---- */
  var drops = Array.prototype.slice.call(document.querySelectorAll(".has-drop"));
  function closeAllDrops() {
    drops.forEach(function (d) {
      d.classList.remove("open");
      var t = d.querySelector(".drop-trigger");
      if (t) t.setAttribute("aria-expanded", "false");
    });
  }
  drops.forEach(function (d) {
    var t = d.querySelector(".drop-trigger");
    if (!t) return;
    t.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var willOpen = !d.classList.contains("open");
      closeAllDrops();
      if (willOpen) { d.classList.add("open"); t.setAttribute("aria-expanded", "true"); }
    });
  });
  if (drops.length) {
    document.addEventListener("click", function (e) {
      if (!drops.some(function (d) { return d.contains(e.target); })) closeAllDrops();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" || e.keyCode === 27) closeAllDrops();
    });
  }

  /* ---- scroll progress bar ---- */
  var prog = document.getElementById("scrollProgress");
  if (prog) {
    var updateProg = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? h.scrollTop / max : 0;
      prog.style.width = (Math.max(0, Math.min(1, p)) * 100).toFixed(2) + "%";
    };
    window.addEventListener("scroll", updateProg, { passive: true });
    window.addEventListener("resize", updateProg, { passive: true });
    updateProg();
  }

  /* ---- scroll-spy: highlight the section in view (home page) ---- */
  var spyPairs = [];
  document.querySelectorAll("[data-spy]").forEach(function (el) {
    var sec = document.getElementById(el.getAttribute("data-spy"));
    if (sec) spyPairs.push({ el: el, sec: sec });
  });
  if (spyPairs.length && "IntersectionObserver" in window) {
    var spyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          spyPairs.forEach(function (s) {
            s.el.classList.toggle("active", s.sec === en.target);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    spyPairs.forEach(function (s) { spyObs.observe(s.sec); });
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

  /* ---- map graticule + labels (all maps with .grat / .maplab) ---- */
  var grats = document.querySelectorAll(".grat");
  if (grats.length) {
    var g = "";
    for (var x = 60; x < 720; x += 60) g += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="360"/>';
    for (var y = 60; y < 360; y += 60) g += '<line x1="0" y1="' + y + '" x2="720" y2="' + y + '"/>';
    grats.forEach(function (el) { el.innerHTML = g; });
  }
  var labs = document.querySelectorAll(".maplab");
  if (labs.length) {
    var lons = [[-180, 4], [-90, 182], [0, 362], [90, 542], [180, 712]];
    var lats = [[60, 64], [0, 184], [-60, 304]];
    var ml = "";
    lons.forEach(function (p) { ml += '<text x="' + p[1] + '" y="354" text-anchor="middle">' + p[0] + "\u00B0</text>"; });
    lats.forEach(function (p) { ml += '<text x="6" y="' + p[1] + '">' + p[0] + "\u00B0</text>"; });
    labs.forEach(function (el) { el.innerHTML = ml; });
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
        if (ml) ml.setAttribute("href", "https://www.google.com/maps/search/?api=1&query=" + lat.toFixed(5) + "," + lon.toFixed(5));
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

  /* =================================================================
     LIVE DATA FEEDS  (run only where their elements exist — live.html)
     ================================================================= */
  var NASA_KEY = "UQeK3Zk8RABYzUkUGsJiWN9rVZ4vjlVzz3plt5kx"; // free key at api.nasa.gov — replace for higher rate limits

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function setT(id, v) { var e = document.getElementById(id); if (e) e.textContent = v; }
  function feedLive(dotId, stateId, ok) {
    var d = document.getElementById(dotId), s = document.getElementById(stateId);
    if (d) d.classList.toggle("lost", !ok);
    if (s) s.textContent = ok ? "LIVE" : "UNAVAILABLE";
  }

  /* Next launch + countdown (The Space Devs — Launch Library 2) */
  (function () {
    if (!document.getElementById("launchName")) return;
    var cd = null;
    function countdown(netIso) {
      var net = new Date(netIso).getTime();
      function tick() {
        var el = document.getElementById("launchCountdown");
        if (!el) return;
        if (isNaN(net)) { el.textContent = "—"; return; }
        var diff = net - Date.now();
        if (diff <= 0) { el.textContent = "LIFTOFF"; if (cd) clearInterval(cd); return; }
        var s = Math.floor(diff / 1000);
        var d = Math.floor(s / 86400); s -= d * 86400;
        var h = Math.floor(s / 3600); s -= h * 3600;
        var m = Math.floor(s / 60); s -= m * 60;
        function p(n) { return (n < 10 ? "0" : "") + n; }
        el.textContent = (d > 0 ? d + "d " : "") + p(h) + ":" + p(m) + ":" + p(s);
      }
      tick(); if (cd) clearInterval(cd); cd = setInterval(tick, 1000);
    }
    fetch("https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=1&hide_recent_previous=true")
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        var L = d.results && d.results[0];
        if (!L) throw 0;
        setT("launchName", L.name || "—");
        setT("launchProvider", (L.launch_service_provider && L.launch_service_provider.name) || "—");
        setT("launchPad", (L.pad && (L.pad.name + (L.pad.location ? " · " + L.pad.location.name : ""))) || "—");
        setT("launchNet", L.net ? new Date(L.net).toUTCString().replace("GMT", "UTC") : "—");
        if (L.net) countdown(L.net);
        feedLive("launchDot", "launchState", true);
      })
      .catch(function () { feedLive("launchDot", "launchState", false); setT("launchName", "Feed unavailable"); });
  })();

  /* Who's in space (community ISS people feed) */
  (function () {
    if (!document.getElementById("crewCount")) return;
    fetch("https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json")
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        setT("crewCount", d.number != null ? d.number : "—");
        if (d.iss_expedition) setT("crewExp", "ISS · Expedition " + d.iss_expedition);
        var ul = document.getElementById("crewList");
        if (ul && d.people) {
          ul.innerHTML = d.people.map(function (p) {
            var craft = p.spacecraft || p.craft || "—";
            var mission = p.iss ? ("ISS · Exp " + (d.iss_expedition || "")) : (p.spacecraft ? "Free flight" : "In orbit");
            return '<li><span class="lbl">' + esc(p.name) +
                   '<span class="crew-sub">' + esc(craft) + (p.position ? " · " + esc(p.position) : "") + '</span></span>' +
                   '<span class="val acc">' + esc(mission) + '</span></li>';
          }).join("");
        }
        feedLive("crewDot", "crewState", true);
      })
      .catch(function () { feedLive("crewDot", "crewState", false); });
  })();

  /* Near-Earth asteroids today (NASA NeoWs) */
  (function () {
    if (!document.getElementById("neoCount")) return;
    var today = new Date().toISOString().slice(0, 10);
    fetch("https://api.nasa.gov/neo/rest/v1/feed?start_date=" + today + "&end_date=" + today + "&api_key=" + NASA_KEY)
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        var list = (d.near_earth_objects && d.near_earth_objects[today]) || [];
        setT("neoCount", list.length);
        setT("neoDate", today);
        list.sort(function (a, b) {
          return parseFloat(a.close_approach_data[0].miss_distance.kilometers) - parseFloat(b.close_approach_data[0].miss_distance.kilometers);
        });
        var ul = document.getElementById("neoList");
        if (ul) {
          ul.innerHTML = list.slice(0, 6).map(function (o) {
            var km = Math.round(parseFloat(o.close_approach_data[0].miss_distance.kilometers)).toLocaleString("en-US");
            var haz = o.is_potentially_hazardous_asteroid ? '<span class="tag-haz">hazardous</span>' : "";
            return '<li><span class="lbl">' + esc(o.name.replace(/[()]/g, "")) + haz + '</span><span class="val">' + km + ' km</span></li>';
          }).join("") || '<li><span class="lbl">No close approaches today</span><span class="val"></span></li>';
        }
        feedLive("neoDot", "neoState", true);
      })
      .catch(function () { feedLive("neoDot", "neoState", false); });
  })();

  /* Space weather — planetary K-index (NOAA SWPC) */
  (function () {
    if (!document.getElementById("kpValue")) return;
    fetch("https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json")
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (rows) {
        var last = rows[rows.length - 1];
        var kp = parseFloat(last[1]);
        setT("kpValue", isNaN(kp) ? "—" : kp.toFixed(0));
        setT("kpLabel", kp >= 7 ? "Severe storm" : kp >= 5 ? "Geomagnetic storm" : kp >= 4 ? "Active" : "Quiet");
        setT("kpTime", (last[0] || "").replace(/\..*/, "") + " UTC");
        feedLive("kpDot", "kpState", true);
      })
      .catch(function () { feedLive("kpDot", "kpState", false); });
  })();

  /* Astronomy Picture of the Day (NASA APOD) */
  (function () {
    if (!document.getElementById("apodImg")) return;
    fetch("https://api.nasa.gov/planetary/apod?api_key=" + NASA_KEY)
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        var img = document.getElementById("apodImg");
        if (img && d.media_type === "image") { img.src = d.url; img.alt = d.title || "APOD"; }
        setT("apodTitle", d.title || "—");
        setT("apodDate", d.date || "");
        var ex = d.explanation || "";
        setT("apodText", ex.length > 340 ? ex.slice(0, 340) + "…" : ex);
        var link = document.getElementById("apodLink");
        if (link) link.href = (d.media_type === "image" ? (d.hdurl || d.url) : d.url) || "#";
        feedLive("apodDot", "apodState", true);
      })
      .catch(function () { feedLive("apodDot", "apodState", false); setT("apodText", "Feed unavailable."); });
  })();

  /* Earth from space — DSCOVR EPIC natural-colour (NASA) */
  (function () {
    if (!document.getElementById("epicImg")) return;
    fetch("https://api.nasa.gov/EPIC/api/natural?api_key=" + NASA_KEY)
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (arr) {
        var e = arr && arr[0];
        if (!e) throw 0;
        var p = e.date.split(" ")[0].split("-");
        var url = "https://api.nasa.gov/EPIC/archive/natural/" + p[0] + "/" + p[1] + "/" + p[2] + "/png/" + e.image + ".png?api_key=" + NASA_KEY;
        var img = document.getElementById("epicImg");
        if (img) { img.src = url; img.alt = "Earth from DSCOVR EPIC, " + e.date; }
        setT("epicDate", e.date + " UTC");
        feedLive("epicDot", "epicState", true);
      })
      .catch(function () { feedLive("epicDot", "epicState", false); });
  })();

  /* Generic satellite tracker — TLE from CelesTrak, SGP4 via satellite.js */
  (function () {
    var sel = document.getElementById("satSelect");
    if (!sel) return;
    if (typeof satellite === "undefined") { feedLive("satDot", "satState", false); setT("satName", "Tracker library unavailable"); return; }
    var W = 720, H = 360, satrec = null, tickTimer = null;
    function proj(lat, lon) { return [(lon + 180) / 360 * W, (90 - lat) / 180 * H]; }
    function fmtLat(v) { return Math.abs(v).toFixed(2) + "\u00B0 " + (v >= 0 ? "N" : "S"); }
    function fmtLon(v) { return Math.abs(v).toFixed(2) + "\u00B0 " + (v >= 0 ? "E" : "W"); }
    function compute(date) {
      var pv = satellite.propagate(satrec, date);
      if (!pv || !pv.position || isNaN(pv.position.x)) return null;
      var geo = satellite.eciToGeodetic(pv.position, satellite.gstime(date));
      var spd = null;
      if (pv.velocity) { var v = pv.velocity; spd = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) * 3600; }
      return { lat: satellite.degreesLat(geo.latitude), lon: satellite.degreesLong(geo.longitude), alt: geo.height, spd: spd };
    }
    function drawTrack(now) {
      var p = document.getElementById("satTrail"); if (!p) return;
      var d = "", prev = null;
      for (var m = -50; m <= 50; m += 1.5) {
        var pos = compute(new Date(now.getTime() + m * 60000));
        if (!pos) continue;
        var pt = proj(pos.lat, pos.lon);
        if (prev && Math.abs(pt[0] - prev[0]) > W / 2) d += " M " + pt[0].toFixed(1) + " " + pt[1].toFixed(1);
        else d += (d ? " L " : "M ") + pt[0].toFixed(1) + " " + pt[1].toFixed(1);
        prev = pt;
      }
      p.setAttribute("d", d);
    }
    function tick() {
      if (!satrec) return;
      var now = new Date();
      var pos = compute(now);
      if (!pos) { feedLive("satDot", "satState", false); return; }
      setT("satLat", fmtLat(pos.lat));
      setT("satLon", fmtLon(pos.lon));
      setT("satAlt", pos.alt.toFixed(0) + " km");
      setT("satVel", pos.spd != null ? Math.round(pos.spd).toLocaleString("en-US") + " km/h" : "\u2014");
      var c = proj(pos.lat, pos.lon);
      var m = document.getElementById("satMarker");
      if (m) m.setAttribute("transform", "translate(" + c[0].toFixed(1) + " " + c[1].toFixed(1) + ")");
      drawTrack(now);
      feedLive("satDot", "satState", true);
    }
    function load(catnr, name) {
      var dot = document.getElementById("satDot"); if (dot) dot.classList.remove("lost");
      setT("satState", "ACQUIRING");
      setT("satName", name || ("NORAD " + catnr));
      fetch("https://celestrak.org/NORAD/elements/gp.php?CATNR=" + catnr + "&FORMAT=TLE")
        .then(function (r) { if (!r.ok) throw 0; return r.text(); })
        .then(function (txt) {
          var lines = txt.trim().split(/\r?\n/);
          if (lines.length < 3 || /no gp data/i.test(txt)) throw 0;
          satrec = satellite.twoline2satrec(lines[1], lines[2]);
          setT("satName", lines[0].trim());
          if (tickTimer) clearInterval(tickTimer);
          tick();
          tickTimer = setInterval(tick, 2000);
        })
        .catch(function () { feedLive("satDot", "satState", false); setT("satName", "TLE source unreachable"); });
    }
    sel.addEventListener("change", function () { load(sel.value, sel.options[sel.selectedIndex].text); });
    load(sel.value, sel.options[sel.selectedIndex].text);
  })();

  /* Copernicus CAMS — global PM2.5 air-quality colour map (via Open-Meteo) + CSV download */
  (function () {
    if (!document.getElementById("cmap")) return;
    var W = 720, H = 360;
    var lons = [], lats = [];
    for (var lo = -165; lo <= 165; lo += 30) lons.push(lo);   // 12 columns
    for (var la = 63; la >= -57; la -= 24) lats.push(la);     // 6 rows (north -> south)
    function colour(v) {
      if (v == null || isNaN(v)) return "#1b2430";
      if (v <= 10) return "#2ecc71";
      if (v <= 20) return "#a3d65c";
      if (v <= 30) return "#f4d03f";
      if (v <= 45) return "#f39c12";
      if (v <= 75) return "#e2552f";
      return "#8e44ad";
    }
    var cLat = [], cLon = [];
    for (var i = 0; i < lats.length; i++)
      for (var j = 0; j < lons.length; j++) { cLat.push(lats[i]); cLon.push(lons[j]); }
    var url = "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=" +
              cLat.join(",") + "&longitude=" + cLon.join(",") + "&current=pm2_5";
    var rows = [];
    fetch(url)
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (data) {
        var arr = Array.isArray(data) ? data : [data];
        var cellW = 30 / 360 * W, cellH = 24 / 180 * H, frag = "";
        for (var k = 0; k < arr.length; k++) {
          var loc = arr[k], lat = cLat[k], lon = cLon[k];
          var pm = loc && loc.current ? loc.current.pm2_5 : null;
          rows.push([lat, lon, pm == null ? "" : pm]);
          var x = (lon - 15 + 180) / 360 * W;
          var y = (90 - (lat + 12)) / 180 * H;
          frag += '<rect class="cmap-cell" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) +
                  '" width="' + cellW.toFixed(1) + '" height="' + cellH.toFixed(1) +
                  '" fill="' + colour(pm) + '" opacity="0.82"></rect>';
        }
        var layer = document.getElementById("cmapCells");
        if (layer) layer.innerHTML = frag;
        setT("cmapTime", "Updated " + new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC");
        feedLive("cmapDot", "cmapState", true);
        var btn = document.getElementById("cmapDownload");
        if (btn) {
          btn.removeAttribute("disabled");
          btn.addEventListener("click", function () {
            var csv = "latitude,longitude,pm2_5_ugm3\n" + rows.map(function (r) { return r.join(","); }).join("\n");
            var blob = new Blob([csv], { type: "text/csv" });
            var a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "cams-pm25-" + new Date().toISOString().slice(0, 10) + ".csv";
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
          });
        }
      })
      .catch(function () { feedLive("cmapDot", "cmapState", false); });
  })();
})();
