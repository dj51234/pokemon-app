import pokemon from 'pokemontcgsdk';
import twilightMasqueradeLogo from '../assets/sv6-logo.png';

pokemon.configure({ apiKey: 'd3eb1c23-a198-4e68-beff-6db7bea1e4b9' });

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

