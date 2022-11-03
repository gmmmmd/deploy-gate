window.addEventListener('DOMContentLoaded', function () {
  const preloader = document.querySelector('#loading');

  const searchForm = document.forms.searchForm;
  const inputSearchForm = searchForm.querySelector('input');

  const postsContainer = document.querySelector('[data-posts-container]');
  const postsTemplate = document.querySelector('[data-posts-template]');

  const paginationContainer = document.querySelector('[data-pagination-container]');
  const paginationTemplate = document.querySelector('[data-pagination-template]');

  init();

  async function getPosts() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/?_start=0&_limit=100');  
      const data = await response.json();      
      closePreloader(preloader);
      return data;
    } catch(err) {
      alert(err);
    }
  };

  async function init() {
    openPreloader(preloader);
    const postsData = await getPosts();
    const perPage = 9;
    let currentPage = 1;

    let searchParams = new URLSearchParams(location.search);

    if (searchParams.has('search')) {
      const res = postsData.filter((item) => {
        return (
          item.title.toLowerCase().includes(searchParams.get('search').toLowerCase())
        );
      });

      displayPosts(res, perPage, currentPage);
      createPagination(res, perPage);
    } else {
      displayPosts(postsData, perPage, currentPage);
      createPagination(postsData, perPage);
    }

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (inputSearchForm.value) {
        searchParams.set('search', inputSearchForm.value);
        history.replaceState(null, document.title, '?' + searchParams.toString());

        const res = postsData.filter((item) => {
          return (
            item.title.toLowerCase().includes(inputSearchForm.value.toLowerCase())
          );
        });

        inputSearchForm.value = "";
        displayPosts(res, perPage, currentPage);
        createPagination(res, perPage);
      } else {
        history.replaceState(null, document.title, location.pathname);
        displayPosts(postsData, perPage, currentPage);
        createPagination(postsData, perPage);
      }
    });

    function displayPosts(array, perPage, currentPage) {
      const lastItem = currentPage * perPage;
      const firstItem = lastItem - perPage;
      const currentData = array.slice(firstItem, lastItem);
      createTemplate(currentData);
    };
  
    function createTemplate(obj) {
      postsContainer.innerHTML = '';      
      obj.forEach(item => {
        const card = postsTemplate.content.cloneNode(true);
        const title = card.querySelector('[data-title]');
        const description = card.querySelector('[data-description]');
        const postId = card.querySelector('[data-id]');
        const value = card.querySelector('[data-value]');
        title.textContent = item.title;
        description.textContent = item.body;
        postId.dataset.id = item.id;
        value.dataset.value = item.id;
        postsContainer.appendChild(card);
      });

      const inputChangeTheme = document.querySelectorAll('#color');

      inputChangeTheme.forEach(i => {
        i.addEventListener('change', () => {
          if (i.checked) {
            i.closest('.hero__card').classList.add('hero__card--dark');
          } else {
            i.closest('.hero__card').classList.remove('hero__card--dark');
          }
        });
      });
    };
  
    function createPagination(array, perPage) {
      paginationContainer.innerHTML = '';
      const pagesCount = Math.ceil(array.length / perPage);
      let pages = [];
  
      for (let i = 1; i <= pagesCount; i++) {
        pages.push(i);
      }
  
      pages.forEach(item => {
        createPaginationButton(item, array)
      });
    };
  
    function createPaginationButton(item, array) {
      const card = paginationTemplate.content.cloneNode(true);
      const page = card.querySelector('[data-page]');
      page.textContent = item;
      paginationContainer.appendChild(card);

      if (currentPage == item) page.classList.add('hero__page--active');

      page.addEventListener("click", () => {
        currentPage = item;

        displayPosts(array, perPage, currentPage);

        let currentActiveBtn = document.querySelector('div.hero__page--active');

        if (currentActiveBtn) {
          currentActiveBtn.classList.remove('hero__page--active');
        }

        page.classList.add('hero__page--active');
      });
    };
  };
  
  function openPreloader(preloader) {
    preloader.style.display = "flex";
  };
  
  function closePreloader(preloader) {
    if (preloader.style.display = "flex") {
      preloader.style.display = "none";
    }
  };

});