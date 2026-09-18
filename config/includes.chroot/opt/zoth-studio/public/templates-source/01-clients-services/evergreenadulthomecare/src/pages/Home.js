import React from "react";
import LandingPageHero from "../components/LandingPageHero";
import PhotoWithText from "../components/PhotoWithText";
import FancyDivider from "../components/FancyDivider";
import HeadingsWithImages from "../components/HeadingsWithImages";
import MissionStatement from "../components/MissionStatement";
import StaffSection from "../components/StaffSection";
import ContactForm from "../components/ContactForm";
import ParallaxImageSection from "../components/ParallaxImageSection";

const Home = () => {
    return (
        <>
        <LandingPageHero />
      <PhotoWithText
        imageUrl="https://via.placeholder.com/300"
        title="Evergreen Adult Home Care"
        description="Providing compassionate and reliable home care services for the elderly. Our team is dedicated to ensuring comfort and well-being for your loved ones."
      />
       <FancyDivider  />
      <HeadingsWithImages />
      <MissionStatement />
      <StaffSection />
      <ContactForm />
      <ParallaxImageSection /></>
    )
}

export default Home;