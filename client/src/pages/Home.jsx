import React from 'react';

const Home = () => {
    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <h1>Welcome to Code3Graphix</h1>
                <p>Your one-stop shop for laser engraving and custom creations.</p>
                <button>See Our Work</button>
            </section>

            {/* Previous Work */}
            <section className="previous-work">
                <h2>Our Previous Work</h2>
                <div className="project-grid">
                    <div className="project-card">
                        <img src="/images/sample.jpg" alt="Sample project" />
                        <p>Engraved Wooden Plaque</p>
                    </div>
                    {/* Add more project cards */}
                </div>
            </section>

            {/* About Us */}
            <section className="about-us">
                <h2>About Us</h2>
                <p>
                    We specialize in custom laser-engraved gifts, signs, and promotional
                    products. Every design is personalized with care and precision.
                </p>
            </section>

            {/* Contact Form */}
            <footer className="contact-form">
                <h2>Contact Us</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <input type="text" name="name" placeholder="Your Name" required />
                    <input type="email" name="email" placeholder="Your Email" required />
                    <textarea name="message" placeholder="Your Message" required />
                    <button type="submit">Send Message</button>
                </form>
            </footer>
        </div>
    );
};

export default Home;
