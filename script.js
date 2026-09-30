// Configuración de recetas
const recipes = {
    linear: {
        formula: (x) => 2 * x + 3,
        expression: "f(x) = 2x + 3",
        desc: "Multiplica las frutas por 2 y le suma 3 de base."
    },
    quadratic: {
        formula: (x) => Math.pow(x, 2) - 1,
        expression: "f(x) = x² - 1",
        desc: "Eleva las frutas al cuadrado y le resta 1."
    },
    rational: {
        formula: (x) => {
            if (x === 0) throw new Error("¡Error de Dominio! No se puede dividir entre 0.");
            return 10 / x;
        },
        expression: "f(x) = 10 / x",
        desc: "Divide 10 entre la cantidad de frutas."
    }
};

// Elementos del DOM
const recipeSelect = document.getElementById('recipe-select');
const recipeDesc = document.getElementById('recipe-desc');
const fruitInput = document.getElementById('fruit-input');
const blendBtn = document.getElementById('blend-btn');
const statusBox = document.getElementById('status-box');
const blade = document.getElementById('blade');
const liquid = document.getElementById('liquid');
const historyTable = document.getElementById('history-table');

// Inicializar Chart.js
const ctx = document.getElementById('functionChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'Puntos (x, y)',
            data: [],
            backgroundColor: '#ff4757',
            pointRadius: 6
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { title: { display: true, text: 'Frutas (x)' } },
            y: { title: { display: true, text: 'Malteadas (y)' } }
        }
    }
});

// Cambiar descripción al seleccionar receta
recipeSelect.addEventListener('change', () => {
    recipeDesc.textContent = recipes[recipeSelect.value].desc;
});

// Botón de licuar
blendBtn.addEventListener('click', () => {
    const x = parseFloat(fruitInput.value);
    const selectedKey = recipeSelect.value;
    const recipe = recipes[selectedKey];

    if (isNaN(x)) {
        statusBox.textContent = "⚠️ Ingresa un número válido de frutas.";
        return;
    }

    // Iniciar animación
    blade.classList.add('spinning');
    liquid.style.height = "70%";
    statusBox.textContent = "Licuando frutas y procesando función...";

    setTimeout(() => {
        blade.classList.remove('spinning');
        liquid.style.height = "0%";

        try {
            const y = recipe.formula(x);
            const resultY = Number.isInteger(y) ? y : y.toFixed(2);
            
            statusBox.textContent = `✅ ¡Listo! ${x} frutas ➔ ${resultY} malteadas.`;
            
            // Agregar a la tabla
            addRowToTable(x, recipe.expression, resultY);
            
            // Agregar a la gráfica
            addPointToChart(x, y);

        } catch (error) {
            statusBox.textContent = `❌ ${error.message}`;
        }
    }, 1000);
});

function addRowToTable(x, expr, y) {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${x}</td><td>${expr}</td><td><strong>${y}</strong></td>`;
    historyTable.prepend(row);
}

function addPointToChart(x, y) {
    chart.data.datasets[0].data.push({ x: x, y: y });
    chart.update();
}