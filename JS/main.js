import pokemon from 'pokemontcgsdk';
import twilightMasqueradeLogo from '../assets/sv6-logo.png';
import loadingGif from '../assets/loading-gif.gif';

pokemon.configure({ apiKey: process.env.API_KEY });
let sets = [];

function fetchSetData() {
    pokemon.set.all()
        .then(response => {
            sets = response.map(set => {
                let cardIds = Array.from({ length: set.printedTotal }, (_,i) => i + 1).map(num => `${set.id}-${num}`);
                let logo = set.images.logo;
                
                // If the set name is "Twilight Masquerade", replace the logo URL
                if (set.name === 'Twilight Masquerade') {
                    logo = twilightMasqueradeLogo;
                }
                return {
                    id: set.id,
                    name: set.name,
                    series: set.series,
                    releaseDate: set.releaseDate,
                    symbol: set.images.symbol,
                    logo: logo,
                    cardIds: cardIds
                }
            });
            
            sets = sortSets(sets, 'asc');
            
            // Extract the unique series names
            const series = [...new Set(sets.map(set => set.series))];

            // Get the series dropdown
            const seriesDropdown = document.getElementById('series-options');

            // Create an option for each series
            series.forEach(series => {
                const option = document.createElement('option');
                option.value = series;
                option.textContent = series;
                seriesDropdown.appendChild(option);
            });

            // When the series dropdown changes
            seriesDropdown.addEventListener('change', (event) => {
                // If "All Series" is selected, display all sets
                if (event.target.value === 'all') {
                    displaySets(sets);
                } else {
                    // Otherwise, filter the sets by the selected series
                    const filteredSets = sets.filter(set => set.series === event.target.value);
                    displaySets(filteredSets);
                }
            });
            
            // Assuming your search bar has the id 'search-bar'
            const searchBar = document.getElementById('search-bar');

            // When the search bar input changes
            searchBar.addEventListener('input', (event) => {
                // Get the selected series
                const selectedSeries = document.getElementById('series-options').value;

                // If a series is selected and it's not "All Series", filter the sets by the selected series
                let setsToSearch = sets;
                if (selectedSeries && selectedSeries !== 'all') {
                    setsToSearch = sets.filter(set => set.series === selectedSeries);
                }

                // Search the setsToSearch by the search bar input
                const filteredSets = setsToSearch.filter(set => set.name.toLowerCase().includes(event.target.value.toLowerCase()));
                displaySets(filteredSets);
            });

            displaySets(sets);

             // Get the search bar and dropdowns
            let searchBarInput = document.getElementById('search-bar');
            let dropdown1 = document.getElementById('sort-options');
            let dropdown2 = document.getElementById('series-options');

            // Add event listeners to the search bar and dropdowns
            searchBarInput.addEventListener('input', removeBackButton);
            dropdown1.addEventListener('change', removeBackButton);
            dropdown2.addEventListener('change', removeBackButton);
            
        })
        .catch(error => console.error(error));
}

function displaySets(filteredSets) {
    let grid = document.getElementById('grid');
    grid.innerHTML = ''; // Clear the grid

    filteredSets.forEach(set => {
        let item = document.createElement('a');
        item.className = 'grid-item';
        item.href = `#`;
        item.innerHTML = `
            <img src="${set.logo}" class="logo" alt="${set.name} logo">
            <div class="set-info">
                <img src="${set.symbol}" class="symbol" alt="${set.name} symbol">
                <h2>${set.name}</h2>
            </div>
            <p>Release date: ${set.releaseDate}</p>
            <p>ID: ${set.id}</p>
        `;

        // Add an event listener to each set item
        item.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default link behavior
            grid.innerHTML = '';
            fetchCardData(set.cardIds); // Fetch the cards for the clicked set
        });

        grid.appendChild(item);
    });
}
// pokemon.card.find('base1-1').then(card => {
//     console.log(card) // "Charizard"
// })
function fetchCardData(cardIds) {
    let grid = document.getElementById('grid');
    
    // Create a loading message
    let loadingMessage = document.createElement('img');
    loadingMessage.className = 'loading-message';
    loadingMessage.src = loadingGif;
    grid.appendChild(loadingMessage);

    // Fetch each card using its ID
    Promise.all(cardIds.map(id => pokemon.card.find(id)))
        .then(cards => {
            grid.removeChild(loadingMessage); // Remove the loading message
            displayCards(cards);
        })
        .catch(error => {
            grid.removeChild(loadingMessage); // Remove the loading message
            console.error(error);
        });
}

function displayCards(cards) {
    let grid = document.getElementById('grid');
    grid.innerHTML = ''; // Clear the grid

    // Create a "Back" button
    let backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.textContent = 'Back to sets';
    backButton.addEventListener('click', () => {
        fetchSetData()
        searchBar.removeChild(backButton)
    });

    // Append the "Back" button to the search bar div
    let searchBar = document.getElementById('search-container');
    searchBar.appendChild(backButton);

    cards.forEach(card => {
        let item = document.createElement('a');
        item.className = 'grid-item--card';
        item.href = `#`;
        item.innerHTML = `
            <img src="${card.images.small}" class="card-image" alt="${card.name}">
        `;

        grid.appendChild(item);
    });
}

fetchSetData();

const searchBar = document.getElementById('search-bar');

searchBar.addEventListener('input', (event) => {
    // Get the selected series
    const selectedSeries = document.getElementById('series-options').value;

    // If a series is selected, filter the sets by the selected series
    let setsToSearch = sets;
    if (selectedSeries) {
        setsToSearch = sets.filter(set => set.series === selectedSeries);
    }

    // Search the setsToSearch by the search bar input
    const filteredSets = setsToSearch.filter(set => set.name.toLowerCase().includes(event.target.value.toLowerCase()));
    displaySets(filteredSets);
});

// Add the dropdown functionality
const sortOptions = document.getElementById('sort-options');

// When the sort options change
sortOptions.addEventListener('change', (event) => {
    // Store the new sort state in the localStorage
    localStorage.setItem('sortState', event.target.value);
    sets = sortSets(sets, event.target.value);
    displaySets(sets);
});

function sortSets(sets, sortState) {
    let sortedSets = [...sets]; // Create a copy of the sets array

    if (sortState === 'asc') {
        sortedSets.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
    } else if (sortState === 'desc') {
        sortedSets.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    }

    return sortedSets;
}

// When the page loads
window.onload = function() {
    // Reset the dropdown's value to its default
    document.getElementById('sort-options').selectedIndex = 0;
};

// Function to remove the "Back" button
function removeBackButton() {
    let backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.parentNode.removeChild(backButton);
    }
}