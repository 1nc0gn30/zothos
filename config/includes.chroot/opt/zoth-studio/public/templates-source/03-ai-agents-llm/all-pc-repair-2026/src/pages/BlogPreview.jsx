import { Typography, Button, Card, CardMedia, CardContent, CardActions } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

const BlogCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  height: 460,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.05)',
    transition: 'transform 0.3s ease-in-out',
  },
}));

const BlogCardMedia = styled(CardMedia)({
  height: 240,
});

const BlogCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  paddingBottom: theme.spacing(4),
}));

const BlogCardActions = styled(CardActions)({
  position: 'absolute',
  bottom: 10,
  left: 10,
  width: '100%',
  display: 'flex',
});

const BlogPreview = ({ blog }) => {
  if (!blog) {
    return null;
  }

  
  const renderBoldText = (text) => {
    const parts = text.split(/<\/?b>/);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index}>{part}</strong>;
      } else {
        return part;
      }
    });
  };

  return (
    <BlogCard>
      <BlogCardMedia
        component="img"
        image={blog.seoLogo}
        alt={blog.seoTitle}
      />
      <BlogCardContent>
        <Typography gutterBottom variant="h5" component="div">
          {blog.seoTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {renderBoldText(blog.seoIntro)}
        </Typography>
      </BlogCardContent>
      <BlogCardActions>
        <Button size="small" component={Link} to={`/blog/${blog.pageId}`} variant="contained" color="primary">
          {blog.seoCta}
        </Button>
      </BlogCardActions>
    </BlogCard>
  );
};

export default BlogPreview;