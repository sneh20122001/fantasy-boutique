export interface Listing {
  id: string;
  sellerAlias: string;
  sellerAge?: number;
  size: string;
  brand: string;
  price: number;
  fantasyText: string;
  imageUrl?: string | null;
  status: "AVAILABLE" | "SOLD";
  createdAt: string;
}

export const mockListings: Listing[] = [
  {
    id: "1",
    sellerAlias: "User_8472",
    sellerAge: 26,
    size: "48C",
    brand: "La Perla",
    price: 500,
    fantasyText:
      "There is a particular evening I return to, again and again. The city was hot and still. I had poured a glass of wine I never finished, put this on, and stood at the window watching the street below. Something about the silk — the way it barely existed against my skin, like a whisper rather than fabric — made me feel impossibly present in my own body. I stood there for a long time. Not doing anything. Just feeling. There are evenings that live inside you. That was one of them.",
    imageUrl: "/fantasy/listing1.png",
    status: "AVAILABLE",
    createdAt: "2026-02-20",
  },
  {
    id: "2",
    sellerAlias: "User_3391",
    sellerAge: 31,
    size: "50D",
    brand: "Agent Provocateur",
    price: 850,
    fantasyText:
      "He left for work at seven. I wore this all morning — made coffee in it, read three pages of a book I couldn't concentrate on, watered the plants while the sunlight came through the kitchen curtains and landed exactly on the lace. By noon I had written him a message I saved as a draft and never sent. Sometimes desire is just that — something you carry all day, quietly, like a stone warmed in your pocket. This piece knows everything about days like that.",
    imageUrl: "/fantasy/listing2.png",
    status: "AVAILABLE",
    createdAt: "2026-02-18",
  },
  {
    id: "3",
    sellerAlias: "User_5520",
    sellerAge: 27,
    size: "48B",
    brand: "Zivame Premium",
    price: 450,
    fantasyText:
      "The night before my wedding I sat alone in a hotel room and put this on. Not for anyone. Just for me — one last conversation with the version of myself that answered to no one. I lit a candle, poured whisky into a toothbrush glass, and looked at myself in the mirror for a very long time. I wasn't sad. I wasn't afraid. I was just there, completely, in a way I wanted to remember. This set carries that night. The stillness of it. The freedom.",
    imageUrl: "/fantasy/listing3.png",
    status: "AVAILABLE",
    createdAt: "2026-02-15",
  },
  {
    id: "4",
    sellerAlias: "User_7104",
    sellerAge: 34,
    size: "52D",
    brand: "Clovia Luxe",
    price: 350,
    fantasyText:
      "We had been arguing for three days — the slow, cold kind that fills a flat like fog. Then on a Tuesday night he walked into the bedroom where I was reading, wearing just this. He stopped in the doorway. Everything that had been said, and everything unsaid, hung between us for exactly four seconds. Then he crossed the room. We did not speak again until morning and by then none of it mattered anymore. Some nights repair everything. This is what I was wearing.",
    imageUrl: "/fantasy/listing4.png",
    status: "AVAILABLE",
    createdAt: "2026-02-12",
  },
  {
    id: "5",
    sellerAlias: "User_2088",
    sellerAge: 23,
    size: "48D",
    brand: "Nykd by Nykaa",
    price: 700,
    fantasyText:
      "My best friend's brother came to pick her up and she wasn't home yet. We sat on the balcony and talked for an hour that felt like minutes. He laughed at something I said and the way he looked at me after — not at me, through me — made the evening suddenly feel ten degrees warmer. When my friend finally arrived I excused myself early. I lay on my bed in this, staring at the ceiling fan, replaying that look on a loop until I fell asleep. I still think about that balcony.",
    imageUrl: "/fantasy/listing5.png",
    status: "AVAILABLE",
    createdAt: "2026-02-10",
  },
  {
    id: "6",
    sellerAlias: "User_9933",
    sellerAge: 29,
    size: "50C",
    brand: "Amante",
    price: 400,
    fantasyText:
      "I wore this on a solo trip to Goa — a February morning when the beach was almost empty and the light was the colour of honey. I sat at the shore in a sarong with this underneath and read for three hours without thinking of a single person from my real life. A man walked past twice and smiled the second time. I smiled back. He kept walking. That was enough. There is an extraordinary kind of freedom in a moment like that — chosen solitude that doesn't feel like loneliness at all.",
    imageUrl: "/fantasy/listing6.png",
    status: "AVAILABLE",
    createdAt: "2026-02-08",
  },
  {
    id: "7",
    sellerAlias: "User_6641",
    sellerAge: 25,
    size: "48C",
    brand: "Clovia",
    price: 600,
    fantasyText:
      "Late office. Everyone had left. He came to my desk to say goodnight and then didn't leave — just leaned against the partition and talked. His cologne was the kind that stays with you. At some point during the conversation I became very aware of the lace at my collar, the weight of the fabric, the strange intimacy of being the last two people in a lit building. Nothing happened. But when I reached home that night and looked in the mirror, something in my eyes had changed — like I'd been reminded I was alive.",
    imageUrl: "/fantasy/listing7.png",
    status: "AVAILABLE",
    createdAt: "2026-02-06",
  },
  {
    id: "8",
    sellerAlias: "User_1173",
    sellerAge: 28,
    size: "50D",
    brand: "PrettySecrets",
    price: 550,
    fantasyText:
      "It was a friend's birthday party and I did not expect to feel anything. I was wearing this under a black dress and had decided the evening would be unremarkable. Then someone laughed across the room — a real laugh, not a polished one — and I turned to look. He caught me looking. He didn't look away. By the end of the night we had talked for two hours about everything and nothing. He asked for my number at the door. I gave it. I still have his first message saved. This is what I wore that particular night the world shifted.",
    imageUrl: "/fantasy/listing8.png",
    status: "AVAILABLE",
    createdAt: "2026-02-04",
  },
  {
    id: "9",
    sellerAlias: "User_4482",
    sellerAge: 22,
    size: "48B",
    brand: "Enamor",
    price: 480,
    fantasyText:
      "We had been circling each other for months — morning hellos in the corridor, eyes that held a second too long. The kind of tension that makes mundane things into ceremonies. One Sunday I heard him in the stairwell and opened the door before I'd thought about it, dressed in just this and a cotton dupatta. We both went very still. Then he asked, quietly, if I had any coffee. I said yes. He came inside. I put the kettle on. I have never made anything so slowly in my life.",
    imageUrl: "/fantasy/listing9.png",
    status: "AVAILABLE",
    createdAt: "2026-02-02",
  },
  {
    id: "10",
    sellerAlias: "User_7758",
    sellerAge: 33,
    size: "52C",
    brand: "Zivame",
    price: 650,
    fantasyText:
      "I had been running every morning for three months and he had been my trainer for all of them — professional, precise, never inappropriate. But there is a specific kind of attention, the attention of someone who studies the way you move, that does something to you over time. I wore this on the evening I finally admitted it to myself: I wanted him to stay after the session. He did. It turns out that kind of slow-built wanting, when it finally lands somewhere, is the most complete feeling in the world.",
    imageUrl: "/fantasy/listing10.png",
    status: "AVAILABLE",
    createdAt: "2026-01-30",
  },
  {
    id: "11",
    sellerAlias: "User_2295",
    sellerAge: 38,
    size: "56D",
    brand: "Amante",
    price: 750,
    fantasyText:
      "The lift in our building is old — slow, wooden-panelled, fitting only two people comfortably. We had ridden it together perhaps a dozen times: small talk, weather, the new security guard. One evening the power cut mid-floor. Total dark. I could hear him breathe. Neither of us spoke for what felt like a very long time. Then he said, simply: 'You smell like summer.' I didn't answer. When the lights returned we were both looking at the floor. I have worn this in that lift every time since, hoping for another outage.",
    imageUrl: "/fantasy/listing11.png",
    status: "AVAILABLE",
    createdAt: "2026-01-28",
  },
  {
    id: "12",
    sellerAlias: "User_8830",
    sellerAge: 24,
    size: "48C",
    brand: "La Senza",
    price: 420,
    fantasyText:
      "Some connections arrive without warning on an ordinary afternoon. He came to deliver a parcel, I answered the door in a hurry — thin robe, this underneath, hair still undone. He apologised for the timing. I said it was fine and meant it. We talked at the door for twenty minutes about nothing in particular and then about everything. He came back the next day — no parcel this time. Just a question: 'Are you free?' I was. That first unhurried evening together still feels like something I dreamed. This is what I wore when it began.",
    imageUrl: "/fantasy/listing12.png",
    status: "AVAILABLE",
    createdAt: "2026-01-25",
  },
];
