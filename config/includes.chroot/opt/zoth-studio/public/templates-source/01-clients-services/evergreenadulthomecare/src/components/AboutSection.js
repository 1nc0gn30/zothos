import React from 'react';
import {
    Typography,
    Box,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Chip,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Rating,
    Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PeopleIcon from '@mui/icons-material/People';
import MedicationIcon from '@mui/icons-material/Medication';
import { motion } from 'framer-motion';
import Grid from '@mui/material/Grid2';

const fadeIn = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const MissionCard = ({ icon, title, description, imageUrl, stats }) => (
    <Grid item="true" size={{xs: 12, sm: 10, md: 8, lg: 6}} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Card
            component={motion.div}
            variants={fadeIn}
            initial="initial"
            animate="animate"
            sx={{
                width: '100%',
                maxWidth: '500px',
                borderRadius: '16px',
                boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#56B435',
                color: 'white',
                position: 'relative',
            }}
        >
            <Chip
                label="Featured"
                color="success"
                sx={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    fontSize: '0.9rem',
                    padding: '8px 12px',
                }}
            />
            <CardContent>
                <Box
                    component="img"
                    src={imageUrl}
                    alt={title}
                    sx={{
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginBottom: '16px',
                    }}
                />
                <IconButton color="default" sx={{ backgroundColor: 'white', marginBottom: '16px' }}>
                    {icon}
                </IconButton>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: '700' }}>
                    {title}
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, marginBottom: '16px' }}>
                    {description}
                </Typography>

                {/* Stats Section with Star Ratings */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                    {stats.map((stat) => (
                        <Box key={stat.label} sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Typography>{stat.label}</Typography>
                            <Rating name={stat.label} value={stat.value} readOnly />
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    </Grid>
);

const OfferingsCard = () => (
    <Grid item="true" size={{xs: 12, sm: 10, md: 8, lg: 6}} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Card
            component={motion.div}
            variants={fadeIn}
            initial="initial"
            animate="animate"
            sx={{
                width: '100%',
                maxWidth: '500px',
                borderRadius: '16px',
                boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#0A4704',
                color: 'white',
                overflow: 'hidden', // Prevent layout shifting from accordion
            }}
        >
            <CardContent>
                <Box
                    component="img"
                    src="https://media.istockphoto.com/id/1917170353/photo/happy-woman-nurse-and-hug-senior-patient-in-elderly-care-support-or-trust-at-old-age-home.jpg?s=612x612&w=0&k=20&c=zH44DlsKiH5Ru6Ob4rt8-Ygt6E4zb0Yf7J8TqLKFo50="
                    alt="What We Offer"
                    sx={{
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginBottom: '16px',
                    }}
                />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: '700' }}>
                    What We Offer
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', marginBottom: '8px' }}>
                    Click the dropdowns below to explore our services in detail.
                </Typography>
                <Divider sx={{ backgroundColor: 'white', marginBottom: '16px' }} />

                {/* Accordion Sections */}
                {['Services', 'Care Packages', 'Additional Support'].map((section) => (
                    <Accordion
                        key={section}
                        sx={{ backgroundColor: 'transparent', color: 'white' }}
                        disableGutters // Prevent extra spacing
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                            <Typography>{section}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <PeopleIcon sx={{ color: 'white' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Companionship and social interaction" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <RestaurantIcon sx={{ color: 'white' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Meal planning and preparation" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <MedicationIcon sx={{ color: 'white' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Medication reminders" />
                                </ListItem>
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))}

                <Box sx={{ marginTop: '16px', textAlign: 'center' }}>
                    <Button
                        component={Link}
                        to="/contact"
                        variant="contained"
                        color="success"
                    >
                        Contact Us
                    </Button>
                </Box>
            </CardContent>
        </Card>
    </Grid>
);

const AboutSection = () => (
    <Box sx={{ marginTop: '32px', textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: '600', marginBottom: '24px', color: '#0A4704' }}>
            Our Mission and What We Offer
        </Typography>

        <Grid container flexDirection="column" alignContent="center" spacing={4} justifyContent="center">
            <MissionCard
                icon={<FavoriteIcon />}
                title="Our Mission"
                description="Our mission is to enhance the quality of life for those we serve by delivering reliable, compassionate care."
                imageUrl="https://media.istockphoto.com/id/1473155461/photo/nurse-hands-and-senior-patient-in-empathy-safety-and-support-of-help-trust-and-healthcare.jpg?s=2048x2048&w=is&k=20&c=SqJVSzEmp_Ufsz8RJYiM9w_585Jh0vF4cxuJkhsIhj0="
                stats={[
                    { label: 'Years in Service', value: 5 },
                    { label: 'Clients Served', value: 5 },
                    { label: 'Caregivers', value: 5 },
                ]}
            />
            <OfferingsCard />
        </Grid>
    </Box>
);

export default AboutSection;
