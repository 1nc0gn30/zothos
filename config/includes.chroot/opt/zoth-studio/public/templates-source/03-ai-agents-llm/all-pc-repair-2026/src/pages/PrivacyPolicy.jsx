import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box } from '@mui/material';
import QuoteComponent from '../components/QuoteComponent';

const PrivacyPolicy = () => {
  return (
    <Container sx={{ my: 4, fontFamily: 'Poppins, sans-serif' }}>
      <Helmet>
        <title>Privacy Policy | All PC Repair</title>
        <meta name="description" content="Read the privacy policy of All PC Repair, located in Chesapeake, VA. Learn about the information we collect, how we use it, and our commitment to protecting your privacy." />
        <meta name="keywords" content="Privacy Policy, All PC Repair, Virginia Beach, Information Collection, Data Protection, Online Privacy" />
        <link rel="canonical" href="https://www.allrepairpcva.com/privacy-policy" />
        <meta property="og:title" content="Privacy Policy | All PC Repair" />
        <meta property="og:description" content="Read the privacy policy of All PC Repair, located in Chesapeake, VA. Learn about the information we collect, how we use it, and our commitment to protecting your privacy." />
        <meta property="og:url" content="https://www.allrepairpcva.com/privacy-policy" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/3.png" />
      </Helmet>
      <Box sx={{ border: '2px solid gold', p: 4, backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" color="black">
          Privacy Policy
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          What Information Do We Collect?
        </Typography>
        <Typography variant="body1" paragraph>
          We collect information from you when you fill out a form. When ordering or registering on our site, as appropriate, you may be asked to enter your name, e-mail address, or phone number. You may, however, visit our site anonymously.
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          What Do We Use Your Information For?
        </Typography>
        <Typography variant="body1" paragraph>
          Any of the information we collect from you may be used in one of the following ways:
        </Typography>
        <ul>
          <li>
            <Typography variant="body1" paragraph>
              <strong>To Personalize Your Experience:</strong> Your information helps us better respond to your individual needs.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" paragraph>
              <strong>To Improve Our Website:</strong> We continually strive to improve our website offerings based on the information and feedback we receive from you.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" paragraph>
              <strong>To Improve Customer Service:</strong> Your information helps us more effectively respond to your customer service requests and support needs.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" paragraph>
              <strong>To Send Periodic Emails:</strong> The email address you provide may be used to send you information, respond to inquiries, and/or other requests or questions.
            </Typography>
          </li>
        </ul>

        <Typography variant="h6" component="h2" gutterBottom>
          Do We Disclose Any Information to Outside Parties?
        </Typography>
        <Typography variant="body1" paragraph>
          We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety. However, non-personally identifiable visitor information may be provided to other parties for marketing, advertising, or other uses.
        </Typography>
	<Typography variant="body1" paragraph>
	  No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. All other categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.
	</Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          Children's Online Privacy Protection Act (COPPA) Compliance
        </Typography>
        <Typography variant="body1" paragraph>
          We are in compliance with the requirements of COPPA (Children's Online Privacy Protection Act), and we do not collect any information from anyone under 13 years of age. Our website, products, and services are all directed to people who are at least 13 years old or older.
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          Online Privacy Policy Only
        </Typography>
        <Typography variant="body1" paragraph>
          This online privacy policy applies only to information collected through our website and not to information collected offline.
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          Your Consent
        </Typography>
        <Typography variant="body1" paragraph>
          By using our site, you consent to our privacy policy.
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          Changes to Our Privacy Policy
        </Typography>
        <Typography variant="body1" paragraph>
          If we decide to change our privacy policy, we will post those changes on this page.
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          Contacting Us
        </Typography>
        <Typography variant="body1" paragraph>
          If there are any questions regarding this privacy policy, you may contact us using the information below:
        </Typography>
        <Typography variant="body1" paragraph>
          <a href="http://www.allpcrepairva.com" style={{ color: 'blue' }}>www.allpcrepairva.com</a><br />
          <a href="mailto:info@allpcrepairva.com" style={{ color: 'blue' }}>info@allpcrepairva.com</a><br />
          757-559-1231
        </Typography>
      </Box>
      <QuoteComponent />
    </Container>
  );
};

export default PrivacyPolicy;
