/**
 * Smoothly scrolls to the element with the given ID or to the top of the page.
 * @param href - The href of the link, e.g., "#about" or "/".
 */
export function smoothScrollTo(href: string) {
  if (href === "/" || href === "#") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
