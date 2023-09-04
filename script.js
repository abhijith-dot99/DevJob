// Function to toggle the theme and store the preference in localStorage
function toggleTheme() {
    const circle = document.getElementById("circle");
    const currentTheme = localStorage.getItem("theme"); // Get the current theme from localStorage

    // Toggle the theme based on the current state
    if (currentTheme === "dark") {
        circle.setAttribute("cx", "48"); // Return the circle to its original position
        document.body.classList.remove("theme-dark"); // Remove dark theme class from body
        document.body.classList.add("theme-light"); // Add light theme class to body

        const searchInputs = document.querySelectorAll(".search-area");
        searchInputs.forEach((input) => {
            input.classList.remove("theme-dark");
            input.classList.add("theme-light");
        });

        // Apply the "job-details" class to elements
        const jobDetails = document.querySelectorAll(".job-details");
        jobDetails.forEach((detail) => {
            detail.classList.remove("theme-dark");
            detail.classList.add("theme-light");
        });

        localStorage.setItem("theme", "light"); // Update theme preference in localStorage
    } else {
        circle.setAttribute("cx", "70"); // Move the circle to a new position
        document.body.classList.remove("theme-light"); // Remove light theme class from body
        document.body.classList.add("theme-dark"); // Add dark theme class to body

        // Apply the "search-area" class to elements
        const searchInputs = document.querySelectorAll(".search-area");
        searchInputs.forEach((input) => {
            input.classList.remove("theme-light");
            input.classList.add("theme-dark");
        });

        // Apply the "job-details" class to elements
        const jobDetails = document.querySelectorAll(".job-details");
        jobDetails.forEach((detail) => {
            detail.classList.remove("theme-light");
            detail.classList.add("theme-dark");
        });

        localStorage.setItem("theme", "dark"); // Update theme preference in localStorage
    }
}

// Function to initialize the theme based on localStorage
function initializeTheme() {
    const currentTheme = localStorage.getItem("theme");

    if (currentTheme === "dark") {
        // Apply dark theme
        document.body.classList.add("theme-dark"); // Add dark theme class to body
        const circle = document.getElementById("circle");
        circle.setAttribute("cx", "70"); // Move the circle to its dark mode position
    } else {
        // Apply light theme (default)
        document.body.classList.add("theme-light"); // Add light theme class to body
        const circle = document.getElementById("circle");
        circle.setAttribute("cx", "48"); // Move the circle to its light mode position
    }
}

// Call initializeTheme to set the initial theme
initializeTheme();

// Add a click event listener to the theme toggle button
const themeToggle = document.querySelector(".theme-toggle");
themeToggle.addEventListener("click", toggleTheme);

// Function to fetch JSON data
async function fetchJobData() {
    try {
        const response = await fetch("data.json"); // Replace with the path to your JSON file
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}

// Function to create a card element for a job listing
function createJobCard(job) {
    const cardContainer = document.querySelector(".card-container");

    const card = document.createElement("div");
    card.classList.add("card");

    card.setAttribute("data-job-id", job.id);

    // Apply the appropriate theme class based on the current theme
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
        card.classList.add("dark-theme");
    } else {
        card.classList.add("light-theme");
    }

    // Create card content using job data
    card.innerHTML = `
<div class="icon-container">
    <img src="${job.logo}" alt="Icon" class="icon" style="background-color:${job.logoBackground}; font-size:10px" ></img>
</div>
<div class="card-box">
<div class="text-container">
<p class="card-text">${job.postedAt}</p>
<img src="images/Oval.svg">
<p class="card-text">${job.contract}</p>
</div>
<h2>${job.position}</h2>
<p class="company-text">${job.company}</p>
<p class="location-text">${job.location}</p>
</div>
<!-- Add other job details here -->
`;

    card.addEventListener("click", async () => {
        try {
            const jobData = await fetchJobData();
            const jobId = card.getAttribute("data-job-id");

            console.log(jobId);

            const mainContent = document.querySelector(".searchandCard");

            // Remove padding from the main content element
            mainContent.style.padding = "0";

            // Call the populateJobDetails function with the job ID and the fetched job data
            window.location.href="/details.html?id="+jobId
            // populateJobDetails(jobId, jobData);
        } catch (error) {
            console.error("Error fetching job data:", error);
        }
    });

    // Append the card to the container
    cardContainer.appendChild(card);
}

