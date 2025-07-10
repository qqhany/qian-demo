const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(passport.initialize());

// JWT 配置
const JWT_SECRET = "your_super_secret_jwt_key_2024";

// 模拟用户数据库
const USERS = [
  { id: 1, username: 'test', password: '123456', name: 'Test User' }
];

// 模拟 GitHub 用户存储
const GITHUB_USERS = new Map();

// Malaysian insurers data with more details
const insurers = [
  {
    id: 1,
    name: "Etiqa Takaful",
    basePrice: 800,
    logo: "etiqa.png",
    rating: 4.8,
    features: [
      "24/7 Roadside Assistance",
      "Personal Accident Cover",
      "Free Emergency Assistance",
      "NCD Protection"
    ],
    type: "takaful",
    popular: true,
    discount: "15%",
    installments: [3, 6, 12]
  },
  {
    id: 2,
    name: "Allianz Malaysia",
    basePrice: 900,
    logo: "allianz.png",
    rating: 4.6,
    features: [
      "NCD Protection",
      "Free Emergency Assistance",
      "Windscreen Cover",
      "Personal Accident"
    ],
    type: "conventional",
    popular: false,
    discount: "10%",
    installments: [3, 6, 12]
  },
  {
    id: 3,
    name: "Takaful Ikhlas",
    basePrice: 750,
    logo: "takaful-ikhlas.png",
    rating: 4.5,
    features: [
      "24/7 Roadside Assistance",
      "Personal Accident Cover",
      "Medical Expenses"
    ],
    type: "takaful",
    popular: false,
    discount: "20%",
    installments: [3, 6]
  },
  {
    id: 4,
    name: "Berjaya Sompo",
    basePrice: 850,
    logo: "berjaya-sompo.png",
    rating: 4.7,
    features: [
      "NCD Protection",
      "Free Emergency Assistance",
      "Windscreen Cover",
      "Personal Accident",
      "Medical Expenses"
    ],
    type: "conventional",
    popular: true,
    discount: "12%",
    installments: [3, 6, 12]
  }
];

// Vehicle types and their base multipliers
const vehicleTypes = {
  "sedan": 1.0,
  "suv": 1.2,
  "pickup": 1.1,
  "commercial": 1.5,
  "motorcycle": 0.6
};

// ========== AUTHENTICATION ENDPOINTS ==========

// 本地登录
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  
  const token = jwt.sign(
    { id: user.id, username: user.username, type: 'local' }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  );
  
  res.json({ 
    token, 
    user: { 
      id: user.id, 
      username: user.username, 
      name: user.name,
      type: 'local'
    } 
  });
});

// JWT 验证中间件
function authenticateJWT(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.sendStatus(401);
  
  const token = auth.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// 获取用户信息
app.get("/api/profile", authenticateJWT, (req, res) => {
  if (req.user.type === 'local') {
    const user = USERS.find(u => u.id === req.user.id);
    res.json({ user });
  } else {
    const user = GITHUB_USERS.get(req.user.id);
    res.json({ user });
  }
});

// GitHub OAuth2 策略
passport.use(new GitHubStrategy({
  clientID: "Ov23lisR57GelCPsyvpJ",
  clientSecret: "3a75de5b49da8c07109847bdb15be809263d2240",
  callbackURL: "/api/oauth2/github/callback"
}, (accessToken, refreshToken, profile, done) => {
  // 存储 GitHub 用户信息
  const user = {
    id: profile.id,
    username: profile.username,
    name: profile.displayName || profile.username,
    email: profile.emails?.[0]?.value,
    avatar: profile.photos?.[0]?.value,
    type: 'github'
  };
  
  GITHUB_USERS.set(profile.id, user);
  return done(null, user);
}));

// GitHub 授权
app.get("/api/oauth2/github/authorize", 
  passport.authenticate("github", { scope: ["user:email"] })
);

// GitHub 回调
app.get("/api/oauth2/github/callback", 
  passport.authenticate("github", { session: false }), 
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      { id: user.id, username: user.username, type: 'github' }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    // 重定向到前端并带上token
    res.redirect(`exp://192.168.72.255:8081/--/login?token=${token}`);
  }
);

