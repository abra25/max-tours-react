export interface Destination {
  slug: string;
  image: string;
  region: string;
  title: string;
  description: string;
  icon: string;
  highlights: string[];
}

export const DESTINATIONS: Destination[] = [

  // =====================================================
  // ZANZIBAR
  // =====================================================

  {
    slug: 'stone-town',
    image: '/img/stone-town-1.png',
    region: 'ZANZIBAR',
    title: 'Stone Town',
    description:
      'Wander through historic streets, Swahili architecture and centuries of culture in Zanzibar’s UNESCO-listed heart.',
    icon: 'fa-landmark',
    highlights: [
      'UNESCO World Heritage Site',
      'Swahili & Arabian architecture',
      'Historic cultural experiences'
    ]
  },

  {
    slug: 'mnemba-island',
    image: '/img/mnemba.jpeg',
    region: 'ZANZIBAR',
    title: 'Mnemba Island',
    description:
      'Discover crystal-clear waters, vibrant marine life and unforgettable snorkeling experiences around Zanzibar’s iconic island.',
    icon: 'fa-water',
    highlights: [
      'World-class snorkeling',
      'Dolphin experiences',
      'Crystal-clear Indian Ocean'
    ]
  },

  {
    slug: 'jozani-forest',
    image: '/img/Jozni forest.jpeg',
    region: 'ZANZIBAR',
    title: 'Jozani Forest',
    description:
      'Explore Zanzibar’s lush tropical forest and encounter the rare red colobus monkeys in their natural habitat.',
    icon: 'fa-leaf',
    highlights: [
      'Red colobus monkeys',
      'Tropical forest trails',
      'Nature & conservation'
    ]
  },

  {
    slug: 'nakupenda-beach',
    image: '/img/nakupenda_bech-1.jpeg',
    region: 'ZANZIBAR',
    title: 'Nakupenda Beach',
    description:
      'Escape to a stunning sandbank surrounded by turquoise waters, perfect for swimming, relaxing and ocean adventures.',
    icon: 'fa-umbrella-beach',
    highlights: [
      'White sandbank',
      'Turquoise ocean',
      'Swimming & relaxation'
    ]
  },
  {
  slug: 'salam-cave',
  image: '/img/salam-cave.png',
  region: 'ZANZIBAR',
  title: 'Salam Cave',
  description:
    'Discover the fascinating Salam Cave, a hidden natural wonder where you can explore underground chambers, swim in crystal-clear waters and experience one of Zanzibar’s unique cave adventures.',
  icon: 'fa-water',
  highlights: [
    'Underground cave exploration',
    'Crystal-clear natural pools',
    'Unique Zanzibar experience'
  ]
},

{
  slug: 'Kuza-cave',
  image: '/img/Kuza Cave.jpeg',
  region: 'ZANZIBAR',
  title: 'Kuza Cave',
  description:
    'Step into the mysterious Zuza Cave and discover a remarkable natural attraction surrounded by Zanzibar’s tropical landscape, perfect for adventure, exploration and memorable local experiences.',
  icon: 'fa-mountain',
  highlights: [
    'Natural cave exploration',
    'Local hidden gem',
    'Adventure and photography'
  ]
},

  {
    slug: 'prison-island',
    image: '/img/prison-1.jpeg',
    region: 'ZANZIBAR',
    title: 'Prison Island',
    description:
      'Visit a beautiful island near Stone Town, meet giant tortoises and enjoy the clear tropical waters of Zanzibar.',
    icon: 'fa-turtle',
    highlights: [
      'Giant Aldabra tortoises',
      'Island exploration',
      'Snorkeling opportunities'
    ]
  },

  {
    slug: 'paje-beach',
    image: '/img/paje.jpeg',
    region: 'ZANZIBAR',
    title: 'Paje Beach',
    description:
      'Relax on one of Zanzibar’s most beautiful beaches, famous for its powder-white sand, turquoise waters and kitesurfing.',
    icon: 'fa-wind',
    highlights: [
      'Kitesurfing',
      'Beautiful white beaches',
      'Relaxed coastal atmosphere'
    ]
  },

  {
    slug: 'safari-blue',
    image: '/img/safari-blue-2.jpeg',
    region: 'ZANZIBAR',
    title: 'Safari Blue',
    description:
      'Experience an unforgettable full-day marine adventure with dhow sailing, snorkeling, seafood and tropical islands.',
    icon: 'fa-sailboat',
    highlights: [
      'Traditional dhow cruise',
      'Snorkeling & swimming',
      'Seafood & tropical fruits'
    ]
  },

  {
    slug: 'spice-tour',
    image: '/img/spice-3.png',
    region: 'ZANZIBAR',
    title: 'Spice Farm',
    description:
      'Discover why Zanzibar is known as the Spice Island through an authentic journey into its farms, traditions and flavors.',
    icon: 'fa-seedling',
    highlights: [
      'Authentic spice farms',
      'Local traditions',
      'Taste fresh tropical spices'
    ]
  },

  // =====================================================
  // TANZANIA
  // =====================================================

  {
    slug: 'serengeti',
    image: '/img/serengeti.jpeg',
    region: 'NORTHERN TANZANIA',
    title: 'Serengeti',
    description:
      'Endless golden plains, extraordinary wildlife and the legendary Great Migration make Serengeti one of Africa’s greatest safari destinations.',
    icon: 'fa-paw',
    highlights: [
      'Great Wildebeest Migration',
      'Big Five wildlife',
      'Endless African savannah'
    ]
  },

  {
    slug: 'ngorongoro-crater',
    image: '/img/Ngorongoro creater.jpg',
    region: 'NORTHERN TANZANIA',
    title: 'Ngorongoro Crater',
    description:
      'A breathtaking natural wonder where dramatic landscapes meet some of Africa’s richest wildlife in an extraordinary volcanic setting.',
    icon: 'fa-mountain-sun',
    highlights: [
      'Ngorongoro Crater',
      'Rich wildlife ecosystem',
      'Spectacular landscapes'
    ]
  },

  {
    slug: 'mount-kilimanjaro',
    image: '/img/Mount Kilimanjaro National Park.jpeg',
    region: 'NORTHERN TANZANIA',
    title: 'Mount Kilimanjaro',
    description:
      'Stand beneath Africa’s highest mountain and experience spectacular landscapes, changing climates and unforgettable trekking adventures.',
    icon: 'fa-mountain',
    highlights: [
      'Africa’s highest mountain',
      'Mountain trekking',
      'Spectacular viewpoints'
    ]
  },

  {
    slug: 'nyerere-national-park',
    image: '/img/nyerere.jpg',
    region: 'SOUTHERN TANZANIA',
    title: 'Nyerere National Park',
    description:
      'Escape into vast wilderness, peaceful rivers and rich wildlife for an authentic safari experience away from the crowds.',
    icon: 'fa-binoculars',
    highlights: [
      'Boat safari experiences',
      'Wild African wilderness',
      'Rich wildlife diversity'
    ]
  },

  {
    slug: 'mikumi-national-park',
    image: '/img/mikumi.jpeg',
    region: 'SOUTHERN TANZANIA',
    title: 'Mikumi National Park',
    description:
      'Discover accessible wildlife adventures across open plains where elephants, giraffes, lions and other African wildlife roam.',
    icon: 'fa-paw',
    highlights: [
      'Wildlife safaris',
      'Elephants & giraffes',
      'Accessible safari destination'
    ]
  }

];