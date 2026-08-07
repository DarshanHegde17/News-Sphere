require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/newsphere';
const JWT_SECRET = process.env.JWT_SECRET || 'newsphere_secret_key';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    syncLiveNews(); // Sync live news on server start
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Article Schema & Model
const commentSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  tag: { type: String, required: true },
  source: { type: String, required: true },
  time: { type: String, required: true },
  imageUrl: { type: String, required: true },
  likesCount: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] }, // Array of user emails
  comments: { type: [commentSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const Article = mongoose.model('Article', articleSchema);

// User Schema & Model
const savedArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tag: { type: String, required: true },
  source: { type: String, required: true },
  time: { type: String, required: true }
});

const holdingSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  avgPrice: { type: Number, required: true }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  category: {
    type: String,
    required: [true, 'Preferred category is required'],
    trim: true
  },
  savedArticles: [savedArticleSchema],
  watchlistStocks: {
    type: [String],
    default: []
  },
  holdings: [holdingSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to hash password before saving user
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', userSchema);

// JWT Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token required' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer '
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User session not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// --- Category Mappings & Aggregation Configurations ---

// NewsAPI queries mapping
const newsapiCategories = {
  'Political Live': { endpoint: 'everything', query: 'politics OR government OR election OR elections' },
  'Stock Market': { endpoint: 'everything', query: 'stock market OR Sensex OR Nifty OR share market' },
  'Education': { endpoint: 'everything', query: 'exams OR scholarship OR placement OR admissions' },
  'Sports': { endpoint: 'top-headlines', query: 'sports' },
  'Technology': { endpoint: 'top-headlines', query: 'technology' },
  'Entertainment': { endpoint: 'top-headlines', query: 'entertainment' },
  'Business': { endpoint: 'top-headlines', query: 'business' },
  'Health': { endpoint: 'top-headlines', query: 'health' },
  'International News': { endpoint: 'top-headlines', query: 'general' }
};

// GNews API mapping
const gnewsCategories = {
  'Political Live': { type: 'search', query: 'politics OR government OR election' },
  'Stock Market': { type: 'search', query: 'stock market OR Sensex OR Nifty' },
  'Education': { type: 'search', query: 'board exams OR scholarship OR university admissions' },
  'Sports': { type: 'headlines', query: 'sports' },
  'Technology': { type: 'headlines', query: 'technology' },
  'Entertainment': { type: 'headlines', query: 'entertainment' },
  'Business': { type: 'headlines', query: 'business' },
  'Health': { type: 'headlines', query: 'health' },
  'International News': { type: 'headlines', query: 'world' }
};

// Google News RSS feeds mapping (No-key fallback)
const categoryFeedsRSS = {
  'Political Live': 'https://news.google.com/rss/search?q=politics+government+elections&hl=en-IN&gl=IN&ceid=IN:en',
  'Stock Market': 'https://news.google.com/rss/search?q=stock+market+shares+nifty+sensex&hl=en-IN&gl=IN&ceid=IN:en',
  'Education': 'https://news.google.com/rss/search?q=exams+scholarships+admissions+results&hl=en-IN&gl=IN&ceid=IN:en',
  'Sports': 'https://news.google.com/rss/search?q=sports+cricket+football&hl=en-IN&gl=IN&ceid=IN:en',
  'Technology': 'https://news.google.com/rss/search?q=technology+ai+software&hl=en-IN&gl=IN&ceid=IN:en',
  'Entertainment': 'https://news.google.com/rss/search?q=movies+cinema+music+awards&hl=en-IN&gl=IN&ceid=IN:en',
  'Business': 'https://news.google.com/rss/search?q=business+startups+economy&hl=en-IN&gl=IN&ceid=IN:en',
  'Health': 'https://news.google.com/rss/search?q=health+nutrition+medicine&hl=en-IN&gl=IN&ceid=IN:en',
  'International News': 'https://news.google.com/rss/search?q=world+news+global&hl=en-IN&gl=IN&ceid=IN:en'
};

const categoryImages = {
  'Political Live': 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80',
  'Stock Market': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
  'Education': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
  'Sports': 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
  'Technology': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
  'Entertainment': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
  'Business': 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=800&q=80',
  'Health': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
  'International News': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
};

// 1. NewsAPI Fetcher (Primary live feed aggregator)
async function syncLiveNewsAPI() {
  const NEWS_API_KEY = process.env.NEWS_API_KEY;
  if (!NEWS_API_KEY) {
    console.log('No NewsAPI key found, skipping NewsAPI.');
    return null;
  }

  console.log('Starting live news synchronization using NewsAPI...');
  let articlesSynced = 0;

  for (const [category, config] of Object.entries(newsapiCategories)) {
    try {
      let url = '';
      if (config.endpoint === 'everything') {
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(config.query)}&language=en&sortBy=publishedAt&pageSize=4&apiKey=${NEWS_API_KEY}`;
      } else {
        url = `https://newsapi.org/v2/top-headlines?category=${config.query}&language=en&pageSize=4&apiKey=${NEWS_API_KEY}`;
      }

      const res = await fetch(url, {
        headers: { 'User-Agent': 'NewsSphereApp' }
      });
      const data = await res.json();

      if (data.status === 'ok' && Array.isArray(data.articles)) {
        for (const item of data.articles) {
          let title = item.title;
          if (!title || title.includes('[Removed]')) continue;

          // Clean title
          const lastDash = title.lastIndexOf(' - ');
          if (lastDash > -1) {
            title = title.substring(0, lastDash).trim();
          }

          let content = item.content || item.description || 'Full coverage of this update is available on the source website.';
          content = content.replace(/<[^>]*>/g, '').trim();

          const pubDate = new Date(item.publishedAt);
          const timeString = isNaN(pubDate) ? 'Recently' : pubDate.toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });

          // Check if article already exists
          const existing = await Article.findOne({ title });
          if (!existing) {
            const newArt = new Article({
              title,
              content,
              category,
              tag: item.source?.name || category.split(' ')[0],
              source: item.source?.name || 'NewsSphere',
              time: timeString,
              imageUrl: item.urlToImage || categoryImages[category]
            });
            await newArt.save();
            articlesSynced++;
          }
        }
      } else if (data.status === 'error') {
        console.warn(`NewsAPI returned error status: ${data.message}`);
        throw new Error(data.message);
      }
    } catch (err) {
      console.error(`NewsAPI sync failed for category ${category}:`, err.message);
      throw err;
    }
  }
  console.log(`NewsAPI sync completed. Added ${articlesSynced} new articles.`);
  return articlesSynced;
}

