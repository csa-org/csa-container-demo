document.addEventListener('DOMContentLoaded', () => {
    const charactersContainer = document.getElementById('characters');
    const containerIdElement = document.getElementById('containerId');
    charactersContainer.innerHTML = `
    <p>Loading character details...</p>
    `;
    getContainerId().then(containerId => {
        containerIdElement.innerHTML = `Container ID: ${containerId}`;
    });

    const eventSource = new EventSource('/characters');

    eventSource.onmessage = function (event) {
        if (charactersContainer.innerHTML.includes('Loading character details...')) {
            charactersContainer.innerHTML = '';
        }
        const characters = JSON.parse(event.data);
        characters.forEach(character => {
            const characterDiv = document.createElement('div');
            characterDiv.classList.add('character');
            characterDiv.innerHTML = `
                <h3>${character.name}</h3>
                <p>Height: ${character.height}</p>
                <p>Gender: ${character.gender}</p>
            `;
            characterDiv.addEventListener('click', () => {
                window.location.href = `/character.html?id=${encodeURIComponent(character.url)}`;
            });
            charactersContainer.appendChild(characterDiv);
        });
    };

    eventSource.onerror = function (error) {
        eventSource.close();
    };
});


async function getContainerId() {
    // Returns the containerId value from the "/versions" endpoint.
    const response = await fetch('/version');
    const data = await response.json();
    return data.containerId;
}