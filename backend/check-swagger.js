const https = require('https');
https.get('https://nyooci-app.vercel.app/api-docs/swagger-ui-init.js', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Has /api/auth/login:', data.includes('/api/auth/login'));
    console.log('Has /api/services:', data.includes('/api/services'));
    console.log('Has /api/bookings:', data.includes('/api/bookings'));
    console.log('Has /api/financial:', data.includes('/api/financial'));
    console.log('Total length:', data.length);
  });
});