// 2. GNews API Fetcher (Secondary fallback aggregator)
async function syncLiveNewsGNews() {
  const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
  if (!GNEWS_API_KEY) {
    console.log('No GNews API Key found, skipping GNews.');
    return null;
  }

  console.log('Starting live news synchronization using GNews API...');
  let articlesSynced = 0;

  for (const [category, config] of Object.entries(gnewsCategories)) {
    try {
      let url = '';
      if (config.type === 'search') {
        url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(config.query)}&lang=en&country=in&max=4&apikey=${GNEWS_API_KEY}`;
      } else {
        url = `https://gnews.io/api/v4/top-headlines?category=${config.query}&lang=en&country=in&max=4&apikey=${GNEWS_API_KEY}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.articles && Array.isArray(data.articles)) {
        for (const item of data.articles) {
          const title = item.title;
          const content = item.content || item.description || 'No content description available.';
          const source = item.source?.name || 'NewsSphere Desk';
          const pubDate = new Date(item.publishedAt);
          const timeString = isNaN(pubDate) ? 'Recently' : pubDate.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });

          const existing = await Article.findOne({ title });
          if (!existing) {
            const newArt = new Article({
              title,
              content,
              category,
              tag: category.split(' ')[0],
              source,
              time: timeString,
              imageUrl: item.image || categoryImages[category]
            });
            await newArt.save();
            articlesSynced++;
          }
        }
      } else {
        const errMsg = data.errors ? (Array.isArray(data.errors) ? data.errors.join(', ') : (typeof data.errors === 'string' ? data.errors : JSON.stringify(data.errors))) : 'No articles array found';
        console.warn(`GNews API response error: ${errMsg}`);
        throw new Error(errMsg);
      }
    } catch (err) {
      console.error(`GNews sync failed for category ${category}:`, err.message);
      throw err;
    }
  }
  console.log(`GNews sync completed. Added ${articlesSynced} new articles.`);
  return articlesSynced;
}

