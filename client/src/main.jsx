import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Link, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import './styles.css';

const API_URL = 'http://localhost:5000/api';

const categories = [
  'Political Live',
  'Stock Market',
  'Education',
  'Sports',
  'Technology',
  'Entertainment',
  'Health',
  'International News'
];

const CRICKET_API = 'https://site.api.espn.com/apis/personalized/v2/scoreboard/header?sport=cricket&region=in';
const SOCCER_API = 'https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard';

const formatDate = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
};

const getApiDateRangeString = () => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 2);

  return `${formatDate(twoDaysAgo)}-${formatDate(tomorrow)}`;
};

const launchProducts = [
  {
    id: "launch-1",
    name: "Apple iPhone 17 Pro (Titanium Gray, 256 GB)",
    originalPrice: "₹1,39,900",
    price: "₹1,29,900",
    discount: "7% off",
    rating: "4.9",
    reviewsCount: "18,450 Ratings & 1,240 Reviews",
    specs: [
      "256 GB ROM | 6.3 inch Super Retina XDR Display",
      "48MP + 48MP + 48MP Triple Rear Camera | 12MP Front Camera",
      "A19 Pro Bionic Chip Processor",
      "Titanium Build with Action Button & USB-C 3.0"
    ],
    detailedSpecs: {
      "RAM": "12 GB RAM",
      "Storage (Space)": "256 GB ROM",
      "Processor": "A19 Pro Bionic Chip",
      "Display": "6.3 inch Super Retina XDR (120Hz)",
      "Camera": "48MP + 48MP + 48MP Rear | 12MP Front",
      "Battery": "4400 mAh with 30W wireless charging",
      "OS": "iOS 19"
    },
    offers: [
      "Bank Offer: Flat ₹5,000 instant discount on HDFC Card transactions.",
      "Special Price: Get extra ₹10,000 off on Exchange (T&C Apply)."
    ],
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=400&q=80",
    assured: true,
    status: "PRE-ORDER LIVE"
  },
  {
    id: "launch-2",
    name: "Apple iPhone 16 Pro (Natural Titanium, 128 GB)",
    originalPrice: "₹1,19,900",
    price: "₹1,09,900",
    discount: "8% off",
    rating: "4.8",
    reviewsCount: "28,150 Ratings & 2,140 Reviews",
    specs: [
      "128 GB ROM | 6.3 inch Super Retina XDR Display",
      "48MP + 48MP + 12MP Triple Rear Camera | 12MP Front Camera",
      "A18 Pro Chip Processor",
      "Grade 5 Titanium design with Camera Control button"
    ],
    detailedSpecs: {
      "RAM": "8 GB RAM",
      "Storage (Space)": "128 GB ROM",
      "Processor": "A18 Pro Chip",
      "Display": "6.3 inch Super Retina XDR (120Hz)",
      "Camera": "48MP + 48MP + 12MP Rear | 12MP Front",
      "Battery": "3582 mAh with MagSafe wireless",
      "OS": "iOS 18"
    },
    offers: [
      "Bank Offer: Flat ₹4,000 instant discount on HDFC Card transactions.",
      "Partner Offer: Get free 6 months Apple Music subscription."
    ],
    image: "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&w=400&q=80",
    assured: true,
    status: "RELEASED"
  },
  {
    id: "launch-3",
    name: "Samsung Galaxy S26 Ultra (Phantom Black, 512 GB)",
    originalPrice: "₹1,44,999",
    price: "₹1,24,999",
    discount: "13% off",
    rating: "4.8",
    reviewsCount: "9,120 Ratings & 890 Reviews",
    specs: [
      "512 GB ROM | 12 GB RAM",
      "200MP + 50MP + 12MP + 10MP Quad Rear Camera | 12MP Front",
      "Snapdragon 8 Gen 5 Processor",
      "5000 mAh Lithium-ion Battery with 45W Fast Charge"
    ],
    detailedSpecs: {
      "RAM": "12 GB RAM",
      "Storage (Space)": "512 GB ROM",
      "Processor": "Snapdragon 8 Gen 5",
      "Display": "6.8 inch Quad HD+ Dynamic AMOLED 2X",
      "Camera": "200MP + 50MP + 12MP + 10MP Rear | 12MP Front",
      "Battery": "5000 mAh with 45W Fast Wired Charge",
      "OS": "Android 16"
    },
    offers: [
      "Bank Offer: Flat ₹6,000 instant discount on SBI Card transactions.",
      "EMI Option: No Cost EMI starting from ₹10,417/month."
    ],
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80",
    assured: true,
    status: "RELEASED"
  },
  {
    id: "launch-4",
    name: "Samsung Galaxy S25 (Marble Gray, 256 GB)",
    originalPrice: "₹79,999",
    price: "₹74,999",
    discount: "6% off",
    rating: "4.7",
    reviewsCount: "12,400 Ratings & 1,120 Reviews",
    specs: [
      "256 GB ROM | 8 GB RAM",
      "50MP + 12MP + 10MP Triple Rear Camera | 12MP Front",
      "Exynos 2500 Deca-Core Processor",
      "4000 mAh Battery with AI Power Management"
    ],
    detailedSpecs: {
      "RAM": "8 GB RAM",
      "Storage (Space)": "256 GB ROM",
      "Processor": "Exynos 2500 Deca-Core",
      "Display": "6.2 inch Full HD+ Dynamic AMOLED 2X",
      "Camera": "50MP + 12MP + 10MP Rear | 12MP Front",
      "Battery": "4000 mAh with 25W Fast Charge",
      "OS": "Android 15"
    },
    offers: [
      "Bank Offer: Flat ₹4,000 discount on ICICI Credit Cards.",
      "EMI Option: Buy with 9 months No Cost EMI."
    ],
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80",
    assured: true,
    status: "RELEASED"
  },
  {
    id: "launch-5",
    name: "Sony WH-1000XM6 Wireless Noise Cancelling (Black)",
    originalPrice: "₹34,990",
    price: "₹29,990",
    discount: "14% off",
    rating: "4.7",
    reviewsCount: "3,150 Ratings & 410 Reviews",
    specs: [
      "Industry Leading Active Noise Cancelling (ANC)",
      "42 Hours Battery Life with Quick Charging (10 min charge = 5 hrs play)",
      "V2 Noise Cancelling Processor",
      "Multipoint Connection & Speak-to-Chat Feature"
    ],
    detailedSpecs: {
      "RAM": "N/A (Audio)",
      "Storage (Space)": "N/A (Audio)",
      "Processor": "Sony V2 HD Noise Cancelling Processor",
      "Display": "N/A (Audio)",
      "Drivers": "40mm Dome Type (CCAW Voice Coil)",
      "Battery": "Up to 42 Hours ANC ON / 50 Hours OFF",
      "Connectivity": "Bluetooth 5.4, LDAC, Multipoint"
    },
    offers: [
      "Partner Offer: Sign up for Flipkart Pay Later & get ₹500 Gift Voucher.",
      "Bank Offer: 5% Unlimited Cashback on Flipkart Axis Bank Credit Card."
    ],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
    assured: true,
    status: "COMING SOON"
  },
  {
    id: "launch-6",
    name: "OnePlus 12 (Flowy Emerald, 512 GB)",
    originalPrice: "₹69,999",
    price: "₹64,999",
    discount: "7% off",
    rating: "4.8",
    reviewsCount: "14,890 Ratings & 1,560 Reviews",
    specs: [
      "512 GB ROM | 16 GB RAM",
      "50MP + 64MP + 48MP Triple Camera | 32MP Front",
      "Snapdragon 8 Gen 3 Processor",
      "5400 mAh Battery with 100W SUPERVOOC Charge"
    ],
    detailedSpecs: {
      "RAM": "16 GB LPDDR5X RAM",
      "Storage (Space)": "512 GB UFS 4.0 ROM",
      "Processor": "Snapdragon 8 Gen 3",
      "Display": "6.82 inch 2K 120Hz ProXDR Display",
      "Camera": "50MP Main + 64MP Telephoto + 48MP Ultra-Wide Rear",
      "Battery": "5400 mAh with 100W SUPERVOOC Wired / 50W Wireless",
      "OS": "OxygenOS based on Android 14"
    },
    offers: [
      "Bank Offer: Extra ₹3,000 instant discount on OneCard Card transactions.",
      "Partner Offer: Free 1-year OnePlus Red Cable Club membership."
    ],
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
    assured: true,
    status: "RELEASED"
  }
];

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
        winner: false
      },
      {
        name: "Australia",
        logo: "https://a.espncdn.com/i/teamlogos/cricket/500/2.png",
        score: "201/7 (20.0 ov)",
        winner: false
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

async function fetchESPNScoreboard(apiUrl) {
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;
  try {
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error(`Proxy error code ${res.status}`);
    const data = await res.json();
    if (!data.contents) throw new Error("Empty contents wrapper in proxy response");
    return JSON.parse(data.contents);
  } catch (err) {
    console.warn(`CORS Proxy failed to resolve for ${apiUrl}. Trying direct fetch fallback...`, err.message);
    const directRes = await fetch(apiUrl);
    if (!directRes.ok) throw new Error(`Direct fetch failed: ${directRes.status}`);
    return await directRes.json();
  }
}

function parseCricketData(data) {
  if (!data || !data.sports || !data.sports[0]) return [];
  const sports = data.sports[0];
  let matches = [];
  
  if (sports.leagues) {
    sports.leagues.forEach(league => {
      const leagueName = league.name || "Cricket League";
      if (league.events) {
        league.events.forEach(event => {
          try {
            const competitors = (event.competitors || []).map(c => {
              let logo = c.logo;
              if (!logo && c.name) {
                logo = `https://a.espncdn.com/i/teamlogos/countries/500/${c.name.substring(0,3).toLowerCase()}.png`;
              }
              return {
                name: c.displayName || c.name || "Cricket Team",
                logo: logo || "https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-cricket.png",
                score: c.score || "0",
                winner: c.winner === true || c.winner === 'true'
              };
            });

            const stateMap = {
              'in': 'in',
              'pre': 'pre',
              'post': 'post'
            };
            const statusState = stateMap[event.status] || event.status || 'pre';

            matches.push({
              id: event.id || `cricket-${Math.random()}`,
              sport: "cricket",
              leagueName: leagueName,
              name: event.name || "Cricket Match",
              statusState: statusState,
              statusDetail: event.fullStatus?.type?.detail || event.summary || "Scheduled",
              statusSummary: event.fullStatus?.longSummary || event.fullStatus?.summary || event.summary || "",
              venue: event.location || "Cricket Ground",
              date: event.date ? new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Upcoming",
              competitors: competitors
            });
          } catch (e) {
            console.error("Error parsing cricket event from header", e);
          }
        });
      }
    });
  }
  return matches;
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

function SportsScoreboardBar({ onCardClick, onMatchesUpdate }) {
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshTimer, setRefreshTimer] = useState(30);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollerRef = useRef(null);

  const loadMatches = async () => {
    setIsRefreshing(true);
    try {
      const datesRange = getApiDateRangeString();
      const [cricketData, soccerData] = await Promise.all([
        fetchESPNScoreboard(CRICKET_API),
        fetchESPNScoreboard(`${SOCCER_API}?dates=${datesRange}&limit=100`)
      ]);
      const parsedCricket = parseCricketData(cricketData);
      const parsedSoccer = parseSoccerData(soccerData);
      let apiMatches = [...parsedCricket, ...parsedSoccer].filter(m => m !== null);
      if (apiMatches.length === 0) {
        setMatches(mockSportsMatches);
        if (onMatchesUpdate) {
          onMatchesUpdate(mockSportsMatches);
        }
      } else {
        const statusOrder = { 'in': 0, 'pre': 1, 'post': 2 };
        apiMatches.sort((a, b) => statusOrder[a.statusState] - statusOrder[b.statusState]);
        setMatches(apiMatches);
        if (onMatchesUpdate) {
          onMatchesUpdate(apiMatches);
        }
      }
    } catch (error) {
      console.error("Failed to load sports scoreboards, loading mock scoreboard data:", error);
      setMatches(mockSportsMatches);
      if (onMatchesUpdate) {
        onMatchesUpdate(mockSportsMatches);
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      setRefreshTimer(30);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshTimer(prev => {
        if (prev <= 1) {
          loadMatches();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = () => {
    if (!isRefreshing) {
      loadMatches();
    }
  };

  const handleScroll = (offset) => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const filteredMatches = matches.filter(m => {
    if (filter === 'all') return true;
    return m.sport === filter;
  });

  return (
    <div className="sports-scoreboard-bar">
      <div className="scoreboard-bar-header">
        <div className="scoreboard-bar-filters">
          <button 
            className={`scoreboard-filter-chip ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Matches
          </button>
          <button 
            className={`scoreboard-filter-chip ${filter === 'cricket' ? 'active' : ''}`}
            onClick={() => setFilter('cricket')}
          >
            Cricket
          </button>
          <button 
            className={`scoreboard-filter-chip ${filter === 'soccer' ? 'active' : ''}`}
            onClick={() => setFilter('soccer')}
          >
            Soccer
          </button>
        </div>
        <div className="scoreboard-bar-meta">
          <div className="scoreboard-refresh-timer">
            <span className="scoreboard-spinner" style={{ animationPlayState: isRefreshing ? 'running' : 'paused' }}></span>
            <span>{isRefreshing ? 'Refreshing...' : `Auto-refresh in ${refreshTimer}s`}</span>
          </div>
          <button 
            className={`scoreboard-refresh-btn ${isRefreshing ? 'spinning' : ''}`}
            onClick={handleManualRefresh}
            title="Manual Refresh"
            disabled={isRefreshing}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="scoreboard-scroller-container">
        <button className="scoreboard-scroll-arrow left" onClick={() => handleScroll(-280)}>‹</button>
        <div className="scoreboard-cards-scroller" ref={scrollerRef}>
          {loading ? (
            <div style={{ display: 'flex', gap: '1rem', width: '100%', overflow: 'hidden' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="scoreboard-match-card" style={{ opacity: 0.5 }}>
                  <div className="scoreboard-card-header" style={{ height: '12px', background: 'rgba(255,255,255,0.05)', width: '70%', borderRadius: '4px' }}></div>
                  <div style={{ height: '16px', background: 'rgba(255,255,255,0.05)', width: '100%', borderRadius: '4px', margin: '10px 0' }}></div>
                  <div style={{ height: '16px', background: 'rgba(255,255,255,0.05)', width: '100%', borderRadius: '4px' }}></div>
                </div>
              ))}
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="scoreboard-empty">No active matches found.</div>
          ) : (
            filteredMatches.map(match => {
              const isLive = match.statusState === 'in';
              const isPost = match.statusState === 'post';
              let badgeText = match.statusDetail;
              let badgeClass = 'scheduled';
              if (isLive) {
                badgeText = 'LIVE';
                badgeClass = 'live';
              } else if (isPost) {
                badgeText = 'FINAL';
                badgeClass = 'completed';
              }
              return (
                <div 
                  key={match.id}
                  className={`scoreboard-match-card ${isLive ? 'live-match' : ''}`}
                  onClick={() => onCardClick(match)}
                >
                  <div className="scoreboard-card-header">
                    <span className="scoreboard-card-league">{match.leagueName}</span>
                    <span className={`scoreboard-card-status-badge ${badgeClass}`}>{badgeText}</span>
                  </div>
                  <div className="scoreboard-card-competitors">
                    {match.competitors.map((team, idx) => {
                      const isWinner = isPost && team.winner;
                      return (
                        <div key={idx} className={`scoreboard-card-team ${isWinner ? 'winner' : ''}`}>
                          <div className="scoreboard-card-team-info">
                            <img 
                              className="scoreboard-card-team-logo" 
                              src={team.logo} 
                              alt={team.name}
                              onError={(e) => {
                                e.target.src = 'https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-cricket.png';
                              }}
                            />
                            <span className="scoreboard-card-team-name">{team.name}</span>
                          </div>
                          <span className="scoreboard-card-team-score">{team.score}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="scoreboard-card-footer">
                    {isLive ? (match.statusSummary || match.statusDetail) : (match.statusSummary || match.date)}
                  </div>
                </div>
              );
            })
          )}
        </div>
        <button className="scoreboard-scroll-arrow right" onClick={() => handleScroll(280)}>›</button>
      </div>
    </div>
  );
}

const AuthContext = createContext(null);

function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedArticles, setSavedArticles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUser(data.user);
          } else {
            localStorage.removeItem('token');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch saved articles when user changes
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      fetch(`${API_URL}/users/saved-articles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setSavedArticles(data.savedArticles || []);
          }
        })
        .catch((err) => console.error('Error fetching saved articles:', err));
    } else {
      setSavedArticles([]);
    }
  }, [user]);

  const saveArticle = async (article) => {
    if (!user) return false;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/users/saved-articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: article.title,
          tag: article.tag,
          source: article.source,
          time: article.time
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedArticles(data.savedArticles);
        return true;
      }
    } catch (err) {
      console.error('Error saving article:', err);
    }
    return false;
  };

  const unsaveArticle = async (title) => {
    if (!user) return false;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/users/saved-articles`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedArticles(data.savedArticles);
        return true;
      }
    } catch (err) {
      console.error('Error unsaving article:', err);
    }
    return false;
  };

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, savedArticles, saveArticle, unsaveArticle }}>
      {children}
    </AuthContext.Provider>
  );
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [accent, setAccent] = useState(() => {
    return localStorage.getItem('accent') || 'green';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    let colorVal = '#00ff88';
    let hoverVal = '#00cc6e';
    let glowVal = 'rgba(0, 255, 136, 0.15)';
    if (accent === 'blue') {
      colorVal = '#0088ff';
      hoverVal = '#0066cc';
      glowVal = 'rgba(0, 136, 255, 0.15)';
    } else if (accent === 'purple') {
      colorVal = '#d300ff';
      hoverVal = '#aa00cc';
      glowVal = 'rgba(211, 0, 255, 0.15)';
    } else if (accent === 'red') {
      colorVal = '#ff3b30';
      hoverVal = '#cc2f26';
      glowVal = 'rgba(255, 59, 48, 0.15)';
    }
    
    document.documentElement.style.setProperty('--accent-green', colorVal);
    document.documentElement.style.setProperty('--accent-hover', hoverVal);
    document.documentElement.style.setProperty('--accent-glow', glowVal);
    localStorage.setItem('accent', accent);
  }, [accent]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme, accent, setAccent };
}

function HomePage() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="home-container">
      <header className="site-header">
        <Link className="brand" to="/">
          <span className="brand-mark">N</span>
          <span>NewsSphere</span>
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {user ? (
            <Link className="nav-button" to="/dashboard">Dashboard</Link>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link className="nav-button" to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <main className="landing-main">
        <section className="hero">
          <div className="hero-media" aria-hidden="true" />
          <div className="hero-content">
            <p className="eyebrow">AI-powered personalized news</p>
            <h1>NewsSphere</h1>
            <p className="hero-copy">
              Real-time updates, custom recommendations, and an AI conversational chatbot that summarizes articles and delivers daily briefs.
            </p>
            <div className="hero-actions">
              {user ? (
                <Link className="primary-action" to="/dashboard">Go to Dashboard</Link>
              ) : (
                <>
                  <Link className="primary-action" to="/register">Create Account</Link>
                  <Link className="secondary-action" to="/login">Sign In</Link>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function AuthLayout({ mode }) {
  const isLogin = mode === 'login';
  const { theme, toggleTheme } = useTheme();
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.target);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    if (!isLogin) {
      data.name = formData.get('name');
      data.category = formData.get('category');
    }

    try {
      const response = await fetch(`${API_URL}/auth/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        login(result.token, result.user);
        navigate('/dashboard');
      } else {
        setError(result.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to connect to server. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link className="brand auth-brand" to="/" style={{ margin: 0 }}>
          <span className="brand-mark">N</span>
          <span>NewsSphere</span>
        </Link>
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
      <section className="auth-shell">
        <div className="auth-copy">
          <p className="eyebrow">{isLogin ? 'Welcome back' : 'Join NewsSphere'}</p>
          <h1>{isLogin ? 'Continue your personalized briefing.' : 'Create your news profile.'}</h1>
          <p>
            Save interests, follow categories, receive smart recommendations, and use the chatbot to understand stories faster.
          </p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>{isLogin ? 'Login' : 'Registration'}</h2>
          {error && <div className="error-message">{error}</div>}
          {!isLogin && (
            <label>
              Full name
              <input type="text" name="name" placeholder="Enter your name" autoComplete="name" required />
            </label>
          )}
          <label>
            Email address
            <input type="email" name="email" placeholder="you@example.com" autoComplete="email" required />
          </label>
          <label>
            Password
            <input type="password" name="password" placeholder="Enter password" autoComplete={isLogin ? 'current-password' : 'new-password'} minLength="6" required />
          </label>
          {!isLogin && (
            <label>
              Preferred category
              <select name="category" defaultValue="" required>
                <option value="" disabled>Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
          )}
          <button className="primary-action full-width" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create account')}
          </button>
          <p className="switch-link">
            {isLogin ? 'New to NewsSphere?' : 'Already registered?'}{' '}
            <Link to={isLogin ? '/register' : '/login'}>{isLogin ? 'Create an account' : 'Login'}</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationName, setLocationName] = useState(() => localStorage.getItem('weather_location_name') || 'Bengaluru');
  const [lat, setLat] = useState(() => parseFloat(localStorage.getItem('weather_lat')) || 12.9716);
  const [lon, setLon] = useState(() => parseFloat(localStorage.getItem('weather_lon')) || 77.5946);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const fetchWeather = async (latitude, longitude, name) => {
    try {
      setLoading(true);
      setError('');
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load weather');
      const data = await res.json();
      setWeather(data);
      
      setLocationName(name);
      setLat(latitude);
      setLon(longitude);
      
      localStorage.setItem('weather_location_name', name);
      localStorage.setItem('weather_lat', latitude.toString());
      localStorage.setItem('weather_lon', longitude.toString());
    } catch (err) {
      console.error(err);
      setError('Failed to fetch weather forecast');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedLat = localStorage.getItem('weather_lat');
    const savedLon = localStorage.getItem('weather_lon');
    const savedName = localStorage.getItem('weather_location_name');
    if (savedLat && savedLon && savedName) {
      fetchWeather(parseFloat(savedLat), parseFloat(savedLon), savedName);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            
            let name = 'Local Area';
            try {
              const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
              if (geoRes.ok) {
                const geoData = await geoRes.json();
                name = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.county || 'Local Area';
              }
            } catch (e) {
              console.warn(e);
            }
            fetchWeather(latitude, longitude, name);
          },
          (geoErr) => {
            fetchWeather(12.9716, 77.5946, 'Bengaluru');
          }
        );
      } else {
        fetchWeather(12.9716, 77.5946, 'Bengaluru');
      }
    }
  }, []);

  const handleSearchLocation = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setError('');

    try {
      const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`;
      const res = await fetch(geoUrl);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      
      if (data && data.length > 0) {
        const first = data[0];
        const latitude = parseFloat(first.lat);
        const longitude = parseFloat(first.lon);
        const name = first.display_name.split(',')[0];
        
        await fetchWeather(latitude, longitude, name);
        setSearchQuery('');
        setShowSearch(false);
      } else {
        setError('Location not found. Try another city.');
      }
    } catch (err) {
      console.error(err);
      setError('Search failed. Check your connection.');
    } finally {
      setSearching(false);
    }
  };

  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️';
    if (code >= 1 && code <= 3) return '🌤️';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 55) return '🌧️';
    if (code >= 61 && code <= 65) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 95 && code <= 99) return '⛈️';
    return '🌤️';
  };

  const getWeatherDesc = (code) => {
    if (code === 0) return 'Clear Sky';
    if (code >= 1 && code <= 3) return 'Partly Cloudy';
    if (code >= 45 && code <= 48) return 'Foggy';
    if (code >= 51 && code <= 55) return 'Drizzle';
    if (code >= 61 && code <= 65) return 'Rainy';
    if (code >= 71 && code <= 77) return 'Snowy';
    if (code >= 80 && code <= 82) return 'Showers';
    if (code >= 95 && code <= 99) return 'Thunderstorms';
    return 'Cloudy';
  };

  const current = weather?.current_weather;
  const daily = weather?.daily;

  return (
    <div className="dashboard-widget weather-widget" style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: '16px',
      padding: '1.25rem',
      marginBottom: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          📍 {locationName}
        </span>
        <button 
          onClick={() => setShowSearch(!showSearch)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-green)',
            fontSize: '0.72rem',
            cursor: 'pointer',
            padding: 0
          }}
        >
          {showSearch ? '✕ Cancel' : '🔍 Change Location'}
        </button>
      </div>

      {showSearch && (
        <form onSubmit={handleSearchLocation} style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
          <input 
            type="text"
            placeholder="City (e.g. Mysuru, London)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              padding: '0.3rem 0.5rem',
              fontSize: '0.75rem',
              color: '#fff'
            }}
          />
          <button 
            type="submit" 
            disabled={searching}
            style={{
              background: 'var(--accent-green)',
              color: '#080c10',
              border: 'none',
              borderRadius: '4px',
              padding: '0.3rem 0.6rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {searching ? '...' : 'Go'}
          </button>
        </form>
      )}

      {error && (
        <div style={{ color: '#ff3b30', fontSize: '0.72rem', margin: '0.25rem 0' }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem 0' }}>
          <div className="skeleton-text loading-shimmer" style={{ width: '80%', height: '14px' }} />
          <div className="skeleton-text loading-shimmer" style={{ width: '50%', height: '24px' }} />
        </div>
      ) : weather && current && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.25rem 0' }}>
            <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>{getWeatherIcon(current.weathercode)}</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
                {Math.round(current.temperature)}°C
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                {getWeatherDesc(current.weathercode)} · Wind: {current.windspeed} km/h
              </span>
            </div>
          </div>

          {daily && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '0.75rem',
              marginTop: '0.25rem',
              gap: '0.5rem'
            }}>
              {[1, 2, 3].map((idx) => {
                const date = new Date(daily.time[idx]);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', flex: 1 }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{dayName}</span>
                    <span style={{ fontSize: '1.1rem' }}>{getWeatherIcon(daily.weathercode[idx])}</span>
                    <span style={{ fontSize: '0.7rem', color: '#fff', fontWeight: 600 }}>
                      {Math.round(daily.temperature_2m_max[idx])}°/{Math.round(daily.temperature_2m_min[idx])}°
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const topMoviesThisMonth = [
  {
    id: "top-m-1",
    name: "Deadpool & Wolverine",
    rating: "8.1",
    year: "2024",
    genres: "Action, Comedy, Sci-Fi",
    cast: "Ryan Reynolds, Hugh Jackman, Emma Corrin",
    director: "Shawn Levy",
    plot: "A listless Wade Wilson toils in civilian life. His days as the morally flexible mercenary, Deadpool, behind him. When his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.",
    image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "top-m-2",
    name: "Inside Out 2",
    rating: "7.9",
    year: "2024",
    genres: "Animation, Adventure, Comedy",
    cast: "Amy Poehler, Maya Hawke, Kensington Tallman",
    director: "Kelsey Mann",
    plot: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust aren't sure how to feel when Anxiety shows up.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "top-m-3",
    name: "Dune: Part Two",
    rating: "8.6",
    year: "2024",
    genres: "Action, Adventure, Drama",
    cast: "Timothée Chalamet, Zendaya, Rebecca Ferguson",
    director: "Denis Villeneuve",
    plot: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future.",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "top-m-4",
    name: "Despicable Me 4",
    rating: "6.3",
    year: "2024",
    genres: "Animation, Adventure, Comedy",
    cast: "Steve Carell, Kristen Wiig, Will Ferrell",
    director: "Chris Renaud",
    plot: "Gru, Lucy, Margo, Edith, and Agnes welcome a new member to the family, Gru Jr., who is intent on tormenting his dad. Gru faces a new nemesis in Maxime Le Mal and his femme fatale girlfriend Valentina, and the family is forced to go on the run.",
    image: "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?auto=format&fit=crop&w=400&q=80"
  }
];

const indianMoviesCatalog = [
  {
    id: "ind-m-1",
    name: "K.G.F: Chapter 2 (Kannada)",
    rating: "8.3",
    year: "2022",
    genres: "Action, Crime, Drama",
    cast: "Yash, Sanjay Dutt, Raveena Tandon, Srinidhi Shetty",
    director: "Prashanth Neel",
    plot: "In the blood-drenched Kolar Gold Fields (KGF), Rocky's name strikes fear in his enemies. While his allies look up to him as their Savior, the government views him as a threat to law and order.",
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "ind-m-2",
    name: "Kantara (Kannada)",
    rating: "8.2",
    year: "2022",
    genres: "Action, Adventure, Drama, Thriller",
    cast: "Rishab Shetty, Sapthami Gowda, Kishore Kumar G.",
    director: "Rishab Shetty",
    plot: "When greedy officials threaten the mystical forest of a village, a local rebel Shiva champions the ancient tribal traditions and the legend of the demigod Panjurli in Karnataka.",
    image: "https://images.unsplash.com/photo-1460881680858-30d872d5b530?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "ind-m-3",
    name: "Kalki 2898 AD (Pan-Indian)",
    rating: "7.6",
    year: "2024",
    genres: "Action, Sci-Fi, Fantasy",
    cast: "Prabhas, Amitabh Bachchan, Kamal Haasan, Deepika Padukone",
    director: "Nag Ashwin",
    plot: "A modern avatar of Vishnu, a mythical figure, is believed to have descended to Earth to protect the world from evil forces in a dystopian post-apocalyptic future.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "ind-m-4",
    name: "Pushpa 2: The Rule (Pan-Indian)",
    rating: "8.0",
    year: "2024",
    genres: "Action, Crime, Drama",
    cast: "Allu Arjun, Rashmika Mandanna, Fahadh Faasil",
    director: "Sukumar",
    plot: "The clash continues between Pushpa Raj, now ruling the red sandalwood smuggling empire, and the ruthless police officer Bhanwar Singh Shekhawat in this high-octane pan-Indian sequel.",
    image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "ind-m-5",
    name: "K.G.F: Chapter 1 (Kannada)",
    rating: "8.2",
    year: "2018",
    genres: "Action, Drama",
    cast: "Yash, Srinidhi Shetty, Ramachandra Raju",
    director: "Prashanth Neel",
    plot: "Rocky, a young man, seeks power and wealth in order to fulfill a promise to his dying mother. His quest takes him to the gold mines of Kolar, where he must free oppressed workers.",
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "ind-m-6",
    name: "Pushpa: The Rise (Telugu/Kannada/Hindi)",
    rating: "7.6",
    year: "2021",
    genres: "Action, Crime, Drama",
    cast: "Allu Arjun, Rashmika Mandanna, Fahadh Faasil",
    director: "Sukumar",
    plot: "Violence erupts between red sandalwood smugglers and the police in the Seshachalam forests of Andhra Pradesh. A coolie rises to become the leader of the syndicate.",
    image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "ind-m-7",
    name: "Baahubali 2: The Conclusion (Pan-Indian)",
    rating: "8.2",
    year: "2017",
    genres: "Action, Drama, Fantasy",
    cast: "Prabhas, Rana Daggubati, Anushka Shetty, Tamannaah Bhatia",
    director: "S.S. Rajamouli",
    plot: "When Mahendra Baahubali, the son of Meredev, learns about his heritage, he begins to look for answers. His story is juxtaposed with past events in the Kingdom of Mahishmati.",
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "ind-m-8",
    name: "Baahubali: The Beginning (Pan-Indian)",
    rating: "8.0",
    year: "2015",
    genres: "Action, Drama, Fantasy",
    cast: "Prabhas, Rana Daggubati, Anushka Shetty, Tamannaah Bhatia",
    director: "S.S. Rajamouli",
    plot: "In ancient India, an adventurous and daring man Shiva falls in love with a warrior woman. While trying to woo her, he helps rescue her former queen and discovers his true identity.",
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "ind-m-9",
    name: "RRR (Telugu/Hindi/Kannada)",
    rating: "7.8",
    year: "2022",
    genres: "Action, Drama",
    cast: "N.T. Rama Rao Jr., Ram Charan, Ajay Devgn, Alia Bhatt",
    director: "S.S. Rajamouli",
    plot: "A fearless warrior on a perilous mission comes face to face with a steely cop serving the British forces in this epic saga of friendship, duty, and freedom set in 1920s India.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "ind-m-10",
    name: "Jawan (Hindi/Kannada/Tamil)",
    rating: "7.0",
    year: "2023",
    genres: "Action, Thriller",
    cast: "Shah Rukh Khan, Nayanthara, Vijay Sethupathi",
    director: "Atlee",
    plot: "A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society, starring Shah Rukh Khan in a double role.",
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "ind-m-11",
    name: "Pathaan (Hindi)",
    rating: "5.9",
    year: "2023",
    genres: "Action, Adventure, Thriller",
    cast: "Shah Rukh Khan, Deepika Padukone, John Abraham",
    director: "Siddharth Anand",
    plot: "An Indian agent Pathaan fights against a mercenary group Outfit X led by Jim, who plans to unleash a deadly virus in India.",
    image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "ind-m-12",
    name: "Charlie 777 (Kannada)",
    rating: "8.7",
    year: "2022",
    genres: "Adventure, Comedy, Drama",
    cast: "Rakshit Shetty, Sangeetha Sringeri, Charlie",
    director: "Kiranraj K.",
    plot: "Dharma is stuck in a rut with his negative lifestyle. A Labrador puppy named Charlie enters his life and changes it forever, taking him on a journey of self-discovery across India.",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "ind-m-13",
    name: "Kirik Party (Kannada)",
    rating: "8.3",
    year: "2016",
    genres: "Comedy, Drama, Romance",
    cast: "Rakshit Shetty, Rashmika Mandanna, Samyuktha Hegde",
    director: "Rishab Shetty",
    plot: "Kirik Party is the story of a gang of mischievous students, led by Karna, who enter engineering college and find friendship, love, and life lessons.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "ind-m-14",
    name: "Vikrant Rona (Kannada)",
    rating: "7.0",
    year: "2022",
    genres: "Action, Adventure, Drama, Mystery",
    cast: "Sudeep, Nirup Bhandari, Neetha Ashok",
    director: "Anup Bhandari",
    plot: "Almost half a century ago, a remote village in the middle of a tropical rainforest starts witnessing a series of unexplained events which they attribute to the supernatural, investigated by inspector Vikrant Rona.",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "ind-m-15",
    name: "Sapta Sagaradaache Ello (Kannada)",
    rating: "8.4",
    year: "2023",
    genres: "Drama, Romance",
    cast: "Rakshit Shetty, Rukmini Vasanth, Achyuth Kumar",
    director: "Hemanth M. Rao",
    plot: "An intense love story between Manu and Priya. When Manu takes a desperate shortcut to realize their dreams, it leads to tragic consequences, testing their love across shores.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "ind-m-16",
    name: "Dangal (Hindi)",
    rating: "8.3",
    year: "2016",
    genres: "Action, Biography, Drama",
    cast: "Aamir Khan, Sakshi Tanwar, Fatima Sana Shaikh",
    director: "Nitesh Tiwari",
    plot: "Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games in the face of societal oppression.",
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "ind-m-17",
    name: "3 Idiots (Hindi)",
    rating: "8.4",
    year: "2009",
    genres: "Comedy, Drama",
    cast: "Aamir Khan, Madhavan, Sharman Joshi, Kareena Kapoor",
    director: "Rajkumar Hirani",
    plot: "Two friends search for their long-lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently, even as the world called them 'idiots'.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "ind-m-18",
    name: "Sholay (Hindi)",
    rating: "8.1",
    year: "1975",
    genres: "Action, Adventure, Comedy",
    cast: "Dharmendra, Sanjeev Kumar, Hema Malini, Amitabh Bachchan",
    director: "Ramesh Sippy",
    plot: "After his family is murdered by a notorious bandit, a former police officer hires two outlaws to capture the bandit and bring him to justice.",
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "ind-m-19",
    name: "Animal (Hindi)",
    rating: "6.3",
    year: "2023",
    genres: "Action, Drama, Thriller",
    cast: "Ranbir Kapoor, Anil Kapoor, Bobby Deol, Rashmika Mandanna",
    director: "Sandeep Reddy Vanga",
    plot: "The complex relationship between a father and son, set against the backdrop of a fierce underworld gang war that drives the son to extreme levels of violence.",
    image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=400&q=80"
  }
];

function EntertainmentMovieSearchModule() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [apiKey, setApiKey] = useState(localStorage.getItem('newsphere_omdb_key') || '');
  const [showConfig, setShowConfig] = useState(false);
  const [error, setError] = useState('');

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('newsphere_omdb_key', key);
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      // 1. Query TVmaze first
      const tvmazeUrl = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`;
      const tvmazeRes = await fetch(tvmazeUrl);
      
      let tvShows = [];
      if (tvmazeRes.ok) {
        const tvmazeData = await tvmazeRes.json();
        tvShows = await Promise.all(tvmazeData.slice(0, 5).map(async (item) => {
          const show = item.show;
          let castNames = "N/A";
          try {
            const castRes = await fetch(`https://api.tvmaze.com/shows/${show.id}/cast`);
            if (castRes.ok) {
              const castData = await castRes.json();
              castNames = castData.slice(0, 3).map(c => c.person?.name).join(', ') || "N/A";
            }
          } catch (castErr) {
            console.warn("Failed to fetch cast from TVmaze", castErr);
          }

          const cleanSummary = show.summary ? show.summary.replace(/<[^>]*>/g, '') : "No description available.";

          return {
            id: `tv-${show.id}`,
            name: show.name,
            rating: show.rating?.average ? `${show.rating.average}` : "7.5",
            year: show.premiered ? show.premiered.substring(0, 4) : "N/A",
            genres: show.genres?.join(', ') || "Drama",
            cast: castNames,
            director: show.network?.name || show.webChannel?.name || "Production",
            plot: cleanSummary,
            image: show.image?.medium || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80"
          };
        }));
      }

      // 2. Search local movie databases
      const localMatches = topMoviesThisMonth.filter(m => 
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.genres.toLowerCase().includes(query.toLowerCase()) ||
        m.cast.toLowerCase().includes(query.toLowerCase())
      );

      const indianMatches = indianMoviesCatalog.filter(m => 
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.genres.toLowerCase().includes(query.toLowerCase()) ||
        m.cast.toLowerCase().includes(query.toLowerCase())
      );

      // 3. OMDb API query if key provided
      let omdbMovies = [];
      if (apiKey.trim()) {
        const omdbUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey.trim()}`;
        const omdbRes = await fetch(omdbUrl);
        if (omdbRes.ok) {
          const omdbData = await omdbRes.json();
          if (omdbData.Response === 'True' && omdbData.Search) {
            omdbMovies = await Promise.all(omdbData.Search.slice(0, 3).map(async (m) => {
              try {
                const detailRes = await fetch(`https://www.omdbapi.com/?i=${m.imdbID}&apikey=${apiKey.trim()}`);
                if (detailRes.ok) {
                  const detail = await detailRes.json();
                  return {
                    id: m.imdbID,
                    name: detail.Title || m.Title,
                    rating: detail.imdbRating || "N/A",
                    year: detail.Year || m.Year,
                    genres: detail.Genre || "Movie",
                    cast: detail.Actors || "N/A",
                    director: detail.Director || "N/A",
                    plot: detail.Plot || "No description available.",
                    image: detail.Poster !== 'N/A' ? detail.Poster : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80"
                  };
                }
              } catch (detailErr) {
                console.warn(detailErr);
              }
              return {
                id: m.imdbID,
                name: m.Title,
                rating: "N/A",
                year: m.Year,
                genres: "Movie",
                cast: "N/A",
                director: "N/A",
                plot: "Details on IMDB.",
                image: m.Poster !== 'N/A' ? m.Poster : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80"
              };
            }));
          }
        }
      }

      const combined = [...localMatches, ...indianMatches, ...omdbMovies, ...tvShows];
      if (combined.length === 0) {
        setError("No matching movies or series found. Try checking the spelling.");
      } else {
        const unique = [];
        const seen = new Set();
        combined.forEach(item => {
          const lowerName = item.name.toLowerCase();
          if (!seen.has(lowerName)) {
            seen.add(lowerName);
            unique.push(item);
          }
        });
        setResults(unique);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during search. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="movie-search-module" style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '2rem'
    }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        🎬 Movie & Series IMDb Search
      </h3>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
        Search details, ratings, cast lists, and descriptions for any movie or TV series. TV series searches are powered live by TVmaze without key requirements!
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={() => setShowConfig(!showConfig)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-green)',
            fontSize: '0.75rem',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          ⚙️ {showConfig ? 'Hide OMDb settings' : 'Configure Live OMDb API Key for Movies (Optional)'}
        </button>
        {showConfig && (
          <div style={{
            marginTop: '0.75rem',
            padding: '1rem',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              OMDb API Key
            </label>
            <input 
              type="password"
              placeholder="Paste your OMDb API Key here..."
              value={apiKey}
              onChange={(e) => saveApiKey(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '0.5rem',
                fontSize: '0.78rem',
                color: '#fff'
              }}
            />
            <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', margin: 0 }}>
              * Free keys can be requested instantly at <code>omdbapi.com</code>. TV series searches will work out-of-the-box anyway.
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <input 
          type="text"
          placeholder="Search movies or TV series (e.g. Deadpool, Stranger Things, Inception)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            fontSize: '0.85rem',
            color: '#fff'
          }}
        />
        <button 
          type="submit"
          disabled={loading}
          style={{
            background: 'var(--accent-green)',
            color: '#080c10',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div style={{ color: 'var(--danger-color)', fontSize: '0.8rem', marginBottom: '1rem' }}>
          ⚠️ {error}
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '0.75rem' }}>
          <div className="scoreboard-spinner"></div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Searching movies & series database...</span>
        </div>
      )}

      {results.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            🔍 Search Results ({results.length})
          </h4>
          <div className="movie-releases-grid">
            {results.map((movie) => (
              <div key={movie.id} className="movie-release-card">
                <div className="movie-card-poster-wrapper">
                  <span className="movie-card-rating-badge">★ {movie.rating}</span>
                  <img className="movie-card-poster" src={movie.image} alt={movie.name} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80'; }} />
                </div>
                <div className="movie-card-content">
                  <h4 className="movie-card-title">{movie.name}</h4>
                  <div className="movie-card-meta">{movie.year} · {movie.genres}</div>
                  <p className="movie-card-plot">{movie.plot}</p>
                  <div className="movie-card-cast" style={{ fontSize: '0.7rem' }}>
                    <strong>Director/Network:</strong> {movie.director} <br/>
                    <strong>Cast:</strong> {movie.cast}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && !loading && (
        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            🔥 Blockbuster Movie Releases This Month
          </h4>
          <div className="movie-releases-grid">
            {topMoviesThisMonth.map((movie) => (
              <div key={movie.id} className="movie-release-card">
                <div className="movie-card-poster-wrapper">
                  <span className="movie-card-rating-badge">★ {movie.rating}</span>
                  <img className="movie-card-poster" src={movie.image} alt={movie.name} />
                </div>
                <div className="movie-card-content">
                  <h4 className="movie-card-title">{movie.name}</h4>
                  <div className="movie-card-meta">{movie.year} · {movie.genres}</div>
                  <p className="movie-card-plot">{movie.plot}</p>
                  <div className="movie-card-cast" style={{ fontSize: '0.7rem' }}>
                    <strong>Director:</strong> {movie.director} <br/>
                    <strong>Cast:</strong> {movie.cast}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TechProductSearchModule() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [apiKey, setApiKey] = useState(localStorage.getItem('newsphere_rapidapi_key') || '');
  const [showConfig, setShowConfig] = useState(false);
  const [error, setError] = useState('');

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('newsphere_rapidapi_key', key);
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      if (apiKey.trim()) {
        const targetUrl = `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(query)}&country=IN`;
        
        const res = await fetch(targetUrl, {
          headers: {
            'x-rapidapi-key': apiKey.trim(),
            'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com'
          }
        });
        
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        
        if (data.status === 'ERROR') {
          throw new Error(data.message || 'RapidAPI returned an error');
        }

        const products = data.data?.products || [];
        const formatted = products.map(p => {
          const title = p.product_title || '';
          let ram = "8 GB RAM";
          let storage = "128 GB ROM";
          if (title.toLowerCase().includes("256gb") || title.toLowerCase().includes("256 gb")) storage = "256 GB ROM";
          else if (title.toLowerCase().includes("512gb") || title.toLowerCase().includes("512 gb")) storage = "512 GB ROM";
          else if (title.toLowerCase().includes("1tb") || title.toLowerCase().includes("1 tb")) storage = "1 TB ROM";

          if (title.toLowerCase().includes("12gb") || title.toLowerCase().includes("12 gb")) ram = "12 GB RAM";
          else if (title.toLowerCase().includes("16gb") || title.toLowerCase().includes("16 gb")) ram = "16 GB RAM";

          let processor = "Octa Core";
          if (title.toLowerCase().includes("iphone")) processor = "Apple Bionic / Pro Chip";
          else if (title.toLowerCase().includes("samsung") || title.toLowerCase().includes("snapdragon")) processor = "Snapdragon / Exynos Octa Core";

          return {
            id: p.asin || `product-${Math.random()}`,
            name: title,
            price: p.product_price || "Price Details on Store",
            originalPrice: p.product_original_price || "",
            discount: p.product_original_price ? `${Math.round(((parseFloat(p.product_original_price.replace(/[^\d.]/g, '')) - parseFloat(p.product_price.replace(/[^\d.]/g, ''))) / parseFloat(p.product_original_price.replace(/[^\d.]/g, ''))) * 100)}% off` : "",
            rating: p.product_star_rating || "4.5",
            reviewsCount: p.product_num_ratings ? `${p.product_num_ratings} Ratings` : "Recent Launch",
            image: p.product_photo || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
            specs: [
              `${ram} | ${storage}`,
              `Processor: ${processor}`,
              p.delivery_information || "Free Delivery available"
            ],
            detailedSpecs: {
              "RAM": ram,
              "Storage (Space)": storage,
              "Processor": processor,
              "ASIN": p.asin || "N/A",
              "URL": p.product_url || "#"
            },
            url: p.product_url || "#"
          };
        });

        setResults(formatted);
      } else {
        const targetUrl = `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`;
        const res = await fetch(targetUrl);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        
        const products = data.products || [];
        const formatted = products.map(p => {
          let ram = "8 GB RAM";
          let storage = "128 GB ROM";
          if (p.title.toLowerCase().includes("256gb") || p.description.toLowerCase().includes("256gb")) storage = "256 GB ROM";
          else if (p.title.toLowerCase().includes("512gb") || p.description.toLowerCase().includes("512gb")) storage = "512 GB ROM";

          return {
            id: p.id || `product-${Math.random()}`,
            name: `${p.brand || ''} ${p.title}`,
            price: `₹${Math.round(p.price * 83)}`,
            originalPrice: `₹${Math.round(p.price * 83 * (1 + (p.discountPercentage || 0)/100))}`,
            discount: `${Math.round(p.discountPercentage || 0)}% off`,
            rating: p.rating || "4.5",
            reviewsCount: `${Math.round(p.rating * 150)} Ratings`,
            image: p.thumbnail || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
            specs: [
              `${ram} | ${storage}`,
              p.description || "Premium technical specifications"
            ],
            detailedSpecs: {
              "RAM": ram,
              "Storage (Space)": storage,
              "Brand": p.brand || "Generics",
              "Category": p.category || "Technology",
              "Rating": `${p.rating} / 5`
            },
            url: "#"
          };
        });
        setResults(formatted);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to retrieve market data. Please verify your connection or API key.");
    } finally {
      setLoading(false);
    }
  };

  const [expandedProductSpecs, setExpandedProductSpecs] = useState({});

  return (
    <div className="tech-product-search-module" style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '2rem'
    }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        🛍️ Current Tech Market Search
      </h3>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
        Enter any tech product (e.g. &quot;iphone 16&quot;, &quot;samsung galaxy s25&quot;) to fetch current market prices, reviews, specifications, RAM, and space information.
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={() => setShowConfig(!showConfig)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-green)',
            fontSize: '0.75rem',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          ⚙️ {showConfig ? 'Hide API Settings' : 'Configure Live Amazon API Key (Optional)'}
        </button>
        {showConfig && (
          <div style={{
            marginTop: '0.75rem',
            padding: '1rem',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              RapidAPI Key (Host: <code>real-time-amazon-data</code>)
            </label>
            <input 
              type="password"
              placeholder="Paste your RapidAPI Key here..."
              value={apiKey}
              onChange={(e) => saveApiKey(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '0.5rem',
                fontSize: '0.78rem',
                color: '#fff'
              }}
            />
            <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', margin: 0 }}>
              * If left blank, searches will automatically fall back to the open DummyJSON products catalog.
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <input 
          type="text"
          placeholder="Search products (e.g. iPhone 17, Samsung S25, Sony XM5)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            fontSize: '0.85rem',
            color: '#fff'
          }}
        />
        <button 
          type="submit"
          disabled={loading}
          style={{
            background: 'var(--accent-green)',
            color: '#080c10',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Searching...' : 'Search Market'}
        </button>
      </form>

      {error && (
        <div style={{ color: 'var(--danger-color)', fontSize: '0.8rem', marginBottom: '1rem' }}>
          ⚠️ {error}
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '0.75rem' }}>
          <div className="scoreboard-spinner"></div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Retrieving live market details...</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {results.map((product) => {
          const isExpanded = !!expandedProductSpecs[product.id];
          return (
            <div key={product.id} className="launch-product-card" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1rem', padding: '1rem' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>{product.name}</h4>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="flipkart-rating-badge">{product.rating} ★</span>
                  <span className="flipkart-reviews-count">({product.reviewsCount})</span>
                  <span className="flipkart-assured-tag">Assured<span className="flipkart-assured-text">✓</span></span>
                </div>

                <div className="launch-price-row">
                  <span className="flipkart-price" style={{ fontSize: '1.3rem' }}>{product.price}</span>
                  {product.originalPrice && <span className="flipkart-original-price" style={{ fontSize: '0.9rem' }}>{product.originalPrice}</span>}
                  {product.discount && <span className="flipkart-discount" style={{ fontSize: '0.85rem' }}>{product.discount}</span>}
                </div>

                <ul className="launch-specs-list" style={{ margin: '0.25rem 0' }}>
                  {product.specs.map((spec, idx) => (
                    <li key={idx} className="launch-spec-item">{spec}</li>
                  ))}
                </ul>

                {product.detailedSpecs && (
                  <>
                    <button 
                      className="flipkart-specs-toggle-btn"
                      onClick={() => setExpandedProductSpecs(prev => ({ ...prev, [product.id]: !prev[product.id] }))}
                    >
                      {isExpanded ? "▲ Hide Technical Specifications" : "▼ Show Technical Specifications"}
                    </button>
                    {isExpanded && (
                      <table className="flipkart-specs-table" style={{ marginTop: '0.5rem' }}>
                        <tbody>
                          {Object.entries(product.detailedSpecs).map(([lbl, val]) => (
                            <tr key={lbl} className="flipkart-specs-row">
                              <td className="flipkart-specs-label">{lbl}</td>
                              <td className="flipkart-specs-value">{val}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MusicView({
  currentSong,
  setCurrentSong,
  musicQueue,
  setMusicQueue,
  musicPlaying,
  setMusicPlaying,
  musicVolume,
  musicProgress,
  musicDuration,
  handlePlayPauseMusic,
  handleAudioSeek,
  handleAudioVolumeChange,
  musicError
}) {
  const [songSearchQuery, setSongSearchQuery] = useState('');
  const [searchingSongs, setSearchingSongs] = useState(false);
  const [songSearchResults, setSongSearchResults] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [activeTab, setActiveTab] = useState('arijit');

  const runTabSearch = async (query) => {
    setSearchingSongs(true);
    setSearchError('');
    try {
      const res = await fetch(`https://jiosaavn-api-beta.vercel.app/search/songs?query=${encodeURIComponent(query)}`);
      const json = await res.json();
      if (json.status === 'SUCCESS') {
        setSongSearchResults(json.data.results || json.data);
      } else {
        setSearchError('No songs found.');
      }
    } catch (err) {
      console.error(err);
      setSearchError('Failed to fetch songs.');
    } finally {
      setSearchingSongs(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'arijit') {
      runTabSearch('Arijit Singh');
    } else if (activeTab === 'kannada') {
      runTabSearch('Kannada Hits');
    } else if (activeTab === 'pop') {
      runTabSearch('Global Pop Hits');
    }
  }, [activeTab]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!songSearchQuery.trim()) return;
    runTabSearch(songSearchQuery);
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="music-player-view" style={{ padding: '1rem', color: '#fff' }}>
      <div className="section-heading" style={{ marginBottom: '1.5rem' }}>
        <p>NewsSphere Entertainment</p>
        <h2>🎵 Unlimited Music Stream</h2>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <button 
          onClick={() => setActiveTab('arijit')}
          style={{
            background: activeTab === 'arijit' ? 'var(--accent-green)' : 'var(--bg-secondary)',
            color: activeTab === 'arijit' ? '#080c10' : '#fff',
            border: 'none',
            borderRadius: '20px',
            padding: '0.4rem 1.2rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Hindi Hits (Arijit)
        </button>
        <button 
          onClick={() => setActiveTab('kannada')}
          style={{
            background: activeTab === 'kannada' ? 'var(--accent-green)' : 'var(--bg-secondary)',
            color: activeTab === 'kannada' ? '#080c10' : '#fff',
            border: 'none',
            borderRadius: '20px',
            padding: '0.4rem 1.2rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Kannada Beats
        </button>
        <button 
          onClick={() => setActiveTab('pop')}
          style={{
            background: activeTab === 'pop' ? 'var(--accent-green)' : 'var(--bg-secondary)',
            color: activeTab === 'pop' ? '#080c10' : '#fff',
            border: 'none',
            borderRadius: '20px',
            padding: '0.4rem 1.2rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Global Pop
        </button>
      </div>

      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input 
          type="text"
          placeholder="Search songs in Kannada, Hindi, English..."
          value={songSearchQuery}
          onChange={(e) => setSongSearchQuery(e.target.value)}
          style={{
            flex: 1,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            color: '#fff',
            fontSize: '0.9rem'
          }}
        />
        <button 
          type="submit"
          disabled={searchingSongs}
          style={{
            background: 'var(--accent-green)',
            color: '#080c10',
            border: 'none',
            borderRadius: '8px',
            padding: '0 1.5rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          {searchingSongs ? 'Searching...' : 'Search'}
        </button>
      </form>

      {searchError && (
        <div style={{ color: '#ff3b30', fontSize: '0.85rem', marginBottom: '1rem' }}>
          ⚠️ {searchError}
        </div>
      )}

      {musicError && (
        <div style={{ background: 'rgba(255,59,48,0.1)', border: '1px solid #ff3b30', borderRadius: '8px', padding: '0.75rem', color: '#ff3b30', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'left' }}>
          ⚠️ {musicError}
        </div>
      )}

      <div className="music-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem' }}>
        <div className="songs-results-panel" style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.25rem',
          maxHeight: '600px',
          overflowY: 'auto'
        }}>
          <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', textAlign: 'left' }}>
            Tracks
          </h3>

          {searchingSongs ? (
            <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
              ⚡ Fetching tracks from JioSaavn...
            </div>
          ) : songSearchResults.length === 0 ? (
            <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No tracks loaded. Search for a song to begin!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {songSearchResults.map((song) => {
                const isCurrent = currentSong && currentSong.id === song.id;
                const albumImg = song.image?.[1]?.link || song.image?.[1]?.url || song.image?.[0]?.link || 'https://via.placeholder.com/150';
                
                return (
                  <div 
                    key={song.id} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.8rem',
                      borderRadius: '8px',
                      background: isCurrent ? 'rgba(0,255,136,0.08)' : 'var(--bg-tertiary)',
                      border: isCurrent ? '1px solid var(--accent-green)' : '1px solid transparent',
                      cursor: 'pointer'
                    }}
                    onClick={async () => {
                      setSearchingSongs(true);
                      try {
                        const res = await fetch(`https://jiosaavn-api-beta.vercel.app/songs?id=${song.id}`);
                        const json = await res.json();
                        if (json.status === 'SUCCESS' && json.data) {
                          const freshSong = json.data[0] || json.data.results?.[0] || json.data;
                          setCurrentSong(freshSong);
                        } else {
                          setCurrentSong(song);
                        }
                      } catch (e) {
                        console.warn(e);
                        setCurrentSong(song);
                      } finally {
                        setSearchingSongs(false);
                        setMusicQueue(songSearchResults);
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                      <img 
                        src={albumImg} 
                        alt={song.name}
                        style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                      />
                      <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                        <strong style={{ fontSize: '0.85rem', color: isCurrent ? 'var(--accent-green)' : '#fff', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {song.name}
                        </strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {song.primaryArtists || song.artists}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                        {formatTime(song.duration)}
                      </span>
                      <button 
                        style={{
                          background: 'none',
                          border: 'none',
                          color: isCurrent ? 'var(--accent-green)' : '#fff',
                          cursor: 'pointer',
                          fontSize: '1rem'
                        }}
                      >
                        {isCurrent && musicPlaying ? '⏸️' : '▶️'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="now-playing-deck-panel">
          {currentSong ? (
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1.5rem',
              textAlign: 'center',
              position: 'sticky',
              top: '1rem'
            }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-green)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Now Playing
              </span>
              
              <img 
                src={currentSong.image?.[2]?.link || currentSong.image?.[2]?.url || currentSong.image?.[1]?.link || 'https://via.placeholder.com/500'} 
                alt={currentSong.name}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: '12px',
                  margin: '1.25rem 0',
                  objectFit: 'cover',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
                }}
              />

              <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: '0 0 0.25rem 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentSong.name}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentSong.primaryArtists || currentSong.artists}
              </p>

              <div style={{ margin: '1rem 0' }}>
                <input 
                  type="range"
                  min="0"
                  max={musicDuration || 100}
                  value={musicProgress}
                  onChange={(e) => handleAudioSeek(parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    accentColor: 'var(--accent-green)',
                    cursor: 'pointer',
                    height: '4px',
                    borderRadius: '2px'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  <span>{formatTime(musicProgress)}</span>
                  <span>{formatTime(musicDuration)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', margin: '1.5rem 0' }}>
                <button 
                  onClick={async () => {
                    const idx = musicQueue.findIndex(s => s.id === currentSong.id);
                    if (idx > 0) {
                      const prevSong = musicQueue[idx - 1];
                      try {
                        const res = await fetch(`https://jiosaavn-api-beta.vercel.app/songs?id=${prevSong.id}`);
                        const json = await res.json();
                        if (json.status === 'SUCCESS' && json.data) {
                          setCurrentSong(json.data[0] || json.data.results?.[0] || json.data);
                        } else {
                          setCurrentSong(prevSong);
                        }
                      } catch (e) {
                        setCurrentSong(prevSong);
                      }
                    }
                  }}
                  style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.3rem', cursor: 'pointer' }}
                  title="Previous"
                >
                  ⏮️
                </button>
                <button 
                  onClick={handlePlayPauseMusic}
                  style={{
                    background: 'var(--accent-green)',
                    color: '#080c10',
                    border: 'none',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 12px var(--accent-green)'
                  }}
                >
                  {musicPlaying ? '⏸️' : '▶️'}
                </button>
                <button 
                  onClick={async () => {
                    const idx = musicQueue.findIndex(s => s.id === currentSong.id);
                    if (idx > -1 && idx < musicQueue.length - 1) {
                      const nextSong = musicQueue[idx + 1];
                      try {
                        const res = await fetch(`https://jiosaavn-api-beta.vercel.app/songs?id=${nextSong.id}`);
                        const json = await res.json();
                        if (json.status === 'SUCCESS' && json.data) {
                          setCurrentSong(json.data[0] || json.data.results?.[0] || json.data);
                        } else {
                          setCurrentSong(nextSong);
                        }
                      } catch (e) {
                        setCurrentSong(nextSong);
                      }
                    }
                  }}
                  style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.3rem', cursor: 'pointer' }}
                  title="Next"
                >
                  ⏭️
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.8rem' }}>🔈</span>
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={musicVolume}
                  onChange={(e) => handleAudioVolumeChange(parseFloat(e.target.value))}
                  style={{ width: '100px', accentColor: 'var(--accent-green)', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.8rem' }}>🔊</span>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '3rem 1.5rem',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem'
            }}>
              🎵 Choose a song from the results list to start playing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user, logout, savedArticles, saveArticle, unsaveArticle } = useAuth();
  const { theme, toggleTheme, accent, setAccent } = useTheme();
  const navigate = useNavigate();

  // Navigation and search states
  const [activeView, setActiveView] = useState('home'); // home, profile, bookmarks, notifications, chatbot, political-live, stock-market, education, sports, tech, ent, biz, health, intl, article
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [voiceListening, setVoiceListening] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [themePanelOpen, setThemePanelOpen] = useState(false);

  // Music Player States
  const [currentSong, setCurrentSong] = useState(null);
  const [musicQueue, setMusicQueue] = useState([]);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.8);
  const [musicProgress, setMusicProgress] = useState(0);
  const [musicDuration, setMusicDuration] = useState(0);
  const audioRef = useRef(null);

  const [musicError, setMusicError] = useState('');

  useEffect(() => {
    if (audioRef.current && currentSong) {
      setMusicError('');
      
      const tryPlay = (index) => {
        if (!currentSong.downloadUrl || index < 0) {
          const dlLink = currentSong.url;
          if (dlLink) {
            audioRef.current.pause();
            audioRef.current.src = dlLink;
            audioRef.current.load();
            audioRef.current.play()
              .then(() => {
                setMusicPlaying(true);
              })
              .catch(e => {
                console.error("Direct link play failed:", e);
                setMusicError("Audio stream blocked. Try selecting another song or disable Brave shields / ad-blocker.");
                setMusicPlaying(false);
              });
          }
          return;
        }

        const linkObj = currentSong.downloadUrl[index];
        const dlLink = linkObj?.link || linkObj?.url;
        
        if (dlLink) {
          audioRef.current.pause();
          audioRef.current.src = dlLink;
          audioRef.current.load();
          audioRef.current.volume = musicVolume;
          
          audioRef.current.play()
            .then(() => {
              setMusicPlaying(true);
              setMusicError('');
            })
            .catch(err => {
              console.warn(`Quality index ${index} failed, trying lower quality...`, err);
              tryPlay(index - 1);
            });
        }
      };

      const startIndex = currentSong.downloadUrl ? currentSong.downloadUrl.length - 1 : -1;
      tryPlay(startIndex);
    }
  }, [currentSong]);

  const handlePlayPauseMusic = () => {
    if (!audioRef.current || !currentSong) return;
    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setMusicPlaying(true);
          setMusicError('');
        })
        .catch(e => {
          console.error(e);
          setMusicError("Playback blocked. Interact with the document first or check your network.");
        });
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setMusicProgress(audioRef.current.currentTime);
    }
  };

  const handleAudioLoadedMetadata = () => {
    if (audioRef.current) {
      setMusicDuration(audioRef.current.duration);
    }
  };

  const handleAudioSeek = (newTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setMusicProgress(newTime);
    }
  };

  const handleAudioVolumeChange = (vol) => {
    setMusicVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const handleAudioEnded = async () => {
    if (musicQueue.length > 0) {
      const currentIndex = musicQueue.findIndex(s => s.id === currentSong.id);
      if (currentIndex > -1 && currentIndex < musicQueue.length - 1) {
        const nextSong = musicQueue[currentIndex + 1];
        setMusicError('');
        try {
          const res = await fetch(`https://jiosaavn-api-beta.vercel.app/songs?id=${nextSong.id}`);
          const json = await res.json();
          if (json.status === 'SUCCESS' && json.data) {
            setCurrentSong(json.data[0] || json.data.results?.[0] || json.data);
          } else {
            setCurrentSong(nextSong);
          }
        } catch (e) {
          setCurrentSong(nextSong);
        }
      } else {
        setMusicPlaying(false);
      }
    } else {
      setMusicPlaying(false);
    }
  };

  // Article state
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Breaking News Alert', body: 'Quantum Computing reaches crucial 100-qubit fidelity milestone.', category: 'Technology', time: '15 mins ago', read: false },
    { id: 2, title: 'Stock Alert', body: 'Indices hit record highs as banking and tech sectors rally.', category: 'Stock Market', time: '30 mins ago', read: false },
    { id: 3, title: 'Education Update', body: 'Board Exam results declared online with a 94.6% overall pass rate.', category: 'Education', time: '3 hours ago', read: true },
    { id: 4, title: 'Sports Alert', body: 'United seals the Football Cup championship with a 93rd-minute goal.', category: 'Sports', time: '12 mins ago', read: true }
  ]);

  // Preferred Settings state
  const [preferredLanguage, setPreferredLanguage] = useState('English'); // English, Kannada, Hindi, Tamil
  const [followedCategories, setFollowedCategories] = useState(user ? [user.category] : []);
  const [offlineMode, setOfflineMode] = useState(false);

  // AI Chatbot state
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: "Hello! I am your AI News Assistant. How can I help you explore today's headlines?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [aiQueriesCount, setAiQueriesCount] = useState(0);

  // Live widgets simulation data (WebSockets mock)
  const [liveStockTicker, setLiveStockTicker] = useState([
    { symbol: 'SENSEX', price: '76,450.20', change: '+1.12%', up: true },
    { symbol: 'NIFTY 50', price: '23,280.40', change: '+0.98%', up: true },
    { symbol: 'RELIANCE', price: '2,920.00', change: '-0.30%', up: false },
    { symbol: 'TCS', price: '3,850.15', change: '+0.45%', up: true }
  ]);
  const [liveSportsScore, setLiveSportsScore] = useState({
    sport: 'Cricket',
    match: 'IND vs AUS (T20)',
    score: 'IND 184/3 (18.2 Ov)',
    status: 'India needs 12 runs in 10 balls'
  });
  const [selectedSportsMatch, setSelectedSportsMatch] = useState(null);
  const [loadedMatches, setLoadedMatches] = useState([]);

  // Tech launches search and specs states
  const [launchSearchQuery, setLaunchSearchQuery] = useState('');
  const [isLaunchSearching, setIsLaunchSearching] = useState(false);
  const [expandedLaunchSpecs, setExpandedLaunchSpecs] = useState({});

  useEffect(() => {
    if (!launchSearchQuery.trim()) {
      setIsLaunchSearching(false);
      return;
    }
    setIsLaunchSearching(true);
    const delayDebounceFn = setTimeout(() => {
      setIsLaunchSearching(false);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [launchSearchQuery]);

  const filteredLaunchProducts = launchProducts.filter((product) => {
    const query = launchSearchQuery.toLowerCase().trim();
    if (!query) return true;
    const nameMatch = product.name.toLowerCase().includes(query);
    const specsMatch = product.specs.some(s => s.toLowerCase().includes(query));
    const detailedSpecsMatch = product.detailedSpecs && Object.entries(product.detailedSpecs).some(([key, val]) => 
      key.toLowerCase().includes(query) || val.toLowerCase().includes(query)
    );
    return nameMatch || specsMatch || detailedSpecsMatch;
  });

  const [syncingNews, setSyncingNews] = useState(false);

  // Groww stock platform states
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [stockSearchResults, setStockSearchResults] = useState([]);
  const [searchingStocks, setSearchingStocks] = useState(false);
  const [selectedStockSymbol, setSelectedStockSymbol] = useState('RELIANCE');
  const [selectedStockDetail, setSelectedStockDetail] = useState(null);
  const [loadingStockDetail, setLoadingStockDetail] = useState(false);
  const [userHoldings, setUserHoldings] = useState([]);
  const [userWatchlist, setUserWatchlist] = useState([]);
  const [tradeQty, setTradeQty] = useState(1);
  const [politicsSubCategory, setPoliticsSubCategory] = useState('all');

  const handleSyncNews = async () => {
    setSyncingNews(true);
    try {
      const res = await fetch(`${API_URL}/articles/sync`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert("Live news feeds synchronized successfully from Google News!");
        fetchArticles();
      }
    } catch (err) {
      console.error("Error syncing news:", err);
    } finally {
      setSyncingNews(false);
    }
  };

  // --- Groww Stock API Helper Functions ---
  const calculatePortfolio = () => {
    let invested = 0;
    let current = 0;
    
    (userHoldings || []).forEach(h => {
      invested += h.qty * h.avgPrice;
      const live = (liveStockTicker || []).find(s => s.symbol === h.symbol);
      const currentPrice = live ? parseFloat(live.price.replace(/,/g, '')) : h.avgPrice;
      current += h.qty * currentPrice;
    });

    const profitLoss = current - invested;
    const plPercent = invested > 0 ? (profitLoss / invested) * 100 : 0;

    return {
      invested: invested.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      current: current.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      pl: (profitLoss >= 0 ? '+' : '') + profitLoss.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      plPercent: (profitLoss >= 0 ? '+' : '') + plPercent.toFixed(2) + '%',
      isUp: profitLoss >= 0
    };
  };

  const drawStockChart = (prices, isUp) => {
    if (!prices || prices.length === 0) return (
      <div className="no-chart-data">No historical price points available.</div>
    );
    const width = 600;
    const height = 240;
    const padding = 20;

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;

    const points = prices.map((price, idx) => {
      const x = padding + (idx / (prices.length - 1)) * (width - padding * 2);
      const y = height - padding - ((price - minPrice) / priceRange) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');

    const strokeColor = isUp ? '#00d09c' : '#ff5353';
    const fillGradId = `chartGrad-${selectedStockSymbol}`;

    const fillPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible', display: 'block' }}>
        <defs>
          <linearGradient id={fillGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {/* Horizontal grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.06)" strokeDasharray="3" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.06)" strokeDasharray="3" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.06)" strokeDasharray="3" />

        {/* Gradient fill */}
        <polygon points={fillPoints} fill={`url(#${fillGradId})`} />

        {/* Chart Line */}
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          points={points}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const fetchHoldings = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/users/holdings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUserHoldings(data.holdings || []);
      }
    } catch (err) {
      console.error('Error fetching holdings:', err);
    }
  };

  const fetchWatchlist = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/users/watchlist-stocks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUserWatchlist(data.watchlistStocks || []);
      }
    } catch (err) {
      console.error('Error fetching watchlist:', err);
    }
  };

  const fetchStockDetail = async (symbol) => {
    setLoadingStockDetail(true);
    try {
      const res = await fetch(`${API_URL}/stocks/details?symbol=${symbol}`);
      const data = await res.json();
      if (data.success) {
        setSelectedStockDetail(data.stock);
      }
    } catch (err) {
      console.error('Error fetching stock details:', err);
    } finally {
      setLoadingStockDetail(false);
    }
  };

  const handleStockSearch = async (val) => {
    setStockSearchQuery(val);
    if (!val.trim()) {
      setStockSearchResults([]);
      return;
    }
    setSearchingStocks(true);
    try {
      const res = await fetch(`${API_URL}/stocks/search?q=${val}`);
      const data = await res.json();
      if (data.success) {
        setStockSearchResults(data.stocks || []);
      }
    } catch (err) {
      console.error('Error searching stocks:', err);
    } finally {
      setSearchingStocks(false);
    }
  };

  const handleBuyStock = async (symbol, name, qty, price) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/users/holdings/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ symbol, name, qty, price })
      });
      const data = await res.json();
      if (data.success) {
        setUserHoldings(data.holdings || []);
        alert(`Successfully bought ${qty} shares of ${symbol}!`);
      } else {
        alert(data.message || 'Transaction failed');
      }
    } catch (err) {
      console.error('Error buying stock:', err);
    }
  };

  const handleSellStock = async (symbol, qty) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/users/holdings/sell`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ symbol, qty })
      });
      const data = await res.json();
      if (data.success) {
        setUserHoldings(data.holdings || []);
        alert(`Successfully sold ${qty} shares of ${symbol}!`);
      } else {
        alert(data.message || 'Transaction failed');
      }
    } catch (err) {
      console.error('Error selling stock:', err);
    }
  };

  const handleToggleWatchlist = async (symbol) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/users/watchlist-stocks/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ symbol })
      });
      const data = await res.json();
      if (data.success) {
        setUserWatchlist(data.watchlistStocks || []);
      }
    } catch (err) {
      console.error('Error toggling watchlist:', err);
    }
  };

  // Sync holdings/watchlist and details
  useEffect(() => {
    if (user) {
      fetchHoldings();
      fetchWatchlist();
    }
  }, [user]);

  useEffect(() => {
    if (user && selectedStockSymbol) {
      fetchStockDetail(selectedStockSymbol);
    }
  }, [user, selectedStockSymbol]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Fetch articles on search query / category change / political subcategory change
  useEffect(() => {
    fetchArticles();
  }, [activeView, searchQuery, searchCategory, politicsSubCategory]);

  const fetchArticles = async () => {
    setLoadingArticles(true);
    try {
      let url = `${API_URL}/articles`;
      const params = [];

      // If activeView is a category, filter by it
      if (activeView.startsWith('category-')) {
        const catName = activeView.substring(9).replace('-', ' ');
        // Map slug back to actual category
        let actualCat = categories.find(c => c.toLowerCase() === catName.toLowerCase());
        if (actualCat) params.push(`category=${encodeURIComponent(actualCat)}`);
        
        // Add subCategory parameter for Politics category
        if (activeView === 'category-political-live') {
          params.push(`subCategory=${politicsSubCategory}`);
        }
      } else if (searchCategory) {
        params.push(`category=${encodeURIComponent(searchCategory)}`);
      }

      if (searchQuery) {
        params.push(`search=${encodeURIComponent(searchQuery)}`);
      }

      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setArticles(data.articles);
      }
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoadingArticles(false);
    }
  };

  // Fetch single article
  const viewArticleDetails = async (id) => {
    setSelectedArticleId(id);
    setActiveView('article');
    try {
      const res = await fetch(`${API_URL}/articles/${id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedArticle(data.article);
      }
    } catch (error) {
      console.error('Error loading article detail:', error);
    }
  };

  // Like Article
  const handleLikeArticle = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/articles/${id}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        if (selectedArticle && selectedArticle._id === id) {
          setSelectedArticle(prev => ({
            ...prev,
            likesCount: data.likesCount,
            likedBy: data.likedBy
          }));
        }
        // Also update the local list
        setArticles(prev => prev.map(art => art._id === id ? { ...art, likesCount: data.likesCount, likedBy: data.likedBy } : art));
      }
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  // Comment Article
  const handleAddComment = async (e, id, commentText) => {
    e.preventDefault();
    if (!commentText || !commentText.trim()) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/articles/${id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: commentText })
      });
      const data = await res.json();
      if (data.success) {
        if (selectedArticle && selectedArticle._id === id) {
          setSelectedArticle(prev => ({
            ...prev,
            comments: data.comments
          }));
        }
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  // Chat request
  const handleChatSubmit = async (e, customMsg = null) => {
    if (e) e.preventDefault();
    const messageToSend = customMsg || chatInput;
    if (!messageToSend.trim() || chatLoading) return;

    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: messageToSend }]);
    setChatLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend })
      });
      const data = await res.json();
      if (data.success) {
        setChatMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
        setAiQueriesCount(prev => prev + 1);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'bot', text: "Error communicating with AI server." }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Speech Synthesizer for Articles
  const [speechStatus, setSpeechStatus] = useState('stopped'); // stopped, speaking, paused
  const [speechRate, setSpeechRate] = useState(1.0);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  const handleSpeechPlay = (text) => {
    if (!synthRef.current) return;
    if (speechStatus === 'paused') {
      synthRef.current.resume();
      setSpeechStatus('speaking');
    } else {
      synthRef.current.cancel();
      const cleanText = text.replace(/[*#`_\-]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = speechRate;
      utterance.onend = () => setSpeechStatus('stopped');
      utterance.onerror = () => setSpeechStatus('stopped');
      utteranceRef.current = utterance;
      setSpeechStatus('speaking');
      synthRef.current.speak(utterance);
    }
  };

  const handleSpeechPause = () => {
    if (synthRef.current && speechStatus === 'speaking') {
      synthRef.current.pause();
      setSpeechStatus('paused');
    }
  };

  const handleSpeechStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setSpeechStatus('stopped');
    }
  };

  useEffect(() => {
    if (speechStatus === 'speaking' && selectedArticle) {
      handleSpeechPlay(selectedArticle.content);
    }
  }, [speechRate]);

  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [selectedArticleId]);

  // Translate in-UI mapping
  const translations = {
    Kannada: {
      "quantum computing": "ಕ್ವಾಂಟಮ್ ಕಂಪ್ಯೂಟಿಂಗ್",
      "election": "ಚುನಾವಣೆ",
      "market": "ಷೇರು ಮಾರುಕಟ್ಟೆ",
      "scholarship": "ವೇತನ ಧನಸಹಾಯ",
      "football": "ಫುಟ್ಬಾಲ್",
      "ind vs aus": "ಭಾರತ ವಿರುದ್ಧ ಆಸ್ಟ್ರೇಲಿಯಾ",
      "sports": "ಕ್ರೀಡೆ",
      "education": "ಶಿಕ್ಷಣ",
      "board exams": "ಬೋರ್ಡ್ ಪರೀಕ್ಷೆ",
      "breaking news alert": "ಬ್ರೇಕಿಂಗ್ ನ್ಯೂಸ್ ಎಚ್ಚರಿಕೆ",
      "government announces new green energy funding plan": "ಸರ್ಕಾರದಿಂದ ಹೊಸ ಹಸಿರು ಇಂಧನ ಧನಸಹಾಯ ಯೋಜನೆ ಘೋಷಣೆ"
    },
    Hindi: {
      "quantum computing": "क्वांटम कंप्यूटिंग",
      "election": "चुनाव",
      "market": "शेयर बाजार",
      "scholarship": "छात्रवृत्ति",
      "football": "फ़ुटबॉल",
      "ind vs aus": "भारत बनाम ऑस्ट्रेलिया",
      "sports": "खेल",
      "education": "शिक्षा",
      "board exams": "बोर्ड परीक्षा",
      "breaking news alert": "ब्रेकिंग न्यूज़ अलर्ट",
      "government announces new green energy funding plan": "सरकार ने नई हरित ऊर्जा योजना की घोषणा की"
    },
    Tamil: {
      "quantum computing": "குவாண்டம் கம்ப்யூட்டிங்",
      "election": "தேர்தல்",
      "market": "பங்குச் சந்தை",
      "scholarship": "கல்வி உதவித்தொகை",
      "football": "கால்பந்து",
      "ind vs aus": "இந்தியா எதிர் ஆஸ்திரேலியா",
      "sports": "விளையாட்டு",
      "education": "கல்வி",
      "board exams": "அரசுத் தேர்வுகள்",
      "breaking news alert": "முக்கிய செய்தி அறிவிப்பு",
      "government announces new green energy funding plan": "அரசு புதிய பசுமை எரிசக்தி நிதி திட்டத்தை அறிவித்துள்ளது"
    }
  };

  const translateText = (text) => {
    if (preferredLanguage === 'English' || !translations[preferredLanguage]) return text;
    const langDict = translations[preferredLanguage];
    let translated = text;
    Object.keys(langDict).forEach(key => {
      const regex = new RegExp(key, 'gi');
      translated = translated.replace(regex, langDict[key]);
    });
    return translated;
  };

  const fetchLiveStocks = async () => {
    try {
      const res = await fetch(`${API_URL}/stocks`);
      const data = await res.json();
      if (data.success && data.stocks && data.stocks.length > 0) {
        setLiveStockTicker(data.stocks);
      }
    } catch (err) {
      console.error('Error fetching live stocks:', err);
    }
  };

  // Fetch real stocks on mount and update every 30 seconds
  useEffect(() => {
    fetchLiveStocks();
    const timer = setInterval(fetchLiveStocks, 30000);
    return () => clearInterval(timer);
  }, []);

  // Mock WebSocket Updates for Sports Scores
  useEffect(() => {
    const timer = setInterval(() => {
      // Live Cricket update
      setLiveSportsScore(prev => {
        const scoreParts = prev.score.match(/(\d+)\/(\d+)\s*\((\d+)\.(\d+)/);
        if (scoreParts) {
          let runs = parseInt(scoreParts[1]);
          let wickets = parseInt(scoreParts[2]);
          let overs = parseInt(scoreParts[3]);
          let balls = parseInt(scoreParts[4]);

          balls += 1;
          if (balls === 6) {
            balls = 0;
            overs += 1;
          }
          if (Math.random() > 0.7) {
            runs += Math.floor(Math.random() * 5); // 0 to 4 runs
          }
          if (Math.random() > 0.95 && wickets < 10) {
            wickets += 1;
          }
          const remainingBalls = (20 * 6) - (overs * 6 + balls);
          const remainingRuns = 196 - runs;

          let status = `India needs ${remainingRuns} runs in ${remainingBalls} balls`;
          if (remainingRuns <= 0) {
            status = 'India won by 7 wickets!';
          } else if (remainingBalls <= 0 || wickets === 10) {
            status = 'Match Tied / Australia won!';
          }

          return {
            ...prev,
            score: `IND ${runs}/${wickets} (${overs}.${balls} Ov)`,
            status
          };
        }
        return prev;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Voice recognition Mock / Actual
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not fully supported in your browser. Mocking voice activation...");
      setVoiceListening(true);
      setTimeout(() => {
        setSearchQuery("quantum computing");
        setVoiceListening(false);
      }, 2000);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setVoiceListening(true);
    };

    recognition.onresult = (event) => {
      const resultText = event.results[0][0].transcript;
      setSearchQuery(resultText);
    };

    recognition.onend = () => {
      setVoiceListening(false);
    };

    recognition.onerror = () => {
      setVoiceListening(false);
    };

    recognition.start();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleCategoryFollow = (cat) => {
    setFollowedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // Render Sidebar Icons helper
  const renderNavIcon = (name) => {
    switch (name) {
      case 'home': return '🏠';
      case 'breaking': return '🔥';
      case 'headlines': return '📰';
      case 'bookmarks': return '⭐';
      case 'notifications': return '🔔';
      case 'chatbot': return '🤖';
      case 'profile': return '👤';
      case 'music': return '🎵';
      case 'settings': return '⚙️';
      case 'logout': return '🚪';
      case 'Political Live': return '🏛️';
      case 'Stock Market': return '📈';
      case 'Education': return '🎓';
      case 'Sports': return '⚽';
      case 'Technology': return '💻';
      case 'Entertainment': return '🎬';
      case 'Business': return '💼';
      case 'Health': return '🏥';
      case 'International News': return '🌍';
      default: return '📄';
    }
  };

  return (
    <div className={`dashboard-wrapper ${sidebarCollapsed ? 'sidebar-minimized' : ''}`}>
      {/* 1. TOP NAVIGATION BAR */}
      <header className="dashboard-topbar">
        <div className="topbar-left">
          <button 
            className="hamburger-menu" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title="Toggle Sidebar"
          >
            ☰
          </button>
          <div className="brand" onClick={() => setActiveView('home')} style={{ cursor: 'pointer' }}>
            <span className="brand-mark">N</span>
            <span className="brand-text">NewsSphere</span>
          </div>
        </div>

        <div className="topbar-search">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search news, topics, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select 
              className="search-cat-select"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button 
              className={`mic-button ${voiceListening ? 'listening' : ''}`} 
              onClick={handleVoiceSearch}
              title="Voice Search"
            >
              🎤
            </button>
          </div>
        </div>

        <div className="topbar-right">
          <button 
            className="topbar-icon-btn" 
            onClick={() => setActiveView('notifications')}
            title="Notifications"
          >
            🔔
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="badge-dot" />
            )}
          </button>

          <button 
            className="topbar-icon-btn" 
            onClick={() => setActiveView('bookmarks')}
            title="Bookmarks"
          >
            ⭐
            {savedArticles.length > 0 && (
              <span className="badge-count">{savedArticles.length}</span>
            )}
          </button>

          <button 
            className="topbar-icon-btn" 
            onClick={() => setActiveView('chatbot')}
            title="AI Chatbot"
          >
            🤖
          </button>

          <button 
            className={`topbar-icon-btn ${syncingNews ? 'spinning' : ''}`} 
            onClick={handleSyncNews}
            title="Sync Live News"
            disabled={syncingNews}
          >
            🔄
          </button>

          {/* Theme & Accent Customize Panel */}
          <div className="theme-customizer-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button 
              className="topbar-icon-btn"
              onClick={() => setThemePanelOpen(!themePanelOpen)}
              title="Customize Theme & Accent Colors"
              style={{ fontSize: '1.2rem' }}
            >
              🎨
            </button>
            {themePanelOpen && (
              <div className="profile-dropdown-menu" style={{ 
                position: 'absolute', 
                top: '100%', 
                right: 0, 
                width: '200px', 
                padding: '1rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
                  🌓 Theme Mode
                </div>
                <button 
                  onClick={() => { toggleTheme(); }}
                  style={{
                    width: '100%',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    padding: '0.4rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  {theme === 'dark' ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
                </button>

                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem', marginTop: '0.25rem' }}>
                  🎨 Accent Colors
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', padding: '0.25rem 0' }}>
                  <button 
                    onClick={() => setAccent('green')}
                    style={{
                      background: '#00ff88',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: accent === 'green' ? '2px solid #fff' : 'none',
                      cursor: 'pointer',
                      boxShadow: accent === 'green' ? '0 0 8px #00ff88' : 'none'
                    }}
                    title="Matrix Green (Default)"
                  />
                  <button 
                    onClick={() => setAccent('blue')}
                    style={{
                      background: '#0088ff',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: accent === 'blue' ? '2px solid #fff' : 'none',
                      cursor: 'pointer',
                      boxShadow: accent === 'blue' ? '0 0 8px #0088ff' : 'none'
                    }}
                    title="Royal Blue"
                  />
                  <button 
                    onClick={() => setAccent('purple')}
                    style={{
                      background: '#d300ff',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: accent === 'purple' ? '2px solid #fff' : 'none',
                      cursor: 'pointer',
                      boxShadow: accent === 'purple' ? '0 0 8px #d300ff' : 'none'
                    }}
                    title="Cyberpunk Neon Purple"
                  />
                  <button 
                    onClick={() => setAccent('red')}
                    style={{
                      background: '#ff3b30',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: accent === 'red' ? '2px solid #fff' : 'none',
                      cursor: 'pointer',
                      boxShadow: accent === 'red' ? '0 0 8px #ff3b30' : 'none'
                    }}
                    title="Crimson Sunset Red"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="user-menu-wrapper">
            <button 
              className="user-profile-btn" 
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
              <span className="user-display-name">{user.name}</span>
              <span className="dropdown-caret">▼</span>
            </button>

            {profileDropdownOpen && (
              <div className="profile-dropdown-menu">
                <button onClick={() => { setActiveView('profile'); setProfileDropdownOpen(false); }}>👤 Profile Details</button>
                <button onClick={() => { setActiveView('bookmarks'); setProfileDropdownOpen(false); }}>⭐ Bookmarked Stories</button>
                <button onClick={toggleTheme}>🌓 Toggle Theme</button>
                <div className="divider" />
                <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. LEFT SIDEBAR NAVIGATION */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-profile-snippet">
          <div className="avatar-large">{user.name.charAt(0).toUpperCase()}</div>
          <div className="snippet-info">
            <h4>{user.name}</h4>
            <p>{user.email}</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-title">Feed</div>
          <button className={activeView === 'home' ? 'nav-item active' : 'nav-item'} onClick={() => { setActiveView('home'); setSelectedArticleId(null); }}>
            <span className="nav-icon">{renderNavIcon('home')}</span>
            <span className="nav-label">Home Feed</span>
          </button>
          <button className={activeView === 'breaking' ? 'nav-item active' : 'nav-item'} onClick={() => { setActiveView('breaking'); setSelectedArticleId(null); }}>
            <span className="nav-icon">{renderNavIcon('breaking')}</span>
            <span className="nav-label">Breaking News</span>
          </button>

          <div className="nav-section-title">Categories</div>
          {categories.map((cat) => {
            const slug = cat.toLowerCase().replace(/\s+/g, '-');
            const isActive = activeView === `category-${slug}`;
            return (
              <button 
                key={cat} 
                className={isActive ? 'nav-item active' : 'nav-item'} 
                onClick={() => { setActiveView(`category-${slug}`); setSelectedArticleId(null); }}
              >
                <span className="nav-icon">{renderNavIcon(cat)}</span>
                <span className="nav-label">{cat}</span>
              </button>
            );
          })}

          <div className="nav-section-title">Personal</div>
          <button className={activeView === 'bookmarks' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveView('bookmarks')}>
            <span className="nav-icon">{renderNavIcon('bookmarks')}</span>
            <span className="nav-label">Bookmarks</span>
          </button>
          <button className={activeView === 'notifications' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveView('notifications')}>
            <span className="nav-icon">{renderNavIcon('notifications')}</span>
            <span className="nav-label">Notifications</span>
          </button>
          <button className={activeView === 'chatbot' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveView('chatbot')}>
            <span className="nav-icon">{renderNavIcon('chatbot')}</span>
            <span className="nav-label">AI Chatbot</span>
          </button>
          <button className={activeView === 'music' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveView('music')}>
            <span className="nav-icon">{renderNavIcon('music')}</span>
            <span className="nav-label">Music Player</span>
          </button>
          <button className={activeView === 'profile' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveView('profile')}>
            <span className="nav-icon">{renderNavIcon('profile')}</span>
            <span className="nav-label">Profile & Settings</span>
          </button>
          <button className="nav-item logout-nav-item" onClick={handleLogout}>
            <span className="nav-icon">{renderNavIcon('logout')}</span>
            <span className="nav-label">Logout</span>
          </button>
        </nav>
      </aside>

      {/* CORE CONTENT PANE */}
      <main className="dashboard-content">
        {/* Sports Scoreboard Bar */}
        {(activeView === 'home' || activeView === 'category-sports') && (
          <SportsScoreboardBar onCardClick={setSelectedSportsMatch} onMatchesUpdate={setLoadedMatches} />
        )}

        {/* 3. HOME DASHBOARD */}
        {activeView === 'home' && (
          <div className="home-dashboard-view">
            {/* Breaking News Ticker */}
            <div className="breaking-banner">
              <span className="live-badge">🔴 LIVE BREAKING</span>
              <div className="ticker-wrapper">
                <div className="ticker-content">
                  🔥 {translateText("Quantum Computing reaches crucial 100-qubit fidelity milestone.")} &nbsp;&nbsp;&nbsp;&nbsp;
                  📈 {translateText("Indices scale historic highs as banking and technology shares rally.")} &nbsp;&nbsp;&nbsp;&nbsp;
                  🎓 {translateText("Board Exam results declared online with a 94.6% overall pass rate.")}
                </div>
              </div>
            </div>

            <div className="home-grid">
              <div className="home-left-col">
                <div className="section-heading">
                  <p>Daily Digest</p>
                  <h2>Top Headlines</h2>
                </div>

                {loadingArticles ? (
                  <div className="skeletons-wrapper">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="skeleton-card">
                        <div className="skeleton-image loading-shimmer" />
                        <div className="skeleton-title loading-shimmer" />
                        <div className="skeleton-text loading-shimmer" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="articles-feed">
                    {articles.map((art) => {
                      const isSaved = savedArticles.some(saved => saved.title === art.title);
                      return (
                        <div key={art._id} className="news-card">
                          <img 
                            src={art.imageUrl} 
                            alt={art.title} 
                            onClick={() => viewArticleDetails(art._id)}
                            style={{ cursor: 'pointer' }}
                          />
                          <div className="news-card-content">
                            <span className="tag-category">{art.category}</span>
                            <h3 onClick={() => viewArticleDetails(art._id)} style={{ cursor: 'pointer' }}>
                              {translateText(art.title)}
                            </h3>
                            <p>{art.content.substring(0, 140)}...</p>
                            <div className="news-card-footer">
                              <span className="meta">{art.source} · {art.time}</span>
                              <div className="card-actions">
                                <button onClick={() => handleLikeArticle(art._id)}>
                                  👍 {art.likesCount || 0}
                                </button>
                                <button 
                                  onClick={() => isSaved ? unsaveArticle(art.title) : saveArticle(art)}
                                  title={isSaved ? "Unsave" : "Save"}
                                >
                                  {isSaved ? '★' : '☆'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="home-right-col">
                {/* Weather forecast widget */}
                <WeatherWidget />

                {/* Live Stock Ticker Widget */}
                <div className="dashboard-widget stock-widget">
                  <h3>📈 Live Stock Market</h3>
                  <div className="stock-list">
                    {liveStockTicker.map((stock) => (
                      <div key={stock.symbol} className="stock-row">
                        <span className="symbol">{stock.symbol}</span>
                        <div className="stock-vals">
                          <span className="price">{stock.price}</span>
                          <span className={`change ${stock.up ? 'up' : 'down'}`}>
                            {stock.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Sports score widget */}
                <div className="dashboard-widget score-widget">
                  <h3>⚽ Live Scores</h3>
                  <div className="scorecard">
                    {(() => {
                      let displayMatch = null;
                      if (loadedMatches && loadedMatches.length > 0) {
                        displayMatch = loadedMatches.find(m => m.statusState === 'in');
                        if (!displayMatch) {
                          displayMatch = loadedMatches.find(m => m.statusState === 'pre');
                        }
                        if (!displayMatch) {
                          displayMatch = loadedMatches[0];
                        }
                      }

                      if (displayMatch) {
                        const comp1 = displayMatch.competitors?.[0];
                        const comp2 = displayMatch.competitors?.[1];
                        const scoreText = comp1 && comp2 ? `${comp1.name} ${comp1.score} vs ${comp2.score} ${comp2.name}` : '';
                        
                        return (
                          <>
                            <span className="badge" style={{ backgroundColor: displayMatch.statusState === 'in' ? '#ff3b30' : 'var(--accent-green)' }}>
                              {displayMatch.sport.toUpperCase()} {displayMatch.statusState === 'in' ? '● LIVE' : ''}
                            </span>
                            <h4>{displayMatch.name}</h4>
                            <p className="score" style={{ fontSize: '1.1rem', margin: '0.5rem 0', fontWeight: 'bold' }}>{scoreText}</p>
                            <p className="status" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              {displayMatch.statusSummary || displayMatch.statusDetail || displayMatch.date}
                            </p>
                          </>
                        );
                      }

                      return (
                        <>
                          <span className="badge" style={{ backgroundColor: '#ff3b30' }}>
                            BADMINTON ● LIVE
                          </span>
                          <h4>Prannoy H.S. vs Kento Momota</h4>
                          <p className="score" style={{ fontSize: '1.1rem', margin: '0.5rem 0', fontWeight: 'bold' }}>21-19, 18-21, 15-11</p>
                          <p className="status" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Game 3 - India leads</p>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Tech launches widget with Flipkart Info */}
                <div className="dashboard-widget launches-widget">
                  <h3>🛍️ Premium Tech Launches</h3>
                  
                  {/* Search Bar with AJAX simulation spinner */}
                  <div className="launch-search-container">
                    <input
                      type="text"
                      className="launch-search-input"
                      placeholder="Search launches (e.g., iPhone 17, 12GB RAM, 512GB)..."
                      value={launchSearchQuery}
                      onChange={(e) => setLaunchSearchQuery(e.target.value)}
                    />
                    {isLaunchSearching ? (
                      <span className="launch-search-spinner"></span>
                    ) : (
                      <span className="launch-search-icon">🔍</span>
                    )}
                  </div>

                  <div className="launches-list">
                    {filteredLaunchProducts.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        No matching product launches found.
                      </div>
                    ) : (
                      filteredLaunchProducts.map((product) => {
                        const isPreorder = product.status === "PRE-ORDER LIVE";
                        const isComingSoon = product.status === "COMING SOON";
                        const isExpanded = !!expandedLaunchSpecs[product.id];
                        
                        let badgeClass = "";
                        if (isPreorder) badgeClass = "pre-order";
                        else if (isComingSoon) badgeClass = "coming-soon";

                        return (
                          <div key={product.id} className="launch-product-card">
                            <div className="launch-card-header">
                              <img className="launch-card-img" src={product.image} alt={product.name} />
                              <span className={`launch-card-status-badge ${badgeClass}`}>{product.status}</span>
                            </div>
                            
                            <div className="launch-card-content">
                              <h4 className="launch-card-title">{product.name}</h4>
                              
                              <div className="launch-rating-row">
                                <span className="flipkart-rating-badge">
                                  {product.rating} ★
                                </span>
                                <span className="flipkart-reviews-count">
                                  ({product.reviewsCount.split(" ")[0]})
                                </span>
                                {product.assured && (
                                  <span className="flipkart-assured-tag">
                                    Assured<span className="flipkart-assured-text">✓</span>
                                  </span>
                                )}
                              </div>
                              
                              <div className="launch-price-row">
                                <span className="flipkart-price">{product.price}</span>
                                <span className="flipkart-original-price">{product.originalPrice}</span>
                                <span className="flipkart-discount">{product.discount}</span>
                              </div>

                              <ul className="launch-specs-list">
                                {product.specs.slice(0, 3).map((spec, idx) => (
                                  <li key={idx} className="launch-spec-item">{spec}</li>
                                ))}
                              </ul>

                              {/* Flipkart Specification Table Toggle */}
                              {product.detailedSpecs && (
                                <>
                                  <button 
                                    className="flipkart-specs-toggle-btn"
                                    onClick={() => {
                                      setExpandedLaunchSpecs(prev => ({
                                        ...prev,
                                        [product.id]: !prev[product.id]
                                      }));
                                    }}
                                  >
                                    {isExpanded ? "▲ Hide Specifications" : "▼ Show Specifications"}
                                  </button>
                                  
                                  {isExpanded && (
                                    <table className="flipkart-specs-table">
                                      <tbody>
                                        {Object.entries(product.detailedSpecs).map(([label, val]) => (
                                          <tr key={label} className="flipkart-specs-row">
                                            <td className="flipkart-specs-label">{label}</td>
                                            <td className="flipkart-specs-value">{val}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  )}
                                </>
                              )}

                              <div className="launch-offers-box">
                                {product.offers.map((offer, idx) => (
                                  <div key={idx} className="launch-offer-item">
                                    <span className="launch-offer-icon">🏷️</span>
                                    <span>{offer}</span>
                                  </div>
                                ))}
                              </div>

                              <button 
                                className={`flipkart-buy-btn ${isPreorder ? 'pre-order' : ''}`}
                                onClick={() => {
                                  alert(`🎉 Order Registered on Flipkart!\nProduct: ${product.name}\nPrice: ${product.price}\n\nThank you for using NewsSphere's smart retail integration!`);
                                }}
                                disabled={isComingSoon}
                                style={{ opacity: isComingSoon ? 0.5 : 1, cursor: isComingSoon ? 'not-allowed' : 'pointer' }}
                              >
                                {isComingSoon ? "Coming Soon" : isPreorder ? "Pre-order on Flipkart" : "Buy on Flipkart"}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Trending News */}
                <div className="dashboard-widget trending-widget">
                  <h3>🔥 Trending News</h3>
                  <div className="trending-list">
                    {articles.slice(0, 4).map((art, idx) => (
                      <div key={art._id} className="trending-row" onClick={() => viewArticleDetails(art._id)}>
                        <span className="rank">0{idx + 1}</span>
                        <div>
                          <h4>{translateText(art.title)}</h4>
                          <span className="meta">{art.source} · {art.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BREAKING NEWS VIEW */}
        {activeView === 'breaking' && (
          <div className="category-view">
            <h2>🔥 Breaking News Alerts</h2>
            <div className="articles-feed">
              {articles.slice(0, 3).map((art) => (
                <div key={art._id} className="news-card wide-card">
                  <img src={art.imageUrl} alt={art.title} onClick={() => viewArticleDetails(art._id)} />
                  <div className="news-card-content">
                    <span className="live-badge">🔴 URGENT</span>
                    <h3 onClick={() => viewArticleDetails(art._id)}>{translateText(art.title)}</h3>
                    <p>{art.content}</p>
                    <span className="meta">{art.source} · {art.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. CATEGORY MODULES */}
        {activeView.startsWith('category-') && (
          <div className="category-view">
            <h2>🏛️ {activeView.substring(9).replace('-', ' ').toUpperCase()}</h2>

            {/* Product Market Search for Technology Category */}
            {activeView === 'category-technology' && (
              <TechProductSearchModule />
            )}

            {/* Movie/Series IMDb Search for Entertainment Category */}
            {activeView === 'category-entertainment' && (
              <EntertainmentMovieSearchModule />
            )}
            
            {/* Render sub-modules specifically */}
            {activeView === 'category-political-live' && (
              <div className="politics-filter-container">
                <div className="politics-tabs">
                  <button className={politicsSubCategory === 'all' ? 'politics-tab active' : 'politics-tab'} onClick={() => setPoliticsSubCategory('all')}>🌍 All Politics</button>
                  <button className={politicsSubCategory === 'international' ? 'politics-tab active' : 'politics-tab'} onClick={() => setPoliticsSubCategory('international')}>🌐 International</button>
                  <button className={politicsSubCategory === 'india' ? 'politics-tab active' : 'politics-tab'} onClick={() => setPoliticsSubCategory('india')}>🇮🇳 India</button>
                  <button className={politicsSubCategory === 'state' ? 'politics-tab active' : 'politics-tab'} onClick={() => setPoliticsSubCategory('state')}>🏛️ State & Local</button>
                </div>

                <div className="live-timeline-widget">
                  <h3>🏛️ Live Coverage & Regional Announcements ({politicsSubCategory === 'all' ? 'All regions' : politicsSubCategory.toUpperCase()})</h3>
                  <div className="timeline">
                    {(politicsSubCategory === 'all' || politicsSubCategory === 'india') && (
                      <div className="timeline-item">
                        <div className="time">15 mins ago</div>
                        <div className="event">
                          <strong>Election Commission</strong> declared cities-wide registration drives starting this Monday.
                        </div>
                      </div>
                    )}
                    {(politicsSubCategory === 'all' || politicsSubCategory === 'state') && (
                      <div className="timeline-item">
                        <div className="time">1 hour ago</div>
                        <div className="event">
                          <strong>Ministry of Environment</strong> signed new clean water and green energy policies.
                        </div>
                      </div>
                    )}
                    {politicsSubCategory === 'international' && (
                      <div className="timeline-item">
                        <div className="time">Live Update</div>
                        <div className="event">
                          <strong>Foreign Ministry</strong> signed global bilateral treaties supporting green trade corridors.
                        </div>
                      </div>
                    )}
                    {politicsSubCategory === 'india' && (
                      <div className="timeline-item">
                        <div className="time">2 hours ago</div>
                        <div className="event">
                          <strong>Union Cabinet</strong> proposes new seed grants for state engineering portals and infrastructure.
                        </div>
                      </div>
                    )}
                    {politicsSubCategory === 'state' && (
                      <div className="timeline-item">
                        <div className="time">3 hours ago</div>
                        <div className="event">
                          <strong>Tamil Nadu Assembly</strong> resolves legislative stalemate, launching housing project portals.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeView === 'category-stock-market' && (
              <div className="groww-stock-container">
                {/* 1. TOP INDICES BAR */}
                <div className="groww-indices-bar">
                  {liveStockTicker.slice(0, 2).map((idxCard) => (
                    <div key={idxCard.symbol} className="groww-index-card" onClick={() => setSelectedStockSymbol(idxCard.symbol === 'SENSEX' ? '^BSESN' : '^NSEI')}>
                      <div className="idx-info">
                        <h4>{idxCard.symbol}</h4>
                        <span className={`idx-change ${idxCard.up ? 'up' : 'down'}`}>{idxCard.change}</span>
                      </div>
                      <p className="idx-price">{idxCard.price}</p>
                    </div>
                  ))}
                </div>

                {/* 2. SEARCH BAR */}
                <div className="groww-search-wrapper">
                  <div className="groww-search-box">
                    <span className="search-icon">🔍</span>
                    <input 
                      type="text" 
                      placeholder="Search Stocks (e.g. Tata, Reliance, HDFC, TCS...)" 
                      value={stockSearchQuery}
                      onChange={(e) => handleStockSearch(e.target.value)}
                    />
                    {searchingStocks && <span className="search-spinner">⚡</span>}
                  </div>
                  
                  {/* Suggestions Dropdown */}
                  {stockSearchResults.length > 0 && (
                    <div className="groww-suggestions-list">
                      {stockSearchResults.map((stock) => (
                        <div 
                          key={stock.symbol} 
                          className="suggestion-item"
                          onClick={() => {
                            setSelectedStockSymbol(stock.symbol);
                            setStockSearchQuery('');
                            setStockSearchResults([]);
                          }}
                        >
                          <div className="suggest-info">
                            <strong>{stock.symbol}</strong>
                            <span>{stock.name}</span>
                          </div>
                          <div className="suggest-price">
                            <span>₹{stock.price}</span>
                            <span className={stock.up ? 'up' : 'down'}>{stock.change}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. DUAL COLUMN LAYOUT */}
                <div className="groww-grid">
                  
                  {/* LEFT COLUMN: STOCK OVERVIEW & DETAILS */}
                  <div className="groww-main-col">
                    {loadingStockDetail ? (
                      <div className="groww-loader-card">
                        <div className="shimmer-text loading-shimmer" style={{ width: '40%', height: '24px', marginBottom: '10px' }} />
                        <div className="shimmer-text loading-shimmer" style={{ width: '60%', height: '40px', marginBottom: '20px' }} />
                        <div className="shimmer-chart loading-shimmer" style={{ height: '220px' }} />
                      </div>
                    ) : selectedStockDetail ? (
                      <div className="groww-stock-card">
                        <div className="stock-card-header">
                          <div>
                            <h2>{selectedStockDetail.name} ({selectedStockDetail.symbol})</h2>
                            <div className="price-row">
                              <span className="stock-price">₹{selectedStockDetail.price}</span>
                              <span className={`stock-change-badge ${selectedStockDetail.up ? 'up' : 'down'}`}>
                                {selectedStockDetail.change}
                              </span>
                            </div>
                          </div>
                          <button 
                            className={`groww-watchlist-btn ${userWatchlist.some(w => w.symbol === selectedStockDetail.symbol) ? 'active' : ''}`}
                            onClick={() => handleToggleWatchlist(selectedStockDetail.symbol)}
                            title="Toggle Watchlist"
                          >
                            {userWatchlist.some(w => w.symbol === selectedStockDetail.symbol) ? '★ Watchlisted' : '☆ Add to Watchlist'}
                          </button>
                        </div>

                        {/* Interactive SVG Sparkline Chart */}
                        <div className="stock-chart-container">
                          {drawStockChart(selectedStockDetail.prices, selectedStockDetail.up)}
                        </div>

                        {/* Stock Key Statistics */}
                        <div className="stock-stats-section">
                          <h3>Performance & Fundamentals</h3>
                          <div className="stats-grid">
                            <div className="stat-box">
                              <span className="label">Open</span>
                              <span className="value">₹{selectedStockDetail.stats?.open?.toFixed(2)}</span>
                            </div>
                            <div className="stat-box">
                              <span className="label">Prev. Close</span>
                              <span className="value">₹{selectedStockDetail.stats?.prevClose?.toFixed(2)}</span>
                            </div>
                            <div className="stat-box">
                              <span className="label">Day High</span>
                              <span className="value" style={{ color: '#00d09c' }}>₹{selectedStockDetail.stats?.high?.toFixed(2)}</span>
                            </div>
                            <div className="stat-box">
                              <span className="label">Day Low</span>
                              <span className="value" style={{ color: '#ff5353' }}>₹{selectedStockDetail.stats?.low?.toFixed(2)}</span>
                            </div>
                            <div className="stat-box">
                              <span className="label">Volume</span>
                              <span className="value">{(selectedStockDetail.stats?.volume || 0).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="groww-empty-state">
                        <p>Search or select a stock to view detailed metrics, live interactive charts, and execute mock trades.</p>
                      </div>
                    )}

                    {/* WATCHLIST & POPULAR STOCKS LIST */}
                    <div className="groww-quick-list-section">
                      <h3>My Watchlist</h3>
                      {userWatchlist.length === 0 ? (
                        <p className="groww-watchlist-empty">Your watchlist is currently empty. Star a stock above to add it here!</p>
                      ) : (
                        <div className="groww-watchlist-grid">
                          {userWatchlist.map((wStock) => (
                            <div key={wStock.symbol} className="groww-watchlist-card" onClick={() => setSelectedStockSymbol(wStock.symbol)}>
                              <strong>{wStock.symbol}</strong>
                              <div className="watch-price">
                                <span>₹{wStock.price}</span>
                                <span className={wStock.up ? 'up' : 'down'}>{wStock.change}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: PORTFOLIO & BUY/SELL OPERATIONS */}
                  <div className="groww-side-col">
                    
                    {/* PORTFOLIO CARD */}
                    <div className="groww-portfolio-card">
                      <h3>💼 Virtual Portfolio Holdings</h3>
                      
                      <div className="portfolio-summary-row">
                        <div className="summary-item">
                          <span className="label">Invested Value</span>
                          <strong className="val">₹{calculatePortfolio().invested}</strong>
                        </div>
                        <div className="summary-item">
                          <span className="label">Current Value</span>
                          <strong className="val">₹{calculatePortfolio().current}</strong>
                        </div>
                      </div>

                      <div className={`portfolio-pnl-banner ${calculatePortfolio().isUp ? 'up' : 'down'}`}>
                        <span>Total Returns</span>
                        <strong>{calculatePortfolio().pl} ({calculatePortfolio().plPercent})</strong>
                      </div>

                      {userHoldings.length === 0 ? (
                        <p className="empty-holdings-text">You don't own any stocks yet. Place a virtual buy order below to build your portfolio!</p>
                      ) : (
                        <div className="holdings-mini-list">
                          {userHoldings.map((h) => {
                            const live = liveStockTicker.find(s => s.symbol === h.symbol);
                            const currentPrice = live ? parseFloat(live.price.replace(/,/g, '')) : h.avgPrice;
                            const totalReturn = (currentPrice - h.avgPrice) * h.qty;
                            const isUp = totalReturn >= 0;
                            return (
                              <div key={h.symbol} className="holding-row-item" onClick={() => setSelectedStockSymbol(h.symbol)}>
                                <div>
                                  <strong>{h.symbol}</strong>
                                  <span className="holding-qty">{h.qty} shares · Avg. ₹{h.avgPrice}</span>
                                </div>
                                <div className="holding-val-col">
                                  <strong>₹{(h.qty * currentPrice).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong>
                                  <span className={isUp ? 'up' : 'down'}>
                                    {isUp ? '+' : ''}{totalReturn.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* VIRTUAL TRANSACTION BOX */}
                    {selectedStockDetail && (
                      <div className="groww-trade-box">
                        <h3>⚡ Place Virtual Order</h3>
                        <div className="trade-tabs">
                          <button 
                            className="trade-tab buy-btn active"
                          >
                            BUY {selectedStockDetail.symbol}
                          </button>
                        </div>

                        <div className="trade-inputs">
                          <label>
                            Shares Quantity
                            <input 
                              type="number" 
                              min="1" 
                              value={tradeQty} 
                              onChange={(e) => setTradeQty(Math.max(1, parseInt(e.target.value) || 1))}
                            />
                          </label>
                          <div className="trade-meta-row">
                            <span>Market Price</span>
                            <strong>₹{selectedStockDetail.price}</strong>
                          </div>
                          <div className="trade-meta-row total-row">
                            <span>Estimated Charge</span>
                            <strong>₹{(tradeQty * parseFloat(selectedStockDetail.price.replace(/,/g, ''))).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                          </div>
                        </div>

                        <div className="trade-actions-buttons">
                          <button 
                            className="action-buy-btn"
                            onClick={() => handleBuyStock(
                              selectedStockDetail.symbol, 
                              selectedStockDetail.name, 
                              tradeQty, 
                              parseFloat(selectedStockDetail.price.replace(/,/g, ''))
                            )}
                          >
                            Execute Buy Order
                          </button>
                          
                          {userHoldings.some(h => h.symbol === selectedStockDetail.symbol) && (
                            <button 
                              className="action-sell-btn"
                              onClick={() => handleSellStock(selectedStockDetail.symbol, tradeQty)}
                            >
                              Execute Sell Order
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeView === 'category-education' && (
              <div className="edu-announcements">
                <div className="edu-grid">
                  <div className="edu-card">
                    <span className="badge">Placement</span>
                    <h4>Tech placement records show a 20% salary increase this year.</h4>
                    <p>Admissions portal lists average packaging at 8.4 LPA.</p>
                  </div>
                  <div className="edu-card">
                    <span className="badge">Scholarship</span>
                    <h4>National Scholarship program extends registration dates to July 15.</h4>
                    <p>Open for all undergraduate engineering candidates with 80%+ marks.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="articles-feed">
              {articles.length === 0 ? (
                <p className="empty-state">No articles found in this category.</p>
              ) : (
                articles.map((art) => (
                  <div key={art._id} className="news-card">
                    <img src={art.imageUrl} alt={art.title} onClick={() => viewArticleDetails(art._id)} />
                    <div className="news-card-content">
                      <span className="tag-category">{art.tag}</span>
                      <h3 onClick={() => viewArticleDetails(art._id)}>{translateText(art.title)}</h3>
                      <p>{art.content.substring(0, 150)}...</p>
                      <div className="news-card-footer">
                        <span className="meta">{art.source} · {art.time}</span>
                        <button onClick={() => handleLikeArticle(art._id)}>👍 {art.likesCount || 0}</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 5. ARTICLE READING PAGE */}
        {activeView === 'article' && selectedArticle && (
          <article className="full-article-page">
            <button className="back-link" onClick={() => setActiveView('home')}>← Back to Headlines</button>
            
            <header className="article-header">
              <span className="article-category-tag">{selectedArticle.category}</span>
              <h1>{translateText(selectedArticle.title)}</h1>
              
              <div className="article-author-row">
                <div className="author-details">
                  <strong>By {selectedArticle.source} Desk</strong>
                  <span>Published: {selectedArticle.time}</span>
                </div>
              </div>
            </header>

            <img className="article-hero-image" src={selectedArticle.imageUrl} alt={selectedArticle.title} />

            <div className="article-body">
              <p>{translateText(selectedArticle.content)}</p>
            </div>

            <div className="article-actions-bar">
              <button className="action-btn" onClick={() => handleLikeArticle(selectedArticle._id)}>
                {selectedArticle.likedBy?.includes(user.email) ? '❤️ Liked' : '🤍 Like'} ({selectedArticle.likesCount || 0})
              </button>
              <button className="action-btn" onClick={() => {
                const isSaved = savedArticles.some(s => s.title === selectedArticle.title);
                isSaved ? unsaveArticle(selectedArticle.title) : saveArticle(selectedArticle);
              }}>
                {savedArticles.some(s => s.title === selectedArticle.title) ? '★ Bookmarked' : '☆ Bookmark'}
              </button>
              <button className="action-btn" onClick={() => alert("Link copied to clipboard! Share it with your friends.")}>
                🔗 Share Article
              </button>
            </div>

            {/* In-UI translation select box */}
            <div className="translate-panel-box">
              <label>🌐 Translate Article Language: </label>
              <select value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)}>
                <option value="English">English</option>
                <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                <option value="Hindi">हिन्दी (Hindi)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
              </select>
            </div>

            {/* Comments Section */}
            <section className="comments-section">
              <h3>Comments ({selectedArticle.comments?.length || 0})</h3>
              <form 
                onSubmit={(e) => {
                  const text = e.target.commentInput.value;
                  handleAddComment(e, selectedArticle._id, text);
                  e.target.commentInput.value = '';
                }}
                className="comment-form"
              >
                <input 
                  type="text" 
                  name="commentInput" 
                  placeholder="Share your thoughts on this story..." 
                  required 
                />
                <button type="submit">Post Comment</button>
              </form>

              <div className="comments-list">
                {selectedArticle.comments?.length === 0 ? (
                  <p className="empty-state">No comments yet. Start the conversation!</p>
                ) : (
                  selectedArticle.comments?.map((comment) => (
                    <div key={comment._id} className="comment-bubble">
                      <div className="comment-header">
                        <strong>{comment.userName}</strong>
                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p>{comment.text}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
            {/* Sticky TTS Media Player Bar */}
            <div className="tts-control-bar" style={{
              position: 'sticky',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(8, 12, 16, 0.95)',
              backdropFilter: 'blur(12px)',
              borderTop: '1px solid var(--border-color)',
              padding: '1rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              zIndex: 100,
              borderRadius: '0 0 16px 16px',
              marginTop: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>
                  {speechStatus === 'speaking' ? '🔊' : speechStatus === 'paused' ? '⏸️' : '🔈'}
                </span>
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ fontSize: '0.85rem', color: '#fff', margin: 0, fontWeight: 700 }}>Read Aloud Assistant</h4>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    {speechStatus === 'speaking' ? 'Currently reading this article...' : speechStatus === 'paused' ? 'Narration paused.' : 'Click Play to listen to this article.'}
                  </span>
                </div>
              </div>

              {/* Player buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {speechStatus === 'speaking' ? (
                  <button 
                    onClick={handleSpeechPause}
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      color: '#fff',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    ⏸️ Pause
                  </button>
                ) : (
                  <button 
                    onClick={() => handleSpeechPlay(selectedArticle.content)}
                    style={{
                      background: 'var(--accent-green)',
                      color: '#080c10',
                      border: 'none',
                      padding: '0.5rem 1.25rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    ▶️ {speechStatus === 'paused' ? 'Resume' : 'Play Narration'}
                  </button>
                )}

                {(speechStatus === 'speaking' || speechStatus === 'paused') && (
                  <button 
                    onClick={handleSpeechStop}
                    style={{
                      background: 'rgba(255, 59, 48, 0.2)',
                      border: '1px solid #ff3b30',
                      color: '#ff3b30',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    ⏹️ Stop
                  </button>
                )}
              </div>

              {/* Speed rate control select dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Speed:</span>
                <select 
                  value={speechRate} 
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    borderRadius: '4px',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="0.8">0.8x</option>
                  <option value="1.0">1.0x (Normal)</option>
                  <option value="1.2">1.2x</option>
                  <option value="1.5">1.5x</option>
                  <option value="1.8">1.8x</option>
                  <option value="2.0">2.0x</option>
                </select>
              </div>
            </div>
          </article>
        )}

        {/* 6. AI NEWS CHATBOT PANEL */}
        {activeView === 'chatbot' && (
          <div className="ai-chatbot-view">
            <div className="chatbot-header">
              <h2>🤖 Conversational News Assistant</h2>
              <p>Ask questions about trending updates, request article summaries, or translate stories instantly.</p>
            </div>

            <div className="chatbot-chat-box">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`chat-message-row ${msg.role === 'user' ? 'user' : 'bot'}`}>
                  <div className="chat-avatar">{msg.role === 'user' ? '👤' : '🤖'}</div>
                  <div className="chat-message-bubble">
                    <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="chat-message-row bot">
                  <div className="chat-avatar">🤖</div>
                  <div className="chat-message-bubble italic">
                    AI Assistant is thinking...
                  </div>
                </div>
              )}
            </div>

            <div className="chatbot-quick-prompts">
              <button onClick={() => handleChatSubmit(null, "What happened in politics today?")}>🏛️ Politics Today</button>
              <button onClick={() => handleChatSubmit(null, "Summarize today's stock market news.")}>📈 Stock Market</button>
              <button onClick={() => handleChatSubmit(null, "Who won yesterday's football match?")}>⚽ Sports Desk</button>
              <button onClick={() => handleChatSubmit(null, "Show the latest education notifications.")}>🎓 Exam Updates</button>
            </div>

            <form className="chatbot-input-form" onSubmit={handleChatSubmit}>
              <input 
                type="text" 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask about any news story, explain a topic, or generate briefs..." 
                required 
              />
              <button type="submit" disabled={chatLoading}>Send Query</button>
            </form>
          </div>
        )}

        {/* 7. NOTIFICATIONS DASHBOARD */}
        {activeView === 'notifications' && (
          <div className="notifications-view">
            <div className="notifications-header">
              <h2>🔔 Notifications</h2>
              <button 
                className="mark-all-read-btn"
                onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
              >
                Mark all as read
              </button>
            </div>

            <div className="notifications-list">
              {notifications.map((n) => (
                <div key={n.id} className={`notification-item ${n.read ? 'read' : 'unread'}`}>
                  <div className="notification-icon-col">
                    {n.category === 'Technology' ? '💻' : n.category === 'Stock Market' ? '📈' : n.category === 'Education' ? '🎓' : '⚽'}
                  </div>
                  <div className="notification-content-col">
                    <h4>{n.title}</h4>
                    <p>{n.body}</p>
                    <span className="meta">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. BOOKMARK DASHBOARD */}
        {activeView === 'bookmarks' && (
          <div className="bookmarks-view">
            <div className="bookmarks-header">
              <h2>⭐ Saved Bookmarks</h2>
              <div className="offline-toggle-bar">
                <label className="switch-label">
                  <input 
                    type="checkbox" 
                    checked={offlineMode}
                    onChange={(e) => setOfflineMode(e.target.checked)}
                  />
                  <span>Offline Reading Mode</span>
                </label>
              </div>
            </div>

            {offlineMode && (
              <div className="offline-alert-box">
                💾 **Offline Mode Active**: Saved bookmarks are downloaded. You can read them without an active internet connection.
              </div>
            )}

            {savedArticles.length === 0 ? (
              <p className="empty-state">No saved bookmarks yet. Go back to Home Feed to bookmark stories.</p>
            ) : (
              <div className="bookmarks-list">
                {savedArticles.map((art) => (
                  <div key={art.title} className="bookmark-card-item">
                    <div className="bookmark-details">
                      <span className="badge">{art.tag}</span>
                      <h4>{art.title}</h4>
                      <p className="meta">{art.source} · {art.time}</p>
                    </div>
                    <div className="bookmark-actions">
                      <button className="unsave-btn" onClick={() => unsaveArticle(art.title)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 9. USER PROFILE AND SETTINGS */}
        {activeView === 'profile' && (
          <div className="profile-view">
            <h2>👤 User Profile & Settings</h2>
            
            <div className="profile-dashboard-grid">
              <div className="profile-card-details">
                <h3>Personal Information</h3>
                <div className="profile-info-row">
                  <strong>Name:</strong>
                  <span>{user.name}</span>
                </div>
                <div className="profile-info-row">
                  <strong>Email:</strong>
                  <span>{user.email}</span>
                </div>
                <div className="profile-info-row">
                  <strong>Preferred Category:</strong>
                  <span>{user.category}</span>
                </div>
                <div className="profile-info-row">
                  <strong>Registered On:</strong>
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="profile-card-details">
                <h3>Reader Statistics</h3>
                <div className="stats-indicator-grid">
                  <div className="indicator-box">
                    <span className="number">{savedArticles.length * 3 + 2}</span>
                    <span className="label">Articles Read</span>
                  </div>
                  <div className="indicator-box">
                    <span className="number">{savedArticles.length}</span>
                    <span className="label">Saved Bookmarks</span>
                  </div>
                  <div className="indicator-box">
                    <span className="number">{followedCategories.length}</span>
                    <span className="label">Followed Categories</span>
                  </div>
                  <div className="indicator-box">
                    <span className="number">{aiQueriesCount}</span>
                    <span className="label">AI Assistant Chats</span>
                  </div>
                </div>
              </div>

              <div className="profile-card-details settings-panel">
                <h3>System Preferences</h3>
                <div className="settings-option">
                  <label>Preferred Translation Language:</label>
                  <select value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)}>
                    <option value="English">English</option>
                    <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                    <option value="Hindi">हिन्दी (Hindi)</option>
                    <option value="Tamil">தமிழ் (Tamil)</option>
                  </select>
                </div>

                <div className="settings-option">
                  <label>Dashboard theme:</label>
                  <button className="primary-action inline-btn" onClick={toggleTheme}>
                    Toggle Dark / Light Mode
                  </button>
                </div>

                <div className="settings-option" style={{ marginTop: '1rem' }}>
                  <label>Accent Color Highlight:</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <button 
                      onClick={() => setAccent('green')}
                      style={{
                        background: '#00ff88',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: accent === 'green' ? '2px solid #fff' : 'none',
                        cursor: 'pointer',
                        boxShadow: accent === 'green' ? '0 0 8px #00ff88' : 'none'
                      }}
                      title="Emerald Green (Default)"
                    />
                    <button 
                      onClick={() => setAccent('blue')}
                      style={{
                        background: '#0088ff',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: accent === 'blue' ? '2px solid #fff' : 'none',
                        cursor: 'pointer',
                        boxShadow: accent === 'blue' ? '0 0 8px #0088ff' : 'none'
                      }}
                      title="Royal Blue"
                    />
                    <button 
                      onClick={() => setAccent('purple')}
                      style={{
                        background: '#d300ff',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: accent === 'purple' ? '2px solid #fff' : 'none',
                        cursor: 'pointer',
                        boxShadow: accent === 'purple' ? '0 0 8px #d300ff' : 'none'
                      }}
                      title="Cyberpunk Neon Purple"
                    />
                    <button 
                      onClick={() => setAccent('red')}
                      style={{
                        background: '#ff3b30',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: accent === 'red' ? '2px solid #fff' : 'none',
                        cursor: 'pointer',
                        boxShadow: accent === 'red' ? '0 0 8px #ff3b30' : 'none'
                      }}
                      title="Crimson Sunset Red"
                    />
                  </div>
                </div>

                <div className="settings-option">
                  <label>Push Notification Alerts:</label>
                  <input type="checkbox" defaultChecked />
                </div>
              </div>

              <div className="profile-card-details category-followers">
                <h3>Favorite Categories</h3>
                <p>Toggle to customize recommended feeds:</p>
                <div className="pref-category-grid">
                  {categories.map((cat) => (
                    <label key={cat} className="checkbox-category-label">
                      <input 
                        type="checkbox" 
                        checked={followedCategories.includes(cat)}
                        onChange={() => toggleCategoryFollow(cat)}
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'music' && (
          <MusicView 
            currentSong={currentSong}
            setCurrentSong={setCurrentSong}
            musicQueue={musicQueue}
            setMusicQueue={setMusicQueue}
            musicPlaying={musicPlaying}
            setMusicPlaying={setMusicPlaying}
            musicVolume={musicVolume}
            musicProgress={musicProgress}
            musicDuration={musicDuration}
            handlePlayPauseMusic={handlePlayPauseMusic}
            handleAudioSeek={handleAudioSeek}
            handleAudioVolumeChange={handleAudioVolumeChange}
            musicError={musicError}
          />
        )}
      </main>
      
      {/* Sports Match Details Modal */}
      {selectedSportsMatch && (
        <div className="newsphere-modal-overlay" onClick={() => setSelectedSportsMatch(null)}>
          <div className="newsphere-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="newsphere-modal-close" onClick={() => setSelectedSportsMatch(null)}>&times;</button>
            <div className="scoreboard-card-league" style={{ fontSize: '0.75rem', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>
              {selectedSportsMatch.leagueName}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '1.5rem' }}>
              {selectedSportsMatch.name}
            </div>
            
            <div className="detail-modal-teams-grid">
              <div className={`detail-modal-team ${selectedSportsMatch.statusState === 'post' && selectedSportsMatch.competitors[0].winner ? 'winner' : ''}`}>
                <img 
                  className="detail-modal-team-logo" 
                  src={selectedSportsMatch.competitors[0].logo} 
                  alt={selectedSportsMatch.competitors[0].name}
                  onError={(e) => { e.target.src = 'https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-cricket.png'; }}
                />
                <span className="detail-modal-team-name">{selectedSportsMatch.competitors[0].name}</span>
                <span className="detail-modal-team-score">{selectedSportsMatch.competitors[0].score}</span>
              </div>
              <div className="detail-modal-vs-box">VS</div>
              <div className={`detail-modal-team ${selectedSportsMatch.statusState === 'post' && selectedSportsMatch.competitors[1].winner ? 'winner' : ''}`}>
                <img 
                  className="detail-modal-team-logo" 
                  src={selectedSportsMatch.competitors[1].logo} 
                  alt={selectedSportsMatch.competitors[1].name}
                  onError={(e) => { e.target.src = 'https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-cricket.png'; }}
                />
                <span className="detail-modal-team-name">{selectedSportsMatch.competitors[1].name}</span>
                <span className="detail-modal-team-score">{selectedSportsMatch.competitors[1].score}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textAlign: 'center' }}>
              <div className="scoreboard-card-status-badge live" style={{
                background: selectedSportsMatch.statusState === 'in' ? 'rgba(255, 77, 77, 0.15)' : selectedSportsMatch.statusState === 'pre' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedSportsMatch.statusState === 'in' ? 'var(--danger-color)' : selectedSportsMatch.statusState === 'pre' ? 'var(--accent-green)' : 'var(--text-secondary)',
                fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: '4px'
              }}>
                {selectedSportsMatch.statusState === 'in' ? '🔴 LIVE' : selectedSportsMatch.statusState === 'pre' ? '⏳ UPCOMING' : '🏆 FINAL'}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--accent-green)', marginTop: '0.5rem' }}>
                {selectedSportsMatch.statusSummary || selectedSportsMatch.statusDetail}
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Venue</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 550 }}>{selectedSportsMatch.venue}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Match Time</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 550 }}>{selectedSportsMatch.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <audio 
        ref={audioRef} 
        onTimeUpdate={handleAudioTimeUpdate} 
        onLoadedMetadata={handleAudioLoadedMetadata}
        onEnded={handleAudioEnded}
      />

      {currentSong && activeView !== 'music' && (
        <div className="global-music-sticky-bar" style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          background: 'rgba(8, 12, 16, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          zIndex: 999,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          maxWidth: '350px',
          animation: 'fadeInUp 0.3s ease'
        }}>
          <img 
            src={currentSong.image?.[1]?.link || currentSong.image?.[1]?.url || currentSong.image?.[0]?.link || 'https://via.placeholder.com/150'} 
            alt={currentSong.name}
            style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
          />
          <div style={{ flex: 1, overflow: 'hidden', textAlign: 'left' }}>
            <h4 style={{ fontSize: '0.8rem', color: '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentSong.name}
            </h4>
            <span style={{ fontSize: '0.68rem', color: musicError ? '#ff3b30' : 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
              {musicError ? '⚠️ Playback blocked' : (currentSong.primaryArtists || currentSong.artists)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={handlePlayPauseMusic}
              style={{
                background: 'var(--accent-green)',
                color: '#080c10',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem'
              }}
            >
              {musicPlaying ? '⏸' : '▶'}
            </button>
            <button 
              onClick={() => { setActiveView('music'); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
              title="Open Full Player"
            >
              🎵
            </button>
            <button 
              onClick={() => { setCurrentSong(null); setMusicPlaying(false); if(audioRef.current) audioRef.current.pause(); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
              title="Close Player"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthLayout mode="login" />} />
          <Route path="/register" element={<AuthLayout mode="register" />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

createRoot(document.getElementById('root')).render(<App />);
