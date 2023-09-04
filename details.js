
let jobData;
// Function to populate job details based on the job ID
function populateJobDetails(jobId, jobData) {
    // Find the job with the given ID in the jobData
    const job = jobData.find((job) => job.id === parseInt(jobId, 10));
    console.log(job);

    // Check if a job with the given ID exists
    if (job) {
        // Access the HTML elements for the job details section and populate them with the job data
        const jobDetailsContainer = document.querySelector(".job-details");
        jobDetailsContainer.innerHTML = `

        <div class="job-details-one">
            <!-- Job title bar -->
            <div class="job-title-bar">
                <img src="${job.logo}" alt="${job.company} Logo" class="job-icon" style="background-color:${
            job.logoBackground
        }">
                <div class="company-details">
                    <div class="company-info">
                        <h3>${job.company}</h3>
                        <p>${job.company}.com"</p>                  
                    </div>
                    <div>
                        <button class="company-site-button">Company Site</button>
                    </div>
                </div>
            </div>
            
            <!-- Job details -->
            <div class="job-content">
            <div class="job-details-main">
                <div class="job-info">
                <div class="job-info-time">
                    <p> ${job.postedAt}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4" fill="none">
  <circle cx="2" cy="2" r="2" fill="#6E8098"/>
</svg>
                    <p> ${job.contract}</p>
                    </div>
                    <h2 class="jobposmobile">${job.position}</h2>
                    <p class="placeformobile"> ${job.location}</p>
                </div>
                <button class="apply-button">Apply Now</button>
            </div>
            
            <!-- Job description -->
            <div class="job-description">
               
                <p class="job-desc">${job.description}</p>
            </div>
            
            <!-- Job requirements -->
            <div class="job-requirements">
                <h3>Requirements</h3>
                <ul>
                    ${job.requirements.items.map((item) => `<li>${item}</li>`).join("")}
                </ul>
            </div>
           

            <!-- Job you do -->
            <div class="job-youdo">
                <h3>What You Will Do</h3>
                <ol>
                    ${job.role.items.map((item) => `<li>${item}</li>`).join("")}
                </ol>
            </div>
            </div>
            </div>

            <!--footer-->
            <div class="footer">
            <div class="footer-content">
                <div class="footer-col">
                    <h3>${job.position}</h3>
                    <span>So Digital Inc.</span>
                </div>
                <button class="apply-button">Apply Now</button>
            </div>
            </div>


        `;

        const cards = document.querySelectorAll(".card");
        cards.forEach((card) => {
            card.style.display = "none";
        });
        const searchAreas = document.querySelectorAll(".search-area");

        searchAreas.forEach((searchArea) => {
            searchArea.style.display = "none";
        });
        const loadmore = document.querySelectorAll(".loadmore-btn");
        loadmore.forEach((load) => {
            load.style.display = "none";
        });

        // Show the job details container
        jobDetailsContainer.style.display = "flex";
        // Scroll to the job details section
        // jobDetailsContainer.scrollIntoView({ behavior: "smooth" });
        localStorage.setItem("jobDetails", JSON.stringify(job));
    } else {
        console.error(`Job with ID ${jobId} not found.`);
    }
}

// for refresh
window.addEventListener('load', () => {
    const storedJobDetails = localStorage.getItem('jobDetails');
    if (storedJobDetails) {
        // Parse the stored data and populate the job details
        const job = JSON.parse(storedJobDetails);
        console.log(job)
        populateJobDetails(job.id,jobData);
    }
});