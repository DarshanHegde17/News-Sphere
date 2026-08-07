// NewsSphere Application Logic

// API Endpoints
const CRICKET_API = 'https://site.api.espn.com/apis/site/v2/sports/cricket/8589/scoreboard';
const SOCCER_API = 'https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard';
const LOCAL_ARTICLES_API = (window.location.protocol === 'file:' || window.location.hostname === '') 
  ? 'http://localhost:5000/api/articles' 
  : '/api/articles';

// Application State
let scoreboardMatches = []; // Parsed sports matches
let newsArticles = []; // News articles (local API or mock)
let activeSportFilter = 'all'; // 'all', 'cricket', 'soccer'
let activeCategoryFilter = 'all'; // 'all', 'sports', 'technology', 'business', 'politics', 'health', 'education'
let searchQuery = '';
let refreshCountdown = 30;
let refreshTimerInterval = null;

// High-Fidelity Mock News Articles (Fallback)
const mockArticles = [
  {
    _id: "mock-1",
    title: "Champions League Showdown: Arsenal Clinches Final Spot in Thrilling Semifinal",
    content: "In a spectacular display of tactical dominance, Arsenal secured their ticket to the Champions League final with a dramatic 3-2 victory last night. A late header in the 89th minute sealed the deal, sending the stadium into absolute pandemonium. Pundits are calling it one of the greatest Champions League semifinal matches of the decade. The victory puts Arsenal on track to face Real Madrid in the highly anticipated final next month in Munich.",
    category: "Sports",
    tag: "Champions League",
    source: "Sports Desk",
    time: "2 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "mock-2",
    title: "Quantum Computing Leap: Researchers Achieve 99.9% Gate Fidelity",
    content: "A consortium of international quantum computer scientists has announced a major breakthrough in error-correction rates. By achieving a 99.9% single-qubit and two-qubit gate fidelity on silicon-based spin qubits, the team has taken a monumental step toward building a commercially viable, fault-tolerant quantum computer. This achievement paves the way for solving complex chemical modeling and cryptography puzzles in seconds rather than millennia.",
    category: "Technology",
    tag: "Quantum Computing",
    source: "Tech News",
    time: "4 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "mock-3",
    title: "Global Markets Soar as Banking and Tech Sectors Lead Broad Rally",
    content: "Major global indices scaled historic highs today as institutional buying surged across tech, finance, and renewable energy conglomerates. Cooling inflation figures and optimistic interest rate adjustments by central banks have fueled a massive wave of confidence in corporate earnings. Financial analysts predict this bullish trend will persist through Q3, supported by strong capital inflows and steady retail investor participation.",
    category: "Business",
    tag: "Stock Market",
    source: "Finance Wire",
    time: "5 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "mock-4",
    title: "State Assemblies Introduce Green Energy Subsidies and Tech Grants",
    content: "In a landmark legislative session, the coalition government has approved a multi-billion dollar funding scheme to support clean energy corridors and green tech startups. Starting next quarter, local businesses will receive up to 45% subsidies for solar integration, while engineering universities will get seed grants to set up regional incubators. The bill aims to generate over 200,000 technology and clean energy jobs within the next three years.",
    category: "Politics",
    tag: "Policy Update",
    source: "Assembly Tribune",
    time: "7 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "mock-5",
    title: "Gene Therapy Breakthrough: Clinical Trials Show Remission for Rare Genetic Disease",
    content: "The Medical Research Journal published promising results from a phase-II clinical trial using CRISPR gene editing. Ten pediatric patients suffering from a rare, progressive muscular disorder showed full halt in disease progression and significant muscle regeneration after a single infusion. Scientists claim this marks the dawn of personalized genomic medicine, offering cure potentials for conditions previously thought to be incurable.",
    category: "Health",
    tag: "Medicine",
    source: "Health Science",
    time: "1 day ago",
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "mock-6",
    title: "National Engineering Portal Offers 100+ Certified Courses for Free",
    content: "The Department of Education has launched a centralized online portal offering fully certified software engineering, data science, and cloud computing courses in partnership with top global institutions. The courses are open to all students and working professionals, with exams and certifications subsidized 100% by state scholarships. The initiative hopes to bridge the technological skill gap and boost career placement across the country.",
    category: "Education",
    tag: "Admissions",
    source: "Academic Daily",
    time: "2 days ago",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"
  }
];

