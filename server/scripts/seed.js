const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config({ path: '../.env' });

// Load Models
const User = require('../models/User');
const Product = require('../models/Product');
const Service = require('../models/Service');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const users = [
    {
        name: 'Admin User',
        email: 'admin@binarycraft4u.com',
        password: 'AdminPassword123!', // will be hashed
        role: 'admin',
        phone: '+1 555-123-4567',
        address: { street: '123 Tech Lane', city: 'Silicon Valley', country: 'USA' }
    }
];

const products = [
    {
        title: 'Acme UI Kit',
        description: 'A premium UI kit for modern web applications featuring 100+ components.',
        price: 49.99,
        category: 'design',
        icon: '🎨',
        stock: 999,
        tags: ['New', 'Figma']
    },
    {
        title: 'SaaS Boilerplate',
        description: 'Complete Next.js, Node, and MongoDB boilerplate to start your next SaaS in minutes.',
        price: 149.00,
        discountPrice: 99.00,
        category: 'software',
        icon: '🚀',
        stock: 50,
        tags: ['Sale', 'React']
    }
];

const services = [
    {
        title: 'Custom Web Application',
        description: 'Full-stack development of custom web applications tailored to your business needs.',
        price: 1500,
        category: 'web',
        icon: '🌐',
        delivery: '14-30 days',
        features: ['React/Next.js Frontend', 'Node.js/Python Backend', 'Database Design', 'Deployment']
    },
    {
        title: 'Cybersecurity Audit',
        description: 'Comprehensive security audit of your application architecture and codebase.',
        price: 800,
        category: 'security',
        icon: '🛡️',
        delivery: '5-7 days',
        features: ['Vulnerability Scanning', 'Penetration Testing', 'Actionable Report']
    }
];

const importData = async () => {
    try {
        console.log('Clearing database...');
        await User.deleteMany();
        await Product.deleteMany();
        await Service.deleteMany();

        console.log('Seeding Users...');
        const salt = await bcrypt.genSalt(10);
        const hashedUsers = users.map(user => ({
            ...user,
            password: bcrypt.hashSync(user.password, salt)
        }));
        await User.insertMany(hashedUsers);

        console.log('Seeding Products...');
        await Product.insertMany(products);

        console.log('Seeding Services...');
        await Service.insertMany(services);

        console.log('✅ Local Data Imported Successfully!');
        process.exit();
    } catch (err) {
        console.error(`❌ Error importing data: ${err.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    console.log('Data destruction not implemented here. Use standard connect.');
    process.exit();
} else {
    importData();
}
