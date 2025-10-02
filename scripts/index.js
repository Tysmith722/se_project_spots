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
];

const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");

const editProfileForm = editProfileModal.querySelector(".modal__form");
const nameInput = editProfileModal.querySelector("#profile-name-input");
const descriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostForm = newPostModal.querySelector(".modal__form");
const linkInput = newPostModal.querySelector("#card-image-input");
const captionInput = newPostModal.querySelector("#profile-caption-input");

const MODAL_OPEN_CLASS = "modal_is-opened";

function openModal(modal) {
  modal.classList.add(MODAL_OPEN_CLASS);
}

function closeModal(modal) {
  modal.classList.remove(MODAL_OPEN_CLASS);
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

  console.log("New Post Link:", linkInput.value);
  console.log("New Post Caption:", captionInput.value);

  closeModal(newPostModal);
}

editProfileBtn.addEventListener("click", handleOpenEditProfile);
newPostBtn.addEventListener("click", () => openModal(newPostModal));

editProfileCloseBtn.addEventListener("click", () =>
  closeModal(editProfileModal)
);
newPostCloseBtn.addEventListener("click", () => closeModal(newPostModal));

editProfileForm.addEventListener("submit", handleProfileFormSubmit);
newPostForm.addEventListener("submit", handleNewPostSubmit);

initialCards.forEach(function (item) {
  console.log(card.name);
  console.log(card.link);
});
