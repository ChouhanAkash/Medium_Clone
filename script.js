const bell=document.getElementById('bell');
const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');
const signInForm = document.getElementById('signIn');
const signUpForm = document.getElementById('signup');

const openPopupBtn = document.getElementById('openPopup'); // Desktop Button
const mobileOpenPopupBtn = document.querySelector('.menu-icon .btn'); // Mobile Button
const closePopupBtn = document.getElementById('closePopup');
const popupContainer = document.getElementById('popupContainer');
const getstart=document.getElementById('GetopenPopup');
const startread=document.getElementById('startread')
// Function to open popup
function openPopup() {
    popupContainer.style.display = "flex";
    signInForm.style.display = "block";
    signUpForm.style.display = "none";
}

// Open Popup for Desktop
if (openPopupBtn) {
    openPopupBtn.addEventListener('click', openPopup);
}
if (getstart) {
    getstart.addEventListener('click', openPopup);
}
if (startread) {
    startread.addEventListener('click', openPopup);
}
// Open Popup for Mobile
if (mobileOpenPopupBtn) {
    mobileOpenPopupBtn.addEventListener('click', openPopup);
}

// Close Popup
if (closePopupBtn) {
    closePopupBtn.addEventListener('click', function () {
        popupContainer.style.display = "none";
    });
}

// Switch to Sign Up Form
if (signUpButton) {
    signUpButton.addEventListener('click', function () {
        signInForm.style.display = "none";
        signUpForm.style.display = "block";
    });
}

// Switch to Sign In Form
if (signInButton) {
    signInButton.addEventListener('click', function () {
        signInForm.style.display = "block";
        signUpForm.style.display = "none";
    });
}

// Close Popup when clicking outside the form
window.addEventListener('click', function (e) {
    if (e.target === popupContainer) {
        popupContainer.style.display = "none";
    }
});

///
let alldata = [];
let timeout;
let recentlySaved = false; // Flag to check if "Recently Saved" has been displayed

// Fetch data function
async function fetchData() {
  try {
    let res = await fetch(
      "https://code-surgeons-default-rtdb.firebaseio.com/articles.json"
    );
    let data = await res.json();
    alldata = Object.entries(data);
    console.log(alldata);

    // Once data is fetched, display "For You" content by default
    updateTabContent("ForYou");
    
    // Show 3 users in staff picks
    showThreeUsersInStaffPics();
    
    // Create extra "Writing on Medium" section
    createWritingOnMediumSection();
  } catch (error) {
    console.log(error.message);
  }
}

// Function to create extra "Writing on Medium" section in staff picks
function createWritingOnMediumSection() {
  const staffPicsContainer = document.querySelector(".staff_pics");

  // Create a new div for Writing on Medium section
  const writingSectionDiv = document.createElement("div");
  writingSectionDiv.id = "writingOnMediumSection";
  writingSectionDiv.classList.add("writing-section");

  writingSectionDiv.innerHTML = ` 
  <div class="write_div">
     <h3>Writing on Medium</h3>
      <p>New writer FAQ</p>
      <p>Expert writing advice</p>
      <p>Grow your readership</p>
    <button class="start-writing-btn">Start Writing</button>
    </div>
  `;

  // Append the new section to the staff_pics container
  staffPicsContainer.appendChild(writingSectionDiv);

  // Add an event listener to the "Start Writing" button
  const startWritingButton = writingSectionDiv.querySelector(".start-writing-btn");
  startWritingButton.addEventListener("click", () => {
    window.location.href = "publish.html";
  });
}

