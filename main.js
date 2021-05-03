const formulario = document.getElementById('menuForm');
const dias = ["Sábado", "Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];
const resultado = document.getElementById('resultadoMenu');

formulario.addEventListener('submit', submitForm);

async function submitForm(e){
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
		for (let i = 0; i < arr.length; i+=2){
			tmp += `<div class="d-flex flex-row flex-md-column justify-content-between me-2 mb-2">
			<h4>${dias[j]}</h4> 
			<h5>${arr[i]}</h5> 
			<h5>${arr[i+1]}</h5> 
			</div>`;
			j++;
		}

		resultado.innerHTML = tmp;
		document.getElementById('resultadoBTN').innerHTML = `<div class="div class="d-flex flex-row justify-content-between me-2 mb-2"> <button class="btn btn-primary">Editar</button>
		<button class="btn btn-primary">Confirmar</button> </div>`;
		

	} catch (error) {
		console.error(error);
	}
}


async function postFormDataAsJson({ url, formData }) {
	const plainFormData = Object.fromEntries(formData.entries());
	const formDataJsonString = JSON.stringify(plainFormData);
    console.log(formDataJsonString);
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


function imprimir(responseData){
	return responseData.toString();
}
