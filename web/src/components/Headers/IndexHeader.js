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
import { Container } from "reactstrap";

// core components

function IndexHeader() {
  return (
    <>
      <div
        className="page-header section-dark"
        style={{
          backgroundImage:
            "url(" + require("../../assets/img/antoine-barres.jpg") + ")"
        }}
      >
        <div className="filter" />
        <div className="content-center">
          <Container>
            <div className="title-brand">
              <div className="fog-low">
                <img alt="..." src={require("../../assets/img/fog-low.png")} />
              </div>
              <div className="fog-low right">
                <img alt="..." src={require("../../assets/img/fog-low.png")} />
              </div>
            </div>
          </Container>
        </div>
        {/* <div
          className="moving-clouds p-3"
          style={{
            backgroundImage: "url(" + require("../../assets/img/clouds.png") + ")"
          }}
        >
          <h2 className="category category-absolute text-center">
            Designed and coded by{" "}
          </h2>
        </div> */}
      </div>
    </>
  );
}

export default IndexHeader;