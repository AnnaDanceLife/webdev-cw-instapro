import { USER_POSTS_PAGE, POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, page } from "../index.js";

import { likeFetchFunc, dislikeFetchFunc } from "../api.js";

export function renderPostsPageComponent({ appEl }) {
  // Реализован рендер постов из api
  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = posts.
    map((post) => {
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
      ${post.createdAt}
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

    if (getToken()) {

      const countLikesElements = document.querySelectorAll(".like-button");

      for (const countLikesElement of countLikesElements) {
        countLikesElement.addEventListener('click', (event) => {
          event.stopPropagation();
          const postId = countLikesElement.dataset.postId;

          if (countLikesElement.dataset.liked === 'false') {

            likeFetchFunc({ postId, token: getToken() })
              .then(() => {
                goToPage(POSTS_PAGE);
              })
              .catch((error) => {
                console.log(error);
              })
          } else {
            dislikeFetchFunc({ postId, token: getToken() })
              .then(() => {
                goToPage(POSTS_PAGE);
              })
              .catch((error) => {
                console.log(error);
              })
          }
        });
      }
    }
  }
}