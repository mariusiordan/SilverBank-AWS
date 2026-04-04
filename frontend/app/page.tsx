"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [showCookie, setShowCookie] = useState(true);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const totalSlides = 3;

  const handleScrollToFeatures = () => {
    if (typeof document !== "undefined") {
      const section = document.getElementById("section--1");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (typeof document === "undefined") return;
    const href = e.currentTarget.getAttribute("href");
    if (href && href.startsWith("#")) {
      const section = document.querySelector(href);
      if (section) (section as HTMLElement).scrollIntoView({ behavior: "smooth" });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  
  useEffect(() => {
  const nav = document.querySelector(".nav");
  const header = document.querySelector(".header");

  if (!nav || !header) return;

  const navHeight = nav.getBoundingClientRect().height;

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry.isIntersecting) nav.classList.add("sticky");
      else nav.classList.remove("sticky");
    },
    {
      root: null,
      threshold: 0,
      rootMargin: `-${navHeight}px`,
    }
  );

  observer.observe(header);

  return () => observer.disconnect();
}, []);

useEffect(() => {
  const lazyImages = document.querySelectorAll("img[data-src]");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src!;

        img.onload = () => img.classList.remove("lazy-img");

        obs.unobserve(img);
      });
    },
    { root: null, threshold: 0, rootMargin: "-200px" }
  );

  lazyImages.forEach((img) => observer.observe(img));

  return () => observer.disconnect();
}, []);

