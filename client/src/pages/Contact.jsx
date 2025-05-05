import React from 'react';

const Contact = () => {
    return (
        <>
        <h2>Contact Us</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <input type="text" name="name" placeholder="Your Name" required />
                    <input type="email" name="email" placeholder="Your Email" required />
                    <textarea name="message" placeholder="Your Message" required />
                    <button type="submit">Send Message</button>
                </form>
        </>
    );
};

export default Contact;
