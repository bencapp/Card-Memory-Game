function createCards(difficulty) {
  //if there is already an card grid, delete it
  if (document.getElementById("cards")) {
    document.getElementById("cards").remove();
  }

  //create a new card grid
  let newCards = document.createElement("div");
  newCards.id = "cards";
  document.body.append(newCards);

  //set width and height depending on difficulty level
  let width = 4;
  let height = 3;

  if (difficulty == "Medium") {
    width = 6;
    height = 4;
  } else if (difficulty == "Hard") {
    width = 8;
    height = 5;
  }

  //set size of card grid depending on width and height
  document.getElementById("cards").style.width = `${width * 110}px`;
  document.getElementById("cards").style.height = `${height * 110}px`;
  document.getElementById(
    "cards"
  ).style.gridTemplateColumns = `repeat(${width}, 1fr)`;
  document.getElementById(
    "cards"
  ).style.gridTemplateRows = `repeat(${height}, 1fr)`;

  //create array designating image placement
  let imgArr = [];
  for (let i = 0; i < (width * height) / 2; i++) {
    imgArr.push(i);
    imgArr.push(i);
  }

  //create cards
  let cardsRevealed = [];
  let cardsRemoved = 0;
  let attempts = 0;
  resetGuesses(attempts);

  for (let i = 0; i < width * height; i++) {
    //create card and add it to the document
    let card = document.createElement("div");
    card.classList.add("card");
    card.id = "card" + i;
    document.getElementById("cards").append(card);

    //create an overlay for each card and add it to the document
    let overlay = document.createElement("div");
    overlay.className = "overlay";
    document.getElementById("card" + i).append(overlay);

    //assign the card an image value and create the image element
    const imageNum = imgArr.splice(
      Math.floor(Math.random() * imgArr.length),
      1
    );
    card.classList.add(`img${imageNum}`);
    document.getElementById("card" + i).append();

    //create the image element
    let newImage = document.createElement("img");
    newImage.src = "images/" + card.classList[1] + ".jpg";
    newImage.classList.add("card");
    newImage.style.zIndex = -1;
    newImage.style.position = "absolute";
    document.getElementById("card" + i).prepend(newImage);

    //on click, turn over card
    card.classList.add("clickable");
    card.onclick = function () {
      if (card.classList[2] == "clickable") {
        newImage.style.zIndex = 25;
        cardsRevealed.push(card);
        card.classList.remove("clickable");

        //if two cards have been revealed
        if (cardsRevealed.length == 2) {
          cardsRemoved += checkMatch(cardsRevealed);
          attempts++;
          resetGuesses(attempts);
          cardsRevealed = [];
          if (cardsRemoved == width * height) {
            setTimeout(function () {
              console.log("won");
              document.getElementById("win-box").style.display = "initial";
              document.getElementById("win-overlay").style.display = "initial";
            }, 1000);
          }
        }
      }
    };
  }
}

//check and see if there is a match, and perform appropriate animations
function checkMatch(arr) {
  if (arr[0].classList[1] == arr[1].classList[1]) {
    arr.forEach((item) => {
      item.style.border = "5px solid green";
      setTimeout(function () {
        item.style.visibility = "hidden";
      }, 1000);
    });
    return 2;
  } else {
    arr.forEach((item) => {
      item.style.border = "5px solid rgb(170, 0, 0)";
      setTimeout(function () {
        item.firstChild.style.zIndex = -1;
        item.style.border = "none";
      }, 1000);
      item.classList.add("clickable");
    });
    return 0;
  }
}

function resetGuesses(attempts) {
  [].slice.call(document.getElementsByClassName("guesses")).forEach((span) => {
    span.innerHTML = attempts;
  });
}

document.getElementById("reset").onclick = function () {
  createCards(document.getElementById("difficulty-select").value);
};

document.getElementById("reset-won").onclick = function () {
  console.log("removing win box");
  document.getElementById("win-box").style.display = "none";
  document.getElementById("win-overlay").style.display = "none";
  createCards(document.getElementById("difficulty-select-won").value);
};

createCards("easy");
