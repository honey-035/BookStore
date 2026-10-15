require("dotenv").config();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "change-this-password";

const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose');
const multer = require('multer')
const nodemailer = require('nodemailer')
const session = require('express-session')

async function main() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://honey:v2pqWjof1E6H9UOU@ac-xvmonoi-shard-00-00.7g846wq.mongodb.net:27017,ac-xvmonoi-shard-00-01.7g846wq.mongodb.net:27017,ac-xvmonoi-shard-00-02.7g846wq.mongodb.net:27017/?ssl=true&replicaSet=atlas-hjnszu-shard-0&authSource=admin&appName=Cluster0';
    await mongoose.connect(mongoUri);
}

main()
    .then(() => console.log("DB Connected"))
    .catch((err) => {
        console.error("Database connection failed:", err.message);
        console.error("Check MONGODB_URI in your .env file and make sure MongoDB is running.");
    });

const bookschema = new mongoose.Schema({
    title:String,
    author:String,
    price:Number,
    category:String,
    img:String
})

const Book = mongoose.model("Book",bookschema)
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended : true}))

// Personal contact details are configured in .env, not hardcoded in templates.
app.locals.siteEmail = process.env.CONTACT_EMAIL || 'your-email@example.com';
app.locals.sitePhone = process.env.CONTACT_PHONE || 'Add your phone number';
app.locals.siteWhatsapp = (process.env.WHATSAPP_NUMBER || '').replace(/\D/g, '');
app.locals.siteGithub = process.env.GITHUB_URL || 'https://github.com/';
app.locals.siteLocation = process.env.STORE_LOCATION || 'Your city, India';
app.locals.siteName = process.env.SITE_NAME || 'Book Worm';


app.use(session({
    secret: process.env.SESSION_SECRET || 'replace-this-session-secret-before-deployment',
    resave: false,
    saveUninitialized: true
}))

function isAdmin(req,res,next){
    if(req.session.isAdmin){
        next()
    }else{
        res.send("Access Denied")
    }
}

app.get('/admin/login',(req,res)=>{
    res.render('adminlogin')
})
app.get('/admin/logout',(req,res)=>{
    req.session.destroy()
    res.redirect("/")
})
app.post('/admin/login',(req,res)=>{
    const username = req.body.username
    const password = req.body.password
    if(username === ADMIN_USERNAME && password === ADMIN_PASSWORD){
        req.session.isAdmin=true
        res.redirect('/books')
    }else{
        res.send("Invalid Username or Password")
    }
})



app.use((req, res, next) => {
    const cart = req.session.cart || [];
    res.locals.cartCount = cart.reduce(
        (total, book) => total + book.quantity,
        0
    );
    next();
});

const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null,'public/uploads')
    },
    filename:function(req, file, cb){
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({storage :storage})

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

app.get('/', async (req, res) => {
    const books = await Book.find().sort({ _id: -1 }).limit(2);
    res.render('home', { books });
})
app.get('/about',(req,res)=>{
    res.render('about')
})
app.get('/books',async(req,res)=>{
    const books = await Book.find();
    res.render('books',{ books,isAdmin:req.session.isAdmin })
})
app.get('/books/new',(req,res)=>{
    res.render('newbook')
})

app.post('/books',isAdmin,upload.single('img'),async(req,res)=>{
    const book = new Book({
        title:req.body.title,
        author:req.body.author,
        price:req.body.price,
        category:req.body.category,
        img:'/uploads/' + req.file.filename
    })
    await book.save()
    res.redirect('/books')
})

app.post('/books/delete/:id',isAdmin,async(req,res)=>{
    const id = req.params.id
    await Book.findByIdAndDelete(id)
    res.redirect('/books')
})

app.post('/cart/add/:id', async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
        return res.send('Book not found');
    }
    if (!req.session.cart) {
        req.session.cart = [];
    }
    const existingBook = req.session.cart.find(
        item => String(item.id) === String(book._id)
    );
    if (existingBook) {

        existingBook.quantity += 1;
    } else {
        req.session.cart.push({
            id: book._id,
            title: book.title,
            author: book.author,
            price: book.price,
            img: book.img,
            quantity: 1
        });
    }
    res.redirect('/cart');
})
app.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    res.render('cart', { cart });
});