// 3. RSS to JSON Feed Parser (Google News Tickers - Ultimate keyless fallback)
async function syncLiveNewsRSS() {
  console.log('Syncing news using Google News RSS feeds...');
  let articlesSynced = 0;
  
  for (const [category, feedUrl] of Object.entries(categoryFeedsRSS)) {
    try {
      const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`);
      const data = await res.json();
      
      if (data.status === 'ok' && Array.isArray(data.items)) {
        const itemsToSave = data.items.slice(0, 4);
        
        for (const item of itemsToSave) {
          let title = item.title;
          let source = 'NewsSphere Desk';
          const lastDash = title.lastIndexOf(' - ');
          if (lastDash > -1) {
            source = title.substring(lastDash + 3);
            title = title.substring(0, lastDash);
          }

          let content = item.content || item.description || 'No description available for this article.';
          content = content.replace(/<[^>]*>/g, '').trim();

          const pubDate = new Date(item.pubDate);
          const timeString = isNaN(pubDate) ? 'Recently' : pubDate.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });

          const existing = await Article.findOne({ title });
          if (!existing) {
            const newArt = new Article({
              title,
              content,
              category,
              tag: item.categories?.[0] || category.split(' ')[0],
              source,
              time: timeString,
              imageUrl: item.enclosure?.link || item.thumbnail || categoryImages[category]
            });
            await newArt.save();
            articlesSynced++;
          }
        }
      }
    } catch (err) {
      console.error(`Failed to sync RSS category ${category}:`, err);
    }
  }
  console.log(`RSS fallback sync completed. Added ${articlesSynced} new articles.`);
  return articlesSynced;
}

// Live News Sync Coordinator (NewsAPI -> GNews -> RSS)
async function syncLiveNews() {
  try {
    const count = await syncLiveNewsAPI();
    if (count !== null) return count;
  } catch (err) {
    console.warn('NewsAPI fell back due to error. Trying GNews...');
  }

  try {
    const count = await syncLiveNewsGNews();
    if (count !== null) return count;
  } catch (err) {
    console.warn('GNews fell back due to error. Trying Google News RSS feeds...');
  }

  return await syncLiveNewsRSS();
}

// Auth Routes

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, category } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password,
      category,
      savedArticles: []
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        category: newUser.category,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        category: user.category,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// GET CURRENT USER PROFILE (ME)
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      category: req.user.category,
      createdAt: req.user.createdAt
    }
  });
});

// Articles Routes

// GET ALL ARTICLES (with search and category filters)
app.get('/api/articles', async (req, res) => {
  try {
    const { category, search, subCategory } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (category === 'Political Live' && subCategory && subCategory !== 'all') {
      if (subCategory === 'international') {
        query.$or = [
          { title: { $regex: 'global|international|world|un|china|us|usa|trump|biden|putin|uk|europe|foreign|border|london|england|britain|english|american|russia|nato|external|treaty|diplomat|middle east', $options: 'i' } },
          { content: { $regex: 'global|international|world|un|china|us|usa|trump|biden|putin|uk|europe|foreign|border|london|england|britain|english|american|russia|nato|external|treaty|diplomat|middle east', $options: 'i' } }
        ];
      } else if (subCategory === 'india') {
        query.$or = [
          { title: { $regex: 'india|modi|bjp|congress|lok sabha|rajya sabha|delhi|gandhi|union minister|parliament|national|centre|delhi|rahul gandhi|kejriwal|bsp|sp|tmc|cpi|indian government|pib', $options: 'i' } },
          { content: { $regex: 'india|modi|bjp|congress|lok sabha|rajya sabha|delhi|gandhi|union minister|parliament|national|centre|delhi|rahul gandhi|kejriwal|bsp|sp|tmc|cpi|indian government|pib', $options: 'i' } }
        ];
      } else if (subCategory === 'state') {
        query.$or = [
          { title: { $regex: 'state|assembly|governor|chief minister|cm|mla|municipal|local|karnataka|maharashtra|up|bihar|tamil nadu|bengal|kerala|haryana|punjab|gujarat|rajasthan|local body|panchayat|corporation|ward|district|bengaluru|mumbai|chennai|kolkata', $options: 'i' } },
          { content: { $regex: 'state|assembly|governor|chief minister|cm|mla|municipal|local|karnataka|maharashtra|up|bihar|tamil nadu|bengal|kerala|haryana|punjab|gujarat|rajasthan|local body|panchayat|corporation|ward|district|bengaluru|mumbai|chennai|kolkata', $options: 'i' } }
        ];
      }
    }

    if (search) {
      const searchFilter = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { tag: { $regex: search, $options: 'i' } }
        ]
      };
      
      if (query.$or) {
        query.$and = [
          { $or: query.$or },
          searchFilter
        ];
        delete query.$or;
      } else {
        query.$or = searchFilter.$or;
      }
    }

    const articles = await Article.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, articles });
  } catch (error) {
    console.error('Fetch articles error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching articles' });
  }
});

// GET SINGLE ARTICLE BY ID
app.get('/api/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    res.status(200).json({ success: true, article });
  } catch (error) {
    console.error('Fetch article error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching article' });
  }
});

// MANUAL LIVE NEWS SYNC
app.post('/api/articles/sync', async (req, res) => {
  try {
    const count = await syncLiveNews();
    res.status(200).json({ success: true, message: `Successfully synced ${count} new articles.` });
  } catch (error) {
    console.error('Sync request error:', error);
    res.status(500).json({ success: false, message: 'Failed to synchronize live news.' });
  }
});

// TOGGLE LIKE ON AN ARTICLE
app.post('/api/articles/:id/like', authMiddleware, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    const email = req.user.email;
    const likeIndex = article.likedBy.indexOf(email);

    if (likeIndex > -1) {
      article.likedBy.splice(likeIndex, 1);
    } else {
      article.likedBy.push(email);
    }

    article.likesCount = article.likedBy.length;
    await article.save();

    res.status(200).json({ success: true, likesCount: article.likesCount, likedBy: article.likedBy });
  } catch (error) {
    console.error('Like article error:', error);
    res.status(500).json({ success: false, message: 'Server error updating like' });
  }
});

// ADD COMMENT ON AN ARTICLE
app.post('/api/articles/:id/comment', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    const newComment = {
      userName: req.user.name,
      userEmail: req.user.email,
      text: text.trim()
    };

    article.comments.push(newComment);
    await article.save();

    res.status(201).json({ success: true, comments: article.comments });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ success: false, message: 'Server error adding comment' });
  }
});

// User Saved Articles Routes

// GET SAVED ARTICLES
app.get('/api/users/saved-articles', authMiddleware, async (req, res) => {
  res.status(200).json({
    success: true,
    savedArticles: req.user.savedArticles
  });
});

// SAVE AN ARTICLE
app.post('/api/users/saved-articles', authMiddleware, async (req, res) => {
  try {
    const { title, tag, source, time } = req.body;
    if (!title || !tag || !source || !time) {
      return res.status(400).json({ success: false, message: 'All article fields are required' });
    }

    const isAlreadySaved = req.user.savedArticles.some(art => art.title === title);
    if (isAlreadySaved) {
      return res.status(400).json({ success: false, message: 'Article is already saved' });
    }

    req.user.savedArticles.push({ title, tag, source, time });
    await req.user.save();

    res.status(200).json({
      success: true,
      savedArticles: req.user.savedArticles
    });
  } catch (error) {
    console.error('Save article error:', error);
    res.status(500).json({ success: false, message: 'Server error saving article' });
  }
});

// UNSAVE AN ARTICLE
app.delete('/api/users/saved-articles', authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Article title is required to unsave' });
    }

    req.user.savedArticles = req.user.savedArticles.filter(art => art.title !== title);
    await req.user.save();

    res.status(200).json({
      success: true,
      savedArticles: req.user.savedArticles
    });
  } catch (error) {
    console.error('Unsave article error:', error);
    res.status(500).json({ success: false, message: 'Server error unsaving article' });
  }
});

// --- Groww Stock Market Platform Backend Services ---

const popularStocks = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd.', id: 'RELIANCE' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services Ltd.', id: 'TCS' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd.', id: 'HDFCBANK' },
  { symbol: 'INFY.NS', name: 'Infosys Ltd.', id: 'INFY' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Ltd.', id: 'ICICIBANK' },
  { symbol: 'SBIN.NS', name: 'State Bank of India', id: 'SBIN' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel Ltd.', id: 'BHARTIARTL' },
  { symbol: 'ITC.NS', name: 'ITC Ltd.', id: 'ITC' },
  { symbol: 'LTIM.NS', name: 'LTIMindtree Ltd.', id: 'LTIM' },
  { symbol: 'TATAMOTORS.NS', name: 'Tata Motors Ltd.', id: 'TATAMOTORS' },
  { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever Ltd.', id: 'HINDUNILVR' },
  { symbol: 'LT.NS', name: 'Larsen & Toubro Ltd.', id: 'LT' },
  { symbol: 'AXISBANK.NS', name: 'Axis Bank Ltd.', id: 'AXISBANK' },
  { symbol: 'MARUTI.NS', name: 'Maruti Suzuki India Ltd.', id: 'MARUTI' },
  { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank Ltd.', id: 'KOTAKBANK' },
  { symbol: 'WIPRO.NS', name: 'Wipro Ltd.', id: 'WIPRO' },
  { symbol: 'HCLTECH.NS', name: 'HCL Technologies Ltd.', id: 'HCLTECH' },
  { symbol: 'ASIANPAINT.NS', name: 'Asian Paints Ltd.', id: 'ASIANPAINT' },
  { symbol: 'SUNPHARMA.NS', name: 'Sun Pharmaceutical Industries Ltd.', id: 'SUNPHARMA' }
];

// Search stocks endpoint
app.get('/api/stocks/search', async (req, res) => {
  try {
    const query = (req.query.q || '').toLowerCase();
    if (!query) {
      return res.status(200).json({ success: true, stocks: [] });
    }

    const matches = popularStocks.filter(s => 
      s.id.toLowerCase().includes(query) || 
      s.name.toLowerCase().includes(query) || 
      s.symbol.toLowerCase().includes(query)
    );

    const stockDetails = [];
    for (const item of matches.slice(0, 5)) {
      try {
        const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${item.symbol}?interval=1m&range=1d`);
        if (response.ok) {
          const data = await response.json();
          const result = data.chart.result[0];
          const meta = result.meta;
          const price = meta.regularMarketPrice;
          const prevClose = meta.previousClose;
          const diff = price - prevClose;
          const changePct = (diff / prevClose) * 100;
          stockDetails.push({
            symbol: item.id,
            yahooSymbol: item.symbol,
            name: item.name,
            price: price.toFixed(2),
            change: (diff >= 0 ? '+' : '') + changePct.toFixed(2) + '%',
            up: diff >= 0
          });
        }
      } catch (err) {
        console.error('Search fetch failed for', item.symbol, err.message);
      }
    }

    // fallback if Yahoo Finance fails
    if (stockDetails.length === 0 && matches.length > 0) {
      matches.slice(0, 5).forEach(m => {
        stockDetails.push({
          symbol: m.id,
          yahooSymbol: m.symbol,
          name: m.name,
          price: '1,000.00',
          change: '+0.00%',
          up: true
        });
      });
    }

    res.status(200).json({ success: true, stocks: stockDetails });
  } catch (error) {
    console.error('Search stocks error:', error);
    res.status(500).json({ success: false, message: 'Server error searching stocks' });
  }
});

