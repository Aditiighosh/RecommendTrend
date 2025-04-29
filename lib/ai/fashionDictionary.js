// Map fashion terms to numerical IDs
export const FASHION_DICTIONARY = {
  // Clothing
  'dress': 1,
  'shirt': 2,
  'pants': 3,
  't-shirt': 4,
  'blouse': 5,
  'sweater': 6,
  'hoodie': 7,
  'jacket': 8,
  'coat': 9,
  'suit': 10,
  'blazer': 11,
  'vest': 12,
  'jeans': 13,
  'shorts': 14,
  'skirt': 15,
  'leggings': 16,
  'jumpsuit': 17,
  'overalls': 18,
  'sweatshirt': 19,
  'cardigan': 20,
  'tank top': 21,
  'crop top': 22,
  'bodysuit': 23,
  'kimono': 24,
  'tunic': 25,
  
  // Footwear
  'footwear': 26,
  'shoes': 26, // alias
  'sneakers': 27,
  'boots': 28,
  'sandals': 29,
  'heels': 30,
  'flats': 31,
  'loafers': 32,
  'oxfords': 33,
  'slippers': 34,
  'athletic shoes': 35,
  
  // Accessories
  'handbag': 36,
  'purse': 37,
  'backpack': 38,
  'clutch': 39,
  'wallet': 40,
  'belt': 41,
  'scarf': 42,
  'hat': 43,
  'cap': 44,
  'beanie': 45,
  'gloves': 46,
  'sunglasses': 47,
  'eyewear': 48,
  'tie': 49,
  'bowtie': 50,
  'jewelry': 51,
  'necklace': 52,
  'bracelet': 53,
  'ring': 54,
  'earrings': 55,
  'watch': 56,
  
  // Undergarments
  'bra': 57,
  'underwear': 58,
  'boxers': 59,
  'briefs': 60,
  'socks': 61,
  'pantyhose': 62,
  'lingerie': 63,
  
  // Swimwear
  'swimsuit': 64,
  'bikini': 65,
  'trunks': 66,
  
  // Specialized
  'uniform': 67,
  'costume': 68,
  'gown': 69,
  'robe': 70,
  'pajamas': 71,
  
  // Materials/patterns (sometimes detected as separate labels)
  'denim': 72,
  'leather': 73,
  'silk': 74,
  'cotton': 75,
  'wool': 76,
  'plaid': 77,
  'striped': 78,
  'polka dot': 79,
  'floral': 80,

  // Indian Traditional Wear (New Additions)
  'saree': 81,
  'sari': 81, // alternate spelling
  'lehenga': 82,
  'lehenga choli': 83,
  'choli': 84,
  'salwar kameez': 85,
  'salwar suit': 86,
  'kameez': 87,
  'kurta': 88,
  'kurta pajama': 89,
  'sherwani': 90,
  'dhoti': 91,
  'lungi': 92,
  'veshti': 93, // South Indian dhoti
  'mundu': 94, // Kerala dhoti
  'angavastram': 95, // Shawl worn with dhoti
  'bandhgala': 96, // Formal Indian jacket
  'nehru jacket': 97,
  'dupatta': 98, // Scarf/stole
  'odhani': 99, // Similar to dupatta
  'ghagra': 100, // Similar to lehenga
  'patiala salwar': 101, // Loose Punjabi salwar
  'churidar': 102, // Tight-fitting salwar
  'pallu': 103, // Draped part of a saree
  'zari work': 104, // Gold/silver embroidery
  'kanjeevaram': 105, // Silk saree type
  'banarasi': 106, // Silk saree type
  'bandhani': 107, // Tie-dye fabric
  'phulkari': 108, // Punjabi embroidery
  'kalamkari': 109, // Hand-painted fabric
  'ikkat': 110, // Weaving technique
  'ajrak': 111, // Block-printed shawl
  'mojari': 112, // Traditional Indian shoes
  'jutti': 113, // Punjabi footwear
  'kolhapuri chappal': 114, // Maharashtra sandals
  'payal': 115, // Anklet
  'bindi': 116, // Forehead decoration
  'maang tikka': 117, // Head jewelry
  'nath': 118, // Nose ring
  'haar': 119, // Necklace (Hindi)
  'baju band': 120, // Armlet
  'kamarband': 121, // Waist belt
  'pashmina': 122, // Cashmere shawl
  'banarasi silk': 123,
  'chanderi': 124, // Lightweight fabric
  'kurti': 125, // Shorter kurta
  'palazzo': 126, // Wide-legged pants
  'anarkali': 127, // Flowy long dress
  'gota patti': 128, // Ribbon embroidery
  'temple jewelry': 129, // Traditional South Indian jewelry
  'jhumka': 130, // Bell-shaped earrings

  // --- Fabric Patterns & Prints ---
  'stripes': 131,
  'striped': 131, // alternate
  'polka dots': 132,
  'polka dot': 132, // alternate
  'floral': 133,
  'floral print': 133, // alternate
  'geometric': 134,
  'geometric pattern': 134, // alternate
  'chevron': 135,
  'zigzag': 136,
  'houndstooth': 137,
  'paisley': 138, // Common in Indian textiles
  'buta': 138, // Indian name for paisley
  'abstract': 139,
  'tie-dye': 140,
  'batik': 141, // Common in Indian/Indonesian prints
  'ikat': 142, // Common in Indian/Southeast Asian textiles
  'damask': 143,
  'herringbone': 144,
  'argyle': 145,
  'plaid': 146,
  'checkered': 147,
  'gingham': 148,
  'tartan': 149,
  'camouflage': 150,
  'animal print': 151,
  'leopard print': 152,
  'zebra print': 153,
  'snakeskin print': 154,
  'tribal': 155,
  'ethnic print': 156,
  'block print': 157, // Common in Indian textiles
  'ajrakh': 158, // Indian/Pakistani block print
  'kalamkari': 159, // Hand-painted Indian pattern
  'bandhani': 160, // Indian tie-dye
  'phulkari': 161, // Punjabi embroidery pattern
  'chikankari': 162, // Lucknowi embroidery
  'zardozi': 163, // Gold/silver embroidery
  'madhubani': 164, // Indian folk art pattern
  'warli': 165, // Tribal art pattern
  'kantha': 166, // Bengali stitch pattern
  'gotapatti': 167, // Rajasthani ribbon work
  'jacquard': 168, // Woven fabric pattern
  'brocade': 169, // Heavy decorative fabric
  'lace': 170,
  'embroidery': 171,
  'sequins': 172,
  'mirror work': 173, // Common in Indian garments
  'thread work': 174,
  'stone work': 175,
  'patchwork': 176,
  'ombre': 177,
  'gradient': 178,
  'digital print': 179,
  'sublimation print': 180,
  'watercolor print': 181,
  'cartoon print': 182,
  'graphic print': 183,
  'letter print': 184,
  'logo print': 185,
  'vintage print': 186,
  'marble print': 187,
  'metallic': 188,
  'glitter': 189,
  'sheer': 190,
  'transparent': 191,
  'jacquard pattern': 192,
  'flock print': 193,
  'foil print': 194,
  'neon': 195,
  'rainbow': 196,
  'a-line': 197,
  'active pants':198,
  "active shirt" : 199,
  "active shorts": 200,
  "active tank" : 201,
  "active undergarment": 202,
  "advertising": 203,
  "analog watch": 204,
  "bermuda shorts": 205,
  "bikini": 206,
  "camisole": 207,
  "cargo pants": 208,
  "cargo shorts": 209,
  
};