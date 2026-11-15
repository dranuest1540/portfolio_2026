document.querySelectorAll(".site-nav .nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    const navigation = document.querySelector("#mainNavigation");
    if (navigation?.classList.contains("show") && window.bootstrap) {
      window.bootstrap.Collapse.getOrCreateInstance(navigation).hide();
    }
  });
});

document.querySelectorAll("[data-password-toggle]").forEach((toggle) => {
  const input = document.getElementById(toggle.dataset.passwordToggle);
  const icon = toggle.querySelector("i");

  if (!input || !icon) {
    return;
  }

  toggle.addEventListener("click", () => {
    const showPassword = input.type === "password";
    input.type = showPassword ? "text" : "password";
    toggle.setAttribute("aria-pressed", String(showPassword));
    toggle.setAttribute(
      "aria-label",
      showPassword ? "Hide password" : "Show password",
    );
    icon.classList.toggle("fa-eye", !showPassword);
    icon.classList.toggle("fa-eye-slash", showPassword);
  });
});

const techSwiperElement = document.querySelector(".tech-swiper");

if (techSwiperElement && window.Swiper) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  new window.Swiper(techSwiperElement, {
    slidesPerView: "auto",
    spaceBetween: 10,
    loop: true,
    speed: 4000,
    grabCursor: true,
    freeMode: {
      enabled: true,
      momentum: false,
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    autoplay: prefersReducedMotion
      ? false
      : {
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        },
  });
}
