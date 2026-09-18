const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const { email, password } = JSON.parse(event.body);

  // Add your authentication logic here
  // For demonstration, we'll just return a success response
  const success = email === 'test@grindstone.com' && password === 'password';

  return {
    statusCode: 200,
    body: JSON.stringify({ success }),
  };
};
