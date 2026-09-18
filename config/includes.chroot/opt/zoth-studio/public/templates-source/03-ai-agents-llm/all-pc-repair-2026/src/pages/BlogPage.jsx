import { Helmet } from 'react-helmet-async';
import { Container, Typography, Grid, Box } from '@mui/material';
import { motion } from 'framer-motion';
import BlogPreview from './BlogPreview';

const BlogPage = ({ blogs }) => {
  return (
    <>
      <Helmet>
        <title>Blog & Tech Insights | All PC Repair</title>
        <meta name="description" content="Explore articles, cybersecurity guides, and computer repair tips from All PC Repair in Hampton Roads, VA." />
        <meta name="keywords" content="Blog, All PC Repair, IT solutions, cybersecurity, tech trends, Virginia Beach, Norfolk, Chesapeake" />
        <link rel="canonical" href="https://www.allpcrepairva.com/blog" />
        <meta property="og:title" content="Blog & Tech Insights | All PC Repair" />
        <meta property="og:description" content="Explore the latest articles on IT solutions and cybersecurity from All PC Repair." />
        <meta property="og:url" content="https://www.allpcrepairva.com/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.allpcrepairva.com/assets/1.png" />
      </Helmet>
      
      <Box sx={{ py: 6, mb: 4, background: 'linear-gradient(180deg, rgba(18, 18, 24, 0.9) 0%, rgba(10, 10, 16, 0.95) 100%)' }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ color: '#FFD700', fontWeight: 700 }}>
              IT Insights & Cybersecurity Blog
            </Typography>
            <Typography variant="h6" component="p" align="center" sx={{ color: '#B0BEC5', mb: 4 }}>
              Expert guides, hardware repair walkthroughs, and security tips from the All PC Repair engineering team.
            </Typography>
          </motion.div>
        </Container>
      </Box>
      
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 }, pb: 8 }}>
        <Grid container spacing={4}>
          {blogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <BlogPreview blog={blog} />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default BlogPage;
