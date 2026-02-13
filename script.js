/* Se suben los sonidos  */
const sonidoGanar = new Audio("you-win-sequence-1-183948.mp3");
const sonidoPerder = new Audio("080205_life-lost-game-over-89697.mp3");
const sonidoExplosion = new Audio("500673__simoneyoh3998__moderate-bomb-explosion.mp3");
const sonidoNuevoJuego = new Audio("juego_nuevo.wav");
const sonidoAbrir = new Audio("abrir_espacio.mp3");
const sonidoMarcar = new Audio("marcar.mp3");
const sonidoDesmarcar = new Audio("desmarcar.mp3");
let sonidoActivado = true; // El sonido esta  activado por defecto

let filas = 20;
let columnas = 20;
let lado = 30;
let tablero =[];
let enjuego = true;
let banderas = 0; //marcas
let minas = 0.10*filas*columnas /*esto es el area del tablero por 10% esto es para que el 10 porciento del 
tablero tenga minas puede cambiar se tambien esto quiere decir 40 minas  */
let juegoIniciado = false
nuevoJuego()


function reproducir(audio) {
    // si el sonido está desactivado o el audio no existe no  se hace nada
    if (!sonidoActivado || !audio) {
        return; 
    }
    audio.pause();
    audio.currentTime = 0; // Reinicia el audio para que suene inmediatamente si haces clics rápidos
    audio.play();
}


function alternarSonido() {
    // 1. Cambiamos el estado (si era true pasa a false, y viceversa)
    sonidoActivado = !sonidoActivado;

    // 2. Buscamos el ícono en el HTML
    let icono = document.getElementById("icono-sonido");

    // 3. Cambiamos la clase del ícono según el estado
    if (sonidoActivado) {
        // Icono de volumen alto
        icono.className = "fa-solid fa-volume-high"; 
        
        // Opcional: un sonidito corto para confirmar que se activó
        reproducir(sonidoMarcar); 
    } else {
        // Icono de volumen silenciado (mute)
        icono.className = "fa-solid fa-volume-xmark";
        
        // Si había música sonando (como la intro), la callamos inmediatamente
        detenerSonidos(); // (Si implementaste la función que te di antes)
    }
}
function nuevoJuego(){
    reproducir(sonidoNuevoJuego);//   sonido de inicio
    reiniciarVariables()
    generarTableroHTML() //genera la esctructura visual de la matriz
    anadirEventos()
    generarTableroJuego()// genera las minas y los numerpos para las pitas 
    refrescarTablero()// se encarga del comportamiento para mostrar los elementos 
}

function reiniciarVariables() { /*esta es muy importante ya que lo que hace es que todo vuelva como esta 
    las banderas y lo importante es enjuego ya que esto lo que hace es que si esta en juego puedo cliquear y las  minas  no se muestran ya 
    que si no esta en juego hay un if en verficicar perdedor donde pinta las bombas */
    banderas = 0
    enjuego = true
    juegoIniciado = false
  }

function generarTableroHTML(){
    let html = ""
    for(let f=0; f<filas;f++){
        html +=`<tr>`
        for(let c=0; c<columnas;c++){

            /*
            se le asigana una coordenada como id, para poder tratar los elementros de forma matematica, siguiendo patrones
             que facilitan la estructura de algoritmos  
             */
            html +=`<td id = "celda-${c}-${f}" style = "width:${lado}px; height:${lado}px">`
            /*se  ajusta el ancho de cada cuadro las celdas y asi todas tienen el mismo tamaño si no 
            algunas seran mas grandes que otras dependiendo el contenido */
            html +=`</td>`

        }
        html +=`</tr>`
    }

    
    let tableroHTML = document.getElementById("tablero")
    tableroHTML.innerHTML= html
    tableroHTML.style.width=columnas*lado+"px"
    tableroHTML.style.height=filas*lado+"px"
    tableroHTML.style.background = "rgb(44, 38, 38)"

    //**con esto calculo la altura y ancho del tablero multimplicando filas por lado y se le agrega
    //un px como unidad  */
}


/*este servira para dar un seguimiento logico de los elementos que el jugador no pueder ver 
este no lo podra ver el jugador el que ve es el tablero html */