useEffect(() => {
  const sections = document.querySelectorAll(".section");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("section--hidden");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach((sec) => {
    sec.classList.add("section--hidden");
    observer.observe(sec);
  });

  return () => observer.disconnect();
}, []);


  return (
    
    <>
    {showCookie && (
  <div className="cookie-message">
    We use cookies for improved functionality and analytics. ...Nah, just joking! 😂👍
    <button className="btn btn--close-cookie" onClick={() => setShowCookie(false)}>
      Got it!
    </button>
  </div>
)}

      <header className="header">
        <nav className="nav">
          <img
            src="/img/logo.png"
            alt="Bankist logo"
            className="nav__logo"
            id="logo"
            data-version-number="3.0"
          />
          <ul className="nav__links">
            <li className="nav__item">
              <a
                className="nav__link"
                href="#section--1"
                onClick={handleNavClick}
              >
                Features
              </a>
            </li>
            <li className="nav__item">
              <a
                className="nav__link"
                href="#section--2"
                onClick={handleNavClick}
              >
                Operations
              </a>
            </li>
            <li className="nav__item">
              <a
                className="nav__link"
                href="#section--3"
                onClick={handleNavClick}
              >
                Testimonials
              </a>
            </li>
          <li className="nav__item">
            <a className="nav__link nav__link--btn" href="/signup">
                  Open account
               </a>
          </li>

          <li className="nav__item">
            <a className="nav__link nav__link--btn" href="/login">
                Login
             </a>
          </li>

          </ul>
        </nav>

        <div className="header__title">
          <h1>
            SilverBank.
            <span className="highlight">Where</span> your
            <br />
            <span className="highlight">money grow safely.</span>
          </h1>
          <h4>
            Prefer to do your banking on a bigger screen? We&apos;ve been improving
            Online Banking to make it even easier to use.
          </h4>
          <button
            className="btn--text btn--scroll-to"
            onClick={handleScrollToFeatures}
          >
            Learn more &darr;
          </button>
          <img
            src="/img/hero.png"
            className="header__img"
            alt="Minimalist bank items"
          />
        </div>
      </header>

      {/* SECTION 1 - FEATURES */}
      <section className="section" id="section--1">
        <div className="section__title">
          <h2 className="section__description">Features</h2>
          <h3 className="section__header">
            Everything you need in a modern bank and more.
          </h3>
        </div>

        <div className="features">
          <img
            src="/img/digital.png"
            alt="Computer"
            className="features__img"
          />
          <div className="features__feature">
            <div className="features__icon">
              <svg>
                <use xlinkHref="/img/icons.svg#icon-monitor"></use>
              </svg>
            </div>
            <h5 className="features__header">100% digital bank</h5>
            <p>
              See how you can manage your money safely and securely using Online
              Banking and the SilverBank app – from checking your balance and
              transferring money, to managing standing orders and Direct Debits.
            </p>
          </div>

          <div className="features__feature">
            <div className="features__icon">
              <svg>
                <use xlinkHref="/img/icons.svg#icon-trending-up"></use>
              </svg>
            </div>
            <h5 className="features__header">Watch your money grow</h5>
            <p>
              Whether you're saving for something big or small, or just a rainy
              day, we have a range of savings and investment options that could
              be right for you.
            </p>
          </div>
          <img src="/img/grow.jpg" alt="Plant" className="features__img" />

          <img
            src="/img/card.jpg"
            alt="Credit card"
            className="features__img"
          />
          <div className="features__feature">
            <div className="features__icon">
              <svg>
                <use xlinkHref="/img/icons.svg#icon-credit-card"></use>
              </svg>
            </div>
            <h5 className="features__header">Free debit card included</h5>
            <p>
              SilverBank offers free standard debit cards with its current
              accounts, and you can also personalize them with images for free.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 - OPERATIONS */}
      <section className="section" id="section--2">
        <div className="section__title">
          <h2 className="section__description">Operations</h2>
          <h3 className="section__header">
            Everything as simple as possible, but no simpler.
          </h3>
        </div>

        <div className="operations">
          <div className="operations__tab-container">
            <button
              className={
                "btn operations__tab operations__tab--1" +
                (activeTab === 1 ? " operations__tab--active" : "")
              }
              onClick={() => setActiveTab(1)}
            >
              <span>01</span>Instant Transfers
            </button>
            <button
              className={
                "btn operations__tab operations__tab--2" +
                (activeTab === 2 ? " operations__tab--active" : "")
              }
              onClick={() => setActiveTab(2)}
            >
              <span>02</span>Instant Loans
            </button>
            <button
              className={
                "btn operations__tab operations__tab--3" +
                (activeTab === 3 ? " operations__tab--active" : "")
              }
              onClick={() => setActiveTab(3)}
            >
              <span>03</span>Instant Closing
            </button>
          </div>

          <div
            className={
              "operations__content operations__content--1" +
              (activeTab === 1 ? " operations__content--active" : "")
            }
          >
            <div className="operations__icon operations__icon--1">
              <svg>
                <use xlinkHref="/img/icons.svg#icon-upload"></use>
              </svg>
            </div>
            <h5 className="operations__header">
              Transfer money to anyone, instantly! No fees, no BS.
            </h5>
            <p>
              Whether you're splitting a bill, paying a friend, or sending funds
              across the world, our instant transfer service ensures your money
              moves in seconds. Secure, seamless, and available 24/7 – because
              your time (and money) matters.
              <a className="btn--show-modal" href="/signup">
                {" "}
                Sign up
              </a>{" "}
              today and experience the future of payments!
            </p>
          </div>

          <div
            className={
              "operations__content operations__content--2" +
              (activeTab === 2 ? " operations__content--active" : "")
            }
          >
            <div className="operations__icon operations__icon--2">
              <svg>
                <use xlinkHref="/img/icons.svg#icon-home"></use>
              </svg>
            </div>
            <h5 className="operations__header">
              Buy a home or make your dreams come true, with instant loans.
            </h5>
            <p>
              Get approved in minutes with no long waits, no hidden fees, and no
              unnecessary paperwork. Whether it&apos;s for a new home, a big
              purchase, or an unexpected expense, We&apos;ve got you covered with
              flexible terms and competitive rates. Apply today and take control
              of your future—instantly!
            </p>
          </div>

          <div
            className={
              "operations__content operations__content--3" +
              (activeTab === 3 ? " operations__content--active" : "")
            }
          >
            <div className="operations__icon operations__icon--3">
              <svg>
                <use xlinkHref="/img/icons.svg#icon-user-x"></use>
              </svg>
            </div>
            <h5 className="operations__header">
              No longer need your account? No problem! Close it instantly.
            </h5>
            <p>
              No longer need your account? No problem! Close it instantly with
              just a few clicks. No waiting, no paperwork, no hassle. Your time
              is valuable, and we make sure you stay in control—effortlessly.
              Ready to move on? Close your account instantly, anytime.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 - TESTIMONIALS / SLIDER */}
      <section className="section" id="section--3">
        <div className="section__title section__title--testimonials">
          <h2 className="section__description">Not sure yet?</h2>
          <h3 className="section__header">
            Millions of SilverBank customers are already making their lifes
            simpler.
          </h3>
        </div>

        <div className="slider">
          <div
            className="slide slide--1"
            style={{ transform: `translateX(${(0 - currentSlide) * 100}%)` }}
          >
            <div className="testimonial">
              <h5 className="testimonial__header">
                Best financial decision ever!
              </h5>
              <blockquote className="testimonial__text">
                Switching to this service was hands down the best financial
                decision I&apos;ve ever made. The instant transfers are truly
                instant, and I never have to worry about hidden fees or delays.
                Plus, the customer support is outstanding—they actually care
                about helping you. Whether I&apos;m sending money to friends or
                handling bigger transactions, everything just works flawlessly.
                Highly recommend to anyone looking for a stress-free financial
                experience!
              </blockquote>
              <address className="testimonial__author">
                <img
                  src="/img/user-1.jpg"
                  alt=""
                  className="testimonial__photo"
                />
                <h6 className="testimonial__name">Josh</h6>
                <p className="testimonial__location">San Francisco, USA</p>
              </address>
            </div>
          </div>

          <div
            className="slide slide--2"
            style={{ transform: `translateX(${(1 - currentSlide) * 100}%)` }}
          >
            <div className="testimonial">
              <h5 className="testimonial__header">
                The last step to becoming a complete minimalist.
              </h5>
              <blockquote className="testimonial__text">
                You&apos;ve decluttered your home, simplified your life, and embraced
                living with less. Now, it&apos;s time to do the same with your
                finances! Say goodbye to unnecessary fees, complicated
                processes, and financial clutter. With instant transfers, quick
                loans, and one-click account closing, managing your money has
                never been this simple. No stress, no waiting—just total control
                at your fingertips. Minimalism isn&apos;t just about owning less—it&apos;s
                about freeing yourself from the unnecessary. Ready to take the
                final step? Let&apos;s make it effortless!
              </blockquote>
              <address className="testimonial__author">
                <img
                  src="/img/user-2.jpg"
                  alt=""
                  className="testimonial__photo"
                />
                <h6 className="testimonial__name">Andreea</h6>
                <p className="testimonial__location">London, UK</p>
              </address>
            </div>
          </div>

          <div
            className="slide slide--3"
            style={{ transform: `translateX(${(2 - currentSlide) * 100}%)` }}
          >
            <div className="testimonial">
              <h5 className="testimonial__header">
                Finally free from old-school banks
              </h5>
              <blockquote className="testimonial__text">
                No more hidden fees, long wait times, or outdated processes. Say
                goodbye to the hassle of traditional banking and hello to
                instant transfers, fast loans, and total financial
                freedom—all with zero BS. Banking should be simple,
                transparent, and on your terms. Whether you're sending money,
                borrowing, or closing an account, we make it effortless. Break
                free from the past and step into the future of finance—because
                you deserve better! 🚀
              </blockquote>
              <address className="testimonial__author">
                <img
                  src="/img/user-3.jpg"
                  alt=""
                  className="testimonial__photo"
                />
                <h6 className="testimonial__name">Jose de Jesus</h6>
                <p className="testimonial__location">Lisbon, Portugal</p>
              </address>
            </div>
          </div>

          <button
            className="slider__btn slider__btn--left"
            onClick={prevSlide}
          >
            &larr;
          </button>
          <button
            className="slider__btn slider__btn--right"
            onClick={nextSlide}
          >
            &rarr;
          </button>

          <div className="dots">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                className={
                  "dots__dot" +
                  (currentSlide === i ? " dots__dot--active" : "")
                }
                onClick={() => goToSlide(i)}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* SIGN-UP SECTION */}
      <section className="section section--sign-up">
        <div className="section__title">
          <h3 className="section__header">
            The best day to join SilverBank was one year ago. The second best
            is today!
          </h3>
        </div>
       <a className="btn btn--show-modal" href="/signup">
            Open your free account today!
        </a>

      </section>

      {/* FOOTER */}
      <footer className="footer">
        <ul className="footer__nav">
          <li className="footer__item">
            <a className="footer__link" href="#">
              About
            </a>
          </li>
          <li className="footer__item">
            <a className="footer__link" href="#">
              Pricing
            </a>
          </li>
          <li className="footer__item">
            <a className="footer__link" href="#">
              Terms of Use
            </a>
          </li>
          <li className="footer__item">
            <a className="footer__link" href="#">
              Privacy Policy
            </a>
          </li>
          <li className="footer__item">
            <a className="footer__link" href="#">
              Careers
            </a>
          </li>
          <li className="footer__item">
            <a className="footer__link" href="#">
              Blog
            </a>
          </li>
          <li className="footer__item">
            <a className="footer__link" href="#">
              Contact Us
            </a>
          </li>
        </ul>
        <img src="/img/icon.png" alt="Logo" className="footer__logo" />
        <p className="footer__copyright">
          &copy; Copyright by{" "}
          <a
            className="footer__link twitter-link"
            target="_blank"
            href="https://www.linkedin.com/in/mariusiordan/"
          >
            Marius Iordan
          </a>
          . Use for learning and portfolio.
        </p>
      </footer>
    </>
  );
}