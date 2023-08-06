"use client"
import TopNav from "../shared/topNav";
import Footers from "@/shared/footer";

export default function Home() {
  return (
    <>
      <TopNav />

      <section id="hero" className="d-flex align-items-center" style={{ "backgroundImage": "url(assets/img/DM-Cover-01.png)!important", backgroundRepeat:"no-repeat", backgroundSize:"cover" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 d-flex justify-content-center pt-4 pt-lg-0 order-2 order-lg-1" data-aos="fade-up" data-aos-delay="200">
              <img src="assets/img/1683299712020.png" className="img-fluid animated" alt="" />
            </div>
          </div>
        </div>
      </section>

      <main id="main">
        <section id="why-us" className="why-us section-bg">
          <div className="container-fluid" data-aos="fade-up">

            <div className="row">

              <div className="col-lg-7 d-flex flex-column justify-content-center align-items-stretch  order-2 order-lg-1">

                <div className="content">
                  <h4 className='pt-3 pb-3'>Hi <span role="img" aria-label="Love">👋</span>, thanks for stopping by!</h4>
                  <p>
                    Welcome to our Duel Master card search platform! Find all the cards you need to build your ultimate deck and dominate your opponents.
                    We understand that building a deck can be a challenging task, but don't worry, I'm here to support you. If you need any help finding the right card or have any questions about the platform, I'm just a message away.
                  </p>
                </div>

              </div>

              <div className="col-lg-5 align-items-stretch order-1 order-lg-2 img" data-aos="zoom-in" data-aos-delay="150">
                <img src='assets/img/duel_masters_12_by_nakamura8_d9yjode.jpg' height={"260px"} alt='take 1' />
              </div>
            </div>

          </div>
        </section>

        <section id="why-us" className="why-us section-bg">
          <div className="container-fluid" data-aos="fade-up">

            <div className="row">

              <div className="col-lg-5 align-items-stretch order-1 order-lg-2 img" data-aos="zoom-in" data-aos-delay="150">
                <img src='assets/img/duel_masters_14_by_nakamura8_d9yo12l.jpg' height={"260px"} alt='take 1' />
              </div>
              <div className="col-lg-7 d-flex flex-column justify-content-center align-items-stretch  order-2">

                <div className="content">
                  <p>
                    If you enjoy using our platform and would like to support us, there are several ways to do so. You can help spread the word by sharing our platform with your friends and fellow Duel Masters players. You can also follow us on social media and engage with our content. And if you really want to show your support, consider making a donation to help us continue improving our platform.
                  </p>
                </div>

              </div>


            </div>

          </div>
        </section>


        <section id="why-us" className="why-us section-bg">
          <div className="container-fluid" data-aos="fade-up">

            <div className="row">

              <div className="col-lg-7 d-flex flex-column justify-content-center align-items-stretch  order-2 order-lg-1">

                <div className="content">
                  <p>
                    Our platform is run by a small team of passionate Duel Masters players who want to create the best card search experience possible. We are dedicated to continually improving our platform and adding new features to make it even better. But we can't do it without your help. If you believe in what we're doing and want to see our platform thrive, please consider making a donation. Your support will go directly towards improving our platform and providing the best possible experience for our users. Thank you for your support!
                  </p>
                </div>

              </div>

              <div className="col-lg-5 align-items-stretch order-1 order-lg-2 img" data-aos="zoom-in" data-aos-delay="150">
                <img src='assets/img/duel_masters_10_by_nakamura8_d9ae3am.jpg' height={"260px"} alt='take 1' />
              </div>
            </div>

          </div>
        </section>
        <Footers />
      </main>
    </>
  )
}
