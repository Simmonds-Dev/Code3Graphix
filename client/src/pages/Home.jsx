import { useEffect, useState, useRef } from 'react';
import beverageHolder from '../assets/beverage_holder.png';
import bottleOpener from '../assets/bottle_openers.png';
import coaster from '../assets/coaster.png';
import ornament from '../assets/ornament.png';
import glock from '../assets/glock.jfif';
import beardedSkull from '../assets/beardedSkull.jfif';
import firePlaque from '../assets/firePlaque.jfif';
import magazine from '../assets/magazine.jfif';
import woodSign from '../assets/woodSign.jfif';
import knives from '../assets/knives.jfif';
import waterBottles from '../assets/waterBottles.jfif';

const phrases = [
    'get a personalized gift for my mom',
    'have matching tumblers for everyone at the office',
    'get some trophies done',
    'collaborate on ideas and see what we can do',
    'surprise someone with something custom',
]

const images = [beverageHolder, bottleOpener, coaster, ornament, glock, beardedSkull, firePlaque, magazine, woodSign, knives, waterBottles];


const Home = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const scrollRef = useRef(null);
    let animationFrame;

    const handleNext = () => {
        setCurrentImage((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    };

    const [index, setIndex] = useState(0);

    useEffect(() => {
    const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);

    const container = scrollRef.current;
    let scrollSpeed = 1;

    function animate() {
        if (container) {
            container.scrollLeft += scrollSpeed;

            // Reset scroll when halfway through the total scrollable width
            if (container.scrollLeft >= container.scrollWidth / 2) {
                container.scrollLeft = 0;
            }
        }

        animationFrame = requestAnimationFrame(animate);
    }

    animate();

    return () => {
        clearInterval(interval);
        cancelAnimationFrame(animationFrame);
    };
}, []);

    return (
        <div className="home">
            {/* Hero Section */}
            <section class="hero-section">
                <h1>
                    I want to{' '}
                    <span className="rotating-wrapper">
                        <span id="rotating-text" aria-live="polite" key={index}>
                            {phrases[index]}
                        </span>
                    </span>
                </h1>

            </section>

            <div>
                <p>
                    Be sure to check out some of our previous work in the gallery below!
                </p>
            </div>

            {/* Gallery Section */}
            <section className="gallerySection">
                <div className="infinite-scroll-wrapper" ref={scrollRef}>
                    <div className="scrolling-images">
                        {[...images, ...images].map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Gallery image ${index + 1}`}
                                className="scrolling-image"
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
