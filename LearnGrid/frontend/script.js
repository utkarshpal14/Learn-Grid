document.addEventListener('DOMContentLoaded', () => {
    const skillForm = document.getElementById('skill-form');
    const skillInput = document.getElementById('skill-input');
    const roadmapContainer = document.getElementById('roadmap-container');
    const loader = document.getElementById('loading-spinner');

    skillForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const skill = skillInput.value.trim();
        if (!skill) return;

        roadmapContainer.innerHTML = '';
        loader.classList.remove('hidden');

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/roadmap?skill=${encodeURIComponent(skill)}&quiz=true`);
            const data = await response.json();
            console.log("API Response:", data);

            loader.classList.add('hidden');

            if (data.error) {
                roadmapContainer.innerHTML = `<p class="error">Error: ${data.error}</p>`;
            } else {
                displayRoadmap(data);
            }
        } catch (err) {
            loader.classList.add('hidden');
            roadmapContainer.innerHTML = `<p class="error">Failed to fetch roadmap. Check your backend.</p>`;
            console.error(err);
        }
    });

    function displayRoadmap(data) {
        roadmapContainer.innerHTML = '';

        const header = document.createElement('h2');
        header.className = 'roadmap-header';
        header.innerHTML = `Learning Path for <span>${data.skill}</span>`;
        roadmapContainer.appendChild(header);

        data.modules.forEach(module => {
            const moduleDiv = document.createElement('div');
            moduleDiv.className = 'module';

            const moduleHeader = document.createElement('div');
            moduleHeader.className = 'module-header';
            moduleHeader.textContent = module.title;

            const moduleContent = document.createElement('div');
            moduleContent.className = 'module-content';

            const subtopicList = document.createElement('ul');
            subtopicList.className = 'subtopic-list';

            module.subtopics.forEach(subtopic => {
                const listItem = document.createElement('li');

                const titleSpan = document.createElement('span');
                titleSpan.textContent = subtopic.title;

                const youtubeLink = document.createElement('a');
                youtubeLink.className = 'youtube-link';
                youtubeLink.textContent = 'Find on YouTube';
                youtubeLink.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(subtopic.resources.youtube)}`;
                youtubeLink.target = '_blank';

                listItem.appendChild(titleSpan);
                listItem.appendChild(youtubeLink);

                if (subtopic.quiz) {
                    const quizDiv = document.createElement('div');
                    quizDiv.className = 'quiz';
                    quizDiv.innerHTML = `
                        <strong>Quiz:</strong> ${subtopic.quiz.question}<br>
                        ${subtopic.quiz.options.map(opt => `<div>- ${opt}</div>`).join('')}
                        <div><em>Answer:</em> ${subtopic.quiz.answer}</div>
                    `;
                    listItem.appendChild(quizDiv);
                }

                subtopicList.appendChild(listItem);
            });

            moduleContent.appendChild(subtopicList);
            moduleDiv.appendChild(moduleHeader);
            moduleDiv.appendChild(moduleContent);
            roadmapContainer.appendChild(moduleDiv);

            moduleHeader.addEventListener('click', () => {
                moduleDiv.classList.toggle('active');
                moduleContent.style.maxHeight = moduleContent.style.maxHeight ? null : moduleContent.scrollHeight + "px";
            });
        });
    }
});
