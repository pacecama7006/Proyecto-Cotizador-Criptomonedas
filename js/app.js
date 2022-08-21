// Variables del formulario
const formulario = document.querySelector('#formulario');
const monedaSelect = document.querySelector('#moneda');
const criptomonedasSelect = document.querySelector('#criptomonedas');


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