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

//Variables de memoria del juego
var comparando = []
var recuerdo = []
var listaEncontrados = []
var contador = 0
var referenciaMovimientos = document.querySelector("#movimientos")


//Logica para manejar lo que sucede al tocar cada carta

juegoElement.addEventListener('click', function(event) {
    if (event.target.tagName === 'INPUT') {
        contador++
        referenciaMovimientos.innerHTML = `${contador}`
        var label = document.querySelector(`label[for=${event.target.id}]`)
        var contenidoLabel = label.textContent
        console.log(contenidoLabel)
        if (event.target.checked === true) {
            comparando.push(contenidoLabel)
        }
        if (comparando.length === 1 || comparando.length === 2){
            recuerdo.push(event.target.id)
            console.log("Este es un recuerdo de referencia: " + recuerdo)
        }
        
        if (comparando.length === 1) {
            console.log(recuerdo[0])
            document.querySelector(`#${recuerdo[0]}`).disabled = true
        }else if (comparando.length === 2){
            document.querySelector(`#${recuerdo[0]}`).disabled = false
        }
        if(comparando.length === 2){
            console.log("Has revelado 2 cartas")
            if (comparando[0] === comparando[1]) {
                console.log("Has descubierto una pareja")

                //Esto hace que las cartas no se puedan volver a ocultar una vez son reveladas
                document.querySelector(`#${recuerdo[0]}`).disabled = true
                document.querySelector(`#${recuerdo[1]}`).disabled = true
                listaEncontrados.push([recuerdo[0],recuerdo[1]])
                comparando = []
                recuerdo = []
                console.log("Hasta ahora has encontrado estas: "+listaEncontrados)
            }else{
                console.log("No le acertaste, borrare los recuerdos y las comparaciones y ocultare de nuevo las cartas")

                //esto corrige el bug que hace que se puedan revelar mas de 2 elementos durante 1 turno
                //Si no se entiende, comenta la linea de codigo y ve lo que sucede
                for (let i = 0; i < emojis.length; i++) {
                    var miInput = document.getElementById(`check${i}`)
                    if(miInput.checked === false){
                        miInput.disabled = true
                    }
                }


                //Esto hace que las cartas se queden reveladas durante 0.8 segundos antes de volverse a ocultar
                setTimeout(()=>{
                    var referencia1 = document.getElementById(recuerdo[0])
                    referencia1.checked = false
                    var referencia2 = document.getElementById(recuerdo[1])
                    referencia2.checked = false
                    comparando = []
                    recuerdo = []
                    habilitarCartas()   
                },800)

                //esto vuelve a habilitar las casillas una vez ocultas las parejas erroneas
                function habilitarCartas() {
                    for (let i = 0; i < emojis.length; i++) {
                        var miInput = document.getElementById(`check${i}`)
                        if (!listaEncontrados.includes(miInput)) {
                            miInput.disabled = false
                        }
                    }
                }
            }
        }
        console.log(comparando)
    }


    console.log(listaEncontrados.length)
    if (listaEncontrados.length === 8) {
        console.log("Has ganado!!")
        var jugadas = document.getElementById('jugadas')
        jugadas.innerHTML = contador
        contador = 0
        comparando = []
        recuerdo = []
        listaEncontrados = []
        
        var divAlerta = document.getElementById('alerta')
        divAlerta.classList.add("mostrarAlerta")
        for (let i = 0; i < emojis.length; i++) {
            var miInput = document.getElementById(`check${i}`)
            miInput.disabled = true
        }
        var jugarDeNuevo = document.querySelector('.deNuevo')
        jugarDeNuevo.addEventListener('click', () => {
            divAlerta.classList.remove("mostrarAlerta")
            reiniciarContador()
            ocultarCartas()
            setTimeout(mezclarCartas,1000)
        })
        //iteración para volver a habilitar cada casilla
        for (let i = 0; i < emojis.length; i++) {
            var miInput = document.getElementById(`check${i}`)
            miInput.disabled = false
        }
        
    }
    console.log(`Llevas ${contador} movimientos!`)
})

