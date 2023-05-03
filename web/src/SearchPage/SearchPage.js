import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import 'bootstrap';
import IndexNavbar from "../components/Navbars/IndexNavbar.js";
import IndexHeader from "../components/Headers/IndexHeader.js";
import DemoFooter from "../components/Footers/DemoFooter.js";
import * as reactstrap from "reactstrap";

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
        sort_by: 'name',
        sort_order: 'asc',
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
        console.log(response.data)
        setSearchResults(response.data);
    };

    if (Object.keys(civilizations).length > 0 &&
        Object.keys(races).length > 0 &&
        Object.keys(manacosts).length > 0 &&
        Object.keys(cardtypes).length > 0 &&
        Object.keys(categories).length > 0) {
        Swal.close();

        return (
            <>

                <IndexNavbar />
                <IndexHeader />
                <reactstrap.Container>
                    <div>
                        <reactstrap.Card outline>
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
                                        <reactstrap.Col md={6} xs={12}>
                                            <reactstrap.FormGroup>
                                                <reactstrap.Label for='sort_by'>Sort By:</reactstrap.Label>
                                                <reactstrap.Input
                                                    type="select"
                                                    id="sort_by"
                                                    name="sort_by"
                                                    value={searchParams.sort_by}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">-- Select a sort option --</option>
                                                    <option value="manacost">Mana Cost</option>
                                                    <option value="name">Name</option>
                                                </reactstrap.Input>
                                            </reactstrap.FormGroup>
                                        </reactstrap.Col>
                                        <reactstrap.Col md={6} xs={12}>
                                            <reactstrap.FormGroup>
                                                <reactstrap.Label for='sort_order'>Sort Order:</reactstrap.Label>
                                                <reactstrap.Input
                                                    type="select"
                                                    id="sort_order"
                                                    name="sort_order"
                                                    value={searchParams.sort_order}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">-- Select a sort order --</option>
                                                    <option value="asc">Ascending</option>
                                                    <option value="desc">Descending</option>
                                                </reactstrap.Input>
                                            </reactstrap.FormGroup>
                                        </reactstrap.Col>
                                    </reactstrap.Row>
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
                        </reactstrap.Card>
                        <reactstrap.Card outline className='mt-5'>
                            <reactstrap.CardTitle tag="h2" style={{ "textAlign": "center" }}>
                                Search Results:
                            </reactstrap.CardTitle>
                            <reactstrap.CardBody>
                                <reactstrap.ListGroup>
                                    {Object.values(searchResults).map((card) => (
                                        <reactstrap.ListGroupItem
                                            href={`/details/${card.Card.id}`}
                                            tag="a"
                                            key={card.Card.id}
                                        >
                                            {card.Card.name} ({card.Card.civilization})
                                        </reactstrap.ListGroupItem>
                                    ))}
                                </reactstrap.ListGroup>
                            </reactstrap.CardBody>
                        </reactstrap.Card>
                    </div>
                </reactstrap.Container>
                <DemoFooter />
            </>
        );
    } else {
        return null;
    }
}
export default SearchPage;
