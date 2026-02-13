# 💣 Buscaminas Clásico (Minesweeper)

> Una recreación moderna del clásico juego de estrategia, desarrollada con JavaScript Vanilla y lógica algorítmica avanzada.

![Estado del Proyecto](https://img.shields.io/badge/Estado-Terminado-green)
![Licencia](https://img.shields.io/badge/Licencia-MIT-blue)

## 📖 Descripción

Este proyecto es una implementación completa del juego Buscaminas. El objetivo principal fue fortalecer la lógica de programación mediante la manipulación del **DOM**, el manejo de **eventos** y el uso de **algoritmos recursivos** para la mecánica de despeje de áreas (Flood Fill).

El juego incluye características modernas como efectos de sonido, control de volumen y una interfaz de ajustes personalizada.

## 🚀 Características Principales

-   **Algoritmo de Expansión Recursiva:** Implementación de la técnica *Flood Fill* para despejar automáticamente las áreas vacías al hacer clic en una casilla segura (0).
-   **Generación Dinámica:** El tablero se renderiza mediante JavaScript, permitiendo modificar el tamaño de la cuadrícula en tiempo real.
-   **Sistema de Audio:** Efectos de sonido para eventos clave (victoria, derrota, marcar bandera) con interruptor de silencio global.
-   **Configuración Personalizada:** Integración de **SweetAlert2** para permitir al usuario ajustar:
    -   Número de Filas y Columnas.
    -   Dificultad (Porcentaje de minas sobre el área total).
-   **Mecánicas Clásicas:**
    -   Clic izquierdo: Abrir casilla.
    -   Clic derecho: Marcar/Desmarcar bandera.
    -   Doble clic: Despeje rápido de áreas adyacentes.

## 🛠️ Tecnologías Utilizadas

-   **HTML5:** Estructura semántica.
-   **CSS3:** Diseño responsivo, Flexbox y Grid Layout.
-   **JavaScript (ES6+):** Lógica del juego, manipulación del DOM y Async/Await.
-   **SweetAlert2:** Para modales y formularios de configuración interactivos.
-   **FontAwesome:** Iconografía vectorial.

## 🧠 Retos Técnicos Superados

Uno de los mayores desafíos fue la implementación de la función `abrirArea(c,f)`. Se utilizó **recursividad** para verificar las celdas adyacentes. Para evitar desbordamientos de pila (Stack Overflow) o bucles infinitos, se implementó un control estricto de estados (`descubierto`, `marcado`) y manejo de excepciones `try-catch` para los bordes del tablero.

```javascript
// Fragmento de la lógica de recursividad
function abrirArea(c,f){
    for (let i=-1;i<=1; i++){
        for (let j=-1; j<=1; j++){
            try {
                if(tablero[c+i][f+j].estado != "descubierto"){
                    // Lógica recursiva...
                    abrirArea(c+i, f+j)
                }
            } catch(e){}
        }
    }
}