// High-Fidelity Mock Sports Match Cards (Fallback)
const mockSportsMatches = [
  {
    id: "mock-match-cricket-1",
    sport: "cricket",
    leagueName: "ICC Men's T20 World Cup",
    name: "India vs Australia",
    statusState: "in",
    statusDetail: "In Progress - Over 15.2",
    statusSummary: "India needs 34 runs in 28 balls",
    venue: "Kensington Oval, Barbados",
    date: "Today",
    competitors: [
      {
        name: "India",
        logo: "https://a.espncdn.com/i/teamlogos/cricket/500/6.png",
        score: "168/4 (15.2 ov)",
        winner: false,
        isBatting: true
      },
      {
        name: "Australia",
        logo: "https://a.espncdn.com/i/teamlogos/cricket/500/2.png",
        score: "201/7 (20.0 ov)",
        winner: false,
        isBatting: false
      }
    ]
  },
  {
    id: "mock-match-soccer-1",
    sport: "soccer",
    leagueName: "UEFA Champions League",
    name: "Real Madrid vs Manchester City",
    statusState: "in",
    statusDetail: "Live - 74'",
    statusSummary: "Second Half - 74 mins",
    venue: "Santiago Bernabéu, Madrid",
    date: "Today",
    competitors: [
      {
        name: "Real Madrid",
        logo: "https://a.espncdn.com/i/teamlogos/soccer/500/86.png",
        score: "2",
        winner: false
      },
      {
        name: "Manchester City",
        logo: "https://a.espncdn.com/i/teamlogos/soccer/500/17.png",
        score: "1",
        winner: false
      }
    ]
  },
  {
    id: "mock-match-cricket-2",
    sport: "cricket",
    leagueName: "Test Series",
    name: "England vs West Indies",
    statusState: "post",
    statusDetail: "Final - Day 4",
    statusSummary: "England won by 112 runs",
    venue: "Lord's, London",
    date: "Yesterday",
    competitors: [
      {
        name: "England",
        logo: "https://a.espncdn.com/i/teamlogos/cricket/500/1.png",
        score: "354 & 224",
        winner: true
      },
      {
        name: "West Indies",
        logo: "https://a.espncdn.com/i/teamlogos/cricket/500/4.png",
        score: "288 & 178",
        winner: false
      }
    ]
  },
  {
    id: "mock-match-soccer-2",
    sport: "soccer",
    leagueName: "English Premier League",
    name: "Liverpool vs Chelsea",
    statusState: "pre",
    statusDetail: "Scheduled - 8:30 PM",
    statusSummary: "Today at 8:30 PM",
    venue: "Anfield, Liverpool",
    date: "Today, 8:30 PM",
    competitors: [
      {
        name: "Liverpool",
        logo: "https://a.espncdn.com/i/teamlogos/soccer/500/364.png",
        score: "0",
        winner: false
      },
      {
        name: "Chelsea",
        logo: "https://a.espncdn.com/i/teamlogos/soccer/500/363.png",
        score: "0",
        winner: false
      }
    ]
  }
];

// Document Elements
const scoreboardEl = document.getElementById('sports-scoreboard');
const filterAllBtn = document.getElementById('filter-all-scores');
const filterCricketBtn = document.getElementById('filter-cricket-scores');
const filterSoccerBtn = document.getElementById('filter-soccer-scores');
const manualRefreshBtn = document.getElementById('manual-refresh-scores');
const timerSpinnerEl = document.getElementById('timer-spinner');
const countdownTextEl = document.getElementById('countdown-text');
const scrollLeftBtn = document.getElementById('scroll-left-btn');
const scrollRightBtn = document.getElementById('scroll-right-btn');

const newsSearchEl = document.getElementById('news-search');
const categoryNavBar = document.getElementById('category-nav-bar');
const featuredHeroArticleEl = document.getElementById('featured-hero-article');
const newsArticlesGridEl = document.getElementById('news-articles-grid');

const matchDetailsModal = document.getElementById('match-details-modal');
const modalContentDetails = document.getElementById('modal-content-details');
const modalCloseBtn = document.getElementById('modal-close-btn');
const brandLink = document.getElementById('brand-link');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  loadSportsScoreboard();
  loadNewsArticles();
  startPollingTimer();
});

