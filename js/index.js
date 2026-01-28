let BOOKS = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("./json/books.json")
    .then((r) => r.json())
    .then((data) => {
      BOOKS = data;
      renderCatalog();
    });

  document.querySelector("[data-button-shuffle]")?.addEventListener("click", () => {
    renderCatalog();
  });
});

function renderCatalog() {
  const slots = {
    big: document.querySelector('[data-slot="big"]'),
    small: document.querySelector('[data-slot="small"]'),
    medium: [...document.querySelectorAll('[data-slot="medium"]')],
  };

  Object.values(slots)
    .flat()
    .forEach((s) => (s.innerHTML = ""));

  const fixed = BOOKS.filter((b) => b.sort !== null);
  const free = BOOKS.filter((b) => b.sort === null);

  const fixedBySort = {};

  fixed.forEach((b) => {
    if (!fixedBySort[b.sort]) fixedBySort[b.sort] = [];
    fixedBySort[b.sort].push(b);
  });

  Object.keys(fixedBySort).forEach((sort) => {
    const group = fixedBySort[sort];
    shuffle(group);

    if (sort == 1) {
      slots.big.append(createCard(group[0], "big"));
    }

    if (sort == 2) {
      group.slice(0, 3).forEach((book) => {
        slots.small.append(createCard(book, "small"));
      });
    }

    if (sort == 6) {
      slots.medium[1]?.append(createCard(group[0], "medium"));
    }
  });

  shuffle(free);

  // big
  if (!slots.big.children.length && free.length) {
    slots.big.append(createCard(free.shift(), "big"));
  }

  // small
  while (slots.small.children.length < 3 && free.length) {
    slots.small.append(createCard(free.shift(), "small"));
  }

  // medium
  slots.medium.forEach((slot) => {
    if (!slot.children.length && free.length) {
      slot.append(createCard(free.shift(), "medium"));
    }
  });
}

function createCard(book, type) {
  const a = document.createElement("a");
  a.href = "#!";
  a.className =
    "card-product" +
    (type === "small" ? " card-product--small" : "") +
    (type === "medium" ? " card-product--medium" : "");

  a.innerHTML = `
    <div class="card-product__inner">
      <div class="card-product__head">
        <div class="card-product__poster card-product__poster--cover">
          <img src="${book.cover}" alt="${book.name}">
        </div>
      </div>
      <div class="card-product__body">
        <div class="card-product__info">
          <div class="card-product__name">${book.name}</div>
          <div class="card-product__author">${book.author}</div>
          <div class="card-product__descr"><p>${book.descr}</p></div>
        </div>
      </div>
    </div>
  `;

  return a;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
