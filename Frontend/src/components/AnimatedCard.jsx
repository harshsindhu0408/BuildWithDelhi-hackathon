import React from "react";

const ArticlesData = [
  {
    title: "Building Better Mental Health",
    desc: "Looking to boost your mood, handle your emotions better, or build resilience? These six life-changing strategies for improving mental health and well-being can show you how.",
    link: "https://www.helpguide.org/articles/mental-health/building-better-mental-health.htm",
  },
  {
    title:
      "World mental health support and the effect of stigma and discrimination",
    desc: "Mental health, as with any other aspects of health, can be affected by a range of socioeconomic factors that need to be addressed through comprehensive strategies involving access to preventions, treatments and facilitating recovery as well as raising awareness.",
    link: "https://www.news-medical.net/condition/Mental-Health",
  },
  {
    title: "Our best mental health tips - backed by research",
    desc: "This guide provides you with our best tips on how to look after your mental health - backed by research.",
    link: "https://www.mentalhealth.org.uk/explore-mental-health/publications/our-best-mental-health-tips",
  },
  {
    title: "Mental Health in Asia: The Numbers",
    desc: "Snapshots of common mental health conditions and the level of available support in each country.",
    link: "https://www.ourbetterworld.org/series/mental-health/support-toolkit/mental-health-asia-numbers?gad_source=1&gclid=CjwKCAiAq4KuBhA6EiwArMAw1PAkeWx6LtqcCnT_D-palJNRrgIkrnZg4zv4A62QuLDX4aVSiDZ_JRoCla8QAvD_BwE&type=resource",
  },
  {
    title: "Mental capacity",
    desc: "What can cause a lack of mental capacity?",
    link: "https://www.mentalhealth.org.uk/explore-mental-health/a-z-topics/mental-capacity",
  },
  {
    title: "How to support someone with a mental health problem",
    desc: "We all go through tough times, and people help us through them. Other times we have been worried about other people’s mental health.",
    link: "https://www.mentalhealth.org.uk/explore-mental-health/articles/how-support-someone-mental-health-problem",
  },
];

const AnimatedCard = () => {
  return (
    <div className="grid w-9/12 mt-10 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
      {ArticlesData.map((article, index) => (
        <div
          key={index}
          className="w-full h-72 duration-500 group overflow-hidden relative rounded bg-neutral-800 text-neutral-50 p-4 flex flex-col justify-between"
        >
          <div className="absolute blur duration-500 group-hover:blur-none w-72 h-72 rounded-full group-hover:translate-x-12 group-hover:translate-y-12 bg-sky-900 right-1 -bottom-24"></div>
          <div className="absolute blur duration-500 group-hover:blur-none w-12 h-12 rounded-full group-hover:translate-x-12 group-hover:translate-y-2 bg-indigo-700 right-12 bottom-12"></div>
          <div className="absolute blur duration-500 group-hover:blur-none w-36 h-36 rounded-full group-hover:translate-x-12 group-hover:-translate-y-12 bg-indigo-800 right-1 -top-12"></div>
          <div className="absolute blur duration-500 group-hover:blur-none w-24 h-24 bg-sky-700 rounded-full group-hover:-translate-x-12"></div>
          <div className="z-10 flex flex-col justify-evenly w-full h-full">
            <span className="text-2xl font-bold">{article.title}</span>
            <p className="mb-4">{article.desc}</p>
            <a href={article.link} target="_blank">
              <button className="hover:bg-neutral-200 bg-neutral-50 rounded text-neutral-800 font-extrabold w-full p-3">
                See more
              </button>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimatedCard;
