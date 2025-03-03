// importing necessary modules and components
import React from "react";
import { Link } from "react-router-dom";
import '../styles/pages.css';

// Home component definition
export default function Home() {

    return (
        <main className="home">
            <img src="/img/homeBack.jpg" alt="Main" className="home__img"/>
            <div className="container">
                <section className="home__info">
                        <h1 className="home__info-title">Welcome! Explore the volcanoes around the world!</h1>
                        <p className="home__info-description">Press "view volcanoes" to start investigating, or log
                            in/register to discover more.</p>
                        <div className="home__info-links">
                            <Link to="/volcanoes" className="home__link">View Volcanoes</Link>
                            <Link to="/login" className="home__link login-link">Login</Link>
                        </div>
                </section>
            </div>
                <section className="home__about">
                    <div className="container">
                        <h2 className="home__about-title">/ About Us</h2>
                        <p className="home__about-text">The website was done as assessment for QUT unit Web Computing by
                            Vitali Turkin. All information is taken from the provided server and the volcanoes dataset
                            is
                            collated by the Smithsonian Institution's Global Volcanism Program
                            and is <a href="https://volcano.si.edu/" className="home__about-link">publicly available</a>.
                        </p>
                        <p className="home__about-text" id="home__about-text2">The locations, eruption histories, and
                            other
                            relevant details concerning volcanoes are all covered thoroughly on this website.</p>
                    </div>
                </section>
                <section className="home__quote">
                    <div className="container">
                        <h2 className="home__quote-title">// Quote</h2>
                        <p className="home__quote-text">“ Every volcano is a powerful illustration of God's character.
                            He is
                            a
                            Vesuvius of goodness, life, and energy. ”</p>
                        <p className="home__quote-author">- Reinhard Bonnke</p>
                    </div>
                </section>
            <section className="home__gallery">
                <div className="container">
                    <h2 className="home__gallery-title">/// Gallery</h2>
                    <div className="home__gallery-imgs">
                        <img src="/img/img1.jpg" alt="Gallery 1" className="home__gallery-img"/>
                        <img src="/img/img2.jpg" alt="Gallery 2" className="home__gallery-img"/>
                        <img src="/img/img3.jpg" alt="Gallery 3" className="home__gallery-img"/>
                        <img src="/img/img4.jpg" alt="Gallery 4" className="home__gallery-img"/>
                        <img src="/img/img5.jpg" alt="Gallery 5" className="home__gallery-img"/>
                        <img src="/img/img6.jpg" alt="Gallery 6" className="home__gallery-img"/>
                    </div>
                </div>
            </section>
        </main>
    );
}
