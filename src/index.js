import { fetchBreeds, fetchCatByBreed } from "./cat-api";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import SlimSelect from "slim-select";
import "slim-select/dist/slimselect.css";

const ref = {
  selector: document.querySelector(".breed-select"),
  catInfo: document.querySelector(".cat-info"),
  loader: document.querySelector(".loader"),
  error: document.querySelector(".error"),
};

const { selector, catInfo, loader, error } = ref;

loader.classList.replace("loader", "is-hidden");
error.classList.add("is-hidden");
catInfo.classList.add("is-hidden");

fetchBreeds()
  .then((data) => {
    const arrBreedsId = data.map((element) => ({
      text: element.name,
      value: element.id,
    }));

    new SlimSelect({
      select: selector,
      data: arrBreedsId,
    });
  })
  .catch(onFetchError);

selector.addEventListener("change", onSelectBreed);

function onSelectBreed(event) {
  loader.classList.replace("is-hidden", "loader");
  selector.classList.add("is-hidden");
  catInfo.classList.add("is-hidden");

  const breedId = event.currentTarget.value;
  fetchCatByBreed(breedId)
    .then((data) => {
      loader.classList.replace("loader", "is-hidden");
      selector.classList.remove("is-hidden");
      const { url, breeds } = data[0];

      catInfo.innerHTML = `<div><img src="${url}" alt="${breeds[0].name}" width="400"/></div><div class="cat-info-description"><h1>${breeds[0].name}</h1><p>${breeds[0].description}</p><p><b>Temperament:</b> ${breeds[0].temperament}</p></div>`;
      catInfo.classList.remove("is-hidden");
    })
    .catch(onFetchError);
}

function onFetchError() {
  selector.classList.add("is-hidden");
  loader.classList.replace("loader", "is-hidden");

  Notify.failure("Oops! Something went wrong!", {
    position: "center-center",
    timeout: 5000,
    width: "500px",
    fontSize: "18px",
  });
}
