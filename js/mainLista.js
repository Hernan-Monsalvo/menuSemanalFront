//pagina menu
//traer menu con id
var urlMenu = window.location.href.split("=");
var id = urlMenu[1];
var menu;
var diaMenu;

const resultado = document.getElementById("resultadoMenu");
const dias = [
  "Sábado",
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
];

fetch("http://menu-semanal.herokuapp.com/menuSemanal/menu?id=" + id)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    menu = data;
    console.log(data);

    let arr = data.platos;

    let tmpTitulo = `        
        <div class="d-flex flex-row justify-content-between me-2 mb-2">
        <h3>${data.nombre}</h3>
        <h3>${data.mes}</h3>
        <h3>semana ${data.semana}</h3>
        <button class="btn btn-primary me-2" id="btn-pdfMenu" onclick="imprimirPdfMenu()">Imprimir PDF</button>
        </div>`;

    let tmp = `

      
            <div class="d-flex flex-row flex-md-column justify-content-between me-2 mb-2">
            <h3>Días:</h3> 
            <h3>Almuerzo</h3> 
            <h3>Cena</h3> 
            </div>`;
    let j = 0;
    for (let i = 0; i < arr.length; i += 2) {
      tmp += `<div class="d-flex flex-row flex-md-column justify-content-around me-2 mb-2 text-md-center diaMenu diaBordeado">
                <h4>${dias[j]}</h4> 
                <h6 class="text-center">${arr[i]}</h6> 
                <h6 class="text-center">${arr[i + 1]}</h6> 
                </div>`;
      j++;
    }

    document.getElementById("tituloMenu").innerHTML = tmpTitulo;
    resultado.innerHTML = tmp;
  });
//imprimir pdf

//generar lista de compra con slider
function listaCompra() {
  let rango = slider.noUiSlider.get();

  let val1 = parseInt(rango[0]);
  let val2 = parseInt(rango[1]);

  let diaIni = val1 * 2;
  let diaFin = val2 * 2;

  console.log(diaIni);
  console.log(diaFin);

  fetch(
    `http://menu-semanal.herokuapp.com/menuSemanal/lista?id=${id}&diaIni=${diaIni}&diaFin=${diaFin}`
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);

      keys = Object.keys(data);

      let selectAgregar = document.getElementById("selectAgregar");

      let supr = data.supermercado;
      let carn = data.carniceria;
      let verd = data.verduleria;

      let arr = [supr, carn, verd];
      var tmpLista = "";
      i = 0;
      keys.forEach((titulo) => {
        let opt = document.createElement("option");
        opt.innerHTML = titulo;
        selectAgregar.appendChild(opt);

        let tmp = "";
        tmp += `<div id="${titulo}" class="d-flex flex-column negocioLista p-2 m-1">`;
        let tituloUp = titulo.charAt(0).toUpperCase() + titulo.slice(1);
        tmp += `<h4 class="tituloLista">${tituloUp}</h4>`;
        arr[i].forEach((producto) => {
          tmp += `
          <label for"${producto}">
          <input id="${producto}" type="checkbox"/>${producto}</label>`;
        });
        i++;
        tmp += `</div>`;
        tmpLista += tmp;
      });
      let tmpTitulol = `        
      <div class="d-flex flex-row justify-content-between me-2 mb-2">
      <h3>Tu lista de compras</h3>
      <div>
      <button class="btn btn-primary me-2" id="btn-agregar" data-bs-toggle="modal" data-bs-target="#exampleModal2">agregar producto</button>
      <button class="btn btn-primary me-2" id="btn-pdfMenu" onclick="imprimirPdfLista()">Imprimir PDF</button>
      </div>
      </div>`;

      document.getElementById("tituloLista").innerHTML = tmpTitulol;
      document.getElementById("resultadoLista").innerHTML = tmpLista;
    });
}

//slider

var slider = document.getElementById("slider");

noUiSlider.create(slider, {
  start: [0, 7],
  step: 1,
  connect: true,
  range: {
    min: 0,
    max: 7,
  },
  pips: {
    mode: "values",
    values: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7],
    density: 50,
  },
});

slider.noUiSlider.on("change", pintarOnChange);

function pintarOnChange() {
  let diaMenu = document.querySelectorAll(".diaMenu");
  let sliderPips = document.querySelectorAll(".noUi-value");
  var pipsDias = [];
  sliderPips.forEach((e) => {
    let val = e.getAttribute("data-value");
    if (val.includes(".")) {
      pipsDias.push(e);
    }
  });

  let rango = slider.noUiSlider.get();

  let val1 = parseInt(rango[0]);
  let val2 = parseInt(rango[1]);

  for (let index = 0; index < 7; index++) {
    if (val1 <= index && index < val2) {
      diaMenu[index].classList.add("diaBordeado");
      diaMenu[index].classList.remove("sinBorde");
      pipsDias[index].classList.add("pipResaltado");
      pipsDias[index].classList.remove("pipNormal");
    } else {
      diaMenu[index].classList.remove("diaBordeado");
      diaMenu[index].classList.add("sinBorde");
      pipsDias[index].classList.remove("pipResaltado");
      pipsDias[index].classList.add("pipNormal");
    }
  }
}

