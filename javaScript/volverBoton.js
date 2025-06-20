export function crearBotonSubir() {
  const botonFlotante = document.createElement("button");
  botonFlotante.classList.add("boton-subir");

  const imagen = document.createElement("img");
  imagen.src = "../img/subir.png";
  imagen.alt = "Subir";

  botonFlotante.appendChild(imagen);
  document.body.appendChild(botonFlotante);

  botonFlotante.style.display = "none";
  window.addEventListener("scroll", () => {
    botonFlotante.style.display = window.scrollY > 300 ? "block" : "none";
  });

  botonFlotante.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}