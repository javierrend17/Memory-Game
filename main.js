//Primero se inserta el esqueleto del juego:

var bodyElement = document.body
bodyElement.innerHTML +=`
    <div class="control">
        <button id="reiniciar">Reiniciar juego</button>
        <div class="info">
            <p>Movimientos:</p>
            <p id="movimientos"></p>
        </div>
    </div>
    <div class="contenedor">
        <div class="juego"></div>
    </div>
    <div id="alerta" class="alerta">
        <img src="https://cdn3.iconfinder.com/data/icons/object-emoji/50/Celebration-512.png" alt="imagen de celebracion">
        <p class="felicidades">¡Felicidades, has ganado!</p>
        <div class="countMovimientos">
            <p>Movimientos:</p>
            <p id="jugadas"></p>
        </div>
        <button class="deNuevo">Jugar de nuevo</button>
    </div>
`


const juegoElement = document.querySelector('.juego')


const emojis = ["🍉","🍉","🥭","🥭","🍐","🍐","🍌","🍌","🍇","🍇","🍑","🍑","🍒","🍒","🥥","🥥",]
let emojis_a_mezclar = emojis.slice()

//Crea las cartas e inserta los emojis sin ordenar
let nuevaCarta = document.createElement('div')
for (let i = 0; i < emojis.length; i++) {
    let nuevaCarta = document.createElement('div')
    nuevaCarta.className = 'carta'
    nuevaCarta.innerHTML = `
    <input type="checkbox" id="check${i}" class="check">
    <label for="check${i}" class="label">${emojis_a_mezclar[i]}</label>
    `
    juegoElement.appendChild(nuevaCarta)
}
let cartas = document.querySelectorAll('.juego .carta')

//Comportamientos de estilos css al redimensionar
document.addEventListener('DOMContentLoaded', () => {
    var anchoElemento = juegoElement.offsetWidth;
    juegoElement.style.height = anchoElemento + 'px';
});
window.addEventListener('resize', () => {
    var anchoElemento = juegoElement.offsetWidth;
    juegoElement.style.height = anchoElemento + 'px';
});

//Variables de memoria del juego
const reiniciarVariables = () =>{
    comparando = []
    listaEncontrados = []
    contador = 0
    referenciaMovimientos = document.querySelector("#movimientos")
    misCheckBox = document.querySelectorAll('.carta .check')

    //Se convierte el elemento misCheckbox de tipo nodeList a un array
    listaNoEncontrados = []
    for (let i = 0; i < misCheckBox.length; i++) {
        listaNoEncontrados[i] = misCheckBox[i]
    }
}

var comparando = []
var listaEncontrados = []
var contador = 0
var referenciaMovimientos = document.querySelector("#movimientos")
var misCheckBox = document.querySelectorAll('.carta .check')
//Se convierte el elemento misCheckbox de tipo nodeList a un array
var listaNoEncontrados = []
for (let i = 0; i < misCheckBox.length; i++) {
    listaNoEncontrados[i] = misCheckBox[i]
}

//Funcion que mezcla las cartas
function mezclarCartas() {

    //Parte que mezcla los emojis
    for (let i = emojis_a_mezclar.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [emojis_a_mezclar[i], emojis_a_mezclar[j]] = [emojis_a_mezclar[j], emojis_a_mezclar[i]]
    }

    //Parte que inserta los nuevos emojis mezclados dentro de las cartas ya existentes
    for (let i = 0; i < emojis_a_mezclar.length; i++) {
        cartas[i].innerHTML = `
            <input type="checkbox" id="check${i}" class="check">
            <label for="check${i}" class="label">${emojis_a_mezclar[i]}</label>
        `    
    }

    listaEncontrados = []
    reiniciarVariables()
}

mezclarCartas()

const reiniciarContador = () =>{
    contador = 0
    referenciaMovimientos.innerHTML = `${contador}`
}

//BOTON DE REINICIAR
//Reinicia todas las cartas y empieza el juego desde 0

var reiniciarBtn = document.getElementById('reiniciar')
reiniciarBtn.addEventListener('click', () => {
    reiniciarContador()
    ocultarCartas().then(() => {
        setTimeout(mezclarCartas, 250)
        
    })
})


