const searchInput = document.getElementById("search-input");
const typeSelect = document.getElementById("type-select");
const searchButton = document.getElementById("search-button");
const moviesContainer = document.getElementById("movies-container");
const pagination = document.getElementById("pagination");
const movieDetails = document.getElementById("movie-details");

searchButton.addEventListener("click", searchMovies);

function searchMovies() {
  const searchTerm = searchInput.value.trim();
  const type = typeSelect.value;

  if (searchTerm === "") {
    clearMovies();
    showError("Please enter a search term.");
    return;
  }

  clearMovies();
  hideError();

  fetchMovies(searchTerm, type, 1);
}

function fetchMovies(searchTerm, type, page) {
  const apiKey = "ceb9e89";

  const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(
    searchTerm
  )}&type=${type}&page=${page}`;

  clearMovies();
  hideError();

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.Response === "True") {
        showMovies(data.Search);
        showPagination(searchTerm, type, page, data.totalResults);
      } else {
        showError("Movie not found!");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showError("An error occurred. Please try again.");
    });
}

function showMovies(movies) {
  let counter = 0;

  movies.forEach((movie) => {
    if (counter >= 10) return;

    const movieItem = document.createElement("div");
    movieItem.classList.add("movie-item");
    movieItem.innerHTML = `
      <div class="movie-details-container">
        <img src="${movie.Poster}" alt="${movie.Title}" />
        <div class="movie-details">
          <h3>${movie.Title}</h3>
          </div>
          <p>Year: ${movie.Year}</p>
          <p>Type: ${movie.Type}</p>
      </div>
      <button data-imdbid="${movie.imdbID}" class="details-button">Details</button>
    `;

    const detailsButton = movieItem.querySelector(".details-button");
    detailsButton.addEventListener("click", showMovieDetails);

    moviesContainer.appendChild(movieItem);
    counter++;
  });
}

function showPagination(searchTerm, type, currentPage, totalResults) {
  const totalPages = Math.ceil(totalResults / 10);
  pagination.innerHTML = "";

  const previousButton = document.createElement("button");
  previousButton.textContent = "Previous";
  previousButton.disabled = currentPage === 1;
  previousButton.addEventListener("click", () => {
    fetchMovies(searchTerm, type, currentPage - 1);
  });
  pagination.appendChild(previousButton);

  let startPage = currentPage - 2;
  let endPage = currentPage + 3;
  if (startPage < 1) {
    startPage = 1;
    endPage = Math.min(6, totalPages);
  }
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, totalPages - 5);
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.addEventListener("click", () => {
      fetchMovies(searchTerm, type, i);
    });

    if (i === currentPage) {
      pageButton.classList.add("active");
    }

    pagination.appendChild(pageButton);
  }

  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
    fetchMovies(searchTerm, type, currentPage + 1);
  });
  pagination.appendChild(nextButton);
}

function showMovieDetails(event) {
  const imdbID = event.target.dataset.imdbid;

  fetchMovieDetails(imdbID);
}

function fetchMovieDetails(imdbID) {
  const apiKey = "ceb9e89";

  const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.Response === "True") {
        showMovieDetailsModal(data);
      } else {
        showError("Movie details not found!");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showError("An error occurred. Please try again.");
    });
}

function showMovieDetailsModal(movie) {
  movieDetails.innerHTML = `
    <h2>${movie.Title}</h2>
    <div class="movie-details">
      <div class="image-container">
        <img id="movie-poster" src="${movie.Poster}" alt="${movie.Title}" />
      </div>
      <div class="details-container">
        <p><strong>Year:</strong> ${movie.Year}</p>
        <p><strong>Rated:</strong> ${movie.Rated}</p>
        <p><strong>Released:</strong> ${movie.Released}</p>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Actors:</strong> ${movie.Actors}</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>
      </div>
    </div>
  `;

  const moviePoster = document.getElementById("movie-poster");
  moviePoster.scrollIntoView({ behavior: "smooth", block: "start" });
}

function clearMovies() {
  moviesContainer.innerHTML = "";
  pagination.innerHTML = "";
  movieDetails.innerHTML = "";
}

function showError(message) {
  const errorElement = document.createElement("p");
  errorElement.classList.add("error-message");
  errorElement.textContent = message;
  moviesContainer.appendChild(errorElement);
}

function hideError() {
  const errorElement = document.querySelector(".error-message");
  if (errorElement) {
    errorElement.remove();
  }
}
