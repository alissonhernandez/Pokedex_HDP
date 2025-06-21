![Pokedex](https://raw.githubusercontent.com/sleduardo20/pokedex/0671af442dff1d8f7141e49eb83b438885bbc9e9/public/img/logo.svg)

<p align="center">
  <a href="https://alissonhernandez.github.io/Pokedex_HDP/">
    <img src="https://img.shields.io/badge/SITIO%20WEB-3b4cca?style=for-the-badge&logo=pokemon&logoColor=white" alt="SITIO WEB">
  </a>
</p>


# 📚 Pokédex Interactiva

¡Bienvenido a la Pokédex Interactiva! 🎉 Este proyecto tiene como objetivo mostrar información detallada y visualmente atractiva de los primeros 150 Pokémon. La Pokédex no solo es informativa, sino también interactiva y dinámica, permitiendo una experiencia de usuario envolvente. 🌟

## Diseño y Mecánica

### 1. Información Completa de los Primeros 150 Pokémon
Nuestra Pokédex incluye información detallada de los primeros 150 Pokémon. Cada tarjeta de Pokémon mostrará:
- **🦸‍♂️ Especie**
- **📏 Altura**
- **⚖️ Peso**
- **🔮 Tipo**
- **✨ Habilidades**
- **⚔️ Debilidades**
- **📊 Estadísticas (Stats)**
- **📜 Movimientos (Moves)**

### 2. Tarjetas de Pokémon Personalizadas
Cada tarjeta de Pokémon está diseñada con un color representativo según su tipo. La tarjeta incluye la imagen del Pokémon, que se obtiene a través de la API correspondiente. 🖼️

### 3. Dinamismo y Animaciones
Para una experiencia más atractiva, las tarjetas de Pokémon incluyen transiciones y animaciones, haciendo la interacción más divertida y dinámica. 🌀✨

### 4. Selección de Pokémon Acompañantes
Cada tarjeta de Pokémon incluye un ícono o botón para seleccionar al Pokémon como acompañante. Puedes seleccionar hasta un total de 6 Pokémon acompañantes, los cuales se guardarán de manera persistente. 👥🛡️

### 5. Sección "Mis Acompañantes"
Hemos creado una sección especial en la web llamada "Mis Acompañantes" 👫, donde podrás ver el listado de tus Pokémon acompañantes. Esta sección incluye un CRUD para administrar tus acompañantes. Además, existe un ObjectStore de entrenadores 🏋️‍♂️ donde puedes registrar a todos los integrantes de tu proyecto y asignarles uno de los Pokémon acompañantes.

## Estructura

### 1. Programación Orientada a Objetos (POO)
Para la implementación de la Pokédex, utilizamos Programación Orientada a Objetos (POO) 🛠️. La estructura incluye:
- **Objeto Base `Pokemon`**: Este objeto contiene toda la información base de la cual heredan todos los demás Pokémon. 🧬
- **Objeto `Pokedex`**: Encargado de gestionar y mostrar la Pokédex. 📇

### 2. Métodos y Modularidad
El diseño de la Pokédex es modular y jerárquico, siguiendo las mejores prácticas de POO:
- **Método `dibujarPokedex`**: Este método monta todo el diseño principal de la Pokédex y es el único método público del objeto. 🎨
- **Métodos Internos**: Cada Pokémon se dibuja en pantalla con métodos internos específicos del objeto `Pokedex`. 🖥️

## Uso de la Pokédex

Para comenzar a usar la Pokédex, simplemente llama al método `dibujarPokedex` 🖌️, y disfruta explorando la información detallada de cada Pokémon. Selecciona tus acompañantes y gestiona tu equipo de manera sencilla y divertida. 🚀

---

¡Esperamos que disfrutes de tu experiencia con la Pokédex Interactiva! ¡Atrapa a todos! 🏆🎮
