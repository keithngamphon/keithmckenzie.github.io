(() => {
  const root = document.documentElement;
  const button = document.getElementById("theme-toggle");
  const label = document.getElementById("theme-label");
  const menuButton = document.getElementById("menu-toggle");
  const menu = document.getElementById("site-menu");
  const backdrop = document.createElement("button");
  const storageKey = "keith-ngamphon-theme";
  let menuTimer;
  let menuTransitionId = 0;

  backdrop.type = "button";
  backdrop.className = "menu-backdrop";
  backdrop.setAttribute("aria-label", "Close navigation menu");
  backdrop.tabIndex = -1;
  backdrop.hidden = true;
  menu.before(backdrop);
  menu.inert = true;
  menu.setAttribute("aria-hidden", "true");

  try { root.dataset.theme = localStorage.getItem(storageKey) === "light" ? "light" : "dark"; }
  catch { root.dataset.theme = root.dataset.theme === "light" ? "light" : "dark"; }
  const updateThemeControl = () => {
    const theme = root.dataset.theme === "light" ? "light" : "dark";
    root.dataset.theme = theme;
    const nextTheme = theme === "dark" ? "light" : "dark";
    button.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
    button.title = `Switch to ${nextTheme} theme`;
    label.textContent = theme === "dark" ? "Dark" : "Light";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#111111" : "#f7f7f5");
  };
  updateThemeControl();
  button.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    updateThemeControl();
    try { localStorage.setItem(storageKey, root.dataset.theme); } catch {}
  });
  const finishMenuClose = (transitionId) => {
    if (transitionId !== menuTransitionId || menuButton.getAttribute("aria-expanded") === "true") return;
    window.clearTimeout(menuTimer);
    menu.hidden = true;
    backdrop.hidden = true;
  };
  const closeMenu = (returnFocus = false) => {
    const transitionId = ++menuTransitionId;
    window.clearTimeout(menuTimer);
    menu.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    menu.inert = true;
    menu.setAttribute("aria-hidden", "true");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuTimer = window.setTimeout(() => finishMenuClose(transitionId), 470);
    if (returnFocus) menuButton.focus();
  };
  const openMenu = () => {
    window.clearTimeout(menuTimer);
    ++menuTransitionId;
    menu.hidden = false;
    backdrop.hidden = false;
    menu.inert = false;
    menu.setAttribute("aria-hidden", "false");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Close navigation menu");
    void menu.offsetWidth;
    void backdrop.offsetWidth;
    menu.classList.add("is-open");
    backdrop.classList.add("is-open");
    menu.querySelector("a")?.focus();
  };
  menuButton.addEventListener("click", () => {
    if (menu.hidden || menu.inert) openMenu();
    else closeMenu();
  });
  backdrop.addEventListener("click", () => closeMenu(true));
  menu.addEventListener("transitionend", (event) => {
    if (event.target === menu && event.propertyName === "transform") finishMenuClose(menuTransitionId);
  });
  menu.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu(true);
    if (event.key === "Tab") {
      const links = [...menu.querySelectorAll("a")];
      if (event.shiftKey && document.activeElement === links[0]) { event.preventDefault(); links.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === links.at(-1)) { event.preventDefault(); links[0].focus(); }
    }
  });
  document.addEventListener("click", (event) => {
    if (!menu.hidden && !menu.inert && !menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
})();