// Function to update tab content dynamically
function updateTabContent(tabId, filteredData = null) {
  const tabContent = document.getElementById(tabId);
  tabContent.innerHTML = "";

  const dataToDisplay = filteredData || alldata;

  dataToDisplay.forEach(([key, article]) => {
    const articleDiv = document.createElement("div");
    articleDiv.classList.add("article");
    articleDiv.innerHTML = `
      <div class="article_content">
        <p class="myDIV"> 
          <img src="${article.user.profile_picture}" class="user_profile"/>
          ${article.author}
        </p>

        <!-- User info div that will be shown on hover -->
        <div class="hide">
          <img src="${article.user.profile_picture}" class="user_profile"/>
          <h4>${article.user.name}</h4><p>${article.user.followers} Followers</p>
          <p>${article.user.bio}</p>
          <input type="button" value="Follow" class="btn" />
        </div>

        <h4>${article.title}</h4>
        <p><a href="${article.blog}" class="desciption">${article.description}</a></p>
        <a href="${article.blog}" >Read More</a>
        <div class="like_comment">
          <button class="like"><i class="fa-solid fa-hands-clapping"></i> </button>
          <button class="comment"><i class="fa-regular fa-comment"></i> ${article.comments}</button>
          <button class="remove"><i class="fa-solid fa-circle-minus"></i></button>
          <button class="save"><i class="fa-regular fa-bookmark"></i></button>
          <button class="ellipsce"><i class="fa-solid fa-ellipsis"></i></button>
        </div>
      </div>
      <div class="imgs"><img src="${article.image}" alt="article image" /></div>
    `;
    tabContent.appendChild(articleDiv);

    // Create a horizontal line and store it
    const hr = document.createElement("hr");
    tabContent.appendChild(hr);

    // Store hr in the articleDiv so we can access it later
    articleDiv.hrElement = hr;

    // Display user data
    const followButton = articleDiv.querySelector(".btn");
    followButton.addEventListener("click", change);

    // Access the like button and add event listener
    const likeButton = articleDiv.querySelector(".like");
    likeButton.addEventListener("click", () => {
      // Check if the article is liked, toggle the like
      if (article.liked) {
        // If liked, subtract 1
        article.likes -= 1;
        article.liked = false;
      } else {
        // If not liked, add 1
        article.likes += 1;
        article.liked = true;
      }

      // Update the like button text
      likeButton.innerHTML = `<i class="fa-solid fa-hands-clapping"></i> ${article.likes}`;
      updateArticleLikesInDatabase(key, article.likes); // Update the database
    });

    // Function to toggle follow button text
    function change(event) {
      const btn = event.target;
      if (btn.value === "Follow") {
        btn.value = "Following";
      } else {
        btn.value = "Follow";
      }
    }

    const removebtn = articleDiv.querySelector(".remove");
    removebtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to remove?") == true) {
        // Remove the article and the corresponding horizontal line
        articleDiv.remove();
        hr.remove(); // Remove the horizontal line
      }
    });

    // "Save" button functionality for saving articles
    const saveButton = articleDiv.querySelector(".save");
    saveButton.addEventListener("click", () => {
      saveArticle(article);  // Save the article to staff picks
    });

    const ellipsceButton = articleDiv.querySelector(".ellipsce");
    ellipsceButton.addEventListener("click", () => {
      console.log("Ellipsce button clicked");
    });
  });
}

