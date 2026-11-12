/* Dr. Victor Maiorano — interações */
(function () {
  "use strict";
  var WHATSAPP = "5582991229643";
  var root = document.documentElement;

  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(a.getAttribute("data-wa"));
  });

  /* A persiana da janela abre logo depois do carregamento */
  window.addEventListener("load", function () { setTimeout(function () { root.classList.add("open"); }, 250); });
  setTimeout(function () { root.classList.add("open"); }, 1800);

  var top = document.getElementById("top");
  var wa = document.querySelector(".wa");
  function onScroll() {
    var y = window.scrollY;
    top.classList.toggle("is-solid", y > 30);
    wa.classList.toggle("is-visible", y > window.innerHeight * 0.7);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add("is-in"); }); }

  /* Mural com todas as avaliações reais, com filtros por assunto */
  var wall = document.getElementById("wall");
  if (wall && window.REVIEWS) {
    var TAGS = {
      urg: /urg[eê]ncia|emerg|socorr|véspera|quebr/i,
      vista: /vista|para o mar|pajuçara|panor/i,
      fam: /fam[ií]lia|filh|namorad|parceiro|amigos/i,
      tur: /viag|turist|férias|porto|chile|arapiraca|220 ?km/i,
      calma: /medo|sem dor|indolor|calma|tranquil|relax|à vontade|vontade/i
    };
    var all = window.REVIEWS.map(function (r) {
      var tags = Object.keys(TAGS).filter(function (k) { return TAGS[k].test(r[1]); });
      return { n: r[0], t: r[1], tags: tags };
    });
    var filter = "all", shown = 12, STEP = 12;
    var more = document.getElementById("more");
    function list() { return filter === "all" ? all : all.filter(function (r) { return r.tags.indexOf(filter) > -1; }); }
    document.querySelectorAll("[data-c]").forEach(function (el) {
      var k = el.getAttribute("data-c");
      el.textContent = k === "all" ? all.length : all.filter(function (r) { return r.tags.indexOf(k) > -1; }).length;
    });
    function render() {
      var l = list(); wall.innerHTML = "";
      l.slice(0, shown).forEach(function (r, i) {
        var a = document.createElement("article");
        a.style.animationDelay = (i % STEP) * 30 + "ms";
        var p = document.createElement("p"); p.textContent = "“" + r.t + "”";
        var f = document.createElement("footer");
        var b = document.createElement("b"); b.textContent = r.n;
        var s = document.createElement("i"); s.textContent = "★★★★★"; s.setAttribute("aria-label", "5 estrelas");
        f.appendChild(b); f.appendChild(s); a.appendChild(p); a.appendChild(f); wall.appendChild(a);
      });
      more.parentElement.hidden = shown >= l.length;
      more.textContent = "Ver mais avaliações (" + (l.length - shown) + ")";
    }
    document.querySelectorAll(".chip").forEach(function (c) {
      c.addEventListener("click", function () {
        filter = c.getAttribute("data-f"); shown = STEP;
        document.querySelectorAll(".chip").forEach(function (x) { var on = x === c; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", String(on)); });
        render();
      });
    });
    more.addEventListener("click", function () { shown += STEP; render(); });
    render();
  }

  var y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();
})();
