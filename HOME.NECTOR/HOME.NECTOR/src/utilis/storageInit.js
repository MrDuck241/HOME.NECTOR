export function initializeLocalStorageDefaults() {
    if (localStorage.getItem("theme") === null) {
        localStorage.setItem("theme", "dark");
      }
    
      if (localStorage.getItem("lang") === null) {
        localStorage.setItem("lang", "en");
      }
}