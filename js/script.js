
document.addEventListener("DOMContentLoaded", (e) => {
  
  const moviesUrl = "https://japceibal.github.io/japflix_api/movies-data.json";


  fetch(moviesUrl)
    .then(response => {
      
      if (!response.ok) {
        throw new Error("Error en la red"); 
      }
      return response.json(); 
    })
    .then(data => {
      console.log('movies-data-json', data); 
      // Guarda los datos en localStorage 
      localStorage.setItem("movies-data-json", JSON.stringify(data));
    })
    .catch(error => {
      
      console.error("Error al cargar los datos:", error);
    });
});


document.addEventListener("DOMContentLoaded", function () {
  
  const botonBuscar = document.getElementById("btnBuscar");
  const inputBuscar = document.getElementById("inputBuscar");
  const listaPeliculasContainer = document.getElementById("lista");

  // Añade un evento de clic al botón de búsqueda
  botonBuscar.addEventListener("click", (event) => {
    
    listaPeliculasContainer.innerHTML = '';

    // Obtiene el texto ingresado y lo convierte a minúsculas
    const textoIngresado = inputBuscar.value.toLowerCase();
    // si no hay texto ingresado, sale de la función
    if (!textoIngresado) {
      return;
    } else {
      // Recupera la lista de películas del localStorage
      const listaPeliculasString = localStorage.getItem("movies-data-json");
      const listaPeliculas = JSON.parse(listaPeliculasString); 

      // Filtra las películas que coinciden con el texto ingresado
      const peliculasFiltradas = listaPeliculas.filter(pelicula => {
        return pelicula.title.toLowerCase().includes(textoIngresado) || 
          pelicula.tagline.toLowerCase().includes(textoIngresado) || 
          pelicula.overview.toLowerCase().includes(textoIngresado) ||
          pelicula.genres.some(genero => genero.name.toLowerCase().includes(textoIngresado)); 
      });

      // Para cada película filtrada, crea un nuevo elemento de lista y lo añade al contenedor
      peliculasFiltradas.forEach(pelicula => {
        listaPeliculasContainer.appendChild(crearItemPelicula(pelicula)); 
      });
    }
  });
});

//crea un elemento de lista para una película
function crearItemPelicula(pelicula) {
  const li = document.createElement('li'); 
  li.className = 'list-group-item bg-dark item-pelicula '; 

  
  li.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex flex-column">
          <span class="text-white">${pelicula.title}</span> // Muestra el título de la película
          <span class="text-secondary">${pelicula.tagline}</span> // Muestra el tagline de la película
        </div>
        <div class="text-white">
          ${obtenerEstrellas(pelicula.vote_average)} 
        </div>
      </div>
    `;

  // evento de clic a la lista para desplegar más detalles
  li.addEventListener("click", () => { desplegarContenedorSuperior(pelicula) });

  return li; 
}

//representación visual de las estrellas
function obtenerEstrellas(promedioDeVotacion) {
  const estrellas = Math.round(promedioDeVotacion / 2);
  let estrellasHtml = ''; 
  for (let i = 1; i <= 5; i++) { 
    
    estrellasHtml += `<span class="fa fa-star ${i <= estrellas ? 'checked' : ''}"></span>`;
  }
  return estrellasHtml; // Retorna el HTML generado de las estrellas
}

// Función que despliega los detalles de la película seleccionada
function desplegarContenedorSuperior(pelicula) {
  const movieOverview = document.getElementById("movieOverview");
  const movieTitle = document.getElementById("movieTitle");
  const movieGenres = document.getElementById("movieGenres");
  const movieYear = document.getElementById("movieYear");
  const movieRuntime = document.getElementById("movieRuntime");
  const movieBudget = document.getElementById("movieBudget");
  const movieRevenue = document.getElementById("movieRevenue");

  // Rellena los elementos con los datos de la película
  movieOverview.innerText = pelicula.overview; 
  movieTitle.innerText = pelicula.title; 
  movieYear.innerText = pelicula.release_date.split('-')[0]; 
  movieRuntime.innerText = pelicula.runtime + ' mins'; 
  movieBudget.innerText = '$' + pelicula.budget; 
  movieRevenue.innerText = '$' + pelicula.revenue; 

  // Limpia el contenedor de géneros y agrega cada género como un nuevo elemento de lista
  movieGenres.innerHTML = '';
  pelicula.genres.forEach(genre => {
    const listItem = document.createElement('li'); 
    listItem.textContent = genre.name; 
    movieGenres.appendChild(listItem); 
  });

  // contenedor de detalles de la película con Bootstrap
  const detallePelicula = document.getElementById('offcanvas-detalle-pelicula');
  const offcanvas = new bootstrap.Offcanvas(detallePelicula); 
  offcanvas.show(); // Muestra offcanvas
}

