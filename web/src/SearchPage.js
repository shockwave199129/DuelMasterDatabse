import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SearchPage() {
    const [civilizations, setCivilizations] = useState([]);
    const [races, setRaces] = useState([]);
    const [manacosts, setManacosts] = useState([]);
    const [cardtypes, setCardtypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sets, setSets] = useState([]);
    const [searchParams, setSearchParams] = useState({
        name: '',
        civilization: '',
        race: '',
        cost: '',
        text: '',
        cardtype: '',
        category: '',
        ocg_set: '',
        sort_by: '',
        sort_order: '',
    });
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const civilizationResponse = await axios.get('http://localhost:8000/get-civilization');
            setCivilizations(civilizationResponse.data);

            const raceResponse = await axios.get('http://localhost:8000/get-race');
            setRaces(raceResponse.data);

            const manacostResponse = await axios.get('http://localhost:8000/get-manacost');
            setManacosts(manacostResponse.data);

            const cardtypeResponse = await axios.get('http://localhost:8000/get-cardtype');
            setCardtypes(cardtypeResponse.data);

            const categoryResponse = await axios.get('http://localhost:8000/get-category');
            setCategories(categoryResponse.data);

            const setResponse = await axios.get('http://localhost:8000/get-set');
            setSets(setResponse.data);
        }
        fetchData();
    }, []);

    const handleInputChange = (event) => {
        setSearchParams((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const response = await axios.get('http://localhost:8000/card-search', { params: searchParams });
        setSearchResults(response.data);
    };

    return (
        <div>
            <h1>Search for Cards</h1>
            <form onSubmit={handleFormSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={searchParams.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor="civilization">Civilization:</label>
                    <select
                        id="civilization"
                        name="civilization"
                        value={searchParams.civilization}
                        onChange={handleInputChange}
                    >
                        <option value="">-- Select a civilization --</option>
                        {civilizations.length > 0 ? civilizations.map((civilization) => (
                            <option key={civilization} value={civilization}>
                                {civilization}
                            </option>
                        )):''}
                    </select>
                </div>
                <div>
                    <label htmlFor="race">Race:</label>
                    <select
                        id="race"
                        name="race"
                        value={searchParams.race}
                        onChange={handleInputChange}
                    >
                        <option value="">-- Select a race --</option>
                        {races.map((race) => (
                            <option key={race} value={race}>
                                {race}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="cost">Cost:</label>
                    <input
                        type="number"
                        id="cost"
                        name="cost"
                        value={searchParams.cost}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor="text">Text:</label>
                    <input
                        type="text"
                        id="text"
                        name="text"
                        value={searchParams.text}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor="cardtype">Card Type:</label>
                    <select
                        id="cardtype"
                        name="cardtype"
                        value={searchParams.cardtype}
                        onChange={handleInputChange}
                    >
                        <option value="">-- Select a card type --</option>
                        {cardtypes.map((cardtype) => (
                            <option key={cardtype} value={cardtype}>
                                {cardtype}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="category">Category:</label>
                    <select
                        id="category"
                        name="category"
                        value={searchParams.category}
                        onChange={handleInputChange}
                    >
                        <option value="">-- Select a category --</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="ocg_set">Set:</label>
                    <select
                        id="ocg_set"
                        name="ocg_set"
                        value={searchParams.ocg_set}
                        onChange={handleInputChange}
                    >
                        <option value="">-- Select a set --</option>
                        {sets.map((set) => (
                            <option key={set} value={set}>
                                {set}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="sort_by">Sort By:</label>
                    <select
                        id="sort_by"
                        name="sort_by"
                        value={searchParams.sort_by}
                        onChange={handleInputChange}
                    >
                        <option value="">-- Select a sort option --</option>
                        <option value="manacost">Mana Cost</option>
                        <option value="name">Name</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="sort_order">Sort Order:</label>
                    <select
                        id="sort_order"
                        name="sort_order"
                        value={searchParams.sort_order}
                        onChange={handleInputChange}
                    >
                        <option value="">-- Select a sort order --</option>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
                <button type="submit">Search</button>
            </form>
            <h2>Search Results:</h2>
            <ul>
                {searchResults.map((card) => (
                    <li key={card.id}>
                        {card.name} ({card.civilization})
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default SearchPage;