function generarTableroJuego(params){
    vaciarTablero() /*para que no haya nada de la partida pasada */
    ponerMinas() /*las minas se representaran con un -1 */
    contadoresMinas() /* las pistas de minas cercas */


}


function  vaciarTablero(){

    tablero=[]
    for (let c=0; c<columnas; c++){
        tablero.push([])/*le agrego algo en blanco es decir lo vacio. solo voy por las columnas porque 
        solo estoy vaciando no necesito ir celda por celda
        PROBAR SI ESTOY EN LO CIERTO Y CAMBIARLAS COLUMNAS POR FILAS */
    }

}
function ponerMinas(){
    for(let f =0; f<minas; f++ ){ /*un for para usar las 40 minas*/
        let c
        let f

        do{
            c=Math.floor(Math.random()*columnas)
            f=Math.floor(Math.random()*filas)
             /* genero una fila y una columna aleatroria la tengo que multplicar porque math.random me da un numero 
             aleatrorio entre 0 a 1 es decir puede que sea un 0.3*/

        }while(tablero[c][f])/*aqui se busca una celda donde no se haya puesto una mina y este while lo que hace es que mientras 
        haya una mina en la celda pues se repite lo del do ayudandome del(tablero[c][f]  que si tiene un valor 
        es true ya que todos los objetos se entienden como true y si no tiene nada como esta vacio seria flase o undefine  */
        tablero[c][f]= {valor: -1} /*aqui le doy un valor pero no demanera de valor si no como un objeto o sea valor es un atributo esto 
        porque el valor puede cambiar necesito usarlo  */
    }



}
/*esto es parte de la creacion del juego mismo
esto es para poner las pitas   */
function contadoresMinas(){
    /*recorro toda las celdas  */
    for(let f=0; f<filas;f++){
        for(let c=0; c<columnas;c++){
          if(!tablero[c][f]){ /*si esta vacio se le asigna un valor  con esto se asegura de que las minas se excluyan     */

            let contador =0
            /*creo un dos fores mirar las filias  columnas aledaños 
            el primer for es para las filas el cual es te una fila arriba(-1) la misma fila(0) y una filia abajo 
            el segundo es para las columnas una atras (-1)la misma columana 0  y columna adelante(1) por eso es importante que
            los fors vayan hasta 1   */
            for (let i=-1;i<=1; i++){
                for (let j=-1; j<=1; j++){
                    if(i==0 && j==0){ /* esta es  la misma pocion entonces no se puede contar a si misma  */
                        continue // pasa al siguiente 
                    }
                    try{
                        if (tablero[c+i][f+j].valor ==-1)/*aqui es donde se hace lo de ir atras adelte y mismo fila y columna*/{
                            contador++/*si hay una bomba en esa celda aledaña se suma una bomba  */
                        }
                        

                    }catch (e){/*se tiene que usar un try catch ya que puede haber numeros negativos ya que si es la primera 
                        fila puede haber un menos -1 y asi o desbordamientos     */
                        
                    }
            }
            tablero[c][f]= {valor: contador}/* al final a la celda en cuestion se le pone lo que sumo el contador */
          }
        }
    }

    }
}
function anadirEventos(){
    for(let f=0; f<filas;f++){
        for(let c=0; c<columnas;c++){
            let celda= document.getElementById(`celda-${c}-${f}`)
            celda.addEventListener("dblclick", function(me) {
                /*adeventli.. es el metodo que se tiene por defecto para escuchar los clics y "dblc" es doble clic
                y mouseup es clic simple */
                dobleClic(celda, c,f, me)
                /*se llama una funcion con parametros llamada doblecli ya que esta funcion es la encargada de 
                realizar los cambios al recibir doble clic 
                
                me es la variable que se encarga de dar la informacion cuando se haga doble clic*/

            })

            celda.addEventListener("mouseup", function(me){
                clicSimple(celda, c,f, me)

            })
        }
    }
}