// Event Listeners setup
function initializeEventListeners() {
  // Scoreboard Filters
  filterAllBtn.addEventListener('click', () => setSportFilter('all', filterAllBtn));
  filterCricketBtn.addEventListener('click', () => setSportFilter('cricket', filterCricketBtn));
  filterSoccerBtn.addEventListener('click', () => setSportFilter('soccer', filterSoccerBtn));

  // Scoreboard Manual Refresh
  manualRefreshBtn.addEventListener('click', handleManualRefresh);

  // Scoreboard Scrolling
  scrollLeftBtn.addEventListener('click', () => scrollScoreboard(-300));
  scrollRightBtn.addEventListener('click', () => scrollScoreboard(300));

  // Category Filtering
  categoryNavBar.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-btn')) {
      document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      setCategoryFilter(e.target.dataset.category);
    }
  });

  // News Search
  newsSearchEl.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderNews();
  });

  // Modal Close
  modalCloseBtn.addEventListener('click', closeModal);
  matchDetailsModal.addEventListener('click', (e) => {
    if (e.target === matchDetailsModal) closeModal();
  });

  // Brand click resets filters
  brandLink.addEventListener('click', (e) => {
    e.preventDefault();
    newsSearchEl.value = '';
    searchQuery = '';
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.category-btn[data-category="all"]').classList.add('active');
    activeCategoryFilter = 'all';
    renderNews();
  });
}

// -------------------------------------------------------------
// Scoreboard Operations
// -------------------------------------------------------------

async function loadSportsScoreboard() {
  showScoreboardLoading();
  
  try {
    const [cricketData, soccerData] = await Promise.all([
      fetchESPNScoreboard(CRICKET_API),
      fetchESPNScoreboard(SOCCER_API)
    ]);

    const parsedCricket = parseCricketData(cricketData);
    const parsedSoccer = parseSoccerData(soccerData);

    // Merge API results, filter out nulls/errors
    let apiMatches = [...parsedCricket, ...parsedSoccer].filter(m => m !== null);

    // If API returns no events, merge with mocks to guarantee rich live content
    if (apiMatches.length === 0) {
      console.warn("ESPN APIs returned empty datasets, using high-fidelity mocks");
      scoreboardMatches = [...mockSportsMatches];
    } else {
      scoreboardMatches = apiMatches;
    }
  } catch (error) {
    console.error("Failed to load sports scoreboards, loading mock scoreboard data:", error);
    scoreboardMatches = [...mockSportsMatches];
  }

  renderScoreboard();
}

// Fetch ESPN scoreboard via AllOrigins proxy
async function fetchESPNScoreboard(apiUrl) {
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;
  
  try {
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error(`Proxy error code ${res.status}`);
    const data = await res.json();
    if (!data.contents) throw new Error("Empty content wrapper in proxy response");
    return JSON.parse(data.contents);
  } catch (err) {
    console.warn(`CORS Proxy failed to resolve for ${apiUrl}. Trying direct fetch fallback...`, err.message);
    // Direct fetch fallback in case browser supports it or for testing environments
    const directRes = await fetch(apiUrl);
    if (!directRes.ok) throw new Error(`Direct fetch failed: ${directRes.status}`);
    return await directRes.json();
  }
}

// Parsers
function parseCricketData(data) {
  if (!data || !data.events) return [];
  const leagueName = data.leagues?.[0]?.name || "International Cricket";
  
  return data.events.map(event => {
    try {
      const comp = event.competitions?.[0];
      if (!comp) return null;
      
      const competitors = comp.competitors.map(c => {
        // Fallback for logo
        let logo = c.team?.logo || (c.team?.logos && c.team?.logos[0] ? c.team?.logos[0].href : '');
        if (!logo && c.team?.name) {
          logo = `https://a.espncdn.com/i/teamlogos/countries/500/${c.team.name.substring(0,3).toLowerCase()}.png`;
        }
        
        return {
          name: c.team?.displayName || c.team?.name || "Cricket Team",
          logo: logo || "https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-cricket.png",
          score: c.score || "0",
          winner: c.winner === true || c.winner === 'true',
          isBatting: c.isBatting || false
        };
      });

      return {
        id: event.id || `cricket-${Math.random()}`,
        sport: "cricket",
        leagueName: leagueName,
        name: event.name || "Cricket Match",
        statusState: event.status?.type?.state || "pre",
        statusDetail: event.status?.type?.detail || "Scheduled",
        statusSummary: event.status?.summary || event.status?.type?.description || "",
        venue: comp.venue?.fullName || "Cricket Stadium",
        date: event.date ? new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Upcoming",
        competitors: competitors
      };
    } catch (e) {
      console.error("Error parsing cricket event", e);
      return null;
    }
  });
}

