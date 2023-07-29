/*!

=========================================================
* Paper Kit React - v1.3.1
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-kit-react

* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/paper-kit-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import React from "react";

// reactstrap components
import { Row, Container, Nav, NavItem, NavLink, Col } from "reactstrap";

function DemoFooter() {
  return (
    <footer className="footer footer-black footer-white">
      <Container>
        <Row className="align-items-center">
          {/* <nav className="footer-nav">
            <ul className="d-flex justify-content-between">
              <li>
                <a
                  href="https://github.com/shockwave199129"
                  target="_blank"
                >
                  ShockWave
                </a>
              </li>
              <li>
                <a
                  href="http://blog.creative-tim.com/?ref=pkr-footer"
                  target="_blank"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="https://www.creative-tim.com/license?ref=pkr-footer"
                  target="_blank"
                >
                  Licenses
                </a>
              </li>
            </ul>
          </nav> */}
          <Col md={6} xs={12} className="credits ml-auto">
            <span className="copyright">
              © {new Date().getFullYear()}, made with{" "}
              <i className="fa fa-heart heart" /> by Subhrangshu
            </span>
          </Col>
          <Col md={6} xs={12} className="d-flex justify-content-end">
            <Nav navbar className="flex-row">
              <NavItem>
                <NavLink
                  data-placement="bottom"
                  href="https://duelmasters.fandom.com/wiki/Duel_Masters_Wiki"
                  target="_blank"
                  title="Offical DM wiki"
                  style={{"padding":"10 px 15px", "margin":"15px 3px", "fontSize":"15px"}}
                >
                  <i className="fa fa-wikipedia-w" />
                  <p className="d-lg-none">Twitter</p>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  data-placement="bottom"
                  href="#"
                  target="_blank"
                  title="Like us on Facebook"
                  style={{"padding":"10 px 15px", "margin":"15px 3px", "fontSize":"15px"}}
                >
                  <i className="fa fa-facebook-square" />
                  <p className="d-lg-none">Facebook</p>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  data-placement="bottom"
                  href="#"
                  target="_blank"
                  title="Follow us on Instagram"
                  style={{"padding":"10 px 15px", "margin":"15px 3px", "fontSize":"15px"}}
                >
                  <i className="fa fa-instagram" />
                  <p className="d-lg-none">Instagram</p>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  data-placement="bottom"
                  href="https://github.com/shockwave199129"
                  target="_blank"
                  title="Star on GitHub"
                  style={{"padding":"10 px 15px", "margin":"15px 3px", "fontSize":"15px"}}
                >
                  <i className="fa fa-github" />
                  <p className="d-lg-none">GitHub</p>
                </NavLink>
              </NavItem>
              {/* <NavItem>
              <NavLink
                href="https://demos.creative-tim.com/paper-kit-react/#/documentation?ref=pkr-index-navbar"
                target="_blank"
              >
                <i className="nc-icon nc-book-bookmark" /> Documentation
              </NavLink>
            </NavItem> */}
            </Nav>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default DemoFooter;
