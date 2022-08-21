// Variables del formulario
const formulario = document.querySelector('#formulario');
const monedaSelect = document.querySelector('#moneda');
const criptomonedasSelect = document.querySelector('#criptomonedas');
const resultadoDiv = document.querySelector('#resultado');


const objBusqueda = {
    moneda: '',
    criptomoneda: '',
}

// Creación de un promise
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
});


document.addEventListener('DOMContentLoaded',  () =>{
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});

function consultarCriptomonedas() {
    // Consulta a la api de https://min-api.cryptocompare.com/documentation
    // para obtener las criptomonedas más relevantes
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))

}
// Fin consultarCriptomonedas

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(criptomoneda => {
        // console.log(criptomoneda);
        const {FullName, Name} = criptomoneda.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}
// Fin selectCriptomonedas


function submitFormulario(e) {
    e.preventDefault();

    // Validar el formulario
    const {moneda, criptomoneda} = objBusqueda;

    if (moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    // Consultar la Api con los resultado
    consultarApi();
}
// Fin submitFormulario

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
    // console.log(objBusqueda);
}

function mostrarAlerta(mensaje) {
    // console.log(mensaje);
    const existeError = document.querySelector('.error');
    if (!existeError) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
        divMensaje.textContent = mensaje;
        formulario.appendChild(divMensaje);
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
    
}
// Fin mostrar alerta

function consultarApi(){
    const {moneda, criptomoneda} = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => {
            // Como el resultado me aparece en un array, accedo con los corchetes
            // console.log(cotizacion.DISPLAY[criptomoneda][moneda]);
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        })
        .catch(error => {
            console.log(error);
        })

}
// Fin consultarApi

function mostrarCotizacionHTML(cotizacion) {
    // console.log(cotizacion);

    limpiarHTML();

    const {PRICE, HIGHDAY, LOWDAY,CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `
        El precio es de: <span>${PRICE}</span>
    `;

    const precioAlto = document.createElement('p');
    precioAlto.classList.add('precioAlto');
    precioAlto.innerHTML = `
        El precio más alto del día: <span>${HIGHDAY}</span>
    `;

    const precioBajo = document.createElement('p');
    precioBajo.classList.add('precioBajo');
    precioBajo.innerHTML = `
        El precio más bajo del día: <span>${LOWDAY}</span>
    `;

    const variacion = document.createElement('p');
    variacion.innerHTML = `
        La variación últimas 24hrs: <span>${CHANGEPCT24HOUR} %</span>
    `;

    const lastUpdate = document.createElement('p');
    lastUpdate.innerHTML = `
        Última actualización: <span>${LASTUPDATE}</span>
    `;

    resultadoDiv.appendChild(precio);
    resultadoDiv.appendChild(precioAlto);
    resultadoDiv.appendChild(precioBajo);
    resultadoDiv.appendChild(variacion);
    resultadoDiv.appendChild(lastUpdate);
}

// Fin mostrarCotizacionHTML

function limpiarHTML() {
    while (resultadoDiv.firstChild) {
        resultadoDiv.removeChild(resultadoDiv.firstChild);
    }
}

function mostrarSpinner() {
    limpiarHTML();

    const spinnerDiv = document.createElement('div');
    spinnerDiv.classList.add('spinner');
    spinnerDiv.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultadoDiv.appendChild(spinnerDiv);
}
