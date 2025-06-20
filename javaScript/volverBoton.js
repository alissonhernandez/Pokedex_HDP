const botonFlotante = document.createElement("button");
botonFlotante.innerHTML = `<img src="../img/subir.png" alt="Subir" style="width: 30px;">`;
botonFlotante.classList.add("boton-subir");

document.body.appendChild(botonFlotante);

botonFlotante.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

