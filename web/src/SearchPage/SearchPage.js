import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import 'bootstrap';
import IndexNavbar from "../components/Navbars/IndexNavbar.js";
import IndexHeader from "../components/Headers/IndexHeader.js";
import DemoFooter from "../components/Footers/DemoFooter.js";
import * as reactstrap from "reactstrap";
import json2csv from 'json2csv';
import { saveAs } from 'file-saver';
import './style.css';
import $ from 'jquery';

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
    const [cardDetails, setCardDetails] = useState({});
    const [currentDisplayCard, setCurrentDisplayCard] = useState();

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
    };

    const handleCardClick = async (cardId) => {
        const cardResponse = await axios.get(`http://localhost:8000/card-details/${cardId}`);
        setCardDetails(cardResponse.data);
        setCurrentDisplayCard(cardId);
        console.log($(".sidebar").hasClass("active"))

        if ($(".sidebar").hasClass("active") == false) {
            $(".sidebar").addClass("active");
            $(".sidebar-item").addClass("active");
        } else if (cardId == currentDisplayCard) {
            $(".sidebar").removeClass("active");
            $(".sidebar-item").removeClass("active");
        }
    };

    const handleCardDeatailClick = () => {
        if ($(".sidebar").hasClass("active")) {
            $(".sidebar").removeClass("active");
            $(".sidebar-item").removeClass("active");
        }
    }

    const handleKeyDown = (event) => {
        if (event.keyCode === 27) {
            handleCardDeatailClick()
        }
    }

    const handleDownloadCsv = () => {
        if (Object.keys(searchResults).length > 0) {
            const newArray = searchResults.map(obj => {
                return {
                    id: obj.Card.id,
                    civilization: obj.Card.civilization,
                    manacost: obj.Card.manacost,
                    power: obj.Card.power,
                    subtype: obj.Card.subtype,
                    link: obj.Card.link,
                    cardtype: obj.Card.cardtype,
                    name: obj.Card.name,
                    image: obj.Card.image,
                    race: obj.Card.race,
                    englishtext: obj.Card.englishtext,
                    mananumber: obj.Card.mananumber,
                    categories: obj.categories,
                    sets: obj.sets
                };
            });
            let csvFileName = 'DM_serach';
            for (const [key, value] of Object.entries(searchParams)) {
                if (value != '' && key != 'sort_by' && key != 'sort_order') {
                    csvFileName = csvFileName + '&' + key + '=' + value
                }
            }
            const csvData = json2csv.parse(newArray);
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
            saveAs(blob, csvFileName + '.csv');
        }
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
                <reactstrap.Container onKeyDown={handleKeyDown} style={{
                    "position":"relative",
                    "top":"-20vh"
                }}>
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
                                {Object.keys(searchResults).length > 0 && (
                                    <reactstrap.Col className='d-flex justify-content-end'>
                                        <reactstrap.Button onClick={(event) => {
                                            event.preventDefault();
                                            handleDownloadCsv();
                                        }}>
                                            <i className='fa fa-download'></i>
                                            Download as CSV
                                        </reactstrap.Button>
                                    </reactstrap.Col>
                                )}
                                <reactstrap.ListGroup>
                                    {Object.values(searchResults).map((card) => (
                                        <reactstrap.ListGroupItem
                                            href={`#card-${card.Card.id}`}
                                            tag="a"
                                            key={card.Card.id}
                                            onClick={(event) => {
                                                event.preventDefault();
                                                handleCardClick(card.Card.id);
                                            }}
                                        >
                                            {card.Card.name} ({card.Card.civilization})
                                        </reactstrap.ListGroupItem>
                                    ))}
                                </reactstrap.ListGroup>
                            </reactstrap.CardBody>
                        </reactstrap.Card>
                    </div>
                </reactstrap.Container>

                <reactstrap.Col md={6} xd={12} className='sidebar' onKeyDown={handleKeyDown}>
                    <div className='d-flex justify-content-start'>
                        <i
                            className='fa fa-times'
                            style={{ "fontSize": "25px", "paddingLeft": "20px", "cursor": "pointer" }}
                            onClick={(event) => {
                                event.preventDefault();
                                handleCardDeatailClick();
                            }}
                        ></i>
                    </div>
                    <reactstrap.Col md={12} className='sidebar-list'>
                        <reactstrap.Table bordered bgcolor='aliceblue' className='sidebar-item'>
                            {Object.keys(cardDetails).length > 0 && (
                                <tbody>
                                    <tr>
                                        <th scope='row' className='d-flex justify-content-center'>
                                            {cardDetails.Card.name}
                                        </th>
                                    </tr>
                                    <tr>
                                        <td className='d-flex justify-content-center'>
                                            <img src={cardDetails.Card.image} alt={cardDetails.Card.name} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='d-flex'>
                                            <reactstrap.Col md={6} className='text-center fw-bolder'><strong>Civilization:</strong></reactstrap.Col>
                                            <reactstrap.Col md={6}>{cardDetails.Card.civilization}</reactstrap.Col>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='d-flex'>
                                            <reactstrap.Col md={6} className='text-center fw-bolder'><strong>Type:</strong></reactstrap.Col>
                                            <reactstrap.Col md={6}>{cardDetails.Card.cardtype}</reactstrap.Col>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='d-flex'>
                                            <reactstrap.Col md={6} className='text-center fw-bolder'><strong>Race:</strong></reactstrap.Col>
                                            <reactstrap.Col md={6}>{JSON.parse(cardDetails.Card.race).join('/')}</reactstrap.Col>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='d-flex'>
                                            <reactstrap.Col md={6} className='text-center fw-bolder'><strong>Cost:</strong></reactstrap.Col>
                                            <reactstrap.Col md={6}>{cardDetails.Card.manacost}</reactstrap.Col>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='d-flex'>
                                            <reactstrap.Col md={6} className='text-center fw-bolder'><strong>Text:</strong></reactstrap.Col>
                                            <reactstrap.Col md={6}>{cardDetails.Card.englishtext}</reactstrap.Col>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='d-flex'>
                                            <reactstrap.Col md={6} className='text-center fw-bolder'><strong>Mana:</strong></reactstrap.Col>
                                            <reactstrap.Col md={6}>{cardDetails.Card.mananumber}</reactstrap.Col>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='d-flex'>
                                            <reactstrap.Col md={6} className='text-center fw-bolder'><strong>Categories:</strong></reactstrap.Col>
                                            <reactstrap.Col md={6}>{JSON.parse(cardDetails.categories).join('/')}</reactstrap.Col>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='d-flex'>
                                            <reactstrap.Col md={6} className='text-center fw-bolder'><strong>Sets:</strong></reactstrap.Col>
                                            <reactstrap.Col md={6}>{cardDetails.set}</reactstrap.Col>
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </reactstrap.Table>
                    </reactstrap.Col>
                </reactstrap.Col >

                <DemoFooter />
            </>
        );
    } else {
        return null;
    }
}
export default SearchPage;
