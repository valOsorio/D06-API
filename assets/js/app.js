const input = document.querySelector("#input");
const select = document.querySelector("#select");
const btn = document.querySelector("#btn");
const span = document.querySelector("#span");
const url = "https://mindicador.cl/api";
let myChart = null;

const getMonedas = async (moneda) => {
  try {
    const res = await fetch(`${url}/${moneda}`);
    const data = await res.json();
    const { serie } = data;
    const datos = createDataToChart(serie.slice(-10).reverse());
    renderGrafica(datos);
    const [{ valor: valorDeLaMoneda }] = serie;
    return valorDeLaMoneda;
  } catch (error) {
    alert(error.message); // Esto es para mostrar alerta "Failed to Fetch"
  }
};

const createDataToChart = (serie) => {
  const labels = serie.map(({ fecha }) => FormatDate(fecha));
  const data = serie.map(({ valor }) => valor);
  const datasets = [
    {
      label: "Historial de los últimos 10 días",
      borderColor: "rgb(255, 99, 132)",
      data,
    },
  ];
  return { labels, datasets };
};

const renderGrafica = (data) => {
  const config = {
    type: "line",
    data,
  };

  const canvas = document.getElementById("myChart").getContext("2d");
  if (myChart) {
    myChart.destroy();
  }
  myChart = new Chart(canvas, config);
};

const FormatDate = (date) => {
  date = new Date(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${day}/${month}/${year}`;
};

btn.addEventListener("click", async () => {
  const { value: pesos } = input;
  const { value: monedaSelected } = select;
  if (isNaN(parseFloat(pesos)) || parseFloat(pesos) <= 0) {
    alert("Por favor, ingrese una cantidad valida y positiva en pesos")
    return
  }
  const valorDeLaMoneda = await getMonedas(monedaSelected);
  if (!isFinite(valorDeLaMoneda)) {
    alert("El valor de la moneda seleccionada no es valido")
    return
  }
  const valorFinal = (pesos / valorDeLaMoneda).toFixed(2);
  span.innerHTML = `Resultado: $${valorFinal}`;
});