app.get('/checkout', (req, res) => {
    const cart = req.session.cart || [];
    res.render('checkout', { cart });

});

app.post('/cart/increase/:id', (req, res) => {
    const book = req.session.cart.find(
        item => String(item.id) === String(req.params.id)
    );
    if (book) {
        book.quantity += 1;
    }
    res.json({
        quantity: book ? book.quantity : 0
    });
});

app.post('/cart/decrease/:id', (req, res) => {
    const bookIndex = req.session.cart.findIndex(
        item => String(item.id) === String(req.params.id)
    );
    if (bookIndex !== -1) {
        req.session.cart[bookIndex].quantity -= 1;
        if (req.session.cart[bookIndex].quantity <= 0) {
            req.session.cart.splice(bookIndex, 1);
        }
    }
    const remainingBook = req.session.cart.find(
        item => String(item.id) === String(req.params.id)
    );
    res.json({
        quantity: remainingBook ? remainingBook.quantity : 0
    });
});
app.get('/books/edit/:id',isAdmin,async(req,res)=>{
    const id = req.params.id
    const books = await Book.findById(id)
    res.render('editbook',{ books })
})

app.post('/books/edit/:id', upload.single('img'), async(req,res)=>{
    const id = req.params.id
    const books = await Book.findById(id)
    books.title = req.body.title
    books.author = req.body.author
    books.price = req.body.price
    books.category = req.body.category
    if(req.file){
        books.img = '/uploads/' + req.file.filename
    }
    await books.save()
    res.redirect('/books')
})

app.get('/category', async(req, res)=>{
    const books = await Book.find();

    const categories = [...new Set(
        books.map(book => book.category.trim())
    )];

    res.render('categories', {books, categories});
});


app.get('/category/:category', async(req, res)=>{
    const category = req.params.category;
    const allBooks = await Book.find();
    const books = allBooks.filter(book =>
        book.category.trim() === category.trim()
);
    const categories = [...new Set(
    allBooks.map(book => book.category.trim())
)];
    res.render('categories', {books, categories});
});

app.get('/contact',(req,res)=>{  
    res.render('contact')
})
app.post('/contact', async (req, res) => {
    const { name, email, mob, message } = req.body;

    if (!name || !email || !mob || !message) {
        return res.status(400).send('Please fill in all contact form fields.');
    }


    const phoneDigits = mob.replace(/\D/g, '');

    if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
        return res.status(400).send(`
            <script>
                alert("Please enter a valid 10-digit Indian mobile number.");
                window.location.href = "/contact";
            </script>
        `);
    }


    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD || !process.env.CONTACT_EMAIL) {
        return res.status(500).send(
            'Contact email is not configured yet. Add EMAIL_USER, EMAIL_APP_PASSWORD, and CONTACT_EMAIL to your .env file.'
        );
    }

    try {
        await transport.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.CONTACT_EMAIL,
            replyTo: email,
            subject: `New ${app.locals.siteName} message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${mob}\nMessage: ${message}`
        });
        return res.send(`<script>
            alert("Message sent successfully!");
            window.location.href = "/contact";
        </script>`);
    } catch (error) {
        console.error('Contact email failed:', error.message);
        return res.status(500).send(
            'Email could not be sent. Check your Gmail app password and email configuration in .env.'
        );
    }
});

app.post('/place-order', (req, res) => {
    const payment = req.body.payment;
    const cart = req.session.cart || [];
    if (cart.length === 0) {
        return res.redirect('/cart');
    }
    const total = cart.reduce((sum, book) => {
        return sum + (book.price * book.quantity);
    }, 0);
    req.session.cart = [];
    res.render('order-success', {
        payment,
        total
    });
});

app.listen(port,()=>{
    console.log("Listening on "+port)
})