function parseSoccerData(data) {
  if (!data || !data.events) return [];
  const leagueName = data.leagues?.[0]?.name || "Soccer Cup";
  
  return data.events.map(event => {
    try {
      const comp = event.competitions?.[0];
      if (!comp) return null;
      
      const competitors = comp.competitors.map(c => {
        let logo = c.team?.logo || (c.team?.logos && c.team?.logos[0] ? c.team?.logos[0].href : '');
        if (!logo && c.team?.abbreviation) {
          logo = `https://a.espncdn.com/i/teamlogos/countries/500/${c.team.abbreviation.toLowerCase()}.png`;
        }
        
        return {
          name: c.team?.displayName || c.team?.name || "Soccer Club",
          logo: logo || "https://a.espncdn.com/i/teamlogos/countries/500/default-logo.png",
          score: c.score || "0",
          winner: c.winner === true || c.winner === 'true'
        };
      });

      return {
        id: event.id || `soccer-${Math.random()}`,
        sport: "soccer",
        leagueName: leagueName,
        name: event.name || "Soccer Match",
        statusState: event.status?.type?.state || "pre",
        statusDetail: event.status?.type?.detail || "Scheduled",
        statusSummary: event.status?.type?.description || "",
        venue: comp.venue?.fullName || "Football Pitch",
        date: event.date ? new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Upcoming",
        competitors: competitors
      };
    } catch (e) {
      console.error("Error parsing soccer event", e);
      return null;
    }
  });
}

// Render Scoreboard Match Cards
function renderScoreboard() {
  const filtered = scoreboardMatches.filter(m => {
    if (activeSportFilter === 'all') return true;
    return m.sport === activeSportFilter;
  });

  if (filtered.length === 0) {
    scoreboardEl.innerHTML = `<div class="scoreboard-empty">No live ${activeSportFilter} matches scheduled today.</div>`;
    return;
  }

  scoreboardEl.innerHTML = '';
  filtered.forEach(match => {
    const card = document.createElement('div');
    card.className = `match-card ${match.statusState === 'in' ? 'live-match' : ''}`;
    card.addEventListener('click', () => openMatchDetails(match));

    // Header badge
    let statusClass = 'scheduled';
    let statusText = match.statusDetail;
    if (match.statusState === 'in') {
      statusClass = 'live';
      statusText = 'LIVE';
    } else if (match.statusState === 'post') {
      statusClass = 'completed';
      statusText = 'FINAL';
    }

    // Competitors list
    let competitorsHtml = '';
    match.competitors.forEach(team => {
      const isWinner = match.statusState === 'post' && team.winner;
      competitorsHtml += `
        <div class="competitor ${isWinner ? 'winner' : ''}">
          <div class="team-info">
            <img class="team-logo" src="${team.logo}" alt="${team.name}" onerror="this.src='https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-cricket.png'">
            <span class="team-name">${team.name}</span>
          </div>
          <span class="team-score">${team.score}</span>
        </div>
      `;
    });

    // Scoreboard Card Template
    card.innerHTML = `
      <div class="match-header">
        <span class="league-name">${match.leagueName}</span>
        <span class="status-badge ${statusClass}">${statusText}</span>
      </div>
      <div class="competitors-list">
        ${competitorsHtml}
      </div>
      <div class="match-footer">
        ${match.statusState === 'in' ? (match.statusSummary || match.statusDetail) : (match.statusSummary || match.date)}
      </div>
    `;

    scoreboardEl.appendChild(card);
  });
}

function showScoreboardLoading() {
  scoreboardEl.innerHTML = `
    <div style="display: flex; gap: 1rem; width: 100%; overflow: hidden;">
      ${[1, 2, 3, 4].map(() => `
        <div class="match-card" style="flex: 0 0 280px; opacity: 0.5;">
          <div class="match-header" style="height: 14px; background: rgba(255,255,255,0.05); width: 80%; border-radius: 4px;"></div>
          <div style="height: 20px; background: rgba(255,255,255,0.05); width: 100%; border-radius: 4px; margin: 10px 0;"></div>
          <div style="height: 20px; background: rgba(255,255,255,0.05); width: 100%; border-radius: 4px;"></div>
        </div>
      `).join('')}
    </div>
  `;
}

// Filter scores trigger
function setSportFilter(filter, button) {
  activeSportFilter = filter;
  document.querySelectorAll('.filter-chip').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  renderScoreboard();
}

// Smooth scrolling for scoreboard bar
function scrollScoreboard(offset) {
  scoreboardEl.scrollBy({ left: offset, behavior: 'smooth' });
}

