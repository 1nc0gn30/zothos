import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "https://plus.unsplash.com/premium_photo-1679429321019-ead74d467206?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1663036988004-3e134ce59780?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1664474470266-a50eae18ae30?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const AboutPageHero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 10000); // Change every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const handleScrollToForm = () => {
    const section = document.getElementById("contact-form");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "700px",
        overflow: "hidden",
        backgroundColor: "#E0E0E0",
      }}
    >
         <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: 'url(/assets/images/EvergreenGreenLogo.png)',
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: 0.8,
          zIndex: 1,
        }}
      />
      {/* Rotating Image Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${images[index]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 1,
          }}
        />
      </AnimatePresence>

      {/* Centered Overlay Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)", // Centering the content
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(13, 77, 49, 0.75)", // Evergreen green overlay
              padding: 4,
              borderRadius: 8,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: { xs: "2rem", md: "4rem" },
                width: { xs: "80vw", md: "50vw" },
              }}
            >
              About Us
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: "white", textAlign: "center", mt: 2 }}
            >
              "Dedicated to Providing Compassionate, High-Quality Care"
            </Typography>
            <Button
              variant="contained"
              sx={{
                mt: 4,
                background: "#56B435",
                "&:hover": { background: "#4CA730" },
              }}
              onClick={handleScrollToForm}
            >
              Get In Touch
            </Button>
          </Box>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default AboutPageHero;
