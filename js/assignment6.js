// Assignment 6: jQuery features. Separate from earlier assignments.
$(function () {
  console.log("jQuery is ready!");
  if (!$("#scroll-progress-bar").length) $("body").prepend('<div id="scroll-progress-bar"></div>');
  function progress() {
    const total = $(document).height() - $(window).height();
    $("#scroll-progress-bar").css("width", (total > 0 ? Math.min(100, $(window).scrollTop() / total * 100) : 100) + "%");
  }
  $(window).on("scroll resize", progress); progress();

  if ($(".main-content").length && !$("#jquery-search-input").length)
    $(".main-content").prepend('<div class="jquery-search-section"><div class="search-wrapper"><input id="jquery-search-input" class="search-input" autocomplete="off" placeholder="Search menu, news, or reviews (e.g. Burger, Wings, Astana)..."><div id="search-suggestions" class="search-suggestions"></div></div></div>');
  const terms = ["Chefburger", "Twister Wrap", "Zinger Burger", "Calculus Retake Relief", "Draft-Free Combo", "Friends Bucket", "Astana Stores", "Almaty Stores", "Shymkent Stores", "Crispy Wings"];
  function clearMarks() { $("mark.highlight").each(function () { $(this).replaceWith(document.createTextNode($(this).text())); }); }
  function highlight(term) {
    clearMarks(); if (!term) return;
    $(".main-content p,.main-content .card-title,.main-content .card-desc,.main-content h3").each(function () {
      const walker = document.createTreeWalker(this, NodeFilter.SHOW_TEXT), nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(node => {
        const value = node.nodeValue, lower = value.toLowerCase();
        let pos = lower.indexOf(term.toLowerCase()), from = 0;
        if (pos === -1) return;
        const fragment = document.createDocumentFragment();
        while (pos !== -1) {
          fragment.append(document.createTextNode(value.slice(from, pos)));
          const mark = document.createElement("mark");
          mark.className = "highlight"; mark.textContent = value.slice(pos, pos + term.length);
          fragment.append(mark);
          from = pos + term.length;
          pos = lower.indexOf(term.toLowerCase(), from);
        }
        fragment.append(document.createTextNode(value.slice(from)));
        node.replaceWith(fragment);
      });
    });
  }
  $("#jquery-search-input").on("input", function () {
    const query = $(this).val().trim().toLowerCase(), box = $("#search-suggestions").empty().hide();
    if (!query) { clearMarks(); return; }
    terms.filter(x => x.toLowerCase().includes(query)).forEach(x => $("<div>").addClass("suggestion-item").text(x).appendTo(box));
    if (box.children().length) box.show();
    highlight(query);
  });
  $(document).on("click", ".suggestion-item", function () {
    const value = $(this).text();
    $("#jquery-search-input").val(value);
    $("#search-suggestions").hide();
    highlight(value);
  });
  $(document).on("click", e => { if (!$(e.target).closest(".jquery-search-section").length) $("#search-suggestions").hide(); });

  if ($(".main-content").length && !$(".stats-counter-section").length)
    $(".main-content").append('<section class="stats-counter-section"><h2>KFC Kazakhstan in Numbers</h2><div class="stats-grid"><div class="stat-card"><h3 class="counter" data-target="15000">0</h3><p>Happy Customers Daily</p></div><div class="stat-card"><h3 class="counter" data-target="24">0</h3><p>Restaurants Nationwide</p></div><div class="stat-card"><h3 class="counter" data-target="100">0</h3><p>% Fresh Local Chicken</p></div></div></section>');
  let animated = false;
  function counters() {
    const stats = $(".stats-counter-section");
    if (animated || !stats.length || $(window).scrollTop() + $(window).height() < stats.offset().top + 70) return;
    animated = true;
    $(".counter").each(function () {
      const el = $(this), number = Number(el.attr("data-target"));
      $({ value: 0 }).animate({ value: number }, {
        duration: 2000, easing: "swing",
        step() { el.text(Math.floor(this.value).toLocaleString()); },
        complete() { el.text(number.toLocaleString() + "+"); }
      });
    });
  }
  $(window).on("scroll resize", counters); counters();

  window.showJQueryToast = function (message, type = "success") {
    let area = $("#site-toast-area");
    if (!area.length) area = $('<div id="site-toast-area" aria-live="polite"></div>').appendTo("body");
    const toast = $("<div>").addClass("site-toast " + type).text(message).appendTo(area);
    setTimeout(() => toast.fadeOut(400, function () { $(this).remove(); }), 3000);
  };
  $("form").on("submit", function (event) {
    const form = this, button = $(form).find('button[type="submit"],input[type="submit"]').first();
    setTimeout(() => {
      if (event.defaultPrevented || !form.checkValidity() || !button.length || button.hasClass("is-loading")) return;
      const isInput = button.is("input"), old = isInput ? button.val() : button.html();
      button.prop("disabled", true).addClass("is-loading");
      if (isInput) button.val("Please wait...");
      else button.html('<span class="btn-spinner"></span> Please wait...');
      setTimeout(() => {
        if (isInput) button.val(old); else button.html(old);
        button.prop("disabled", false).removeClass("is-loading");
        showJQueryToast("Form submitted successfully!");
      }, 1500);
    }, 0);
  });

  $(".promo-card").each(function () {
    if (!$(this).find(".copy-snippet-btn").length)
      $(this).append('<button type="button" class="copy-snippet-btn">Copy Info<span class="copy-tooltip">Copied to clipboard!</span></button>');
  });
  $(document).on("click", ".copy-snippet-btn", function () {
    const button = $(this), card = button.closest(".promo-card");
    const value = card.find(".card-title,h3").first().text() + " - " + card.find(".card-desc,p").first().text();
    if (!navigator.clipboard?.writeText) { showJQueryToast("Clipboard unavailable", "error"); return; }
    navigator.clipboard.writeText(value).then(() => {
      button.find(".copy-tooltip").fadeIn(200).delay(1000).fadeOut(200);
      showJQueryToast("Copied to clipboard!");
    }).catch(() => showJQueryToast("Copy failed", "error"));
  });

  $("img").each(function () {
    const image = $(this);
    if (image.attr("src") && !image.attr("data-src")) {
      image.attr("data-src", image.attr("src")).css("opacity", 0.3);
    }
  });
  function lazyLoad() {
    const top = $(window).scrollTop(), bottom = top + $(window).height();
    $("img[data-src]").each(function () {
      const image = $(this), y = image.offset().top;
      if (y + image.height() >= top - 100 && y <= bottom + 100) {
        image.attr("src", image.attr("data-src")).removeAttr("data-src").animate({ opacity: 1 }, 500);
      }
    });
  }
  $(window).on("scroll resize", lazyLoad); lazyLoad();
});