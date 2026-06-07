// tripEngine.js

const CITY_DATA = {

  bangalore: [
    { name: "Lalbagh Botanical Garden", type: "nature", cost: 20, slots: ["morning"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 12.9507, lng: 77.5848 },
    { name: "Cubbon Park", type: "nature", cost: 0, slots: ["morning","evening"], moods: ["relaxed","nature","budget","explore","romantic","cultural","adventure","foodie","fast"], lat: 12.9763, lng: 77.5929 },
    { name: "Bangalore Palace", type: "cultural", cost: 230, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 13.0070, lng: 77.5921 },
    { name: "Nandi Hills", type: "nature", cost: 50, slots: ["morning"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 13.3702, lng: 77.6835 },
    { name: "UB City Mall", type: "leisure", cost: 1000, slots: ["afternoon","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 12.9716, lng: 77.5946 },
    { name: "ISKCON Temple", type: "cultural", cost: 0, slots: ["morning","evening"], moods: ["relaxed","cultural","romantic","nature","explore","adventure","foodie","fast","budget"], lat: 13.0102, lng: 77.5510 },
    { name: "Vidhana Soudha", type: "cultural", cost: 0, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 12.9794, lng: 77.5913 },
    { name: "Commercial Street", type: "food", cost: 300, slots: ["afternoon","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 12.9834, lng: 77.6077 },
    { name: "Ulsoor Lake", type: "nature", cost: 0, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 12.9822, lng: 77.6200 },
  ],

  mysore: [
    { name: "Mysore Palace", type: "cultural", cost: 70, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 12.3052, lng: 76.6552 },
    { name: "Chamundi Hills", type: "nature", cost: 20, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 12.2723, lng: 76.6728 },
    { name: "Brindavan Gardens", type: "nature", cost: 30, slots: ["evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 12.4244, lng: 76.5722 },
    { name: "Mysore Zoo", type: "nature", cost: 100, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 12.3005, lng: 76.6553 },
    { name: "Devaraja Market", type: "food", cost: 0, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 12.3090, lng: 76.6526 },
    { name: "St. Philomena's Church", type: "cultural", cost: 0, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 12.3157, lng: 76.6400 },
    { name: "Karanji Lake", type: "nature", cost: 30, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 12.2960, lng: 76.6490 },
    { name: "Rail Museum Mysore", type: "cultural", cost: 20, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 12.3103, lng: 76.6180 },
    { name: "Mysore Sand Sculpture Museum", type: "cultural", cost: 100, slots: ["afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 12.2975, lng: 76.6340 },
  ],

  goa: [
    { name: "Baga Beach", type: "nature", cost: 0, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 15.5524, lng: 73.7517 },
    { name: "Calangute Beach", type: "nature", cost: 0, slots: ["morning","afternoon","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 15.5440, lng: 73.7525 },
    { name: "Fort Aguada", type: "cultural", cost: 0, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 15.5007, lng: 73.7732 },
    { name: "Dudhsagar Waterfalls", type: "adventure", cost: 400, slots: ["morning"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 15.3144, lng: 74.3144 },
    { name: "Old Goa Churches", type: "cultural", cost: 0, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 15.5009, lng: 73.9116 },
    { name: "Anjuna Flea Market", type: "food", cost: 200, slots: ["afternoon","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 15.5738, lng: 73.7416 },
    { name: "Vagator Beach", type: "nature", cost: 0, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 15.5993, lng: 73.7440 },
    { name: "Palolem Beach", type: "nature", cost: 0, slots: ["morning","afternoon","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 15.0100, lng: 74.0232 },
    { name: "Spice Plantation Tour", type: "nature", cost: 500, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 15.4139, lng: 74.0115 },
  ],

  mumbai: [
    { name: "Gateway of India", type: "cultural", cost: 0, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 18.9220, lng: 72.8347 },
    { name: "Marine Drive", type: "nature", cost: 0, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 18.9442, lng: 72.8236 },
    { name: "Elephanta Caves", type: "cultural", cost: 40, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 18.9633, lng: 72.9315 },
    { name: "Chhatrapati Shivaji Terminus", type: "cultural", cost: 0, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 18.9402, lng: 72.8356 },
    { name: "Bandra-Worli Sea Link", type: "leisure", cost: 0, slots: ["evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 19.0354, lng: 72.8183 },
    { name: "Dharavi", type: "cultural", cost: 500, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 19.0424, lng: 72.8544 },
    { name: "Juhu Beach", type: "nature", cost: 0, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 19.0883, lng: 72.8264 },
    { name: "Crawford Market", type: "food", cost: 0, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 18.9467, lng: 72.8356 },
    { name: "Siddhivinayak Temple", type: "cultural", cost: 0, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 19.0169, lng: 72.8302 },
  ],

  delhi: [
    { name: "Red Fort", type: "cultural", cost: 35, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 28.6562, lng: 77.2410 },
    { name: "Qutub Minar", type: "cultural", cost: 35, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 28.5245, lng: 77.1855 },
    { name: "India Gate", type: "cultural", cost: 0, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 28.6129, lng: 77.2295 },
    { name: "Humayun's Tomb", type: "cultural", cost: 35, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 28.5933, lng: 77.2507 },
    { name: "Lotus Temple", type: "cultural", cost: 0, slots: ["morning","afternoon","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 28.5535, lng: 77.2588 },
    { name: "Chandni Chowk", type: "food", cost: 200, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 28.6506, lng: 77.2334 },
    { name: "Akshardham Temple", type: "cultural", cost: 0, slots: ["afternoon","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 28.6127, lng: 77.2773 },
    { name: "Hauz Khas Village", type: "leisure", cost: 0, slots: ["afternoon","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 28.5494, lng: 77.2001 },
    { name: "Lodhi Garden", type: "nature", cost: 0, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 28.5931, lng: 77.2196 },
  ],

  jaipur: [
    { name: "Amber Fort", type: "cultural", cost: 100, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 26.9855, lng: 75.8513 },
    { name: "Hawa Mahal", type: "cultural", cost: 50, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 26.9239, lng: 75.8267 },
    { name: "City Palace", type: "cultural", cost: 200, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 26.9258, lng: 75.8237 },
    { name: "Jantar Mantar", type: "cultural", cost: 50, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 26.9247, lng: 75.8245 },
    { name: "Nahargarh Fort", type: "adventure", cost: 50, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 26.9433, lng: 75.8103 },
    { name: "Jal Mahal", type: "nature", cost: 0, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 26.9523, lng: 75.8483 },
    { name: "Johari Bazaar", type: "food", cost: 300, slots: ["afternoon","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 26.9221, lng: 75.8236 },
    { name: "Birla Mandir", type: "cultural", cost: 0, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 26.8993, lng: 75.8196 },
    { name: "Chokhi Dhani", type: "cultural", cost: 800, slots: ["evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 26.7800, lng: 75.8700 },
  ],

  agra: [
    { name: "Taj Mahal", type: "cultural", cost: 50, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 27.1751, lng: 78.0421 },
    { name: "Agra Fort", type: "cultural", cost: 40, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 27.1795, lng: 78.0211 },
    { name: "Fatehpur Sikri", type: "cultural", cost: 40, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 27.0945, lng: 77.6600 },
    { name: "Mehtab Bagh", type: "nature", cost: 25, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 27.1788, lng: 78.0375 },
    { name: "Itimad-ud-Daulah", type: "cultural", cost: 30, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 27.1948, lng: 78.0358 },
    { name: "Kinari Bazaar", type: "food", cost: 200, slots: ["afternoon","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 27.1799, lng: 78.0151 },
    { name: "Chini Ka Rauza", type: "cultural", cost: 0, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 27.1975, lng: 78.0417 },
    { name: "Wildlife SOS Bear Rescue", type: "nature", cost: 150, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 27.2350, lng: 77.9578 },
  ],

  varanasi: [
    { name: "Kashi Vishwanath Temple", type: "cultural", cost: 0, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 25.3109, lng: 83.0107 },
    { name: "Dashashwamedh Ghat", type: "cultural", cost: 0, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 25.3057, lng: 83.0114 },
    { name: "Sarnath", type: "cultural", cost: 25, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 25.3763, lng: 83.0235 },
    { name: "Assi Ghat", type: "nature", cost: 0, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 25.2894, lng: 83.0103 },
    { name: "Manikarnika Ghat", type: "cultural", cost: 0, slots: ["morning","afternoon","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 25.3098, lng: 83.0123 },
    { name: "BHU Campus", type: "cultural", cost: 0, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 25.2686, lng: 82.9995 },
    { name: "Ramnagar Fort", type: "cultural", cost: 15, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 25.2915, lng: 83.0373 },
    { name: "Ganga Boat Ride", type: "nature", cost: 200, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 25.3100, lng: 83.0100 },
  ],

  chennai: [
    { name: "Marina Beach", type: "nature", cost: 0, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 13.0500, lng: 80.2824 },
    { name: "Kapaleeshwarar Temple", type: "cultural", cost: 0, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 13.0337, lng: 80.2698 },
    { name: "Fort St. George", type: "cultural", cost: 5, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 13.0802, lng: 80.2881 },
    { name: "Government Museum", type: "cultural", cost: 15, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 13.0664, lng: 80.2647 },
    { name: "San Thome Basilica", type: "cultural", cost: 0, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 13.0339, lng: 80.2786 },
    { name: "Elliot's Beach", type: "nature", cost: 0, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 12.9990, lng: 80.2727 },
    { name: "Mahabalipuram", type: "cultural", cost: 40, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 12.6269, lng: 80.1927 },
    { name: "Express Avenue Mall", type: "leisure", cost: 500, slots: ["afternoon","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 13.0604, lng: 80.2629 },
    { name: "Murugan Idli Shop", type: "food", cost: 150, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 13.0418, lng: 80.2488 },
  ],

  hyderabad: [
    { name: "Charminar", type: "cultural", cost: 25, slots: ["morning","afternoon","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 17.3616, lng: 78.4747 },
    { name: "Golconda Fort", type: "cultural", cost: 15, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 17.3833, lng: 78.4011 },
    { name: "Hussain Sagar Lake", type: "nature", cost: 0, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 17.4239, lng: 78.4738 },
    { name: "Salar Jung Museum", type: "cultural", cost: 20, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 17.3713, lng: 78.4804 },
    { name: "Ramoji Film City", type: "leisure", cost: 1500, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 17.2543, lng: 78.6808 },
    { name: "Laad Bazaar", type: "food", cost: 300, slots: ["afternoon","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 17.3609, lng: 78.4731 },
    { name: "Birla Mandir Hyderabad", type: "cultural", cost: 0, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 17.4062, lng: 78.4691 },
    { name: "KBR National Park", type: "nature", cost: 25, slots: ["morning"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 17.4280, lng: 78.4344 },
    { name: "Paradise Biryani", type: "food", cost: 400, slots: ["afternoon","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 17.4344, lng: 78.4614 },
  ],

  kolkata: [
    { name: "Victoria Memorial", type: "cultural", cost: 30, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 22.5448, lng: 88.3426 },
    { name: "Howrah Bridge", type: "cultural", cost: 0, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 22.5851, lng: 88.3468 },
    { name: "Dakshineswar Kali Temple", type: "cultural", cost: 0, slots: ["morning","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 22.6549, lng: 88.3572 },
    { name: "Park Street", type: "food", cost: 400, slots: ["afternoon","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 22.5514, lng: 88.3510 },
    { name: "Indian Museum", type: "cultural", cost: 20, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 22.5578, lng: 88.3510 },
    { name: "Sundarbans Day Tour", type: "nature", cost: 1500, slots: ["morning"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 21.9497, lng: 88.8974 },
    { name: "College Street", type: "cultural", cost: 0, slots: ["morning","afternoon"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 22.5764, lng: 88.3634 },
    { name: "Eco Park", type: "nature", cost: 30, slots: ["morning","afternoon","evening"], moods: ["relaxed","nature","explore","romantic","cultural","adventure","foodie","fast","budget"], lat: 22.5941, lng: 88.4799 },
  ],

};

// ── Helpers ──────────────────────────────────────────────────────
function normaliseCity(c) {
  return (c || "").toLowerCase().trim();
}

function normaliseMood(m) {
  return (m || "relaxed").toLowerCase().trim();
}

// ── Match Score ──────────────────────────────────────────────────
function calculateMatchScore(places, mood, budget) {
  let moodMatch = 0;
  let totalCost = 0;

  places.forEach(p => {
    if (p.moods?.includes(mood)) moodMatch++;
    totalCost += p.cost;
  });

  const moodScore   = (moodMatch / places.length) * 100;
  const budgetScore = totalCost <= budget
    ? 100
    : Math.max(0, 100 - ((totalCost - budget) / budget) * 100);

  return Math.round((moodScore * 0.6) + (budgetScore * 0.4));
}

// ── Main export ──────────────────────────────────────────────────
export function generateTripPlan(days, mood, destination, budget = 5000) {
  const city = normaliseCity(destination);
  const m    = normaliseMood(mood);

  const places = CITY_DATA[city];
  if (!places) {
    return {
      success: false,
      error: `"${destination}" is not supported yet. Try: Bangalore, Mysore, Goa, Mumbai, Delhi, Jaipur, Agra, Varanasi, Chennai, Hyderabad, or Kolkata.`
    };
  }

  // Filter by mood first, fall back to all places if not enough
  const moodFiltered = places.filter(p => p.moods.includes(m));
  const pool = moodFiltered.length >= days * 2 ? moodFiltered : places;

  const selected = pool.slice(0, days * 3);

  const itinerary = [];
  let index = 0;

  for (let d = 1; d <= days; d++) {
    itinerary.push({
      day: d,
      slots: {
        morning:   [selected[index++]].filter(Boolean),
        afternoon: [selected[index++]].filter(Boolean),
        evening:   [selected[index++]].filter(Boolean),
      }
    });
  }

  const totalCost   = selected.reduce((sum, p) => sum + p.cost, 0);
  const matchScore  = calculateMatchScore(selected, m, budget);

  return {
    success: true,
    itinerary,
    total_places:            selected.length,
    estimated_activity_cost: totalCost,
    match_score:             matchScore,
    summary: {
      vibe:           m,
      budget_status:  totalCost <= budget ? "Within budget" : "Over budget",
      recommendation: matchScore > 75
        ? "Excellent trip plan"
        : matchScore > 50
        ? "Good plan with solid options"
        : "Decent plan, can be improved",
    }
  };
}