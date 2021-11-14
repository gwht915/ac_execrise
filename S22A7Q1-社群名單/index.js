const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";

users = [];
const USERS_PER_PAGE = 12;
let filteredUsers = [];

axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results);

    renderPaginator(users.length);
    userList(getUsersByPage(1));
  })
  .catch((err) => console.log(err));

const dataPanel = document.querySelector("#data-panel");

function userList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    // title, image
    rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
        <img src="${item.avatar}" class="card-img-top" alt="User Image" data-id="${item.id}"/>
        <div class="card-body" data-id="${item.id}">
          <h5 class="card-title" data-id="${item.id}">${item.name} ${item.surname}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-user" data-toggle="modal" data-target="#user-modal" data-id="${item.id}">More</button>
          
        </div>
      </div>
     </div>
     </div>`;
  });
  //console.log(rawHTML);
  dataPanel.innerHTML = rawHTML;
}

//const cardClick = document.querySelector(".col-sm-3");

dataPanel.addEventListener("click", function onCardClicked(event) {
  //console.log(event.target);
  if (event.target.matches(".btn-show-user")) {
    //console.log(event.target.dataset.id)
    showUserInfo(event.target.dataset.id);
  }
});

function showUserInfo(id) {
  console.log(id);
  const modalTitle = document.querySelector("#user-modal-title");
  const modalImage = document.querySelector("#user-modal-image");
  const modalDescription = document.querySelector("#user-modal-description");

  axios
    .get(INDEX_URL + id)
    .then((response) => {
      //console.log(response.data);
      const data = response.data;
      //console.log(`${data.name} ${data.surname}`);
      modalTitle.innerText = data.name + " " + data.surname;

      //modalInfo.innerText = data.description;
      modalImage.innerHTML = `<img src="${data.avatar}" alt="movie-poster" class="img-fluid">`;
      //console.log(modalImage.innerHTML);
      modalDescription.innerHTML = `<p>Email: ${data.email}</p><p>Gender: ${data.gender}</p><p>Age: ${data.age}</p><p>Region: ${data.region}</p><p>Birthday: ${data.birthday}</p>`;
      console.log(modalDescription.innerHTML);
    })
    .catch((error) => console.log(error));
}

function getUsersByPage(page) {
  //計算起始 index
  const data1 = filteredUsers.length ? filteredUsers : users;
  const startIndex = (page - 1) * USERS_PER_PAGE;
  //回傳切割後的新陣列
  //return movies.slice(startIndex, startIndex + MOVIES_PER_PAGE)
  return data1.slice(startIndex, startIndex + USERS_PER_PAGE);
}

function renderPaginator(amount) {
  //計算總頁數
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE);
  //製作 template
  let rawHTML = "";

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  //放回 HTML
  paginator.innerHTML = rawHTML;
}

paginator.addEventListener("click", function onPaginatorClicked(event) {
  //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== "A") return;

  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page);
  //更新畫面
  userList(getUsersByPage(page));
});

//Seacrh event
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
//...
//監聽表單提交事件
searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault(); //當使用者按下 Search 提交搜尋表單時，頁面不會刷新 (重新導向目前頁面)
  //console.log('click!') //測試用

  //取得搜尋關鍵字
  const keyword = searchInput.value.trim().toLowerCase();

  filteredUsers = users.filter((user) =>
    (user.name + " " + user.surname).toLowerCase().includes(keyword)
  );

  if (filteredUsers.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的朋友`);
  }
  //重新輸出至畫面
  renderPaginator(filteredUsers.length);

  userList(getUsersByPage(1));
});