//Oculta todas las cartas con una linda animacion
function ocultarCartas() {
    return new Promise(resolve => {
        
        let cartasOcultas = 0
        function ocultarCartaConRetraso(i) {
            setTimeout(() => {
                var miInput = document.getElementById(`check${i}`)
                miInput.checked = false
                cartasOcultas++
                if (cartasOcultas === emojis.length) {
                    resolve()
                }
                
            }, i * 35)
        }
        for (let i = 0; i < emojis.length; i++) {
            ocultarCartaConRetraso(i)
        }
    })
}

//Logica para manejar lo que sucede al tocar cada carta

juegoElement.addEventListener('click', function(event) {
    if (event.target.tagName === 'INPUT') {

        //Cuenta cuantos movimientos lleva el jugador y los muestra en pantalla
        contador++
        referenciaMovimientos.innerHTML = `${contador}`


        //Muestra en consola la carta seleccionada a modo de guia
        var label = document.querySelector(`label[for=${event.target.id}]`)

        //Añade el elemento de tipo Label encontrado a un array para compararlo más tarde
        if (event.target.checked === true) {
            comparando.push(label)
        }

        //Si el usuario selecciona una carta, esta se deshabilita y no se puede volver a ocultar hasta que el usuario revele una carta más
        if (comparando.length === 1) {
            misCheckBox.forEach(checkBox => {
                if (comparando[0].htmlFor === checkBox.id) {
                    checkBox.disabled = true
                }
            })
        }else if (comparando.length === 2) {
            misCheckBox.forEach(checkBox => {
                if (comparando[1].htmlFor === checkBox.id) {
                    checkBox.disabled = true
                }
            })
        }

        //Si el usuario revela 2 cartas
        if (comparando.length === 2) {

            //Si se encuentra una pareja
            if (comparando[0].textContent === comparando[1].textContent){
                //Se muestra un mensaje en consola que confirma que se encontró una pareja
                console.log('Encontraste una pareja, hasta ahora has encontrado:')

                //Guarda los elementos encontrados en una lista de array
                listaEncontrados.push(comparando[0], comparando[1])

                //Elimina los elementos encontrados de la lista de no encontrados
                for (let i = 0; i < listaNoEncontrados.length; i++) {

                    if (listaNoEncontrados[i].id === comparando[0].htmlFor){
                        listaNoEncontrados.splice(i, 1)
                        i--

                    }else if (listaNoEncontrados[i].id === comparando[1].htmlFor) {
                        listaNoEncontrados.splice(i, 1)
                        i--
                    }
                }

                //Muestra en consola los elementos encontrados
                listaEncontrados.forEach(encontrado => {
                    console.log(encontrado.htmlFor)
                })
                comparando = []

                if (listaEncontrados.length === 16) {
                    var jugadas = document.getElementById('jugadas')
                    jugadas.innerHTML = contador
                    
                    var divAlerta = document.getElementById('alerta')
                    divAlerta.classList.add("mostrarAlerta")
                    reiniciarBtn.disabled = true
                    
                    var jugarDeNuevo = document.querySelector('.deNuevo')
                    jugarDeNuevo.addEventListener('click', () => {
                        divAlerta.classList.remove("mostrarAlerta")
                        reiniciarContador()
                        ocultarCartas()
                        setTimeout(mezclarCartas,1000)
                        reiniciarBtn.disabled = false
                    })
                }
                
                //Si no se encuentra una pareja
            }else if (comparando[0].textContent != comparando[1].textContent) {

                //Bloquea temporalmente todas las cartas
                misCheckBox.forEach(checkbox => {
                    checkbox.disabled = true
                })

                //Vuelve a ocultar las cartas que no hacen match despues de 800 milisegundos
                setTimeout(() => {
                    misCheckBox.forEach(checkBox => {
                        if (checkBox.id === comparando[0].htmlFor) {
                            checkBox.checked = false
                        }else if (checkBox.id === comparando[1].htmlFor){
                            checkBox.checked = false
                        }
                    })

                    //Vuelve a habilitar las cartas que no se han encontrado
                    misCheckBox.forEach(checkBox => {
                        for (let i = 0; i < misCheckBox.length; i++) {
                            if (checkBox === listaNoEncontrados[i]) {
                                checkBox.disabled = false
                            }
                            
                        }
                    })
                    comparando = []
                }, 800)
            }
        }   
    }
})