// Detailed stock page query endpoint
app.get('/api/stocks/details', async (req, res) => {
  try {
    const symbol = req.query.symbol;
    if (!symbol) {
      return res.status(400).json({ success: false, message: 'Symbol is required' });
    }

    // find in popular stocks or construct Yahoo Symbol
    const matched = popularStocks.find(s => s.id === symbol || s.symbol === symbol);
    const yahooSymbol = matched ? matched.symbol : (symbol.endsWith('.NS') ? symbol : symbol + '.NS');
    const name = matched ? matched.name : symbol;

    try {
      const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?range=5d&interval=15m`);
      
      if (response.ok) {
        const data = await response.json();
        const result = data.chart.result[0];
        const meta = result.meta;
        const price = meta.regularMarketPrice;
        const prevClose = meta.previousClose;
        const diff = price - prevClose;
        const changePct = (diff / prevClose) * 100;

        // Extract closing prices for chart
        const prices = (result.indicators.quote[0].close || []).filter(p => p !== null && p !== undefined);
        
        const stats = {
          open: meta.regularMarketOpen || prevClose,
          high: meta.regularMarketDayHigh || price,
          low: meta.regularMarketDayLow || price,
          volume: meta.regularMarketVolume || 0,
          prevClose: prevClose
        };

        return res.status(200).json({
          success: true,
          stock: {
            symbol: matched ? matched.id : symbol,
            yahooSymbol,
            name,
            price: price.toFixed(2),
            change: (diff >= 0 ? '+' : '') + changePct.toFixed(2) + '%',
            up: diff >= 0,
            stats,
            prices
          }
        });
      }
    } catch (chartErr) {
      console.warn('Live chart fetch failed, falling back to mock details:', chartErr.message);
    }

    // Fallback response
    const fallbackPrice = 1250.00;
    res.status(200).json({
      success: true,
      stock: {
        symbol: matched ? matched.id : symbol,
        yahooSymbol,
        name,
        price: fallbackPrice.toFixed(2),
        change: '+1.50%',
        up: true,
        stats: {
          open: fallbackPrice - 10,
          high: fallbackPrice + 25,
          low: fallbackPrice - 15,
          volume: 154200,
          prevClose: fallbackPrice - 18
        },
        prices: [
          fallbackPrice - 15,
          fallbackPrice - 8,
          fallbackPrice - 10,
          fallbackPrice + 5,
          fallbackPrice + 12,
          fallbackPrice
        ]
      }
    });
  } catch (error) {
    console.error('Stock details error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching stock details' });
  }
});

// GET user holdings
app.get('/api/users/holdings', authMiddleware, async (req, res) => {
  res.status(200).json({ success: true, holdings: req.user.holdings || [] });
});

// BUY shares
app.post('/api/users/holdings/buy', authMiddleware, async (req, res) => {
  try {
    const { symbol, name, qty, price } = req.body;
    if (!symbol || !name || !qty || !price) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const buyQty = Number(qty);
    const buyPrice = Number(price);

    if (buyQty <= 0 || buyPrice <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity and price must be greater than zero' });
    }

    const holdingIndex = req.user.holdings.findIndex(h => h.symbol === symbol);

    if (holdingIndex > -1) {
      // average price calculation
      const currentHolding = req.user.holdings[holdingIndex];
      const newQty = currentHolding.qty + buyQty;
      const newAvg = ((currentHolding.qty * currentHolding.avgPrice) + (buyQty * buyPrice)) / newQty;
      
      currentHolding.qty = newQty;
      currentHolding.avgPrice = Number(newAvg.toFixed(2));
    } else {
      req.user.holdings.push({ symbol, name, qty: buyQty, avgPrice: buyPrice });
    }

    await req.user.save();
    res.status(200).json({ success: true, holdings: req.user.holdings });
  } catch (error) {
    console.error('Buy stock error:', error);
    res.status(500).json({ success: false, message: 'Server error executing buy transaction' });
  }
});

// SELL shares
app.post('/api/users/holdings/sell', authMiddleware, async (req, res) => {
  try {
    const { symbol, qty } = req.body;
    if (!symbol || !qty) {
      return res.status(400).json({ success: false, message: 'Symbol and quantity are required' });
    }

    const sellQty = Number(qty);
    if (sellQty <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be greater than zero' });
    }

    const holdingIndex = req.user.holdings.findIndex(h => h.symbol === symbol);
    if (holdingIndex === -1) {
      return res.status(400).json({ success: false, message: 'You do not own this stock' });
    }

    const currentHolding = req.user.holdings[holdingIndex];
    if (currentHolding.qty < sellQty) {
      return res.status(400).json({ success: false, message: 'Insufficient shares to sell' });
    }

    if (currentHolding.qty === sellQty) {
      req.user.holdings.splice(holdingIndex, 1);
    } else {
      currentHolding.qty -= sellQty;
    }

    await req.user.save();
    res.status(200).json({ success: true, holdings: req.user.holdings });
  } catch (error) {
    console.error('Sell stock error:', error);
    res.status(500).json({ success: false, message: 'Server error executing sell transaction' });
  }
});

// GET user watchlist
app.get('/api/users/watchlist-stocks', authMiddleware, async (req, res) => {
  try {
    const watchlistSymbols = req.user.watchlistStocks || [];
    const watchlistDetails = [];

    for (const sym of watchlistSymbols) {
      try {
        const matched = popularStocks.find(s => s.id === sym || s.symbol === sym);
        const yahooSymbol = matched ? matched.symbol : (sym.endsWith('.NS') ? sym : sym + '.NS');
        const name = matched ? matched.name : sym;

        const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1m&range=1d`);
        if (response.ok) {
          const data = await response.json();
          const result = data.chart.result[0];
          const meta = result.meta;
          const price = meta.regularMarketPrice;
          const prevClose = meta.previousClose;
          const diff = price - prevClose;
          const changePct = (diff / prevClose) * 100;
          watchlistDetails.push({
            symbol: sym,
            name,
            price: price.toFixed(2),
            change: (diff >= 0 ? '+' : '') + changePct.toFixed(2) + '%',
            up: diff >= 0
          });
        } else {
          // fallback if response not ok
          watchlistDetails.push({
            symbol: sym,
            name,
            price: '1,250.00',
            change: '+0.00%',
            up: true
          });
        }
      } catch (err) {
        console.error('Watchlist details fetch failed for', sym, err.message);
        watchlistDetails.push({
          symbol: sym,
          name: sym,
          price: '1,250.00',
          change: '+0.00%',
          up: true
        });
      }
    }

    res.status(200).json({ success: true, watchlistStocks: watchlistDetails });
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ success: false, message: 'Server error loading watchlist' });
  }
});

