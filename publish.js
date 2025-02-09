const storedEmail = localStorage.getItem("userEmail");

// Declare a variable:
let UniversalData;

// Store the title and content part in the form of an array:
const heading = document.getElementById("heading");
const content = document.getElementById("content");

async function fetchUser() {
  try {
    const firebaseURL =
      "https://code-surgeons-default-rtdb.firebaseio.com/articles.json";
    const response = await fetch(firebaseURL);
    const data = await response.json(); // Add 'await' here
    UniversalData = data;

    // Call findMatchingUser after fetching data
    findMatchingUser(UniversalData);
  } catch (error) {
    console.error(error);
  }
}

// Function to find the matching user
function findMatchingUser(data) {
  if (!storedEmail) {
    console.log("No user email found in localStorage");
    return null;
  }

  const matchedArticle = data.articles.find(
    (article) => article.user.email === storedEmail
  );

  if (matchedArticle) {
    console.log("Matched User ID:", matchedArticle.user.id);
    return matchedArticle.user.id;
  } else {
    console.log("No matching user found.");
    return null;
  }
}

// Function to update saved articles in Firebase
async function updateUserSavedArticles(userId) {
  try {
    const headingInput = heading.value.trim();
    const contentInput = content.value.trim();

    if (headingInput === "" || contentInput === "") {
      alert("Title and content cannot be empty");
      return;
    }

    // Fetch the existing saved articles
    const fetchResponse = await fetch(
      `https://code-surgeons-default-rtdb.firebaseio.com/articles/${userId}/user/saved.json`
    );
    const existingData = await fetchResponse.json();

    // If existing data is null, start with an empty array
    const savedArticles = existingData ? existingData : [];

    // Push new article
    savedArticles.push({
      heading: headingInput,
      content: contentInput,
    });

    // Update Firebase
    const response = await fetch(
      `https://code-surgeons-default-rtdb.firebaseio.com/articles/${userId}/user/saved.json`,
      {
        method: "PUT", // Use PUT to overwrite with the updated array
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(savedArticles),
      }
    );

    heading.value = "";
    content.value = "";
    if (!response.ok) {
      throw new Error(`Error updating user: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log("User saved articles updated successfully:", responseData);
  } catch (error) {
    console.error("Error updating user saved articles:", error);
  }
}

function updateButtonStyles() {
  const buttons = document.querySelectorAll(".toolbar button");
  buttons.forEach((button) => button.classList.remove("active"));

  if (heading.style.fontWeight === "bold") {
    document.getElementById("bold").classList.add("active");
  }
  if (content.style.fontWeight === "bold") {
    document.getElementById("bold").classList.add("active");
  }
  if (heading.style.fontStyle === "italic") {
    document.getElementById("italic").classList.add("active");
  }
  if (content.style.fontStyle === "italic") {
    document.getElementById("italic").classList.add("active");
  }
  if (heading.style.textDecoration === "underline") {
    document.getElementById("underline").classList.add("active");
  }
  if (content.style.textDecoration === "underline") {
    document.getElementById("underline").classList.add("active");
  }
}

function toggleHeading() {
  const headingBtn = document.getElementById("heading-H");
  headingBtn.classList.toggle("active");
  const isHeadingActive = headingBtn.classList.contains("active");

  heading.style.fontWeight = isHeadingActive ? "bold" : "normal";
  heading.style.fontStyle = isHeadingActive ? "italic" : "normal";
  heading.style.textDecoration = isHeadingActive ? "underline" : "none";
  updateButtonStyles();
}

function boldText() {
  const isHeadingActive = document.getElementById("heading-H").classList.contains("active");
  const target = isHeadingActive ? heading : content;
  target.style.fontWeight = target.style.fontWeight === "bold" ? "normal" : "bold";
  updateButtonStyles();
}

function italicText() {
  const isHeadingActive = document.getElementById("heading-H").classList.contains("active");
  const target = isHeadingActive ? heading : content;
  target.style.fontStyle = target.style.fontStyle === "italic" ? "normal" : "italic";
  updateButtonStyles();
}

function underlineText() {
  const isHeadingActive = document.getElementById("heading-H").classList.contains("active");
  const target = isHeadingActive ? heading : content;
  target.style.textDecoration = target.style.textDecoration === "underline" ? "none" : "underline";
  updateButtonStyles();
}

function resetAll() {
  heading.value = "";
  content.value = "";
  heading.style = "";
  content.style = "";
  updateButtonStyles();
}

document.getElementById("heading-H").addEventListener("click", toggleHeading);
document.getElementById("bold").addEventListener("click", boldText);
document.getElementById("italic").addEventListener("click", italicText);
document.getElementById("underline").addEventListener("click", underlineText);
document.getElementById("reset").addEventListener("click", resetAll);

document.getElementById("publish-btn").addEventListener("click", async () => {
  const userId = findMatchingUser(UniversalData);
  if (userId) {
    await updateUserSavedArticles(userId);
  } else {
    alert("User not found. Unable to save.");
  }
});

fetchUser();
