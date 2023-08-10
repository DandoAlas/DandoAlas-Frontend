document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector('.search input[type="text"]');
    
    searchInput.addEventListener("focus", function () {
        if (searchInput.value === "Buscar") {
            searchInput.value = "";
        }
    });

    searchInput.addEventListener("blur", function () {
        if (searchInput.value.trim() === "") {
            searchInput.value = "Buscar";
        } else {
            searchInput.value = "Buscar";
        }
    });

    const selectSalida = document.querySelector(".salida");
    const selectLlegada = document.querySelector(".llegada");

    for (let i = 1; i <= 24; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        selectSalida.appendChild(option);

        const option2 = document.createElement("option");
        option2.value = i;
        option2.textContent = i;
        selectLlegada.appendChild(option2);
    }
});
