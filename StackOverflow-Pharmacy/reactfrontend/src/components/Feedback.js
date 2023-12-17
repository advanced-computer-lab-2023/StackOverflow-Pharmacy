import React from 'react';
import { Typography, Container, Box, Paper, Avatar, Rating } from '@mui/material';

const Feedback = () => {
  const feedbackData = [
    {
      user: 'John Doe',
      rating: 4.5,
      comment:
        "I've been a customer at Abdullah pharmacy for years. The service is consistently excellent. The staff is friendly and knowledgeable, and the convenience of online prescription refills makes my life much easier. Highly recommended!",
    },
    {
      user: 'Jane Smith',
      rating: 5,
      comment:
        "Impressed with the professionalism and efficiency of Abdullah pharmacy. The pharmacists go above and beyond to answer questions and provide valuable insights. The personalized care and attention to detail make this pharmacy stand out.",
    },
    {
      user: 'Sam Johnson',
      rating: 4,
      comment:
        "Great experience every time I visit Abdullah pharmacy. The atmosphere is welcoming, and the staff is attentive. Quick service and a wide range of products. Definitely my go-to pharmacy.",
    },
  ];

  return (
    <Container>
      <Typography variant="h5" align="center" gutterBottom sx={{ mt: 5 }}>
        Customers Feedback
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        {feedbackData.map((feedback, index) => (
          <Paper key={index} sx={{ p: 3, mt: 3, width: '30%', textAlign: 'center' }}>
            <Avatar sx={{ width: 80, height: 70, mb: 2 }} alt={feedback.user} />
            <Typography variant="h6" gutterBottom>
              {feedback.user}
            </Typography>
            <Rating value={feedback.rating} readOnly precision={0.5} />
            <Typography sx={{ mt: 2 }}>{feedback.comment}</Typography>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default Feedback;