// Function to update likes in the database (if required)
async function updateArticleLikesInDatabase(articleId, newLikesCount) {
  try {
    const response = await fetch(
      `https://code-surgeons-default-rtdb.firebaseio.com/articles/${articleId}.json`,
      {
        method: "PATCH",
        body: JSON.stringify({ likes: newLikesCount }),
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    console.log("Likes updated on server:", data);
  } catch (error) {
    console.error(error.message);
  }
}

// Function to save article to staff picks (this is different from the follow button)
function saveArticle(article) {
  // Only show "Recently Saved" once
  const staffPicsContainer = document.querySelector(".staff_pics");

  if (!recentlySaved) {
    // Create the "Recently Saved" heading only once
    const savedMessageDiv = document.createElement("div");
    savedMessageDiv.classList.add("saved-message");
    savedMessageDiv.innerHTML = `<h3>Recently Saved</h3>`;
    staffPicsContainer.appendChild(savedMessageDiv);

    // Set the flag to true so it won't show again
    recentlySaved = true;
  }

  // Create and append the saved article under "Staff Picks"
  const savedArticleDiv = document.createElement("div");
  savedArticleDiv.classList.add("saved-article");
  savedArticleDiv.innerHTML = `
    <h4><img src="${article.user.profile_picture}" class="user_profile"/>${article.title}</h4>
    <p>${article.description}</p>
    <p>Saved from: <strong>${article.author}</strong></p>
  `;

  staffPicsContainer.appendChild(savedArticleDiv);
}

// Tab switching function
function openCity(evt, article_name) {
  let i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(article_name).style.display = "block";
  evt.currentTarget.className += " active";

  if (article_name === "ForYou") {
    updateTabContent("ForYou");
  } else {
    const filteredData = alldata.filter(
      ([_, article]) => article.category === article_name
    );
    updateTabContent(article_name, filteredData);
  }
}

// Initialize the "For You" tab to show data by default when page loads
window.onload = () => {
  fetchData();

  const forYouTabButton = document.querySelector(".tablinks");
  if (forYouTabButton) {
    forYouTabButton.click();
  }
};

// Function to search the related articles
function searchFunction() {
  let search = document.querySelector("#search").value.toLowerCase();
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    let searchResults = alldata.filter(([_, article]) => {
      return (
        article.title.toLowerCase().includes(search) ||
        article.description.toLowerCase().includes(search) ||
        article.category.toLowerCase().includes(search) ||
        article.author.toLowerCase().includes(search)
      );
    });

    if (searchResults.length === 0) {
      document.getElementById("ForYou").innerHTML =
        "<p>No articles found matching the search term.</p>";
    } else {
      updateTabContent("ForYou", searchResults);
    }
  }, 500);
}

// Function to show 3 random users in the staff pics section
function showThreeUsersInStaffPics() {
  const staffPicsContainer = document.querySelector(".staff_pics");
  staffPicsContainer.innerHTML = ""; // Clear previous content
  
  // Pick the first three users (can be randomized later if you prefer)
  const randomUsers = alldata.slice(0, 3); 

  randomUsers.forEach(([_, article]) => {
    const userInfoDiv = document.createElement("div");
    userInfoDiv.classList.add("user-info");
    userInfoDiv.innerHTML = `
      <img src="${article.user.profile_picture}" class="user-profile-img" alt="Profile Picture"/>
      <div class="user-details">
        <p class="username">${article.user.name}</p>
        <p class="article-title">${article.title}</p>
        <button class="follow-btn">Follow</button>
      </div>
    `;

    staffPicsContainer.appendChild(userInfoDiv);

    const followButton = userInfoDiv.querySelector(".follow-btn");
    followButton.addEventListener("click", () => {
      if (followButton.textContent === "Follow") {
        followButton.textContent = "Following";
      } else {
        followButton.textContent = "Follow";
      }
    });
  });
}

///profile section
const showProfilePopup = document.getElementById('showProfilePopup');
const hideProfilePopup = document.getElementById('hideProfilePopup');
const userPopupOverlay = document.getElementById('userPopupOverlay');

// Open Sidebar Popup
showProfilePopup.addEventListener('click', () => {
    userPopupOverlay.style.display = 'block';
    setTimeout(() => {
        userPopupOverlay.classList.add('show');
    }, 10);
});

// Close Sidebar Popup
hideProfilePopup.addEventListener('click', () => {
    userPopupOverlay.classList.remove('show');
    setTimeout(() => {
        userPopupOverlay.style.display = 'none';
    }, 300);
});

// Close when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === userPopupOverlay) {
        userPopupOverlay.classList.remove('show');
        setTimeout(() => {
            userPopupOverlay.style.display = 'none';
        }, 300);
    }
});


