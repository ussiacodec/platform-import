const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // add this line
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middlewares/auth');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const eventRoutes = require('./routes/eventRoutes');
const businessPlanRoutes = require('./routes/businessPlanRoutes');
const ideaRoutes = require('./routes/ideaRoutes');
const faqRoutes = require('./routes/faqRoutes');


dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to database');
  })
  .catch((error) => {
    console.error(error);
  });

app.use(cors()); // add this line
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/events', eventRoutes);
app.use('/plans', businessPlanRoutes);
app.use('/ideas', ideaRoutes);
app.use('/faqs', faqRoutes);

app.get('/protected', authMiddleware, (req, res) => {
  res.send(`Hello, ${req.user.email}`);
});

// route
app.get("/", (req, res) => {
    // Sending This is the home page! in the page
    res
      .status(200)
      .send(`This is the home page and running on ${process.env.PORT}`);
  });

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'USSIA Starter Platform',
      version: '1.0.0',
      description: 'API Documentation for your application',
      contact: {
        name: 'Ataano',
        email: 'ataano50@gmail.com'
      },
      servers: [`http://localhost:${process.env.PORT}`]
    },
    components: {},
  },
  apis: ['./routes/*.js'], // Add path to your API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.listen(5000, () => {
  console.log('Server started');
});