// Manual refresh handler
async function handleManualRefresh() {
  manualRefreshBtn.classList.add('spinning');
  countdownTextEl.textContent = 'Updating...';
  
  await loadSportsScoreboard();
  
  setTimeout(() => {
    manualRefreshBtn.classList.remove('spinning');
    refreshCountdown = 30;
    countdownTextEl.textContent = 'Updated just now';
  }, 600);
}

// Polling timer management
function startPollingTimer() {
  if (refreshTimerInterval) clearInterval(refreshTimerInterval);
  
  refreshCountdown = 30;
  refreshTimerInterval = setInterval(() => {
    refreshCountdown--;
    if (refreshCountdown <= 0) {
      refreshCountdown = 30;
      loadSportsScoreboard();
    } else {
      countdownTextEl.textContent = `Auto-refresh in ${refreshCountdown}s`;
    }
  }, 1000);
}

// -------------------------------------------------------------
// News Article Operations
// -------------------------------------------------------------

async function loadNewsArticles() {
  try {
    const response = await fetch(LOCAL_ARTICLES_API);
    const data = await response.json();
    if (data.success && data.articles && data.articles.length > 0) {
      newsArticles = data.articles;
      console.log(`Successfully fetched ${newsArticles.length} live articles from backend server`);
    } else {
      console.warn("Backend articles empty or not found, falling back to mock database");
      newsArticles = [...mockArticles];
    }
  } catch (err) {
    console.warn("NewsSphere Express backend offline. Using mock news articles fallback.");
    newsArticles = [...mockArticles];
  }

  renderNews();
}

