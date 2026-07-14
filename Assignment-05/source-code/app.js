require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travelagency';

// Models
const Package = require('./models/Package');
const Booking = require('./models/Booking');

// Middleware Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database Connection
mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log(`Connected to MongoDB at ${MONGODB_URI}`);
        await seedDatabase();
    }).catch(err => {
        console.error('Error connecting to MongoDB. Please ensure MongoDB is running globally or start the service.', err);
    });

// Seed Data
async function seedDatabase() {
    try {
        const count = await Package.countDocuments();
        if (count === 0) {
            console.log("Seeding database with initial travel packages...");
            const initialPackages = [
                {
                    title: "Maldives Paradise Escape",
                    description: "Experience the crystal clear waters and overwater bungalows of the Maldives. Perfect for couples and honeymooners.",
                    price: 2499,
                    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    duration: "7 Days / 6 Nights",
                    destinations: ["Male", "Baa Atoll"]
                },
                {
                    title: "Swiss Alps Adventure",
                    description: "Breathtaking mountain views, scenic train rides, and pure alpine air. An unforgettable journey through Switzerland.",
                    price: 1899,
                    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    duration: "5 Days / 4 Nights",
                    destinations: ["Zurich", "Interlaken", "Zermatt"]
                },
                {
                    title: "Bali Cultural Immersion",
                    description: "Discover ancient temples, lush rice terraces, and beautiful beaches in the Island of the Gods.",
                    price: 1299,
                    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    duration: "10 Days / 9 Nights",
                    destinations: ["Ubud", "Seminyak", "Nusa Penida"]
                },
                {
                    title: "Kyoto Heritage Tour",
                    description: "Walk through history in Japan's cultural heart. Experience tea ceremonies, bamboo forests, and stunning shrines.",
                    price: 2199,
                    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    duration: "8 Days / 7 Nights",
                    destinations: ["Kyoto", "Osaka", "Nara"]
                }
            ];
            await Package.insertMany(initialPackages);
            console.log("Successfully seeded travel packages!");
        }
    } catch (err) {
        console.error("Error seeding database", err);
    }
}

// Routes
app.get('/', async (req, res) => {
    try {
        const packages = await Package.find().limit(3);
        res.render('index', { packages });
    } catch (err) {
        res.status(500).send("Database error occurred.");
    }
});

app.get('/packages', async (req, res) => {
    try {
        const packages = await Package.find();
        res.render('packages', { packages });
    } catch (err) {
        res.status(500).send("Database error occurred.");
    }
});

app.get('/book/:id', async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (!pkg) return res.status(404).send('Package not found');
        res.render('book', { pkg });
    } catch (err) {
        res.status(500).send("Database error occurred.");
    }
});

app.post('/book/:id', async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (!pkg) return res.status(404).send('Package not found');

        const { customerName, email, phone, travelDate, numberOfTravelers } = req.body;

        const travelers = parseInt(numberOfTravelers, 10);
        const totalPrice = pkg.price * travelers;

        const booking = new Booking({
            packageId: pkg._id,
            customerName,
            email,
            phone,
            travelDate,
            numberOfTravelers: travelers,
            totalPrice
        });

        await booking.save();
        res.render('success', { booking, pkg });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating booking.");
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Travel Agency Server is running on http://localhost:${PORT}`);
});