/*este es para para mostrar los valores es decir al hacer clic se muestra si es bomba o numero  */
function refrescarTablero(){
    for(let f=0; f<filas;f++){
        for(let c=0; c<columnas;c++){
         let celda= document.getElementById(`celda-${c}-${f}`)
        

         if(tablero[c][f].estado== "descubierto"){ /**en caso de destapar la celda */
             celda.style.boxShadow= "none" /*se quita la sombra para que se vea que se destapo */
            switch(tablero[c][f].valor){
        
                /*switch case para mostras si es mina o es nuemoro */

                case -1: /*si es una mina se moestrara eso  */
                    celda.innerHTML=`<i class="fa-solid fa-explosion"></i>` /*icono de bomba */
                    celda.style.color = "white"/*bomba negra  negra  */
                    celda.style.background = "red"/*fondo rojo */
                    break;
                case 0: /*si es cero no se hace nada porque no hay minas al rededor*/

                    break
                default:/*solo que daraia los numeros de pistas entonces cualquiera que no sea esas 
                dos casos pues muestra su valor */
                    celda.innerHTML= tablero[c][f].valor
                    break;

            }
       
          }

          if (tablero[c][f].estado == "marcado"){ /*si es marcado  */
            celda.innerHTML=`<i class="fa-solid fa-flag"></i>` /*icono de bandera */
            celda.style.color = "white"/*bomba negra  negra  */
            celda.style.background = "rgb(9, 121, 106)"; // Equivalente a "navy"


          }
          if (tablero[c][f].estado == undefined){ /*si no es marcado entonces no tiene nada y no tiene background esto para que quede 
            como era antes   */
            celda.innerHTML=``
            celda.style.background = ""

          }
          


        }
    }
    verificarPerdedor() /*cada llamado a refrescar verifica si es el gandor  o perdedor */
    verificarGanador()
    actualizarPanelMinas()

}
/*una vez generada el tablero html se le añade los eventos de 
clic a cada una de las celdas para que el usuario pueda interactuar con el juego es decir cada celda ahora
 puede recibir clics*/


/*destapa las celdas que rodean a la celda a la que se le dio doble clic */
function dobleClic(celda, c,f,me){
    if (!enjuego){
        return;/*si no esta en juego no se hace nada. el juego a finzalizado*/
    }
    reproducir(sonidoAbrir); // sonido al expandir área
    abrirArea(c,f)
    refrescarTablero()
}

/*clic derecho y clic izquierdo descubre las celdas o las marca para potegerlas de ser descubiertas  */
function clicSimple(celda, c,f,me){
    if (!enjuego){
        return;/*si no esta en juego no se hace nada  el juego a finzalizado*/
    }

    sonidoNuevoJuego.pause();
    sonidoNuevoJuego.currentTime = 0;
    
    if(tablero[c][f].estado=="descubierto"){
        return; /* en caso de ya estar descubierto no se puede hacer nada  */
        
    }
    switch(me.button){
        case 0:// codigo para el clic izquierdo para abir 
            if(tablero[c][f].estado=="marcado"){
                break; /*no se hace nada porque no se puede abrir celdas marcadas */
            }
            while(!juegoIniciado && tablero[c][f].valor==-1){/*no se puede iniciar con una bomba */
                generarTableroJuego()
            }
            tablero[c][f].estado="descubierto"
            juegoIniciado=true


            reproducir(sonidoAbrir); // abrir celda
            if(tablero[c][f].valor ==0){/*si no ninguna mina se abre hasta la que haya mina  */
                abrirArea(c,f)
            }
        break;
        case 1://codigo para el scrooll
        break;
        case 2://codigo para el clic derecho para marcar o desmarcar
          if(tablero[c][f].estado=="marcado"){
            tablero[c][f].estado=undefined /* cuando la celda no se ha destapado y no se ha marcado tiene un estado
            undefined esto significa que al desmarcar una celda antes marcada se convierte nunevamente en
            undefined */
            banderas--
            reproducir(sonidoDesmarcar); // quitar bandera

          }else{
            tablero[c][f].estado="marcado"
            banderas++
            reproducir(sonidoMarcar); // sonido al poner bandera
          }

        break;
        default:
        break;

    }

    refrescarTablero() /*cada vez que se hace un clic se refresca el tablero  */
}


 

