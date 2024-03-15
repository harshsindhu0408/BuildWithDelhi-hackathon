import styles from "./homepage.module.css";
import { Logo } from "../../svgs/logoSVG";
import { Link, useNavigate } from "react-router-dom";
import Image from "../../svgs/SVG/SVG/FrontImage3.svg";
import axios from "axios";

import { useContext, useRef } from "react";
import LoginContext from "../../context/context";
import Articles from "../Articles/Articles";
import piechart from "../../svgs/piechart.png";
import CustomText from "../../components/CustomText";
import AnimatedCard from "../../components/AnimatedCard";

function Homepage() {
  const navigate = useNavigate();
  const { logout, loggedIn } = useContext(LoginContext);

  const about = useRef(null);
  const articles = useRef(null);

  const aboutClick = () => {
    about.current?.scrollIntoView({ behavior: "smooth" });
  };
  const articlesClick = () => {
    articles.current?.scrollIntoView({ behavior: "smooth" });
  };

  const logoutUser = async () => {
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_API_LINK + "/logout",
        {
          withCredentials: true,
        }
      );
      console.log(data);
      if (data?.msg === "loggedout") {
        logout();
        window.localStorage.clear();
        window.sessionStorage.clear();
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(
              /=.*/,
              "=;expires=" + new Date().toUTCString() + ";path=/"
            );
        });
      }
    } catch (error) {
      console.log("Err in logout");
    }
  };

  return (
    <div className={styles.homepageContainer}>
      <header>
        <Link to={"/"}>
          <div className={styles.logoContainer}>
            <Logo />
            <div className={styles.headerText}>
              <h4 className={styles.text}>BrainLink</h4>
              <h6 className={`${styles.text} text-xs`}>
                A virtual confidante fostering mental health through
                personalized chats.
              </h6>
            </div>
          </div>
        </Link>

        <div className="flex flex-row gap-4">
          {loggedIn && (
            <button
              onClick={() => {
                navigate("/analysis");
              }}
            >
              Button
            </button>
          )}
          <button
            onClick={() => {
              if (!loggedIn) navigate("/login");
              else {
                logoutUser();
              }
            }}
          >
            {!loggedIn ? <div>Login</div> : <div>Logout</div>}
          </button>
        </div>
      </header>

      <main style={{ minHeight: "100vh" }}>
        <section className={styles.leftSection}>
          <CustomText props={"Nurturing Mental Health with AI"} />
          <div
            onClick={() => {
              if (!loggedIn) {
                navigate("/login");
              } else {
                navigate("/message");
              }
            }}
          >
            <button class="px-8 z-30 py-4 bg-rose-400 rounded-md text-white relative font-semibold font-sans after:-z-20 after:absolute after:h-1 after:w-1 after:bg-rose-800 after:left-5 overflow-hidden after:bottom-0 after:translate-y-full after:rounded-md after:hover:scale-[300] after:hover:transition-all after:hover:duration-700 after:transition-all after:duration-700 transition-all duration-700 [text-shadow:3px_5px_2px_#be123c;] hover:[text-shadow:2px_2px_2px_#fda4af] text-2xl">
              Chat with me ......{" "}
            </button>
          </div>
        </section>
        <section className={styles.rightSection}>
          <img
            className="bg-transparent"
            src="https://png.pngtree.com/png-clipart/20230508/original/pngtree-human-brain-vector-images-png-image_9149149.png"
            alt=""
          />
        </section>
      </main>

      <section className={`mt-8 ${styles.statsBox}`}>
        <h1 className="text-center text-4xl font-bold mb-8">
          Some Data to create awareness about Mental Health
        </h1>
        <div className="w-full">
          <img
            className="w-full"
            src="https://www.athenahealth.com/knowledge-hub/sites/insight/files/inline-images/Mental%20Health%20dataslice_Age%20%281%29.jpg"
          ></img>
        </div>
      </section>

      <div className="mt-10">
        <section
          ref={about}
          className={`flex flex-col items-center gap-2 mb-4 ${styles.aboutUs}`}
        >
          <h1 className={`text-4xl font-bold mb-4 ${styles.lato}`}>
            About BrainLink
          </h1>
          <div className={`text-center text-lg ${styles.lato}`}>
            Welcome to our mental health chat assistant platform. We are here
            for you – a supportive community where our empathetic AI actively
            listens, offers encouragement, and provides valuable resources.
            Together, we prioritize your well-being, fostering open dialogue
            around mental health. You're not alone; we, as your dedicated
            companions, stand with you on your journey. Let's build a space
            where understanding and support thrive.
          </div>
        </section>
      </div>
      <section className={`mt-8 ${styles.statsBox}`}>
        <h1 className="text-center text-4xl font-bold mb-8">
          Mental health Issues are Common
        </h1>
        <div className={styles.statsSection}>
          <div>
            <img src={piechart} alt="" />
          </div>
          <div className="text-center flex flex-col justify-center gap-4">
            <h2 className="text-3xl font-semibold">Do You know?</h2>
            <p className="text-lg text-justify">
              Mental health challenges are widespread, affecting hundreds of
              millions annually, and impacting even more individuals throughout
              their lifetimes. Statistics suggest that approximately 1 in 3
              women and 1 in 5 men will grapple with major depression at some
              point in their lives. While less prevalent, conditions like
              schizophrenia and bipolar disorder also significantly influence
              people's lives.
            </p>
          </div>
        </div>
      </section>
      <section className="mt-8" ref={articles}>
        <h1 className="text-center text-3xl font-bold">
          Creator picked articles
        </h1>
        <div className="xl:m-auto flex flex-col items-center justify-center">
          <AnimatedCard />
        </div>
      </section>
      <footer className={styles.footer}>
        <div className="m-auto h-full" style={{ maxWidth: "1320px" }}>
          <div className="grid grid-cols-2 h-5/6">
            <div className="flex flex-col justify-center items-center gap-3 text-lg">
              <div onClick={aboutClick} className="cursor-pointer">
                About
              </div>
              <div onClick={articlesClick} className="cursor-pointer">
                Articles
              </div>
              <div
                onClick={() => {
                  navigate("/message");
                }}
                className="cursor-pointer"
              >
                Chat
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-3 text-lg">
              Footerrrrrrrrr
            </div>
          </div>
          <div className="text-center">© 2024 by Team404</div>
        </div>
      </footer>
    </div>
  );
}

export default Homepage;
