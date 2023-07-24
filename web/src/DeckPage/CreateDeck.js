import React, { useState, useEffect } from 'react';
import 'bootstrap';
import IndexNavbar from "../components/Navbars/IndexNavbar.js";
import IndexHeader from "../components/Headers/IndexHeader.js";
import DemoFooter from "../components/Footers/DemoFooter.js";
import Swal from "sweetalert2";
import { Container, Col, Card, CardHeader, CardBody, Button, Row, Form, FormGroup, Label, Input, ListGroup, ListGroupItem } from 'reactstrap';

import SearchComponent from './SearchComponent.js';

function CreateDeck(props) {

    const [DeckDetails, setDeckDetails] = useState({});
    const [DeckDisplay, setDeckDisplay] = useState({});

    const handleClick = async (cardData) => {
        const count = DeckDetails[cardData.Card.id] || 0;
        const categories = JSON.parse(cardData.categories);
        if (categories.includes('Premium Hall of Fame card') || categories.includes('Disabled card')) {
            Swal.fire({
                icon: "error",
                text: "You can't have any copy of a card in the Premium Hall of Fame / Disabled in your deck",
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            return;
        } else if (categories.includes('Hall of Fame card') && count >= 1) {
            Swal.fire({
                icon: "error",
                text: "You can only have one copy of any card in the Hall of Fame in a deck",
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            return;
        }
        if (count >= 4) {
            Swal.fire({
                icon: "error",
                text: "you can't have more than 4 copys in a deck",
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            return;
        }
        setDeckDetails({
            ...DeckDetails,
            [cardData.Card.id]: count + 1
        });

        setDeckDisplay({
            ...DeckDisplay,
            [cardData.Card.name]: { "count": count + 1, "data": cardData.Card, "categories": cardData.categories }
        })

    };

    const handleDecreaseClick = async (cardData) => {
        const count = cardData.count || 0;
        if (count === 0) {
            return;
        }

        const categories = JSON.parse(cardData.categories);
        if (categories.includes("Premium Hall of Fame card") || categories.includes("Disabled card")) {
            Swal.fire({
                icon: "error",
                text: "You can't have any copy of a card in the Premium Hall of Fame / Disabled in your deck",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            return;
        } else if (categories.includes("Hall of Fame card") && count > 1) {
            Swal.fire({
                icon: "error",
                text: "You can only have one copy of any card in the Hall of Fame in a deck",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            return;
        }

        const newCount = count - 1;
        if (newCount === 0) {
            const { [cardData.data.id]: removedCard, ...rest } = DeckDetails;
            setDeckDetails(rest);
            const { [cardData.data.name]: removedCardDisplay, ...restDisplay } = DeckDisplay;
            setDeckDisplay(restDisplay);
        } else {
            setDeckDetails({
                ...DeckDetails,
                [cardData.data.id]: newCount,
            });
            setDeckDisplay({
                ...DeckDisplay,
                [cardData.data.name]: { count: newCount, data: cardData.data, "categories": cardData.categories },
            });
        }
    };

    const handleIncreaseClick = async (cardData) => {
        const count = cardData.count || 0;
        
        const categories = JSON.parse(cardData.categories);
        if (categories.includes('Premium Hall of Fame card') || categories.includes('Disabled card')) {
            Swal.fire({
                icon: "error",
                text: "You can't have any copy of a card in the Premium Hall of Fame / Disabled in your deck",
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            return;
        } else if (categories.includes('Hall of Fame card') && count >= 1) {
            Swal.fire({
                icon: "error",
                text: "You can only have one copy of any card in the Hall of Fame in a deck",
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            return;
        }
        if (count >= 4) {
            Swal.fire({
                icon: "error",
                text: "you can't have more than 4 copys in a deck",
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            return;
        }
        setDeckDetails({
            ...DeckDetails,
            [cardData.data.id]: count + 1
        });

        setDeckDisplay({
            ...DeckDisplay,
            [cardData.data.name]: { "count": count + 1, "data": cardData.data, "categories": cardData.categories }
        })
    };


    return (
        <>
            <IndexNavbar />
            <IndexHeader />
            <div style={{ "background-color": "#282c34", "color": "white", "align-items": "center" }}>
                <Container fluid style={{
                    "position": "relative",
                    "top": "-20vh"
                }}>
                    <Card>
                        <CardHeader className='text-center'>
                            <b>{props.mode === "edit" ? "Edit" : "Create New"} Deck</b>
                        </CardHeader>
                        <CardBody className='d-flex' style={{ "min-height": "500px" }}>
                            <Col md={6} xs={12} className='border-end border-dark px-3'>
                                <Col className='d-flex'>
                                    <Col className='text-center'><h3>Search Here</h3></Col>
                                </Col>
                                <Col>
                                    <SearchComponent handler={handleClick} DeckDetails={DeckDetails} setDeckDetails={setDeckDetails} />
                                </Col>
                            </Col>
                            <Col md={6} xs={12} className='px-3'>
                                <Form>
                                    <FormGroup row>
                                        <Label for='name' sm={2}>Name: </Label>
                                        <Col sm={10}>
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder="Deck name"
                                                type="text"
                                            />
                                        </Col>
                                        <Input
                                            id='deck_data_json'
                                            type='hidden'
                                            value={JSON.stringify(DeckDetails)}
                                        />
                                    </FormGroup>
                                </Form>
                                <ListGroup className='border mt-5 p-3'>
                                    {Object.values(DeckDisplay).map((card) => (
                                        <ListGroupItem
                                            key={card.data.name}
                                        >
                                            <Col md={12} className='d-flex flex-wrap'>
                                                <Col md={10}>
                                                    {card.data.name}
                                                </Col>
                                                <Col md={2} className='d-flex justify-content-around align-items-center'>
                                                    <Button
                                                        color="success"
                                                        outline
                                                        size="sm"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            handleIncreaseClick(card);
                                                        }}
                                                    >
                                                        <i className="fa fa-plus-square" aria-hidden="true"></i>
                                                    </Button>
                                                    {card.count}
                                                    <Button
                                                        color="danger"
                                                        outline
                                                        size="sm"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            handleDecreaseClick(card);
                                                        }}
                                                    >
                                                        <i className="fa fa-minus-square" aria-hidden="true"></i>
                                                    </Button>
                                                </Col>
                                            </Col>
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                            </Col>
                        </CardBody>
                    </Card>
                </Container>
            </div>
            <DemoFooter />
        </>
    );
}

export default CreateDeck;