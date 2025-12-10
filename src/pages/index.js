import "../pages/index.css";
import Api from "../scripts/API.js";

import {
  resetFormValidation,
  clearFormErrors,
  enableValidation,
} from "../scripts/validation";

const config = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "5d4ee3eb-59cf-4d8b-944b-b92ae148191b",
    "Content-Type": "application/json",
  },
});

const MODAL_OPEN_CLASS = "modal_opened";
const LIKE_ACTIVE_CLASS = "card__like-btn_active";

const cardsListElement = document.querySelector(".cards__list");
const cardTemplate =
  document.querySelector("#card-template").content.firstElementChild;

const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);
const profileAvatarElement = document.querySelector(".profile__avatar");

const editProfileModal = document.querySelector("#edit-profile-modal");
const newPostModal = document.querySelector("#new-post-modal");
const imagePreviewModal = document.querySelector("#image-preview-modal");
const deleteConfirmModal = document.querySelector("#delete-confirm-modal");
const avatarModal = document.querySelector("#avatar-modal");

const previewImage = imagePreviewModal.querySelector(".modal__preview-image");
const previewCaption = imagePreviewModal.querySelector(
  ".modal__preview-caption"
);

const editProfileBtn = document.querySelector(".profile__edit-btn");
const newPostBtn = document.querySelector(".profile__add-btn");
const avatarEditBtn = document.querySelector(".profile__avatar-edit-btn");

const editProfileForm = editProfileModal.querySelector(".modal__form");
const nameInput = editProfileModal.querySelector("#profile-name-input");
const descriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostForm = newPostModal.querySelector(".modal__form");
const linkInput = newPostModal.querySelector("#card-image-input");
const captionInput = newPostModal.querySelector("#profile-caption-input");

const deleteConfirmForm = deleteConfirmModal.querySelector(".modal__form");
const deleteSubmitBtn = deleteConfirmForm.querySelector(".modal__submit-btn");

const avatarForm = avatarModal.querySelector(".modal__form");
const avatarLinkInput = avatarModal.querySelector("#avatar-link-input");

let selectedCard;
let selectedCardId;

const closeByEscape = (evt) => {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
};

/**
 * @param {HTMLElement} modal
 */
function openModal(modal) {
  modal.classList.add(MODAL_OPEN_CLASS);
  document.addEventListener("keydown", closeByEscape);
}

/**
 * @param {HTMLElement} modal
 */
function closeModal(modal) {
  modal.classList.remove(MODAL_OPEN_CLASS);
  document.removeEventListener("keydown", closeByEscape);
}

function renderLoading(
  isLoading,
  button,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = defaultText;
  }
}

function handleLikeClick(cardId, likeBtn, isLiked) {
  const likeAction = isLiked ? api.unlikeCard(cardId) : api.likeCard(cardId);

  likeAction
    .then(() => {
      likeBtn.classList.toggle(LIKE_ACTIVE_CLASS);
    })
    .catch((err) => {
      console.error(err);
    });
}

function handleDeleteClick(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteConfirmModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  renderLoading(true, deleteSubmitBtn, "Yes", "Deleting...");

  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      selectedCard = null;
      closeModal(deleteConfirmModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      renderLoading(false, deleteSubmitBtn, "Yes");
    });
}

function handleImageClick(data) {
  previewImage.src = data.link;
  previewImage.alt = data.name;
  previewCaption.textContent = data.name;
  openModal(imagePreviewModal);
}

/**
 * @param {{name: string, link: string, _id: string, isLiked: boolean}} data
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

  if (data.isLiked) {
    likeBtn.classList.add(LIKE_ACTIVE_CLASS);
  }

  likeBtn.addEventListener("click", () => {
    const isLiked = likeBtn.classList.contains(LIKE_ACTIVE_CLASS);
    handleLikeClick(data._id, likeBtn, isLiked);
  });

  deleteBtn.addEventListener("click", () =>
    handleDeleteClick(cardElement, data)
  );
  cardImage.addEventListener("click", () => handleImageClick(data));

  return cardElement;
}

function handleOpenEditProfile() {
  clearFormErrors(editProfileForm, config);

  nameInput.value = profileNameElement.textContent.trim();
  descriptionInput.value = profileDescriptionElement.textContent.trim();

  openModal(editProfileModal);
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  const submitBtn = editProfileForm.querySelector(".modal__submit-btn");
  renderLoading(true, submitBtn);

  api
    .editUserInfo({
      name: nameInput.value,
      about: descriptionInput.value,
    })
    .then((userData) => {
      profileNameElement.textContent = userData.name;
      profileDescriptionElement.textContent = userData.about;
      closeModal(editProfileModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      renderLoading(false, submitBtn);
    });
}

function handleNewPostSubmit(evt) {
  evt.preventDefault();

  const submitBtn = newPostForm.querySelector(".modal__submit-btn");
  renderLoading(true, submitBtn, "Create");

  api
    .addCard({
      name: captionInput.value,
      link: linkInput.value,
    })
    .then((cardData) => {
      const newCard = getCardElement(cardData);
      cardsListElement.prepend(newCard);
      closeModal(newPostModal);
      resetFormValidation(newPostForm, config);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      renderLoading(false, submitBtn, "Create");
    });
}

function handleOpenAvatarModal() {
  clearFormErrors(avatarForm, config);
  openModal(avatarModal);
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();

  const submitBtn = avatarForm.querySelector(".modal__submit-btn");
  renderLoading(true, submitBtn);

  api
    .updateAvatar({
      avatar: avatarLinkInput.value,
    })
    .then((userData) => {
      profileAvatarElement.src = userData.avatar;
      closeModal(avatarModal);
      resetFormValidation(avatarForm, config);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      renderLoading(false, submitBtn);
    });
}

Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, cards]) => {
    profileNameElement.textContent = userData.name;
    profileDescriptionElement.textContent = userData.about;
    profileAvatarElement.src = userData.avatar;

    cards.forEach((cardData) => {
      const cardElement = getCardElement(cardData);
      cardsListElement.append(cardElement);
    });
  })
  .catch((err) => {
    console.error(err);
  });

editProfileBtn.addEventListener("click", handleOpenEditProfile);
newPostBtn.addEventListener("click", () => openModal(newPostModal));
avatarEditBtn.addEventListener("click", handleOpenAvatarModal);

editProfileForm.addEventListener("submit", handleProfileFormSubmit);
newPostForm.addEventListener("submit", handleNewPostSubmit);
deleteConfirmForm.addEventListener("submit", handleDeleteSubmit);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (
      evt.target === modal ||
      evt.target.classList.contains("modal__close-btn")
    ) {
      closeModal(modal);
    }
  });
});

enableValidation(config);
