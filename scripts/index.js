const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Forest river in morning mist",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

const MODAL_OPEN_CLASS = "modal_is-opened";
const LIKE_ACTIVE_CLASS = "card__like-btn_active";

const cardsListElement = document.querySelector(".cards__list");
const cardTemplate =
  document.querySelector("#card-template").content.firstElementChild;

const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);

const editProfileModal = document.querySelector("#edit-profile-modal");
const newPostModal = document.querySelector("#new-post-modal");
const imagePreviewModal = document.querySelector("#image-preview-modal"); // NEW: Preview Modal

const previewImage = imagePreviewModal.querySelector(".modal__preview-image");
const previewCaption = imagePreviewModal.querySelector(
  ".modal__preview-caption"
);

const editProfileBtn = document.querySelector(".profile__edit-btn");
const newPostBtn = document.querySelector(".profile__add-btn");
const closeButtons = document.querySelectorAll(".modal__close-btn");

const editProfileForm = editProfileModal.querySelector(".modal__form");
const nameInput = editProfileModal.querySelector("#profile-name-input");
const descriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostForm = newPostModal.querySelector(".modal__form");
const linkInput = newPostModal.querySelector("#card-image-input");
const captionInput = newPostModal.querySelector("#profile-caption-input");

/**
 * @param {HTMLElement} modal
 */
function openModal(modal) {
  modal.classList.add(MODAL_OPEN_CLASS);
}

/**
 * @param {HTMLElement} modal
 */
function closeModal(modal) {
  modal.classList.remove(MODAL_OPEN_CLASS);
}

function handleLikeClick(evt) {
  evt.target.classList.toggle(LIKE_ACTIVE_CLASS);
}

function handleDeleteClick(evt) {
  evt.target.closest(".card").remove();
}

function handleImageClick(data) {
  previewImage.src = data.link;
  previewImage.alt = data.name;
  previewCaption.textContent = data.name;

  openModal(imagePreviewModal);
}

/** * @param {{name: string, link: string}}
 * @returns {HTMLElement}
 */
function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);

  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const likeBtn = cardElement.querySelector(".card__like-btn");
  const deleteBtn = cardElement.querySelector(".card__delete-btn");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  likeBtn.addEventListener("click", handleLikeClick);
  deleteBtn.addEventListener("click", handleDeleteClick);

  cardImage.addEventListener("click", () => handleImageClick(data));

  return cardElement;
}

function handleOpenEditProfile() {
  nameInput.value = profileNameElement.textContent.trim();
  descriptionInput.value = profileDescriptionElement.textContent.trim();
  openModal(editProfileModal);
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  profileNameElement.textContent = nameInput.value;
  profileDescriptionElement.textContent = descriptionInput.value;

  closeModal(editProfileModal);
}

function handleNewPostSubmit(evt) {
  evt.preventDefault();

  const newCardData = {
    name: captionInput.value,
    link: linkInput.value,
  };

  const newCard = getCardElement(newCardData);
  cardsListElement.prepend(newCard);

  newPostForm.reset();

  closeModal(newPostModal);
}

function renderInitialCards() {
  initialCards.forEach(function (data) {
    const cardElement = getCardElement(data);
    cardsListElement.append(cardElement);
  });
}

editProfileBtn.addEventListener("click", handleOpenEditProfile);
newPostBtn.addEventListener("click", () => openModal(newPostModal));

closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

editProfileForm.addEventListener("submit", handleProfileFormSubmit);
newPostForm.addEventListener("submit", handleNewPostSubmit);

renderInitialCards();