function updateJobCards(data, showFullTime, searchText, searchLocationText) {
    const cardContainer = document.querySelector(".card-container");
    if(cardContainer){
        cardContainer.innerHTML = ""; // Clear existing cards

        const filteredData = data.filter((job) => {
            // Filter by contract type
            if (showFullTime && job.contract !== "Full Time") {
                return false;
            }
            // Filter by search text
            if (searchText) {
                const positionMatches = job.position.toLowerCase().includes(searchText.toLowerCase());
                const companyMatches = job.company.toLowerCase().includes(searchText.toLowerCase());
    
                if (!positionMatches && !companyMatches) {
                    return false;
                }
            }
    
            // Filter by search location text
            if (searchLocationText && !job.location.toLowerCase().includes(searchLocationText.toLowerCase())) {
                return false;
            }
            return true;
        });
        if (filteredData.length === 0) {
            // No search results found, display the modal
            const modal = document.getElementById("myModal");
            modal.style.display = "block";
    
            // Add an event listener to close the modal when the user clicks the close button
            const closeButton = document.querySelector(".close");
            closeButton.addEventListener("click", () => {
                modal.style.display = "none";
    
                // Retrieve job data from local storage and recreate cards
                const jobDataFromStorage = JSON.parse(localStorage.getItem("jobData"));
                if (jobDataFromStorage) {
                    jobDataFromStorage.slice(0, 12).forEach((job) => {
                        createJobCard(job);
                    });
                }
            });
        } else {
            // Create and append card elements for each job
            filteredData.slice(0, 12).forEach((job) => {
                createJobCard(job);
            });
            localStorage.setItem("jobData", JSON.stringify(filteredData));
        }
    }
   
}

// Add event listener to the search button
const searchButton = document.getElementById("searchButton");
if (searchButton){
    searchButton.addEventListener("click", async () => {
        console.log("click");
        const jobData = await fetchJobData();
        const searchText = document.getElementById("searchInput").value;
        const searchLocationText = document.getElementById("searchLocationInput").value;
        const fullTimeFilterCheckbox = document.getElementById("fulltime");
        updateJobCards(jobData, fullTimeFilterCheckbox.checked, searchText, searchLocationText);
    });
}

const searchButton2 = document.getElementById("searchButton2");
if(searchButton2){
    searchButton2.addEventListener("click", async () => {
        const jobData = await fetchJobData();
        const searchText = document.getElementById("searchInput").value;
        const fullTimeFilterCheckbox = (searchLocationText = "");
        updateJobCards(jobData, false, searchText, searchLocationText);
    });
}


// Initial load of job cards
fetchJobData().then((data) => {
    updateJobCards(data, false, ""); // Show all jobs initially
});



// Step 1: Open the modal when options-button is clicked
const optionsButton = document.querySelector(".options-button");
const modal = document.getElementById("optionsModal");

const overlay = document.querySelector(".modal-overlay");
if(optionsButton){
    optionsButton.addEventListener("click", () => {
        // Show the modal
        modal.classList.add("show-modal");
        overlay.style.display = "block";
        document.body.style.overflow = "hidden";
    });
}

// Function to close the modal and hide the overlay
function closeModal() {
    modal.classList.remove("show-modal");
    overlay.style.display = "none";
    document.body.style.overflow = "auto"; // Restore scrolling when modal is closed
}

// Attach click event listeners to open and close the modal
overlay.addEventListener("click", closeModal);

// Step 2: Perform a search when the modal search button is clicked
// const searchButtonInModal = document.querySelector('.search-button');
const searchButtonInModal = document.getElementById("searchButton3");
if(searchButtonInModal){
    searchButtonInModal.addEventListener("click", async () => {
        // Get the search text and other inputs from the modal
        const searchLocationText = document.getElementById("modalSearchInput").value;
        const searchText = document.getElementById("searchInput").value;
        const fullTimeFilterCheckbox = document.getElementById("modalFullTime");
        console.log(searchText, searchLocationText);
        // Close the modal
        closeModal();
    
        // Perform the search with the provided inputs using the updateJobCards function
        const jobData = await fetchJobData(); // Fetch job data
        updateJobCards(jobData, fullTimeFilterCheckbox.checked, searchText, searchLocationText);
    });
}