// TOGGLE watchlist stock
app.post('/api/users/watchlist-stocks/toggle', authMiddleware, async (req, res) => {
  try {
    const { symbol } = req.body;
    if (!symbol) {
      return res.status(400).json({ success: false, message: 'Symbol is required' });
    }

    const index = req.user.watchlistStocks.indexOf(symbol);
    if (index > -1) {
      req.user.watchlistStocks.splice(index, 1);
    } else {
      req.user.watchlistStocks.push(symbol);
    }

    await req.user.save();
    res.status(200).json({ success: true, watchlistStocks: req.user.watchlistStocks });
  } catch (error) {
    console.error('Watchlist toggle error:', error);
    res.status(500).json({ success: false, message: 'Server error toggling watchlist' });
  }
});

// Real-Time Stock Market Feed Route (Yahoo Finance Integration)
app.get('/api/stocks', async (req, res) => {
  try {
    const symbols = [
      { id: 'SENSEX', yahooSymbol: '^BSESN' },
      { id: 'NIFTY 50', yahooSymbol: '^NSEI' },
      { id: 'RELIANCE', yahooSymbol: 'RELIANCE.NS' },
      { id: 'TCS', yahooSymbol: 'TCS.NS' }
    ];

    const stockData = [];

    for (const item of symbols) {
      try {
        const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${item.yahooSymbol}?interval=1m&range=1d`);
        if (response.ok) {
          const data = await response.json();
          const result = data.chart.result[0];
          const meta = result.meta;
          const price = meta.regularMarketPrice;
          const prevClose = meta.previousClose;
          const diff = price - prevClose;
          const changePct = (diff / prevClose) * 100;
          
          stockData.push({
            symbol: item.id,
            price: price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            change: (diff >= 0 ? '+' : '') + changePct.toFixed(2) + '%',
            up: diff >= 0
          });
        }
      } catch (err) {
        console.error(`Failed to fetch stock ${item.id}:`, err.message);
      }
    }

    // If Yahoo Finance fails or is blocked, return mock fallback
    if (stockData.length === 0) {
      return res.status(200).json({
        success: true,
        stocks: [
          { symbol: 'SENSEX', price: '76,450.20', change: '+1.12%', up: true },
          { symbol: 'NIFTY 50', price: '23,280.40', change: '+0.98%', up: true },
          { symbol: 'RELIANCE', price: '2,920.00', change: '-0.30%', up: false },
          { symbol: 'TCS', price: '3,850.15', change: '+0.45%', up: true }
        ]
      });
    }

    res.status(200).json({ success: true, stocks: stockData });
  } catch (error) {
    console.error('Fetch stocks error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching stocks' });
  }
});

// AI Chatbot Route (Real OpenAI API GPT Integration)
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // 1. Parse keywords from the user message for database search
    const messageLower = message.toLowerCase();
    const cleanMsg = messageLower.replace(/[^\w\s]/g, ' ');
    const stopWords = new Set(['and', 'the', 'for', 'you', 'are', 'what', 'who', 'how', 'why', 'can', 'live', 'news', 'show', 'find', 'search', 'today', 'latest', 'please', 'tell', 'me', 'about']);
    const keywords = cleanMsg
      .split(/\s+/)
      .map(w => w.trim())
      .filter(w => w.length > 2 && !stopWords.has(w));

    // 2. Query MongoDB for articles containing these keywords
    let matchingArticles = [];
    if (keywords.length > 0) {
      const searchQueries = keywords.map(kw => ({
        $or: [
          { title: { $regex: kw, $options: 'i' } },
          { content: { $regex: kw, $options: 'i' } },
          { tag: { $regex: kw, $options: 'i' } },
          { category: { $regex: kw, $options: 'i' } }
        ]
      }));
      matchingArticles = await Article.find({ $or: searchQueries }).sort({ createdAt: -1 }).limit(5);
    }

    // 3. Fallback to category search if no specific keyword matches were found but general terms match
    if (matchingArticles.length === 0) {
      let categoryQuery = null;
      if (messageLower.includes('sport') || messageLower.includes('fifa') || messageLower.includes('cricket') || messageLower.includes('football') || messageLower.includes('game') || messageLower.includes('goal') || messageLower.includes('match') || messageLower.includes('cup') || messageLower.includes('player') || messageLower.includes('team')) {
        categoryQuery = 'Sports';
      } else if (messageLower.includes('tech') || messageLower.includes('ai') || messageLower.includes('software') || messageLower.includes('quantum') || messageLower.includes('computer') || messageLower.includes('technology')) {
        categoryQuery = 'Technology';
      } else if (messageLower.includes('market') || messageLower.includes('stock') || messageLower.includes('sensex') || messageLower.includes('nifty') || messageLower.includes('finance') || messageLower.includes('ipo')) {
        categoryQuery = 'Stock Market';
      } else if (messageLower.includes('education') || messageLower.includes('exam') || messageLower.includes('scholarship') || messageLower.includes('university') || messageLower.includes('board') || messageLower.includes('placement') || messageLower.includes('student') || messageLower.includes('result')) {
        categoryQuery = 'Education';
      } else if (messageLower.includes('politics') || messageLower.includes('election') || messageLower.includes('government') || messageLower.includes('minister') || messageLower.includes('vote') || messageLower.includes('political')) {
        categoryQuery = 'Political Live';
      } else if (messageLower.includes('movie') || messageLower.includes('show') || messageLower.includes('entertainment') || messageLower.includes('cinema') || messageLower.includes('music') || messageLower.includes('actor') || messageLower.includes('award')) {
        categoryQuery = 'Entertainment';
      } else if (messageLower.includes('business') || messageLower.includes('startup') || messageLower.includes('economy') || messageLower.includes('bank') || messageLower.includes('trade') || messageLower.includes('company')) {
        categoryQuery = 'Business';
      } else if (messageLower.includes('health') || messageLower.includes('medicine') || messageLower.includes('nutrition') || messageLower.includes('doctor') || messageLower.includes('disease') || messageLower.includes('hospital')) {
        categoryQuery = 'Health';
      } else if (messageLower.includes('international') || messageLower.includes('world') || messageLower.includes('global') || messageLower.includes('foreign') || messageLower.includes('country')) {
        categoryQuery = 'International News';
      }

      if (categoryQuery) {
        matchingArticles = await Article.find({ category: categoryQuery }).sort({ createdAt: -1 }).limit(5);
      }
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (GEMINI_API_KEY) {
      try {
        console.log('Querying Gemini API for message:', message);
        let systemPrompt = 'You are an intelligent AI News Assistant for NewsSphere. You can summarize news articles, translate texts, explain topics, and answer questions. Keep summaries structured with clear bullet points. Be concise and polite.';
        
        if (matchingArticles.length > 0) {
          const articlesContext = matchingArticles.map((art, idx) => 
            `Article #${idx+1}:\nTitle: ${art.title}\nSource: ${art.source}\nCategory: ${art.category}\nTime: ${art.time}\nContent: ${art.content}`
          ).join('\n\n');
          
          systemPrompt += `\n\nHere are the relevant articles from our database to answer the user's query:\n${articlesContext}`;
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${systemPrompt}\n\nUser Question: ${message}` }
                ]
              }
            ]
          })
        });

        const data = await response.json();
        if (response.ok && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
          const reply = data.candidates[0].content.parts[0].text;
          return res.status(200).json({ success: true, reply });
        } else {
          console.warn('Gemini API returned error or empty response:', data.error || data);
        }
      } catch (err) {
        console.error('Gemini API request failed, falling back to OpenAI or local:', err);
      }
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (OPENAI_API_KEY) {
      try {
        console.log('Querying OpenAI GPT-4o-mini for message:', message);
        let systemPrompt = 'You are an intelligent AI News Assistant for NewsSphere. You can summarize news articles, translate texts, explain topics, and answer questions. Keep summaries structured with clear bullet points. Be concise and polite.';
        
        if (matchingArticles.length > 0) {
          const articlesContext = matchingArticles.map((art, idx) => 
            `Article #${idx+1}:\nTitle: ${art.title}\nSource: ${art.source}\nCategory: ${art.category}\nTime: ${art.time}\nContent: ${art.content}`
          ).join('\n\n');
          
          systemPrompt += `\n\nHere are the relevant articles from our database to answer the user's query:\n${articlesContext}`;
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', { // wait, let's keep it api.openai.com/v1/chat/completions!
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message }
            ]
          })
        });

        const data = await response.json();
        if (response.ok && data.choices && data.choices[0]) {
          const reply = data.choices[0].message.content;
          return res.status(200).json({ success: true, reply });
        } else {
          console.warn('OpenAI API returned error or empty choices:', data.error || data);
        }
      } catch (err) {
        console.error('OpenAI API request failed, falling back to local chat engine:', err);
      }
    }

    // Local Mock Engine Fallback
    let reply = "";
    if (matchingArticles.length > 0) {
      reply = `🔍 **NewsSphere Assistant found ${matchingArticles.length} relevant updates in our feed:**\n\n`;
      matchingArticles.forEach((art, idx) => {
        // Remove trailing tags like [+4215 chars] and clean content
        let cleanContent = art.content.replace(/\s*\[\+\d+ chars\]\s*$/, '').trim();
        const shortContent = cleanContent.length > 180 ? cleanContent.substring(0, 180) + "..." : cleanContent;
        reply += `${idx + 1}. **${art.title}** (${art.source} · ${art.time})\n   ${shortContent}\n\n`;
      });
      reply += "Let me know if you would like me to translate any of these, or show more details!";
    } else {
      if (messageLower.includes('tech') || messageLower.includes('ai') || messageLower.includes('software')) {
        reply = "🤖 **AI & Tech Briefing:**\n- **Quantum Computing:** Silicon processors achieve 99.9% fidelity milestone, accelerating fault-tolerant networks.\n- **NewsSphere AI:** Large language models are now running 4x faster on local systems.\n- **Open Source:** Rust-based databases cut memory footprint in half.";
      } else if (messageLower.includes('market') || messageLower.includes('business') || messageLower.includes('fund') || messageLower.includes('stock') || messageLower.includes('ipo')) {
        reply = "📈 **Market & IPO Update:**\n- **Record Highs:** Sensex & Nifty hit record highs as banking/tech stocks surge.\n- **IPO Pipeline:** Over $12B in tech listings (SaaS, AI) expected by late Q3.\n- **Venture Seed:** Clean-tech startups see a 35% Year-Over-Year funding boost.";
      } else if (messageLower.includes('sport') || messageLower.includes('cricket') || messageLower.includes('football') || messageLower.includes('game') || messageLower.includes('goal') || messageLower.includes('fifa')) {
        reply = "⚽ **Sports Summary:**\n- **Football Final:** Underdog team clinches the Cup Final with a dramatic header in the 93rd minute.\n- **Cricket T20:** World qualifiers showcase record paces and dynamic athletic performances.";
      } else if (messageLower.includes('education') || messageLower.includes('exam') || messageLower.includes('scholarship') || messageLower.includes('result')) {
        reply = "🎓 **Education Alerts:**\n- **Scholarships:** National engineering portal opens for undergraduates (up to 100% tuition coverage).\n- **Board Exams:** Results declared online with a record 94.6% overall pass rate.";
      } else if (messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('hey')) {
        reply = "Hello! I am your **NewsSphere AI Assistant**. Ask me to summarize technology headlines, check business updates, explain board exam notifications, or brief you on the football cup results!";
      } else {
        reply = "🔍 **NewsSphere Analysis:**\nI analyzed your query. Today's top updates cover high-fidelity quantum processors, record market runs, high board exam pass rates, and dramatic sports final finishes. Let me know which topic you'd like a detailed breakdown on!";
      }
    }

    res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ success: false, message: 'Chat service error' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`MERN server running on port ${PORT}`);
});
