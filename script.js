const visor = document.getElementById("visor");
const visorTitulo = document.getElementById("visorTitulo");

/* ---------- Intro: después del logo, mostrar todo ---------- */
window.addEventListener("load", () => {
  setTimeout(() => document.body.classList.add("listo"), 3600);
});

/* ---------- Utilidades ---------- */
function prepararVisor(titulo) {
  visorTitulo.textContent = titulo;
  visor.classList.remove("error");
  visor.innerHTML = "";
}

function aNumero(valor) {
  const texto = String(valor).trim().replace(",", ".");
  if (texto === "" || isNaN(Number(texto))) {
    throw new Error("Entrada no válida. Debes escribir números.");
  }
  return Number(texto);
}

// Crea un formulario dentro de un contenedor.
// campos: [{ id, etiqueta, ejemplo }]
// calcular: recibe un objeto con los valores y devuelve el texto del resultado
function crearFormulario(contenedor, campos, calcular) {
  const form = document.createElement("form");
  form.className = "form";

  campos.forEach(c => {
    const label = document.createElement("label");
    label.textContent = c.etiqueta;
    const input = document.createElement("input");
    input.type = "text";
    input.inputMode = "decimal";
    input.id = c.id;
    input.placeholder = c.ejemplo || "";
    input.autocomplete = "off";
    label.appendChild(input);
    form.appendChild(label);
  });

  const boton = document.createElement("button");
  boton.type = "submit";
  boton.textContent = "Calcular";
  form.appendChild(boton);

  const resultado = document.createElement("div");
  resultado.className = "resultado";
  form.appendChild(resultado);

  form.addEventListener("submit", e => {
    e.preventDefault();
    try {
      const valores = {};
      campos.forEach(c => (valores[c.id] = aNumero(form.querySelector("#" + c.id).value)));
      resultado.classList.remove("error");
      resultado.textContent = calcular(valores);
    } catch (err) {
      resultado.classList.add("error");
      resultado.textContent = err.message;
    }
  });

  contenedor.appendChild(form);
  const primero = form.querySelector("input");
  if (primero) primero.focus();
}

/* 1) Calculadora de propina */
function calcularPropina() {
  prepararVisor("Calculadora de propina");
  crearFormulario(
    visor,
    [
      { id: "cuenta", etiqueta: "Monto de la cuenta", ejemplo: "Ej: 50000" },
      { id: "porcentaje", etiqueta: "Porcentaje de propina (%)", ejemplo: "Ej: 10" }
    ],
    v => {
      const propina = v.cuenta * v.porcentaje / 100;
      const total = v.cuenta + propina;
      return `Propina: ${propina.toFixed(2)}\nTotal a pagar: ${total.toFixed(2)}`;
    }
  );
}

/* 2) Clasificador de IMC */
function clasificarIMC() {
  prepararVisor("Clasificador de IMC");
  crearFormulario(
    visor,
    [
      { id: "peso", etiqueta: "Peso (kg)", ejemplo: "Ej: 70" },
      { id: "altura", etiqueta: "Altura (m)", ejemplo: "Ej: 1.75" }
    ],
    v => {
      if (v.peso <= 0 || v.altura <= 0) {
        throw new Error("El peso y la altura deben ser mayores que 0.");
      }
      const imc = v.peso / (v.altura ** 2);
      let categoria;
      if (imc < 18.5) categoria = "Bajo peso";
      else if (imc < 25) categoria = "Normal";
      else if (imc < 30) categoria = "Sobrepeso";
      else categoria = "Obesidad";
      return `IMC: ${imc.toFixed(2)}\nCategoría: ${categoria}`;
    }
  );
}

/* 3) Menú por switch */
function menuUtilidades() {
  prepararVisor("Menú de utilidades");

  const selector = document.createElement("select");
  selector.innerHTML = `
    <option value="">— Elige una utilidad —</option>
    <option value="1">1) Celsius → Fahrenheit</option>
    <option value="2">2) Precio con IVA</option>
    <option value="3">3) Nota (0–100) → Letra</option>`;
  const zona = document.createElement("div");
  visor.appendChild(selector);
  visor.appendChild(zona);

  selector.addEventListener("change", () => {
    zona.innerHTML = "";

    switch (selector.value) {
      case "1":
        crearFormulario(
          zona,
          [{ id: "c", etiqueta: "Temperatura en °C", ejemplo: "Ej: 25" }],
          v => `${v.c} °C = ${(v.c * 9 / 5 + 32).toFixed(2)} °F`
        );
        break;

      case "2":
        crearFormulario(
          zona,
          [
            { id: "precio", etiqueta: "Precio", ejemplo: "Ej: 100000" },
            { id: "iva", etiqueta: "Porcentaje de IVA (%)", ejemplo: "Ej: 19" }
          ],
          v => `Precio final con IVA: ${(v.precio * (1 + v.iva / 100)).toFixed(2)}`
        );
        break;

      case "3":
        crearFormulario(
          zona,
          [{ id: "nota", etiqueta: "Nota (0–100)", ejemplo: "Ej: 85" }],
          v => {
            if (v.nota < 0 || v.nota > 100) {
              throw new Error("La nota debe estar entre 0 y 100.");
            }
            let letra;
            if (v.nota >= 90) letra = "A";
            else if (v.nota >= 80) letra = "B";
            else if (v.nota >= 70) letra = "C";
            else if (v.nota >= 60) letra = "D";
            else letra = "F";
            return `Nota: ${v.nota}\nLetra: ${letra}`;
          }
        );
        break;

      default:
        break;
    }
  });
}