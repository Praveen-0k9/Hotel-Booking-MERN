const mongoose = require('mongoose');
const Place = require('./models/Place');
const User = require('./models/User');
const fs = require('fs');
require('dotenv').config();

function log(msg) {
  console.log(msg);
  try {
    fs.appendFileSync('seed_log.txt', msg + '\n');
  } catch (e) { console.error('Error writing to log file', e); }
}

async function seedDatabase() {
  try {
    log('Starting seed script at ' + new Date().toISOString());
    log('Attempting to connect to DB at: ' + (process.env.DB_URL ? 'URL_EXISTS' : 'URL_MISSING'));

    await mongoose.connect(process.env.DB_URL);
    log('Connected to database');

    log('Deleting existing places...');
    await Place.deleteMany({});
    log('Cleared existing places');

    let testUser = await User.findOne({ email: 'test@hotelbooking.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@hotelbooking.com',
        password: 'test123'
      });
      log('Created test user');
    }

    // High-quality, reliable Unsplash images for Indian themes
    const samplePlaces = [
      // --- Rajasthan & North India ---
      {
        title: "Umaid Bhawan Palace, Jodhpur",
        address: "Circuit House Rd, Cantt Area, Jodhpur, Rajasthan 342006, India",
        photos: [
          "https://images.unsplash.com/photo-1504194947363-2f14d9e0e445?q=80&w=1167&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          "https://images.unsplash.com/photo-1560416937-230919fb9a88?w=800&q=80",
          "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&q=80",
          "https://images.unsplash.com/photo-1590766940554-634a7ed41450?w=800&q=80",
          "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=800&q=80"
        ],
        description: "One of the world's largest private residences. A part of the palace is managed by Taj Hotels. Experience royal living with Art Deco style suites and acres of gardens.",
        perks: ["Royal Suites", "Vintage Car Drive", "Underground Pool", "Champagne Walk", "Peacock Gardens"],
        extraInfo: "Home to the former royal family of Jodhpur.",
        checkIn: 14,
        checkOut: 12,
        maxGuests: 4,
        price: 1200,
        owner: testUser._id
      },
      {
        title: "The Oberoi Vanyavilas, Ranthambore",
        address: "Ranthambhore Road, Sawai Madhopur, Rajasthan 322001, India",
        photos: [
          "https://media.istockphoto.com/id/668122914/photo/jaipur-building-exteriors-outdoor-park.webp?a=1&b=1&s=612x612&w=0&k=20&c=yPh9QOULIpod7xHTU6Ch58NmJ4LPUd0XkN7OXDaVKXs=",
          "https://images.unsplash.com/photo-1534764028243-e18e0df6fbf8?w=800&q=80",
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
          "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=800&q=80"
        ],
        description: "India's leading luxury jungle resort. Luxury tents with finely embroidered canopies, private walled gardens, and tiger safaris in the adjacent national park.",
        perks: ["Tiger Safari", "Luxury Tents", "Private Walled Garden", "Observation Tower", "Spa"],
        extraInfo: "Located minutes from the Ranthambore Tiger Reserve.",
        checkIn: 13,
        checkOut: 11,
        maxGuests: 2,
        price: 850,
        owner: testUser._id
      },
      {
        title: "Amanbagh, Alwar",
        address: "District Alwar, Ajabgarh, Rajasthan 301027, India",
        photos: [
          "https://images.unsplash.com/photo-1549294413-26f195200c16?w=800&q=80",
          "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
          "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80",
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
        ],
        description: "A modern palace built within a walled compound that was once the staging area for royal hunts. Rose-hued cupolas and vaulted entrances surround a jade green pool.",
        perks: ["Private Pool Suites", "Organic Garden", "Ayurvedic Spa", "Fort Excursions", "Yoga Pavilion"],
        extraInfo: "A peaceful sanctuary in the Aravalli Hills.",
        checkIn: 14,
        checkOut: 12,
        maxGuests: 3,
        price: 900,
        owner: testUser._id
      },
      {
        title: "Suryagarh, Jaisalmer",
        address: "Kahala Phata, Sam Road, Jaisalmer, Rajasthan 345001, India",
        photos: [
          "https://media.istockphoto.com/id/1320653201/photo/mor-gabriel-syriac-monastery-mardin-turkey.webp?a=1&b=1&s=612x612&w=0&k=20&c=82KoAWygqYAXJu3sQpd2F3KQKSQzcv0kFce8lcPKO0I=",
          "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
          "https://images.unsplash.com/photo-1510424578147-3860bb6d3910?w=800&q=80",
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
          "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&q=80"
        ],
        description: "Your gateway to the Thar Desert. Built like a fortress, Suryagarh represents a unique way of life, carefully preserving the traditions of the past and framing them in a modern idiom.",
        perks: ["Desert Safari", "Midnight Trail", "Thar Dinner", "Rait Spa", "Folk Music"],
        extraInfo: "Experience the magic of the dunes and the starry desert sky.",
        checkIn: 14,
        checkOut: 11,
        maxGuests: 4,
        price: 550,
        owner: testUser._id
      },
      {
        title: "The Imperial, New Delhi",
        address: "Janpath Lane, Connaught Place, New Delhi, Delhi 110001, India",
        photos: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
          "https://images.unsplash.com/photo-1618221639263-c79379fa4d0b?w=800&q=80"
        ],
        description: "An iconic property in Delhi's heart, reminiscent of the colonial era. Known for its art collection and classic Victorian architecture fused with Art Deco.",
        perks: ["Art Gallery", "Spice Route Restaurant", "Luxury Spa", "Outdoor Pool", "High Tea"],
        extraInfo: "Steps away from Connaught Place and government/shopping districts.",
        checkIn: 14,
        checkOut: 12,
        maxGuests: 2,
        price: 450,
        owner: testUser._id
      },
      {
        title: "Ananda in the Himalayas, Rishikesh",
        address: "The Palace Estate, Narendra Nagar, Uttarakhand 249175, India",
        photos: [
          "https://images.unsplash.com/photo-1653282768098-95771656e154?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmlzaGlrZXNoJTIwaG90ZWx8ZW58MHx8MHx8fDA%3D",
          "https://images.unsplash.com/photo-1591325732-c659e5e6e87a?w=800&q=80",
          "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
          "https://images.unsplash.com/photo-1598555726325-3b47fa43f773?w=800&q=80",
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80"
        ],
        description: "A destination spa resort located in the foothills of the Himalayas. Focuses on Yoga and Ayurveda. Housed in a Viceregal Palace with breathtaking river and mountain views.",
        perks: ["Ayurveda & Yoga", "Ganga Aarti", "Wellness Meals", "Trekking", "Golf"],
        extraInfo: "Requires a minimum 3-night stay for wellness programs.",
        checkIn: 14,
        checkOut: 11,
        maxGuests: 2,
        price: 1100,
        owner: testUser._id
      },
      {
        title: "The Khyber Himalayan Resort, Gulmarg",
        address: "Gulmarg, Jammu and Kashmir 193403, India",
        photos: [
          "https://images.unsplash.com/photo-1519659528534-7fd733a832a0?w=800&q=80",
          "https://images.unsplash.com/photo-1518684079-3c830dcef6c0?w=800&q=80",
          "https://images.unsplash.com/photo-1605538108596-6953125b8ecf?w=800&q=80",
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
          "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80"
        ],
        description: "A world-class ski resort with views of the Affarwat peaks. Interiors designed to reflect Kashmiri heritage with raw timber and slate.",
        perks: ["Ski-in/Ski-out", "L'Occitane Spa", "Heated Indoor Pool", "Kashmiri Cuisine", "Gondola Access"],
        extraInfo: "Best visited in winter for skiing or summer for meadows.",
        checkIn: 14,
        checkOut: 12,
        maxGuests: 4,
        price: 650,
        owner: testUser._id
      },
      // --- South India ---
      {
        title: "Evolve Back, Coorg",
        address: "Karadigodu Post, Siddapura, Kodagu, Karnataka 571253, India",
        photos: [
          "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800&q=80",
          "https://images.unsplash.com/photo-1582236802146-5991807d9bb8?w=800&q=80",
          "https://images.unsplash.com/photo-1590523278191-995cbcda646b?w=800&q=80",
          "https://images.unsplash.com/photo-1576426863863-1002237072d6?w=800&q=80",
          "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80"
        ],
        description: "Set amidst a 300-acre coffee and spice plantation. Features 'Lily Pool' cottages and 'Heritage Pool' villas designed to reflect the local Kodava architecture.",
        perks: ["Coffee Plantation Walk", "Private Pool Villas", "Ayurvedic Spa", "Bird Watching", "Eco-friendly"],
        extraInfo: "Immersive plantation experience.",
        checkIn: 13,
        checkOut: 11,
        maxGuests: 5,
        price: 500,
        owner: testUser._id
      },
      {
        title: "Taj Falaknuma Palace, Hyderabad",
        address: "Engine Bowli, Falaknuma, Hyderabad, Telangana 500053, India",
        photos: [
          "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80",
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
          "https://images.unsplash.com/photo-1554647286-f365d7defc2d?w=800&q=80",
          "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800&q=80"
        ],
        description: "Perched 2,000 feet above Hyderabad, this 'Mirror of the Sky' palace was the residence of the Nizam. Arrive in a horse-drawn carriage and walk up the grand staircase.",
        perks: ["Horse Carriage Arrival", "Royal Dining Hall", "Library Replica", "Heritage Walk", "Hookah Lounge"],
        extraInfo: "Features the world's longest dining table.",
        checkIn: 14,
        checkOut: 12,
        maxGuests: 4,
        price: 950,
        owner: testUser._id
      },
      {
        title: "The Leela Kovalam, Kerala",
        address: "Kovalam Beach Road, Thiruvananthapuram, Kerala 695527, India",
        photos: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
          "https://images.unsplash.com/photo-1473116763249-5643194dbc02?w=800&q=80",
          "https://images.unsplash.com/photo-1615880480595-d5b9b4a41e6e?w=800&q=80",
          "https://images.unsplash.com/photo-1582610116397-edb318620f90?w=800&q=80",
          "https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=800&q=80"
        ],
        description: "India's only cliff-top beach resort. Offers panoramic views of the Kovalam coastline and the Arabian Sea. Famous for its infinity pools and club lounge.",
        perks: ["Cliff-top Views", "Infinity Pool", "Private Beach", "Club Lounge", "Seafood Grill"],
        extraInfo: "Direct access to the beach.",
        checkIn: 14,
        checkOut: 12,
        maxGuests: 3,
        price: 400,
        owner: testUser._id
      },
      {
        title: "Orange County (Evolve Back), Kabini",
        address: "Bheeramballi, Kakanakote, Karnataka 571116, India",
        photos: [
          "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
          "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
          "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80",
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
          "https://images.unsplash.com/photo-1549294413-26f195200c16?w=800&q=80"
        ],
        description: "Inspired by the Hadis or tribal villages, this resort is bordered on two sides by the Kabini River. Perfect for wildlife enthusiasts.",
        perks: ["Boat Safari", "Tribal Village Style", "Private Pool Huts", "Coracle Ride", "Night Trails"],
        extraInfo: "In the heart of elephant country.",
        checkIn: 13,
        checkOut: 11,
        maxGuests: 3,
        price: 550,
        owner: testUser._id
      },
      {
        title: "Palais de Mahe, Pondicherry",
        address: "4, Bussy St, White Town, Puducherry 605001, India",
        photos: [
          "https://images.unsplash.com/photo-1709805471116-26c5adf3012b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cG9uZGljaGVycnklMjBob3RlbHxlbnwwfHwwfHx8MA%3D%3D",
          "https://images.unsplash.com/photo-1568019672-026cc35bf75c?w=800&q=80",
          "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&q=80",
          "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80",
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
        ],
        description: "Located in the French Quarter, this hotel captures the spirit of colonial Pondicherry. Yellow walls, pillared verandahs, and period furniture.",
        perks: ["French Quarter", "Courtyard Pool", "Roof Terrace", "Cafe", "Colonial Charm"],
        extraInfo: "Walking distance to the Promenade Beach.",
        checkIn: 14,
        checkOut: 12,
        maxGuests: 2,
        price: 300,
        owner: testUser._id
      },
      // --- West & Central India ---
      {
        title: "Ahilya Fort, Maheshwar",
        address: "Ahilya Wada, Maheshwar, Madhya Pradesh 451224, India",
        photos: [
          "https://plus.unsplash.com/premium_photo-1691031429917-777e3123e30d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
          "https://images.unsplash.com/photo-1580977276076-ae079df92d77?w=800&q=80",
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
          "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80"
        ],
        description: "Perched high above the sacred Narmada River, Ahilya Fort offers a unique homestay experience in a 250-year-old fort. Known for its culinary excellence and weaving center.",
        perks: ["River Views", "Fort Stay", "Handloom Weaving", "Private Ghats", "Organic Food"],
        extraInfo: "A heritage hotel run by the descendants of the Holkar dynasty.",
        checkIn: 12,
        checkOut: 10,
        maxGuests: 2,
        price: 400,
        owner: testUser._id
      },
      {
        title: "Taj Exotica, Goa",
        address: "Calwaddo, Benaulim, Goa 403716, India",
        photos: [
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
          "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80"
        ],
        description: "Mediterranean-style resort located on the southwest coast of Goa. 56 acres of lush gardens and a 700-meter stretch of Benaulim beach.",
        perks: ["Private Beach", "Golf Course", "Ayurveda Spa", "Sea View Villas", "Water Sports"],
        extraInfo: "Perfect for a relaxed luxury beach vacation.",
        checkIn: 15,
        checkOut: 12,
        maxGuests: 4,
        price: 550,
        owner: testUser._id
      },
      {
        title: "The Machan, Lonavala",
        address: "Private Road, Atvan, Maharashtra 410401, India",
        photos: [
          "https://images.unsplash.com/photo-1674458230604-1470d0d3eae3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bG9uYXZhbCUyMGhvdGVsfGVufDB8fDB8fHww",
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
          "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80",
          "https://images.unsplash.com/photo-1518684079-3c830dcef6c0?w=800&q=80"
        ],
        description: "An exclusive eco-resort with unique treehouses rising 30-45 feet above the forest floor. Runs on 100% sustainable energy.",
        perks: ["Treehouses", "Forest Views", "Eco-friendly", "Trekking", "Bonfire"],
        extraInfo: "Disconnect from the city in this forest sanctuary.",
        checkIn: 14,
        checkOut: 11,
        maxGuests: 4,
        price: 350,
        owner: testUser._id
      },
      // --- East & North East ---
      {
        title: "Glenburn Tea Estate, Darjeeling",
        address: "Singritan, Darjeeling, West Bengal 734101, India",
        photos: [
          "https://images.unsplash.com/photo-1743018695410-806c64a3683d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGFyamVlbGluZyUyMGhvdGVsfGVufDB8fDB8fHww",
          "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800&q=80",
          "https://images.unsplash.com/photo-1598555726325-3b47fa43f773?w=800&q=80",
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
          "https://images.unsplash.com/photo-1570535352824-73898fdcb594?w=800&q=80"
        ],
        description: "A heavenly plantation retreat that lies on a hillock above the banks of the River Rungeet. Stay in a colonial planter's bungalow with Kanchenjunga views.",
        perks: ["Tea Tasting", "Mount Kanchenjunga View", "Fishing", "Hiking", "Planters Bungalow"],
        extraInfo: "All-inclusive stay with tea garden tours.",
        checkIn: 12,
        checkOut: 10,
        maxGuests: 4,
        price: 600,
        owner: testUser._id
      },
      {
        title: "Ri Kynjai, Meghalaya",
        address: "Umniuh Khwan, UCC Road, Ri Bhoi District, Meghalaya 793103, India",
        photos: [
          "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
          "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80"
        ],
        description: "Meaning 'Serenity by the Lake', this resort features Khasi-style architecture with upturned roofs. Overlooks the majestic Umiam Lake.",
        perks: ["Lake View", "Khasi Architecture", "Spa", "Boating", "Nature Walks"],
        extraInfo: "Gateway to the abode of clouds.",
        checkIn: 14,
        checkOut: 12,
        maxGuests: 3,
        price: 250,
        owner: testUser._id
      },
      // --- Iconic Originals ---
      {
        title: "Taj Lake Palace, Udaipur",
        address: "Pichola, Udaipur, Rajasthan 313001, India",
        photos: [
          "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80",
          "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&q=80",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
          "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=800&q=80",
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80"
        ],
        description: "Experience the grandeur of the Taj Lake Palace, a floating vision in white marble on Lake Pichola. Originally built as a pleasure palace.",
        perks: ["Lake View", "Royal Butler Service", "Heritage Spa", "Fine Dining", "Boat Transfers", "Swimming Pool"],
        extraInfo: "Access is by boat only. Dress code applies for dinner restaurants.",
        checkIn: 14,
        checkOut: 12,
        maxGuests: 3,
        price: 850,
        owner: testUser._id
      },
      {
        title: "The Oberoi Amarvilas, Agra",
        address: "Taj East Gate Road, Paktola, Tajganj, Agra, Uttar Pradesh 282001, India",
        photos: [
          "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
          "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
          "https://images.unsplash.com/photo-1600596542815-3ad19eb6a2f7?w=800&q=80"
        ],
        description: "Enjoy an unrestricted view of the Taj Mahal from every room. The Oberoi Amarvilas offers a blend of Moorish and Mughal architecture, terraced lawns, fountains, and reflection pools.",
        perks: ["Taj Mahal View", "Private Balconies", "Ayurvedic Spa", "Terraced Lawns", "Pool", "Free Wifi"],
        extraInfo: "Golf cart transfers to the Taj Mahal are available for guests.",
        checkIn: 14,
        checkOut: 12,
        maxGuests: 4,
        price: 950,
        owner: testUser._id
      },
      {
        title: "Rambagh Palace, Jaipur",
        address: "Bhawani Singh Rd, Rambagh, Jaipur, Rajasthan 302005, India",
        photos: [
          "https://media.istockphoto.com/id/152000294/photo/city-palace-in-karauli.webp?a=1&b=1&s=612x612&w=0&k=20&c=eDAWlawMsoAwyzpslKh-QHzNtpdzX3Tg-vZDu-o7XNM=",
          "https://images.unsplash.com/photo-1590766940554-634a7ed41450?w=800&q=80",
          "https://images.unsplash.com/photo-1549294413-26f195200c16?w=800&q=80",
          "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80"
        ],
        description: "Walk in the footsteps of Maharajas at the 'Jewel of Jaipur', the Rambagh Palace. Adorned with rich textures, hand-painted wall motifs, and manicured gardens.",
        perks: ["Peacock Gardens", "Polo Bar", "Jiva Grande Spa", "Vintage Car Rides", "Indoor & Outdoor Pools"],
        extraInfo: "The palace was the former residence of the Maharaja of Jaipur.",
        checkIn: 14,
        checkOut: 12,
        maxGuests: 4,
        price: 700,
        owner: testUser._id
      },
      {
        title: "Kumarakom Lake Resort, Kerala",
        address: "North Post, Vayitharamattom, Kumarakom, Kerala 686563, India",
        photos: [
          "https://images.unsplash.com/photo-1708515905649-477068d77781?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8a2VyZWxhJTIwbGFrZSUyMHJlc29ydHxlbnwwfHwwfHx8MA%3D%3D",
          "https://images.unsplash.com/photo-1580835845971-a393b73bf378?w=800&q=80",
          "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800&q=80",
          "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?w=800&q=80",
          "https://images.unsplash.com/photo-1590483015486-da7189255e42?w=800&q=80"
        ],
        description: "Nestled on the banks of Vembanad Lake, this resort is a fine blend of Kerala's traditional architectural charm and modern luxury.",
        perks: ["Backwater Cruises", "Ayurveda Center", "Private Pools", "Traditional Houseboats", "Seafood Restaurant"],
        extraInfo: "Sunset cruise on the backwaters is a must-do experience.",
        checkIn: 13,
        checkOut: 11,
        maxGuests: 5,
        price: 450,
        owner: testUser._id
      },
      {
        title: "The Taj Mahal Palace, Mumbai",
        address: "Apollo Bunder, Colaba, Mumbai, Maharashtra 400001, India",
        photos: [
          "https://images.unsplash.com/photo-1751608734207-1c68d53554b4?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
          "https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80",
          "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800&q=80",
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
        ],
        description: "A flagship of Indian hospitality, The Taj Mahal Palace overlooks the Gateway of India and the Arabian Sea. Since 1903, it has hosted kings, dignitaries, and celebrities.",
        perks: ["Sea View", "Butler Service", "Jiva Spa", "10 Restaurants", "Luxury Shopping"],
        extraInfo: "Located in the heart of Colaba, close to historical landmarks.",
        checkIn: 14,
        checkOut: 12,
        maxGuests: 4,
        price: 550,
        owner: testUser._id
      }
    ];

    await Place.insertMany(samplePlaces);
    log(`Added ${samplePlaces.length} sample places`);

    log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    log('Error seeding database: ' + error);
    process.exit(1);
  }
}

seedDatabase();