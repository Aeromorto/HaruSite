(() => {
  const root = document.documentElement;
  if (/Android/i.test(navigator.userAgent)) {
    root.classList.add("is-android");
  }
  const KEY_THEME = "haru-theme";
  const KEY_LANG = "haru-lang";

  const read = (key) => {
    try {
      return localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  };

  const write = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (_) {
      /* file:// or private mode */
    }
  };

  const param = (name) => {
    try {
      const search = String(location.search || "").replace(/^\?/, "");
      if (!search) return null;
      const parts = search.split("&");
      for (let i = 0; i < parts.length; i += 1) {
        const eq = parts[i].indexOf("=");
        const key = decodeURIComponent(
          eq >= 0 ? parts[i].slice(0, eq) : parts[i]
        );
        if (key === name) {
          return decodeURIComponent(eq >= 0 ? parts[i].slice(eq + 1) : "");
        }
      }
    } catch (_) {
      /* ignore */
    }
    return null;
  };

  const validTheme = (value) =>
    value === "kraft" || value === "clara" ? value : null;
  const validLang = (value) => (value === "en" || value === "pt" ? value : null);

  let theme = validTheme(param("theme")) || validTheme(read(KEY_THEME));
  if (theme) {
    write(KEY_THEME, theme);
  } else {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "kraft"
      : "clara";
  }
  root.setAttribute("data-theme", theme);

  let lang = validLang(param("lang")) || validLang(read(KEY_LANG));
  if (lang) {
    write(KEY_LANG, lang);
  } else {
    lang = "pt";
    const list =
      navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language || navigator.userLanguage || "pt"];
    for (let i = 0; i < list.length; i += 1) {
      const code = String(list[i] || "").toLowerCase();
      if (code === "pt" || code.indexOf("pt-") === 0) {
        lang = "pt";
        break;
      }
      if (code === "en" || code.indexOf("en-") === 0) {
        lang = "en";
        break;
      }
    }
  }
  root.setAttribute("data-lang", lang);
  root.lang = lang === "en" ? "en" : "pt-BR";

  if (lang === "en") {
    const path = String(location.pathname || location.href).toLowerCase();
    if (path.indexOf("microplasticos") >= 0) {
      document.title = "HARU — What a nylon toothbrush leaves in the body";
    } else if (path.indexOf("uso") >= 0) {
      document.title = "HARU — Notes on use";
    } else {
      document.title = "HARU — Hygiene made from matter, not plastic";
    }
  }
})();