function abrirArea(c,f){
       /*creo un dos fores mirar las filias  columnas aledaños 
            el primer for es para las filas el cual es te una fila arriba(-1) la misma fila(0) y una filia abajo 
            el segundo es para las columnas una atras (-1)la misma columana 0  y columna adelante(1) por eso es importante que
            los fors vayan hasta 1   */
            for (let i=-1;i<=1; i++){
                for (let j=-1; j<=1; j++){

                    // if ( i ==0 && j == 0){
                    //     /*esta condicion es obligatoria para que no se encierre en un bucle infinito ya que este 
                    //     es una funcion recursiva  */
                    //     continue

                    /*No es necesario poner el if  porque no se podria entrar dar ya que la celda 
                    que se toca 0 pero no estaria descubier y marcada entonces no se podria 
                    llamar otra vez al mismo metodo */
                    // }
                    
                    try{/*para que no haya desvordamientos o numeros negativos */

                        if(tablero[c+i][f+j].estado != "descubierto"){/*si la siguiente celda 
                            o la anterior  no esta descubierto y no esta marcado*/
                            if(tablero[c+   i][f+j].estado != "marcado"){
                                tablero[c+i][f+j].estado = "descubierto" /*entonces aqui se abre las celdas */
                                if(tablero[c+i][f+j].valor == 0){/*entonces si esa otra celda es 0 entonces se vulve a llamar a
                                    al metodo abir pero ahora con esta nueva celda y  */
                                    abrirArea(c+i, f+j)
                                }
                            }
                        }

                    }catch(e){}
                }
            }
    

}


function verificarGanador (){
    /* hay que verificar que todas las minas esten tapadas  y qye las demas celdas esten destapadas   */

    for(let f=0; f<filas;f++){
        for(let c=0; c<columnas;c++){
            if (tablero[c][f].estado !=="descubierto")/*si  no esta destapada es decir (marcado o undefine) esto con el 
            fin de que cuando ya solo queden  solo  una celdas donde son minas si o si y ya se hayan descubierto las 
            demas entonces ahi tambien el jugador es ganador  */{
                if(tablero[c][f].valor===-1){ /*y es mina */
                    /*va bien */
                    continue
                }
                else{
                    //  esta abierto o descubierto y no es mina  es decir que hay minas cerca 
                    return /*y se acabo la funcion */
                }

            }
        }
    }
        /*si al finalizar las comprobaciones, todas las celdas cubiertas son minas entonces se ha ganado  */


    // let tableroHTML = document.getElementById("tablero");
    // tableroHTML.style.background = "green"; // Muestra el color verde de victoria

    // enjuego = false;
    
    // Finaliza el juego
    let tableroHTML= document.getElementById("tablero")
    tableroHTML.style.background ="rgb(57, 206, 20)"
   
    enjuego = false /*el juego se acaba  */

     reproducir(sonidoGanar); // sonido de victoria
}




function actualizarPanelMinas(){
    let panel = document.getElementById("minas") /*llamo a minas que esta en el index */
    panel.innerHTML = minas-banderas /* */
    
}


function verificarPerdedor(){
    for(let f=0; f<filas;f++){
        for(let c=0; c<columnas;c++){
            /*se recorre todas las filas y columnas  */
            if (tablero[c][f].valor==-1) /*si hay una mina  */
            {
                if (tablero[c][f].estado==`descubierto`)/*si esta destapada*/{
                    let tablero= document.getElementById("tablero")
                    tablero.style.background ="rgb(78, 83, 87)"
                    enjuego = false /*el juego se acaba  */
                    reproducir(sonidoExplosion);

                    // Primero la explosion y luego el sonido de perderS
                    setTimeout(() => {
                        reproducir(sonidoPerder);
                    }, 500); // 500 milisegundos después




                }
            }
        }
        
    }
    if(enjuego){ /*estp es para que no se pongan todas las minas al principio es decir si la partida esta 
        en juego y no se ha abierto una mina entonces se salta el siguiente for */
        return
    }


    for(let f=0; f<filas;f++){
        for(let c=0; c<columnas;c++){
            if (tablero[c][f].valor==-1){
                let celda = document.getElementById(`celda-${c}-${f}` ) /*se recorre todas las celdas 
                y se saca el id para darle un color diferente para mostrar todas  las minas al perder  */
                celda.innerHTML = `<i class="fa-solid fa-explosion"></i>`
                celda.style.color = "withe"
              
            }
        }
    }

  
}

