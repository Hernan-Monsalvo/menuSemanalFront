//boton generar menu

const formulario = document.getElementById("menuForm");
const dias = [
  "Sábado",
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
];
const resultado = document.getElementById("resultadoMenu");

formulario.addEventListener("submit", submitForm);

async function submitForm(e) {
  e.preventDefault();

  const form = e.currentTarget;

  const url = form.action;

  try {
    const formData = new FormData(form);

    const responseData = await postFormDataAsJson({ url, formData });

    let arr = responseData;
    let tmp = `<div class="d-flex flex-row flex-md-column justify-content-between me-2 mb-2">
		<h3>Días:</h3> 
		<h3>Almuerzo</h3> 
		<h3>Cena</h3> 
		</div>`;
    let j = 0;
    for (let i = 0; i < arr.length; i += 2) {
      tmp += `<div class="d-flex flex-row flex-md-column justify-content-around me-2 mb-2 text-md-center diaMenu">
			<h4>${dias[j]}</h4> 
			<h6 class="text-center">${arr[i]}</h6> 
			<h6 class="text-center">${arr[i + 1]}</h6> 
			</div>`;
      j++;
    }

    resultado.innerHTML = tmp;
    document.getElementById(
      "resultadoBTN"
    ).innerHTML = `<div class="d-flex flex-row justify-content-around me-2 mb-2"> <button class="btn btn-primary" id="btn-editar" onclick="modoEditar()">Editar</button>
		<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal1">Confirmar</button> </div>`;
    document.getElementById("submit").innerHTML = "Volver a generar";
    location.href = "#resultadoCont";
  } catch (error) {
    console.error(error);
  }
}

async function postFormDataAsJson({ url, formData }) {
  const plainFormData = Object.fromEntries(formData.entries());
  const formDataJsonString = JSON.stringify(plainFormData);
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: formDataJsonString,
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  return response.json();
}

function imprimir(responseData) {
  return responseData.toString();
}

// fin de generar menu

//boton editar menu
var edicionBool = false;

function modoEditar() {
  let platos = document.getElementsByTagName("h6");
  let platosArr = [].slice.call(platos);

  h6Abutton(platosArr);

  if (edicionBool) {
    document.getElementById("btn-editar").innerHTML = "Terminar Edicion";
  } else {
    document.getElementById("btn-editar").innerHTML = "Editar";
  }
}

//recibe array de htmlelements (h6) y crea botones dentro, si ya tienen los elimina.
function h6Abutton(platos) {
  if (!edicionBool) {
    let i = 0;
    platos.forEach((h6) => {
      str = h6.innerHTML;
      h6.innerHTML = `<button data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-outline-primary btn-sm" onclick="modalEditar('${str}', ${i})"><strong>${str}</strong></button>`;
      i++;
    });
    edicionBool = true;
  } else {
    platos.forEach((h6) => {
      str = h6.children[0].children[0].innerHTML;
      h6.innerHTML = str;
    });
    edicionBool = false;
  }
}

//seteo titulo del modal y relleno el select con los platos a elegir
var posicion;
function modalEditar(plato, pos) {
  posicion = pos;
  document.getElementById(
    "exampleModalLabel"
  ).innerHTML = `Cambiar ${plato} por:`;

  //fetch mando nombre del plato y me devuleve todos los platos del mismo tipo
  fetch("http://localhost:8080/menuSemanal/plato?nombre=" + plato)
    .then(function (res) {
      return res.json();
    })
    .then(function (json) {
      let selectEditar = document.getElementById("selectEditar");
      selectEditar.innerHTML = "";
      json.forEach((plato) => {
        let opt = document.createElement("option");
        opt.innerHTML = plato.nombre;
        selectEditar.appendChild(opt);
      });
    });
  }
  //capturo eleccion y cambio en el menu
  function cambiarPlato(){
    let selectEditar = document.getElementById("selectEditar");
    let platos = document.getElementsByTagName("h6");
    let platosArr = [].slice.call(platos);
    platosArr[posicion].children[0].children[0].innerHTML = selectEditar.value;

  }


//fin de editar menu

//guardar menu

//abrir modal para completar mes, semana y nombre

//mandar todo a la api y guarda el menu (esto devuelve el id) y redirije a pag menu.

// fin de guardar menu

//pagina menu
//imprimir pdf

//generar lista de compra con slider

//imprimir pdf lista de compra

//fin pagina menu
