const searchBox = document.querySelector(".navbar__b--search");
const input = searchBox.querySelector("input");
const button = searchBox.querySelector("button");

async function sha256(texto) {
    const data = new TextEncoder().encode(texto);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

async function performSearch() {
    const query = input.value.trim();

    if (!query) {
        return;
    }

    const hash = await sha256(query);

    const hashPath = hash.match(/.{2}/g).join("/");

    window.location.href =
        `/search/q/${hashPath}/?text=${encodeURIComponent(query)}`;
}

button.addEventListener("click", performSearch);

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        performSearch();
    }
});