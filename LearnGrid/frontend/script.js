document.addEventListener('DOMContentLoaded', () => {
    // Get references to the HTML elements we need to interact with
    const skillForm = document.getElementById('skill-form');
    const skillInput = document.getElementById('skill-input');
    const roadmapContainer = document.getElementById('roadmap-container');
    const loader = document.getElementById('loading-spinner');

    // --- MOCK DATA: This is a sample response we would get from our backend. ---
    // This allows us to build the frontend completely before the backend is ready.
    const sampleRoadmapData = {
        skill: "Python",
        modules: [
            {
                title: "Module 1: Python Fundamentals",
                subtopics: [
                    { title: "Variables & Data Types", resources: { youtube: "Python variables tutorial for beginners" } },
                    { title: "Control Flow (If/Else)", resources: { youtube: "Python if else statements" } },
                    { title: "Loops (For/While)", resources: { youtube: "Python for and while loops explained" } }
                ]
            },
            {
                title: "Module 2: Data Structures",
                subtopics: [
                    { title: "Lists and Tuples", resources: { youtube: "Python lists and tuples" } },
                    { title: "Dictionaries and Sets", resources: { youtube: "Python dictionaries guide" } }
                ]
            },
            {
                title: "Module 3: Functions & Modules",
                subtopics: [
                    { title: "Defining Functions", resources: { youtube: "Python functions tutorial" } },
                    { title: "Importing Modules", resources: { youtube: "Python import system explained" } }
                ]
            }
        ]
    };

    // Listen for the form submission
    skillForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the browser from reloading the page
        const skill = skillInput.value.trim();
        if (!skill) return; // Do nothing if the input is empty

        // --- Simulate an API call ---
        roadmapContainer.innerHTML = ''; // Clear any previous results
        loader.classList.remove('hidden'); // Show the loading spinner

        // We use setTimeout to pretend we are waiting for a server response
        setTimeout(() => {
            loader.classList.add('hidden'); // Hide the spinner
            displayRoadmap(sampleRoadmapData); // Display the roadmap using our sample data
        }, 1500); // Wait for 1.5 seconds
    });

    // This function builds the HTML for the roadmap and adds it to the page
    function displayRoadmap(data) {
        // Create the main header for the roadmap
        const header = document.createElement('h2');
        header.className = 'roadmap-header';
        header.innerHTML = `Learning Path for <span>${data.skill}</span>`;
        roadmapContainer.appendChild(header);

        // Loop through each module in the data
        data.modules.forEach(module => {
            const moduleDiv = document.createElement('div');
            moduleDiv.className = 'module';

            // Create the clickable header for the module
            const moduleHeader = document.createElement('div');
            moduleHeader.className = 'module-header';
            moduleHeader.textContent = module.title;
            
            // Create the content area for the subtopics (initially hidden)
            const moduleContent = document.createElement('div');
            moduleContent.className = 'module-content';
            
            const subtopicList = document.createElement('ul');
            subtopicList.className = 'subtopic-list';

            // Loop through each subtopic in the module
            module.subtopics.forEach(subtopic => {
                const listItem = document.createElement('li');
                
                const titleSpan = document.createElement('span');
                titleSpan.textContent = subtopic.title;
                
                // Create the "Find on YouTube" link
                const youtubeLink = document.createElement('a');
                youtubeLink.className = 'youtube-link';
                youtubeLink.textContent = 'Find on YouTube';
                youtubeLink.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(subtopic.resources.youtube)}`;
                youtubeLink.target = '_blank'; // Open link in a new tab
                
                listItem.appendChild(titleSpan);
                listItem.appendChild(youtubeLink);
                subtopicList.appendChild(listItem);
            });
            
            moduleContent.appendChild(subtopicList);
            moduleDiv.appendChild(moduleHeader);
            moduleDiv.appendChild(moduleContent);
            roadmapContainer.appendChild(moduleDiv);

            // Add the "accordion" click functionality to each module header
            moduleHeader.addEventListener('click', () => {
                moduleDiv.classList.toggle('active');
                // If the content is visible, hide it. Otherwise, show it.
                if (moduleContent.style.maxHeight) {
                    moduleContent.style.maxHeight = null;
                } else {
                    moduleContent.style.maxHeight = moduleContent.scrollHeight + "px";
                }
            });
        });
    }
});