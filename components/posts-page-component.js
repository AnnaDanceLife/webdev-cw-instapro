import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, renderApp } from "../index.js";
import { likeFetchFunc, dislikeFetchFunc } from "../api.js";
import { formatDistanceToNow } from "../node_modules/date-fns";
import { ru } from "../node_modules/date-fns/locale"

export function renderPostsPageComponent({ appEl }) {

  // Реализован рендер постов из api
  // / Oтформатирована дата создания поста 

  const appHtml = posts.
    map((post) => {
      const createDate = formatDistanceToNow(new Date(post.createdAt), { locale: ru, addSuffix: true });
      return `                  
    <li class="post">
    <div class="post-header" data-user-id="${post.user.id}">
        <img src="${post.user.imageUrl}" class="post-header__user-image">
        <p class="post-header__user-name">${post.user.name}</p>
    </div>
    <div class="post-image-container">
      <img class="post-image" src="${post.imageUrl}">
    </div>
    <div class="post-likes">
      <button data-post-id="${post.id}" data-liked="${post.isLiked}" class="like-button ">
      ${post.isLiked ? '<img src="./assets/images/like-active.svg">' : '<img src="./assets/images/like-not-active.svg">'} 
      </button>
      <p class="post-likes-text">
        Нравится: <strong>${post.likes.length}</strong>
      </p>
    </div>
    <p class="post-text">
      <span class="user-name">${post.user.name}</span>
      ${post.description}
    </p>
    <p class="post-date">
      ${createDate}
    </p>
  </li>
`;
    })
    .join('');

  appEl.innerHTML = `
  <div class="page-container">
<div class="header-container">
</div>
</div>
` + appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  let userEls = document.querySelectorAll(".post-header");
  for (let userEl of userEls) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });

    const toggleLikes = ({ postId }) => {
      const index = posts.findIndex((post) => post.id === postId);

      if (posts[index].isLiked) {
        dislikeFetchFunc({ postId, token: getToken() })
          .then((object) => {
            posts[index].likes = object.post.likes;
            posts[index].isLiked = false;
            renderApp();
          })
          .catch((error) => {
            console.error(error);
          })
      } else {
        likeFetchFunc({ postId, token: getToken() })
          .then((object) => {
            posts[index].likes = object.post.likes;
            posts[index].isLiked = true;
            renderApp();
          })
          .catch((error) => {
            console.error(error);
          })
      }
    }

    const countLikesElements = document.querySelectorAll(".like-button");

    for (const countLikesElement of countLikesElements) {
      countLikesElement.addEventListener('click', (event) => {
        event.stopPropagation();

        if (!getToken()) {
          alert("Поставить лайк могут только авторизованные пользователи");
          return;
        }
        const postId = countLikesElement.dataset.postId;

        toggleLikes({ postId });
      });
    }
  }
}
