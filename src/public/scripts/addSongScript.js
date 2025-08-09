// import * as google from 'googleapis';

// const apiKey = 'AIzaSyCQwpdwBrXrZmksBqtWwQ9vJUqVz1JkZEQ';

const urlInput = document.getElementById("url");
const title = document.getElementById("title");

// const youtube = google.youtube({
//   version: 'v3',
//   auth: apiKey,
// });

//when a url is entered, automatically update title input with video's title
urlInput.addEventListener('input', function() {
    const url = urlInput.value;
})

const dropdownButton = document.getElementById("dropdown-button");
const dropdownMenu = document.getElementById("dropdown-menu");
const searchInput = document.getElementById("search-input")
const gameList = document.getElementsByName("game");

//dropdown menu toggle
dropdownButton.addEventListener('click', function(e) {
  e.preventDefault();
  toggleDropdown();
})

function toggleDropdown() {
  dropdownMenu.classList.toggle('hidden');
}

//dropdown menu search
dropdownButton.addEventListener('input', function() {
  gameList.forEach(game => {
    const gameText = game.textContent.toLowerCase();
    const searchText = this.value.toLowerCase();
    if (gameText.includes(searchText)) {
      game.style.display = 'block';
    } else {
      game.style.display = 'none';
    }
  })
})

gameList.forEach(game => {
  game.addEventListener('click', function() {
    dropdownButton.value = game.textContent;
    dropdownButton.textContent = game.textContent;
    toggleDropdown();
  });
});