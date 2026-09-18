import { Helmet } from 'react-helmet-async';
import AboutSection from '../components/AboutSection';

const About = () => {
  return (
    <>
      <Helmet>
        <title>Who We Are | All PC Repair - Managed IT & Computer Repair Experts</title>
        <meta name="description" content="Discover All PC Repair's story, mission, and expert team in Hampton Roads, VA. Enterprise IT, cybersecurity, cloud solutions, and hardware repair." />
        <meta name="keywords" content="Who We Are, About All PC Repair, IT solutions, cybersecurity, Virginia Beach, Norfolk, Chesapeake, Managed IT" />
        <link rel="canonical" href="https://www.allpcrepairva.com/who-we-are" />
        <meta property="og:title" content="Who We Are | All PC Repair - Managed IT Experts" />
        <meta property="og:description" content="Discover our story and mission at All PC Repair in Hampton Roads, VA." />
        <meta property="og:url" content="https://www.allpcrepairva.com/who-we-are" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.allpcrepairva.com/assets/1.png" />
      </Helmet>
      <AboutSection />
    </>
  );
};

export default About;