//cambia el valor de la regla del slide por dias
var sliderPips = document.querySelectorAll(".noUi-value");

sliderPips.forEach((e) => {
  let val = e.getAttribute("data-value");
  if (val.includes(".")) {
    let spl = val.split(".");
    let pos = parseInt(spl[0]);

    e.innerHTML = dias[pos].charAt(0);
  } else {
    e.innerHTML = "";
  }
});

//agregar producto a la lista
function agregarProducto() {
  let producto = document.getElementById("producto").value;
  let selectAgregar = document.getElementById("selectAgregar").value;
  let cantidad = document.getElementById("cantidad").value;
  let unidad = document.getElementById("unidad").value;

  let che = document.createElement("input");
  che.type = "checkbox";

  let lab = document.createElement("label");

  lab.appendChild(che);
  che.id = `${producto}(${cantidad}_${unidad})`;
  let txt = document.createTextNode(`${producto}(${cantidad}_${unidad})`);
  lab.appendChild(txt);

  document.getElementById(selectAgregar).appendChild(lab);
}

//imprimir pdf de menu
function imprimirPdfMenu() {
  console.log("boton pdf");
  fetch("http://menu-semanal.herokuapp.com/menuSemanal/menu?pdfid=" + id)
  .then(async (res) => ({
    blob: await res.blob(),
  }))
    .then((resObj) => {
      // It is necessary to create a new blob object with mime-type explicitly set for all browsers except Chrome, but it works for Chrome too.
      const newBlob = new Blob([resObj.blob], { type: "application/pdf" });

      // MS Edge and IE don't allow using a blob object directly as link href, instead it is necessary to use msSaveOrOpenBlob
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
      } else {
        // For other browsers: create a link pointing to the ObjectURL containing the blob.
        const objUrl = window.URL.createObjectURL(newBlob);

        let link = document.createElement("a");
        link.href = objUrl;
        link.download = "Menu semanal -" + menu.mes + "-" + menu.semana;
        link.click();

        // For Firefox it is necessary to delay revoking the ObjectURL.
        setTimeout(() => {
          window.URL.revokeObjectURL(objUrl);
        }, 250);
      }
    })
    .catch((error) => {
      console.log("DOWNLOAD ERROR", error);
    });
}

//imprimir pdf lista de compra
function imprimirPdfLista(){
//armar json con 3 arrays (objeto lista)
let supermercado = document.querySelectorAll('#supermercado input');
let carniceria = document.querySelectorAll('#carniceria input');
let verduleria = document.querySelectorAll('#verduleria input');

let supArray = [];
let carArray = [];
let verArray = [];

supermercado.forEach(x =>{
  supArray.push(x.id);
})
carniceria.forEach(x =>{
  carArray.push(x.id);
})
verduleria.forEach(x =>{
  verArray.push(x.id);
})

console.log(supArray);
console.log(carArray);
console.log(verArray);

let listaJson = {
  supermercado : supArray,
  carniceria : carArray,
  verduleria : verArray
};

//mandar objeto lista en post (fetch), recibir e imprimir PDF
fetch("http://menu-semanal.herokuapp.com/menuSemanal/lista", {
  method: "POST",
  body: JSON.stringify(listaJson),
  headers: {
    'Content-Type': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded',
  }
})
.then(async (res) => ({
  blob: await res.blob(),
}))
  .then((resObj) => {
    // It is necessary to create a new blob object with mime-type explicitly set for all browsers except Chrome, but it works for Chrome too.
    const newBlob = new Blob([resObj.blob], { type: "application/pdf" });

    // MS Edge and IE don't allow using a blob object directly as link href, instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob);
    } else {
      // For other browsers: create a link pointing to the ObjectURL containing the blob.
      const objUrl = window.URL.createObjectURL(newBlob);

      let link = document.createElement("a");
      link.href = objUrl;
      link.download = "Lista de compras -" + menu.mes + "-" + menu.semana;
      link.click();

      // For Firefox it is necessary to delay revoking the ObjectURL.
      setTimeout(() => {
        window.URL.revokeObjectURL(objUrl);
      }, 250);
    }
  })
  .catch((error) => {
    console.log("DOWNLOAD ERROR", error);
  });


}
//fin pagina menu