// Render News layout
function renderNews() {
  // Apply filtering & searching logic
  const filtered = newsArticles.filter(art => {
    // 1. Search Query filter
    const matchesSearch = searchQuery === '' || 
      art.title.toLowerCase().includes(searchQuery) ||
      art.content.toLowerCase().includes(searchQuery) ||
      art.category.toLowerCase().includes(searchQuery) ||
      (art.tag && art.tag.toLowerCase().includes(searchQuery));

    // 2. Category selection filter
    const matchesCategory = activeCategoryFilter === 'all' || 
      art.category.toLowerCase() === activeCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Clear elements
  featuredHeroArticleEl.innerHTML = '';
  newsArticlesGridEl.innerHTML = '';

  if (filtered.length === 0) {
    newsArticlesGridEl.innerHTML = `<div class="scoreboard-empty" style="grid-column: 1/-1;">No headlines found matching your search.</div>`;
    document.getElementById('featured-section').style.display = 'none';
    return;
  }

  document.getElementById('featured-section').style.display = activeCategoryFilter === 'all' && searchQuery === '' ? 'block' : 'none';

  let startIndex = 0;

  // Render Hero card (only if viewing all categories and no active search queries)
  if (activeCategoryFilter === 'all' && searchQuery === '') {
    const hero = filtered[0];
    featuredHeroArticleEl.innerHTML = `
      <div class="hero-media">
        <img class="hero-img" src="${hero.imageUrl}" alt="${hero.title}" onerror="this.src='https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'">
      </div>
      <div class="hero-content">
        <span class="category-tag">${hero.category}</span>
        <h3 class="hero-title">${hero.title}</h3>
        <p class="hero-snippet">${hero.content.substring(0, 180)}...</p>
        <div class="hero-footer">
          <span>${hero.source}</span>
          <span>${hero.time || 'Today'}</span>
        </div>
      </div>
    `;
    featuredHeroArticleEl.onclick = () => openArticleDetails(hero);
    startIndex = 1;
  }

  // Render remainder grid news cards
  const gridArticles = filtered.slice(startIndex);
  gridArticles.forEach(art => {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.onclick = () => openArticleDetails(art);
    card.innerHTML = `
      <div class="card-media">
        <img class="card-img" src="${art.imageUrl}" alt="${art.title}" onerror="this.src='https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'">
      </div>
      <div class="card-content">
        <span class="category-tag" style="background: rgba(255,255,255,0.03); color: var(--text-secondary); border: 1px solid var(--border-color); font-size: 0.65rem;">${art.category}</span>
        <h4 class="card-title">${art.title}</h4>
        <p class="card-snippet">${art.content.substring(0, 110)}...</p>
        <div class="card-footer">
          <span>${art.source}</span>
          <span>${art.time || 'Today'}</span>
        </div>
      </div>
    `;
    newsArticlesGridEl.appendChild(card);
  });
}

// Category filter trigger
function setCategoryFilter(category) {
  activeCategoryFilter = category.toLowerCase();
  renderNews();
}

// -------------------------------------------------------------
// Detailed Modals
// -------------------------------------------------------------

// Open Sports Match Detail Modal
function openMatchDetails(match) {
  const isPost = match.statusState === 'post';
  
  let competitorsHtml = '';
  match.competitors.forEach(team => {
    const isWinner = isPost && team.winner;
    competitorsHtml += `
      <div class="detail-team ${isWinner ? 'winner' : ''}">
        <img class="detail-logo" src="${team.logo}" alt="${team.name}" onerror="this.src='https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-cricket.png'">
        <span class="detail-name">${team.name}</span>
        <span class="detail-score">${team.score}</span>
      </div>
    `;
  });

  modalContentDetails.innerHTML = `
    <div class="detail-league">${match.leagueName}</div>
    <div class="detail-match-name">${match.name}</div>
    
    <div class="detail-teams">
      ${competitorsHtml.split('</div>')[0]}</div>
      <div class="detail-vs">VS</div>
      ${competitorsHtml.split('</div>')[1]}</div>
    </div>

    <div class="detail-status-section">
      <div class="detail-status-badge" style="
        background: ${match.statusState === 'in' ? 'rgba(239, 68, 68, 0.15)' : match.statusState === 'pre' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.08)'};
        color: ${match.statusState === 'in' ? 'var(--accent-red)' : match.statusState === 'pre' ? 'var(--accent-blue)' : 'var(--text-secondary)'};
      ">
        ${match.statusState === 'in' ? '🔴 LIVE IN PROGRESS' : match.statusState === 'pre' ? '⏳ UPCOMING SCHEDULED' : '🏆 COMPLETED'}
      </div>
      <div class="detail-status-desc">${match.statusSummary || match.statusDetail}</div>
    </div>

    <div class="detail-meta-list">
      <div class="detail-meta-item">
        <span class="detail-meta-label">Venue</span>
        <span class="detail-meta-value">${match.venue}</span>
      </div>
      <div class="detail-meta-item">
        <span class="detail-meta-label">Match Time</span>
        <span class="detail-meta-value">${match.date}</span>
      </div>
      <div class="detail-meta-item">
        <span class="detail-meta-label">Sport Category</span>
        <span class="detail-meta-value" style="text-transform: capitalize;">${match.sport}</span>
      </div>
    </div>
  `;

  matchDetailsModal.classList.add('active');
}

// Open News Article Details Modal
function openArticleDetails(art) {
  modalContentDetails.innerHTML = `
    <span class="category-tag" style="margin-bottom: 0.5rem; display: inline-block;">${art.category}</span>
    <h2 style="font-size: 1.5rem; font-weight: 800; color: #fff; line-height: 1.3; margin-bottom: 1rem;">${art.title}</h2>
    
    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">
      <span>By ${art.source} Desk</span>
      <span>${art.time || 'Today'}</span>
    </div>

    <div style="border-radius: var(--border-radius-md); overflow: hidden; margin-bottom: 1.5rem; border: 1px solid var(--border-color);">
      <img src="${art.imageUrl}" alt="${art.title}" style="width: 100%; height: auto; display: block;" onerror="this.src='https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'">
    </div>

    <div style="color: var(--text-primary); font-size: 0.95rem; line-height: 1.7; white-space: pre-wrap;">
      ${art.content}
    </div>
    
    <div style="margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem; display: flex; gap: 1rem;">
      <button style="flex: 1; padding: 0.6rem; background: var(--accent-blue); color: white; border: none; font-family: var(--font-sans); border-radius: var(--border-radius-sm); font-weight: 600; cursor: pointer; transition: var(--transition-smooth);" onclick="alert('Article added to your guest bookmarks!')">⭐ Save Article</button>
      <button style="flex: 1; padding: 0.6rem; background: rgba(255,255,255,0.05); color: var(--text-primary); border: 1px solid var(--border-color); font-family: var(--font-sans); border-radius: var(--border-radius-sm); font-weight: 600; cursor: pointer; transition: var(--transition-smooth);" onclick="navigator.clipboard.writeText(window.location.href); alert('Link copied to clipboard!')">🔗 Share</button>
    </div>
  `;

  matchDetailsModal.classList.add('active');
}

function closeModal() {
  matchDetailsModal.classList.remove('active');
}
