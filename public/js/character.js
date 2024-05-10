document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const characterUrl = urlParams.get('id');

    const characterDetailsContainer = document.getElementById('character-details');
    characterDetailsContainer.innerHTML = `
    <a href="index.html" class="back-button">Back</a>
    <p>Loading character details...</p>
    `;

    if (characterUrl) {
        fetch(characterUrl)
            .then(response => response.json())
            .then(async character => {

                // Make multiple requests for lists of URLs
                for (const key in character) {
                    if (Array.isArray(character[key])) {
                        character[key] = await Promise.all(character[key].map(url => fetchData(url)));
                        if (character[key].length > 0) {
                            if (key === "films") {
                                character[key] = character[key].map(item => item.title);
                            } else {
                                character[key] = character[key].map(item => item.name);
                            }
                        }
                    } else if (typeof character[key] === 'string' && character[key].startsWith('https://swapi.dev/api/')) {
                        if (key === "homeworld") {
                            character[key] = await fetchData(character[key]);
                            character[key] = character[key].name;
                        }
                    }
                }

                // Generate HTML for character details
                characterDetailsContainer.innerHTML = `
                <a href="index.html" class="back-button">Back</a>
                <div class="image-container">
                    <img src="${getCharacterImageUrl(character.url)}" alt="${character.name}">
                </div>
                `
                characterDetailsContainer.innerHTML += `<h1>${character.name}</h1>`;
                Object.entries(character).forEach(([key, value]) => {
                    let fieldValue;
                    
                    // Skip these fields
                    let fieldsToSkip = ["name", "created", "edited", "url"];
                    if (fieldsToSkip.includes(key)) {
                        return;
                    }

                    // Format the field value
                    if (Array.isArray(value)) {
                        if (value.length > 0 && typeof value[0] === 'string') {
                            fieldValue = `<ul>${value.map(item => `<li>${item}</li>`).join('')}</ul>`;
                        } else {
                            fieldValue = `<ul>N/A</ul>`;
                        }
                    } else {
                        fieldValue = value;
                    }
                    characterDetailsContainer.innerHTML += `<p><strong>${key}:</strong> ${fieldValue}</p>`;
                });

            })
            .catch(error => console.error('Error fetching character details:', error));
    } else {
        characterDetailsContainer.innerHTML = '<p>No character ID provided</p>';
    }
});


async function fetchData(url) {
try {
        const response = await fetch(url);
        return response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};

function getCharacterImageUrl(characterUrl) {
    // Decode the characterUrl
    const decodedUrl = decodeURIComponent(characterUrl);
    console.log(`Decoded URL: ${decodedUrl}`);
    
    // Extract ID from URL
    const urlObj = new URL(decodedUrl);
    const path = urlObj.pathname;
    const pathArr = path.split('/');
    const id = pathArr[pathArr.length - 2];
    console.log(`Extracted ID: ${id}`);
    
    // Submit request to fetch character image
    const characterImageUrl = `https://raw.githubusercontent.com/vieraboschkova/swapi-gallery/main/static/assets/img/people/${id}.jpg`;
    return characterImageUrl;
}
