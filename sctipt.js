// Function to toggle the theme and store the preference in localStorage
function toggleTheme() {
    const circle = document.getElementById('circle');
    const currentTheme = localStorage.getItem('theme'); // Get the current theme from localStorage

    // Toggle the theme based on the current state
    if (currentTheme === 'dark') {
        circle.setAttribute('cx', '48'); // Return the circle to its original position
        document.body.classList.remove('theme-dark'); // Remove dark theme class from body
        document.body.classList.add('theme-light'); // Add light theme class to body




        const searchInputs = document.querySelectorAll('.search-area');
        searchInputs.forEach(input => {
            input.classList.remove('theme-dark');
            input.classList.add('theme-light');
        });


        localStorage.setItem('theme', 'light'); // Update theme preference in localStorage
    } else {
        circle.setAttribute('cx', '70'); // Move the circle to a new position
        document.body.classList.remove('theme-light'); // Remove light theme class from body
        document.body.classList.add('theme-dark'); // Add dark theme class to body



        // Apply the "search-area" class to elements
        const searchInputs = document.querySelectorAll('.search-area');
        searchInputs.forEach(input => {
            input.classList.remove('theme-light');
            input.classList.add('theme-dark');
        });

        localStorage.setItem('theme', 'dark'); // Update theme preference in localStorage
    }
}

// Function to initialize the theme based on localStorage
function initializeTheme() {
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        // Apply dark theme
        document.body.classList.add('theme-dark'); // Add dark theme class to body
        const circle = document.getElementById('circle');
        circle.setAttribute('cx', '70'); // Move the circle to its dark mode position
    } else {
        // Apply light theme (default)
        document.body.classList.add('theme-light'); // Add light theme class to body
        const circle = document.getElementById('circle');
        circle.setAttribute('cx', '48'); // Move the circle to its light mode position
    }
}




















// Call initializeTheme to set the initial theme
initializeTheme();

// Add a click event listener to the theme toggle button
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', toggleTheme);


// Function to fetch JSON data
async function fetchJobData() {
    try {
        const response = await fetch('data.json'); // Replace with the path to your JSON file
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
}




// Function to create a card element for a job listing
function createJobCard(job) {
    const cardContainer = document.querySelector('.card-container');

    const card = document.createElement('div');
    card.classList.add('card');



    card.addEventListener('click', () => {
        // Trigger an alert with the job information when the card is clicked
        alert(`You clicked on job: ${job.position} at ${job.company}`);
    });


     // Apply the appropriate theme class based on the current theme
     const currentTheme = localStorage.getItem('theme');
     if (currentTheme === 'dark') {
         card.classList.add('dark-theme');
     } else {
         card.classList.add('light-theme');
     }




    // Create card content using job data
    card.innerHTML = `
        <div class="icon-container">
            <img src="${job.logo}" alt="Icon" class="icon" style="background-color:${job.logoBackground}" >
        </div>
        <p style="color: #6E8098;">${job.postedAt}</p>
        <p style="color: #6E8098;">${job.contract}</p>
        <h2>${job.position}</h2>
        <p style="color: #6E8098;">${job.company}</p>
        <p style="color: blue">${job.location}</p>
        <!-- Add other job details here -->
    `;

    // Append the card to the container
    cardContainer.appendChild(card);
}



function updateJobCards(data, showFullTime, searchText,searchLocationText) {
    const cardContainer = document.querySelector('.card-container');
    cardContainer.innerHTML = ''; // Clear existing cards

    const filteredData = data.filter(job => {
        // Filter by contract type
        if (showFullTime && job.contract !== 'Full Time') {
            return false;
        }
        // Filter by search text
        if (searchText && !job.position.toLowerCase().includes(searchText.toLowerCase())) {
            return false;
        }
         // Filter by search location text
         if (searchLocationText && !job.location.toLowerCase().includes(searchLocationText.toLowerCase())) {
            return false;
        }
        return true;
    });

    if (filteredData.length === 0) {
        // No search results found, display the modal
        const modal = document.getElementById('myModal');
        modal.style.display = 'block';

        // Add an event listener to close the modal when the user clicks the close button
        const closeButton = document.querySelector('.close');
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';

             // Retrieve job data from local storage and recreate cards
             const jobDataFromStorage = JSON.parse(localStorage.getItem('jobData'));
             if (jobDataFromStorage) {
                 jobDataFromStorage.slice(0, 12).forEach(job => {
                     createJobCard(job);
                 });
             }
        });
    } else {
        // Create and append card elements for each job
        filteredData.slice(0, 12).forEach(job => {
            createJobCard(job);
        });
        localStorage.setItem('jobData', JSON.stringify(filteredData));
    }
}


// Add event listener to the search button
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', async () => {
    const jobData = await fetchJobData();
    const searchText = document.getElementById('searchInput').value;
    const searchLocationText = document.getElementById('searchLocationInput').value;
    const fullTimeFilterCheckbox = document.getElementById('fulltime');
    updateJobCards(jobData, fullTimeFilterCheckbox.checked, searchText, searchLocationText);
});

// Initial load of job cards
fetchJobData().then(data => {
    updateJobCards(data, false, ''); // Show all jobs initially
});








// Function to populate job details based on the job ID
function populateJobDetails(jobId) {
    // Assuming you have already fetched the JSON data and stored it in a variable called 'jobData'
    const job = jobData.find(job => job.id === jobId);

    // Check if a job with the given ID exists
    if (job) {
        // Access the HTML elements for the job details section and populate them with the job data
        const jobDetailsContainer = document.querySelector('.job-details');
        jobDetailsContainer.innerHTML = `
            <!-- Job title bar -->
            <div class="job-title-bar">
                <img src="${job.logo}" alt="${job.company} Logo">
                <div class="company-info">
                    <h3>${job.company}</h3>
                    <p>Company Website: <a href="${job.website}" target="_blank">${job.website}</a></p>
                    <button class="company-site-button">Company Site</button>
                </div>
            </div>
            
            <!-- Job details -->
            <div class="job-details">
                <div class="job-info">
                    <p><strong>Posted at:</strong> ${job.postedAt}</p>
                    <p><strong>Contract:</strong> ${job.contract}</p>
                    <h2>${job.position}</h2>
                    <p><strong>Location:</strong> ${job.location}</p>
                </div>
                <button class="apply-button">Apply Now</button>
            </div>
            
            <!-- Job description -->
            <div class="job-description">
                <h3>Job Description</h3>
                <p>${job.description}</p>
            </div>
            
            <!-- Job requirements -->
            <div class="job-requirements">
                <h3>Requirements</h3>
                <ul>
                    ${job.requirements.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;
        
        // Scroll to the job details section
        jobDetailsContainer.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.error(`Job with ID ${jobId} not found.`);
    }
}

// Assuming you have an array of job cards with unique job IDs, you can add a click event to each card
const jobCards = document.querySelectorAll('.card');

jobCards.forEach((card) => {
    card.addEventListener('click', () => {
        // Get the job ID associated with the clicked card (you should have this information in your HTML or data)
        const jobId = card.getAttribute('data-job-id'); // Replace with the actual attribute name containing the job ID

        // Call the function to populate job details based on the job ID
        populateJobDetails(jobId);
    });
});
