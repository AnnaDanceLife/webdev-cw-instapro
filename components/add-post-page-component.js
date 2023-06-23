import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    // Реализована страницу добавления поста

    let imageUrl = "";
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <h3 class="form-title">Добавить пост</h3>
      <div class="form-inputs">
        <div class="upload-image-container">Выберите фото</div>
        Опишите фотографию:
        <textarea class="input" id="text-input" style="height: 100px;"></textarea>
      </div><br>
     <button class="button" id="add-button" style="width: 100%;">Добавить</button>
    </div>`;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    document.getElementById("add-button").addEventListener("click", () => {
      const textarea = document.getElementById('text-input').value;
      if (textarea === '') {
        alert("Опишите фотографию");
        return;
      }

      if (!imageUrl) {
        alert("Не выбрана фотография");
        return;
      }

      onAddPostClick({
        description: textarea
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;"),
        imageUrl: `${imageUrl}`,
      });
    });
  };

  render();
}
