// Content for the cards visitors can pick. Edit the text here; each card opens as a slideshow.
// Cards appear in the hand in the order listed below.
//
// Each topic has its own picture folder in assets/img/cards/:
//   background/  education/  experience/  eating/  travel/  pottery/  projects/
// One photo on a slide:  { heading: "...", body: "...", image: "assets/img/cards/pottery/bowl.jpg" }
// Logo (shown whole on white, not cropped): add `fit: "contain"` next to `image`.
// Link under the text: add `link: { text: "...", href: "..." }` to a slide.
// Swipeable photo strip: { heading: "...", body: "...", gallery: ["path1.jpg", "path2.jpg", ...] }
// Tip: shrink phone photos before adding them (about 1000px wide) so the site stays fast.
const CARD_CONTENT = [
  {
    rank: "10",
    title: "Background",
    slides: [
      {
        heading: "Hue, Vietnam",
        body: "I was born and raised in a small town in the beautiful city of Hue, Vietnam. My family moved to the U.S. when I was 10.",
        image: "assets/img/cards/background/hue.jpeg",
      },
    ],
  },
  {
    rank: "K",
    title: "Education",
    slides: [
      {
        heading: "UCLA",
        body: "I'm a senior studying Mathematics and Computer Science at the University of California, Los Angeles.",
        image: "assets/img/cards/education/ucla.jpg",
      },
    ],
  },
  {
    rank: "4",
    title: "Experience",
    slides: [
      {
        heading: "Capital One",
        body: "I previously worked at Capital One as a software engineering intern where I built a super cool AI Incident Tool to accelerate incident resolution process.",
        image: "assets/img/cards/experience/capital-one.jpg",
      },
      {
        heading: "PATH",
        body: "I was also previously a software developer for PATH, a nonprofit organization providing housing and necessities to low-income families across LA. And many more!",
        link: { text: "Check out my resume here", href: "assets/docs/Resume_Anh_Thu_Do.pdf" },
        image: "assets/img/cards/experience/path.png",
        fit: "contain",
      },
    ],
  },
  {
    rank: "Q",
    title: "Eating",
    slides: [
      {
        heading: "Good Eats",
        body: "I love eating and would always get so excited planning food trips",
        gallery: [
          "assets/img/cards/eating/web/food-01.jpg",
          "assets/img/cards/eating/web/food-02.jpg",
          "assets/img/cards/eating/web/food-03.jpg",
          "assets/img/cards/eating/web/food-04.jpg",
          "assets/img/cards/eating/web/food-05.jpg",
          "assets/img/cards/eating/web/food-06.jpg",
          "assets/img/cards/eating/web/food-07.jpg",
          "assets/img/cards/eating/web/food-08.jpg",
          "assets/img/cards/eating/web/food-09.jpg",
        ],
      },
    ],
  },
  {
    rank: "J",
    title: "Travel",
    slides: [
      {
        heading: "Travel",
        body: "I love to travel. Here are some of my favorite travel photos.",
        gallery: [
          "assets/img/cards/travel/web/travel-01.jpg",
          "assets/img/cards/travel/web/travel-02.jpg",
          "assets/img/cards/travel/web/travel-03.jpg",
          "assets/img/cards/travel/web/travel-04.jpg",
        ],
      },
    ],
  },
  {
    rank: "2",
    title: "Hobbies",
    slides: [
      {
        heading: "Dancing",
        body: "I started dancing in 2nd grade. Dance is my form of self-expression.",
        image: "assets/img/cards/pottery/catdancing.gif",
        fit: "contain",
      },
      {
        heading: "Pottery",
        body: "I've been enjoying pottery recently. I love the creativity and freedom of ceramics",
        image: "assets/img/cards/pottery/web/pottery-01.jpg",
      },
    ],
  },
  {
    rank: "5",
    title: "Projects",
    slides: [
      {
        heading: "Dango",
        body: "Social media app for sharing restaurant itineraries fueled by my passion for good eats",
      },
      {
        heading: "Glow",
        body: "Ecommerce store for cosmetics motivated by my love for cosmetics and self-expression through makeup.",
      },
    ],
  },
];
