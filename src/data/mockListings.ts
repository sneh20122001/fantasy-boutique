export interface Listing {
  id: string;
  sellerAlias: string;
  size: string;
  brand: string;
  price: number;
  fantasyText: string;
  status: "AVAILABLE" | "SOLD";
  createdAt: string;
}

export const mockListings: Listing[] = [
  {
    id: "1",
    sellerAlias: "User_8472",
    size: "34B",
    brand: "La Perla",
    price: 45,
    fantasyText: "It was a rain-soaked Tuesday when I first wore this to a gallery opening downtown. The silk clung to me like a secret, and across the room, someone held my gaze for exactly three heartbeats. I never learned their name, but I wrote this story in my journal that night by candlelight, wearing nothing else…",
    status: "AVAILABLE",
    createdAt: "2026-02-20",
  },
  {
    id: "2",
    sellerAlias: "User_3391",
    size: "36C",
    brand: "Agent Provocateur",
    price: 60,
    fantasyText: "The hotel room overlooked the Mediterranean. I had packed light — just this piece and a summer dress. The breeze through the open balcony doors carried the scent of jasmine, and I imagined a stranger reading poetry to me in a language I didn't understand, each word a warm breath against my collarbone…",
    status: "AVAILABLE",
    createdAt: "2026-02-18",
  },
  {
    id: "3",
    sellerAlias: "User_5520",
    size: "32A",
    brand: "Fleur du Mal",
    price: 55,
    fantasyText: "I wore this beneath a tailored blazer to a dinner party where I knew no one. The conversation turned to confessions — things we'd never told anyone. When it was my turn, I simply smiled and said nothing, but beneath the table, my pulse quickened with the weight of every unspoken desire…",
    status: "AVAILABLE",
    createdAt: "2026-02-15",
  },
  {
    id: "4",
    sellerAlias: "User_7104",
    size: "38D",
    brand: "Cosabella",
    price: 35,
    fantasyText: "A late-night train through the countryside. The compartment was empty except for the moonlight and me. I pressed my forehead against the cool glass and let my imagination wander — to a version of tonight where the seat across from me wasn't empty, where hands found mine in the dark…",
    status: "AVAILABLE",
    createdAt: "2026-02-12",
  },
  {
    id: "5",
    sellerAlias: "User_2088",
    size: "34C",
    brand: "Simone Pérèle",
    price: 50,
    fantasyText: "The letter arrived on thick cream paper, no return address. 'Meet me at the fountain at midnight.' I wore this underneath a velvet coat, heart pounding. No one came. But standing there alone, the city asleep around me, I realized the thrill was never about who sent it — it was about who I became waiting…",
    status: "AVAILABLE",
    createdAt: "2026-02-10",
  },
  {
    id: "6",
    sellerAlias: "User_9933",
    size: "36B",
    brand: "Chantelle",
    price: 40,
    fantasyText: "Sunday morning. Fresh linen sheets. Espresso on the nightstand. I stretched in this and watched golden light paint patterns across the ceiling. The world outside could wait. In this moment, I was both the dreamer and the dream — untouchable, unhurried, completely and unapologetically myself…",
    status: "AVAILABLE",
    createdAt: "2026-02-08",
  },
];
