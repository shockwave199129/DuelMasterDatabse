import React from 'react';
import './App.css';
import IndexNavbar from "./components/Navbars/IndexNavbar.js";
import IndexHeader from "./components/Headers/IndexHeader.js";
import DemoFooter from "./components/Footers/DemoFooter.js";
import { Container, Col, Card } from 'reactstrap';

function App() {
  return (
    <>
      <IndexNavbar />
      <IndexHeader myProp={"index"} />
      <div className="App">
        <header className="App-header">
          <Container>
            <Col>
              <h4 className='pt-3 pb-3'>Hi <span role="img" aria-label="Love">👋</span>, thanks for stopping by!</h4>
              <Card className='flex-sm-row align-items-center'>
                <Col md={6}>
                  <img src='duel_masters_12_by_nakamura8_d9yjode.jpg' alt='take 1' />
                </Col>
                <Col md={6} className='p-4'>
                  <p style={{ "fontSize": "16px" }}>Welcome to our Duel Master card search platform! Find all the cards you need to build your ultimate deck and dominate your opponents.
                    We understand that building a deck can be a challenging task, but don't worry, I'm here to support you. If you need any help finding the right card or have any questions about the platform, I'm just a message away.</p>
                </Col>
              </Card>
              <Card className='flex-sm-row align-items-center'>
                <Col md={6} className='p-4'>
                  <p style={{ "fontSize": "16px" }}>If you enjoy using our platform and would like to support us, there are several ways to do so. You can help spread the word by sharing our platform with your friends and fellow Duel Masters players. You can also follow us on social media and engage with our content. And if you really want to show your support, consider making a donation to help us continue improving our platform.</p>
                </Col>
                <Col md={6}>
                  <img src='duel_masters_14_by_nakamura8_d9yo12l.jpg' alt='take 2' />
                </Col>
              </Card>
              <Card className='flex-sm-row align-items-center'>
                <Col md={6}>
                  <img src='duel_masters_10_by_nakamura8_d9ae3am.jpg' alt='take 3' />
                </Col>
                <Col md={6} className='p-4'>
                  <p style={{ "fontSize": "16px" }}>Our platform is run by a small team of passionate Duel Masters players who want to create the best card search experience possible. We are dedicated to continually improving our platform and adding new features to make it even better. But we can't do it without your help. If you believe in what we're doing and want to see our platform thrive, please consider making a donation. Your support will go directly towards improving our platform and providing the best possible experience for our users. Thank you for your support!</p>
                </Col>
              </Card>


              <h4 className='pt-3 pb-3' style={{ "color": "#ffc800" }}>Happy Dueling !!!</h4>
            </Col>
          </Container>
        </header>
      </div>
      <DemoFooter />
    </>
  );
}

export default App;
