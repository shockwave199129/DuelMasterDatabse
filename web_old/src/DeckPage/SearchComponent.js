import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import 'bootstrap';
import * as reactstrap from "reactstrap";

function SearchComponent(props) {
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
        sort_by: 'name',
        sort_order: 'asc',
    });
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage, setCardsPerPage] = useState(15);
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = Object.values(searchResults).slice(indexOfFirstCard, indexOfLastCard);

    const [tooltipOpen, setTooltipOpen] = useState(false);

    const toggle = () => setTooltipOpen(!tooltipOpen);

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
        Swal.fire({
            title: "Loading...",
            text: "Please wait while we load the data",
            showConfirmButton: false,
            allowOutsideClick: false
        });
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
        setCurrentPage(1);
    };



    if (Object.keys(civilizations).length > 0 &&
        Object.keys(races).length > 0 &&
        Object.keys(manacosts).length > 0 &&
        Object.keys(cardtypes).length > 0 &&
        Object.keys(categories).length > 0) {
        Swal.close();

        return (
            <>
                <reactstrap.Col outline>
                    <reactstrap.CardBody>
                        <reactstrap.CardTitle tag="h2" style={{ "textAlign": "center" }}>
                            Search for Cards
                        </reactstrap.CardTitle>
                        <reactstrap.Form onSubmit={handleFormSubmit}>
                            <reactstrap.Row>
                                <reactstrap.Col md={6} xs={12}>
                                    <reactstrap.FormGroup>
                                        <reactstrap.Label for='name'>Name:</reactstrap.Label>
                                        <reactstrap.Input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={searchParams.name}
                                            onChange={handleInputChange}
                                        />
                                    </reactstrap.FormGroup>
                                </reactstrap.Col>
                                <reactstrap.Col md={6} xs={12}>
                                    <reactstrap.FormGroup>
                                        <reactstrap.Label for='civilization'>Civilization:</reactstrap.Label>
                                        <reactstrap.Input
                                            type="select"
                                            id="civilization"
                                            name="civilization"
                                            value={searchParams.civilization}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">-- Select a civilization --</option>
                                            {Object.values(civilizations).map((civilization) => (
                                                <option key={civilization} value={civilization}>
                                                    {civilization}
                                                </option>
                                            ))}
                                        </reactstrap.Input>
                                    </reactstrap.FormGroup>
                                </reactstrap.Col>
                            </reactstrap.Row>
                            <reactstrap.Row>
                                <reactstrap.Col md={6} xs={12}>
                                    <reactstrap.FormGroup>
                                        <reactstrap.Label for='race'>Race:</reactstrap.Label>
                                        <reactstrap.Input
                                            type="select"
                                            id="race"
                                            name="race"
                                            value={searchParams.race}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">-- Select a race --</option>
                                            {Object.values(races).map((race) => (
                                                <option key={race} value={race}>
                                                    {race}
                                                </option>
                                            ))}
                                        </reactstrap.Input>
                                    </reactstrap.FormGroup>
                                </reactstrap.Col>
                                <reactstrap.Col md={6} xs={12}>
                                    <reactstrap.FormGroup>
                                        <reactstrap.Label for='cost'>Cost:</reactstrap.Label>
                                        <reactstrap.Input
                                            type="select"
                                            id="cost"
                                            name="cost"
                                            value={searchParams.cost}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">-- Select a cost --</option>
                                            {Object.values(manacosts).map((manacost) => (
                                                <option key={manacost} value={manacost}>
                                                    {manacost}
                                                </option>
                                            ))}
                                        </reactstrap.Input>
                                    </reactstrap.FormGroup>
                                </reactstrap.Col>
                            </reactstrap.Row>
                            <reactstrap.FormGroup>
                                <reactstrap.Label for='text'>Text:</reactstrap.Label>
                                <reactstrap.Input
                                    type="text"
                                    id="text"
                                    name="text"
                                    value={searchParams.text}
                                    onChange={handleInputChange}
                                />
                            </reactstrap.FormGroup>
                            <reactstrap.Row>
                                <reactstrap.Col md={6} xs={12}>
                                    <reactstrap.FormGroup>
                                        <reactstrap.Label for='cardtype'>Card Type:</reactstrap.Label>
                                        <reactstrap.Input
                                            type="select"
                                            id="cardtype"
                                            name="cardtype"
                                            value={searchParams.cardtype}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">-- Select a card type --</option>
                                            {Object.values(cardtypes).map((cardtype) => (
                                                <option key={cardtype} value={cardtype}>
                                                    {cardtype}
                                                </option>
                                            ))}
                                        </reactstrap.Input>
                                    </reactstrap.FormGroup>
                                </reactstrap.Col>
                                <reactstrap.Col md={6} xs={12}>
                                    <reactstrap.FormGroup>
                                        <reactstrap.Label for='category'>Category:</reactstrap.Label>
                                        <reactstrap.Input
                                            type="select"
                                            id="category"
                                            name="category"
                                            value={searchParams.category}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">-- Select a category --</option>
                                            {Object.values(categories).map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </reactstrap.Input>
                                    </reactstrap.FormGroup>
                                </reactstrap.Col>
                            </reactstrap.Row>
                            <reactstrap.FormGroup>
                                <reactstrap.Label for='ocg_set'>Set:</reactstrap.Label>
                                <reactstrap.Input
                                    type="select"
                                    id="ocg_set"
                                    name="ocg_set"
                                    value={searchParams.ocg_set}
                                    onChange={handleInputChange}
                                >
                                    <option value="">-- Select a set --</option>
                                    {Object.values(sets).map((set) => (
                                        <option key={set} value={set}>
                                            {set}
                                        </option>
                                    ))}
                                </reactstrap.Input>
                            </reactstrap.FormGroup>
                            <reactstrap.Row>
                                <reactstrap.Col md={12} className='p-3 text-center'>
                                    <reactstrap.Button
                                        color="primary"
                                        tag="input"
                                        type="submit"
                                        value="Search" />
                                </reactstrap.Col>
                            </reactstrap.Row>
                        </reactstrap.Form>
                    </reactstrap.CardBody>
                </reactstrap.Col>
                <reactstrap.Col outline className='mt-2'>
                    <reactstrap.CardBody>
                        <reactstrap.ListGroup>
                            {currentCards.map((card) => (
                                <reactstrap.ListGroupItem
                                    tag="button"
                                    key={card.Card.id}
                                    className='text-sm-start'
                                    id={'Tooltip-' + card.Card.id}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        props.handler(card);
                                    }}
                                >
                                    {card.Card.name} ({card.Card.civilization})
                                </reactstrap.ListGroupItem>
                            ))}
                        </reactstrap.ListGroup>
                        <reactstrap.Pagination size="sm" listClassName="flex-wrap justify-content-center">
                            <reactstrap.PaginationItem disabled={currentPage === 1}>
                                <reactstrap.PaginationLink onClick={() => setCurrentPage(currentPage - 1)} previous />
                            </reactstrap.PaginationItem>
                            {Array.from({ length: Math.ceil(Object.values(searchResults).length / cardsPerPage) }, (_, i) => (
                                <reactstrap.PaginationItem active={i + 1 === currentPage} key={i}>
                                    <reactstrap.PaginationLink onClick={() => setCurrentPage(i + 1)}>
                                        {i + 1}
                                    </reactstrap.PaginationLink>
                                </reactstrap.PaginationItem>
                            ))}
                            <reactstrap.PaginationItem disabled={currentPage === Math.ceil(Object.values(searchResults).length / cardsPerPage)}>
                                <reactstrap.PaginationLink onClick={() => setCurrentPage(currentPage + 1)} next />
                            </reactstrap.PaginationItem>
                        </reactstrap.Pagination>
                    </reactstrap.CardBody>
                </reactstrap.Col>
            </>
        );
    };
}

export default SearchComponent;