// 退出登录
app.post("/api/logout", authenticateJWT, (req, res) => {
  res.json({ message: "Logged out successfully" });
});

// ========== INSURANCE ENDPOINTS ==========

// Calculate insurance price
app.post("/api/quotes", (req, res) => {
  const { vehicle, driver } = req.body;
  
  if (!vehicle || !driver) {
    return res.status(400).json({ error: "Vehicle and driver information required" });
  }

  const quotes = insurers.map((insurer) => {
    let price = insurer.basePrice;

    // Vehicle type multiplier
    const vehicleMultiplier = vehicleTypes[vehicle.type] || 1.0;
    price *= vehicleMultiplier;

    // Vehicle age factor
    const vehicleAge = new Date().getFullYear() - vehicle.year;
    if (vehicleAge > 10) price *= 1.3;
    else if (vehicleAge > 5) price *= 1.1;

    // Engine capacity factor
    if (vehicle.engineCapacity > 2000) price *= 1.2;
    else if (vehicle.engineCapacity > 1500) price *= 1.1;

    // Driver age factor
    const driverAge = new Date().getFullYear() - driver.birthYear;
    if (driverAge < 25) price *= 1.4;
    else if (driverAge < 30) price *= 1.2;

    // NCD calculation
    const ncd = calculateNCD(vehicle.year, driver.claimsHistory);
    const ncdDiscount = parseFloat(ncd.replace('%', '')) / 100;
    price *= (1 - ncdDiscount);

    // Apply insurer discount
    const discount = parseFloat(insurer.discount.replace('%', '')) / 100;
    price *= (1 - discount);

    return {
      ...insurer,
      finalPrice: Math.round(price),
      originalPrice: Math.round(price / (1 - discount)),
      ncd,
      savings: Math.round((price / (1 - discount)) - price),
      monthlyPayment: Math.round(price / 12)
    };
  });

  // Sort by price
  quotes.sort((a, b) => a.finalPrice - b.finalPrice);

  res.json({
    quotes,
    summary: {
      totalQuotes: quotes.length,
      priceRange: {
        min: quotes[0]?.finalPrice || 0,
        max: quotes[quotes.length - 1]?.finalPrice || 0
      },
      averagePrice: Math.round(quotes.reduce((sum, q) => sum + q.finalPrice, 0) / quotes.length)
    }
  });
});

// Get vehicle types
app.get("/api/vehicle-types", (req, res) => {
  res.json(Object.keys(vehicleTypes));
});

// Get insurers list
app.get("/api/insurers", (req, res) => {
  res.json(insurers);
});

// Calculate installment payments
app.post("/api/installments", (req, res) => {
  const { amount, months } = req.body;
  
  if (!amount || !months) {
    return res.status(400).json({ error: "Amount and months required" });
  }

  const monthlyPayment = Math.round(amount / months);
  const totalPayment = monthlyPayment * months;
  const interest = totalPayment - amount;

  res.json({
    monthlyPayment,
    totalPayment,
    interest,
    months
  });
});

function calculateNCD(year, claimsHistory = 0) {
  const age = new Date().getFullYear() - year;
  
  // Base NCD based on vehicle age
  let baseNCD = 0;
  if (age > 10) baseNCD = 25;
  else if (age > 5) baseNCD = 30;
  else baseNCD = 55;

  // Reduce NCD based on claims history
  const claimsReduction = claimsHistory * 10;
  const finalNCD = Math.max(0, baseNCD - claimsReduction);
  
  return `${finalNCD}%`;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚗 Car Insurance API running on port ${PORT}`);
  console.log(`🔐 Authentication endpoints:`);
  console.log(`   POST /api/login - Local login`);
  console.log(`   GET  /api/oauth2/github/authorize - GitHub OAuth2`);
  console.log(`   GET  /api/profile - Get user profile`);
  console.log(`   POST /api/logout - Logout`);
  console.log(`📊 Insurance endpoints:`);
  console.log(`   POST /api/quotes - Get insurance quotes`);
  console.log(`   GET  /api/vehicle-types - Get vehicle types`);
  console.log(`   GET  /api/insurers - Get insurers list`);
  console.log(`   POST /api/installments - Calculate installments`);
  console.log(`   GET  /api/health - Health check`);
});
