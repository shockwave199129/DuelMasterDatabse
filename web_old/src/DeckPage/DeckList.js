import React from 'react';
import 'bootstrap';
import IndexNavbar from "../components/Navbars/IndexNavbar.js";
import IndexHeader from "../components/Headers/IndexHeader.js";
import DemoFooter from "../components/Footers/DemoFooter.js";
import { Container, Col, Card, CardHeader, CardBody, Button, CardLink } from 'reactstrap';

function DeckList() {
    return (
        <>
            <IndexNavbar />
            <IndexHeader />
            <div style={{ "background-color": "#282c34", "color": "white", "align-items": "center" }}>
                <Container style={{
                    "position": "relative",
                    "top": "-20vh"
                }}>
                    <Card>
                        <CardHeader className='text-center'>
                            <CardLink href="/createdeck" className="btn btn-success" style={{ "float": "right" }}> Create New Deck</CardLink>
                            <h3>Deck List</h3>
                        </CardHeader>
                        <CardBody style={{"min-height": "500px"}}>

                        </CardBody>
                    </Card>
                </Container>
            </div>
            <DemoFooter />
        </>
    );
}

export default DeckList;