async function ajustes() {
    const {
      value: ajustes
    } = await swal.fire({
      title: "Ajustes",
      html: `
              Dificultad &nbsp; (minas/área)
              <br>  
              <br>  <!--  --->
              <input onchange="cambiarValor()" oninput="this.onchange()" id="dificultad" type="range" min="10" max="40" step="1" value="${100 * minas / (filas * columnas)}">
              <span id="valor-dificultad">${100 * minas / (filas * columnas)}%</span>
              <br>
              <br>
              Filas
              <br>
              <input class="swal2-input" type="number" value=${filas} placeholder="filas" id="filas" min="10" max="1000" step="1">
              <br>
              Columnas
              <br>
              <input class="swal2-input" type="number" value=${columnas} placeholder="columnas" id="columnas" min="10" max="1000" step="1">
              <br>
              `,
              /*    <input onchange="cambiarValor()" oninput="this.onchange()" id="dificultad" type="range" min="10" max="40" step="1" value="${100 * minas / (filas * columnas)}" onchange="">
              <span id="valor-dificultad">${100 * minas / (filas * columnas)}%</span>
              
              un cuadro de ajustes 
               type="range" esto definie que sera un input range que tiene una barra para deslizar 
              en la primera parte que crea una variable cambiarvalor se activa cuando se toque curson esto con  oninput="this.onchange() que es lo que 
              captura a tiempo real oniput llama a onchange cada vez que se toca la barra para deslizar y onchenge es que cambia el valor 
              y onche se usaria cada vez que se deslice la barra y se suelte el curson pero con oninput siempre estara activo  llamando 
              a la funcion  cambiar valor que es esta misma linea de codigo 
              el valro que se cambie puede estar entre 10 y 40 pero el valor inicial esta dado 100 * minas / (filas * columnas) con los valores inicales es 10
              y luego se guarda en una variable llamaadda dificultad 
               y span muestra cual es el valor actual de la dificultad 
               
            <input class="swal2-input" type="number" value=${filas} placeholder="filas" id="filas" min="10" max="1000" step="1">

            "swal2-input"  esto es de la liberiria sweetaler  de tipo numerico para que me puede aumentar disminuir numeros o escribirlos
            el valor inicial es el actual de filas o sea 20 pleaceholder es el valor que se muestra al usuario antes de que el lo modifique
            
            lo mimos se hace para columnas 
                            
               */
      confirmButtonText: "Establecer",  /*bootn para establces literalmente existe como una funcion lo uqe establece es el texto */
      cancelButtonText: "Cancelar",  /*bootn para cancelar literalmente existe como una funcio solo establece el texto*/
      showCancelButton: true, /*es para mostrar el boton cancelar o no si esta en false no se muestra  */
      preConfirm: () => { /*al hacer clic en establecer se llama esta funcion esto tmabien es parte de la 
        libreria sweeatalert y establece los valores pero como parte de un objeto llamado ajustes con 
        atributs columnas filas y  dificultad  */
        return {
          columnas: document.getElementById("columnas").value,
          filas: document.getElementById("filas").value,
          dificultad: document.getElementById("dificultad").value
        }
      }
    })
    if (!ajustes) { /*esto valida si existe el objeto ajustes y si lo es es porque el usuario 
        dio al boton establecer  */
      return
    }
    filas = Math.floor(ajustes.filas) /**se establece las nuevas filas usando el objeto ajustes con el atributo fila */
    columnas = Math.floor(ajustes.columnas) /*lo mismo para columnas y minas */
    minas = Math.floor(columnas * filas * ajustes.dificultad / 100) 
    nuevoJuego() /**se crea un nuevo jeugo  */
  } 




/*error ocurrente que me paso era que ponia == en vez de poner igual para asignar los estados  */