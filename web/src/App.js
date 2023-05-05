import React from 'react';
import './App.css';
import IndexNavbar from "./components/Navbars/IndexNavbar.js";
import IndexHeader from "./components/Headers/IndexHeader.js";
import DemoFooter from "./components/Footers/DemoFooter.js";
import { Container, Col } from 'reactstrap';

function App() {
  return (
    <>
      <IndexNavbar />
      <IndexHeader myProp={"index"} />
      <div className="App">
        <header className="App-header">
          <Container>
            <Col>
              <p style={{"fontSize":"16px"}}>Hi 👋, thanks for stopping by!</p>
              <p style={{"fontSize":"16px"}}>Welcome to our Duel Master card search platform! Find all the cards you need to build your ultimate deck and dominate your opponents.</p>
              <p style={{"fontSize":"16px"}}>We understand that building a deck can be a challenging task, but don't worry, I'm here to support you. If you need any help finding the right card or have any questions about the platform, I'm just a message away.</p>
              <h2 style={{"fontSize":"16px", "color":"red"}}>Happy Dueling !!!</h2>
            </Col>
          </Container>
        </header>
      </div>
      <DemoFooter />
    </>
  );
}

export default App;
