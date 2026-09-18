import { useParams } from 'react-router-dom';
import { Container, Typography, Button, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

const BlogContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

const BlogImage = styled('img')(({ theme }) => ({
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  width: '100%',
  height: 'auto',
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

// Function to convert text with <b> tags to bold
const renderBoldText = (text) => {
  const parts = text.split(/<\/?b>/); // Split text by <b> and </b> tags
  return parts.map((part, index) => {
    if (index % 2 === 1) { // Odd indexes indicate text wrapped in <b> tags
      return <strong key={index}>{part}</strong>;
    } else {
      return part; // Normal text parts
    }
  });
};

const Blog = ({ blogs }) => {
  const { pageId } = useParams();
  const blog = blogs.find((b) => b.pageId === pageId);

  if (!blog) {
    return (
      <BlogContainer>
        <Typography variant="h6" align="center" sx={{ my: 4 }}>
          Blog post not found.
        </Typography>
      </BlogContainer>
    );
  }

  return (
    <BlogContainer component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography className="blog-title" component="h1" gutterBottom align="center">
          {blog.seoTitle}
        </Typography>
        <BlogImage src={blog.seoLogo} alt={blog.seoTitle} />
        <Typography variant="body1" paragraph>
          {renderBoldText(blog.seoIntro)}
        </Typography>
        {blog.seoDescription.map((paragraph, index) => (
          <Typography key={index} variant="body1" paragraph>
            {renderBoldText(paragraph)}
          </Typography>
        ))}
        {blog.seoAdditionalBody && blog.seoAdditionalBody.map((paragraph, index) => (
          <Typography key={index} variant="body1" paragraph>
            {renderBoldText(paragraph)}
          </Typography>
        ))}
        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item>
            <Button
              variant="contained"
              component="a"
              href={blog.seoExternalLinks[0]}
              target="_blank"
              rel="noopener noreferrer"
            >
              {blog.seoCta}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              component={Link}
              to={"/services"}
            >
              {blog.seoServiceCta}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </BlogContainer>
  );
};

export default Blog;