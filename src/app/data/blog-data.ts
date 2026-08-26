export interface BlogPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  heroImage: string;
  author: string;
  date: string;
  readTime: string;
  icon: string;

  sections: {
    heading: string;
    text: string;
    image?: string;
  }[];

  highlights: string[];
}

export const BLOG_POSTS: BlogPost[] = [

  {
    slug: 'why-zanzibar',
    category: 'TRAVEL GUIDE',
    title: 'Why Zanzibar Is The Perfect Holiday Destination',
    excerpt:
      'Discover why Zanzibar continues to attract travelers with its beautiful beaches, rich culture, historic towns and unforgettable island experiences.',
    heroImage: '/img/why.jpeg',
    author: 'Max Tour & Safari',
    date: 'August 2026',
    readTime: '5 min read',
    icon: 'fa-umbrella-beach',

    sections: [
      {
        heading: 'A Destination With Something For Everyone',
        text:
          'Zanzibar brings together beautiful beaches, warm Indian Ocean waters, fascinating history and authentic Swahili culture. Whether you are looking for relaxation, romance or adventure, the island offers experiences for different types of travelers.',
        image: '/img/beach.png'
      },

      {
        heading: 'Beautiful Beaches & Ocean Experiences',
        text:
          'From the peaceful beaches of Matemwe and Nungwi to the spectacular waters around Mnemba Island, Zanzibar offers unforgettable coastal experiences. Visitors can swim, snorkel, enjoy dhow cruises or simply relax beside the ocean.',
        image: '/img/Mnemba Island.jpeg'
      },

      {
        heading: 'Culture, History & Stone Town',
        text:
          'Beyond the beaches, Zanzibar has a fascinating cultural heritage. Stone Town, a UNESCO World Heritage Site, offers narrow streets, historic buildings, carved doors, markets and stories influenced by African, Arab, Indian and European cultures.',
        image: '/img/pafect.jpeg'
      },

      {
        heading: 'The Perfect Escape',
        text:
          'The combination of natural beauty, culture, adventure and hospitality makes Zanzibar a memorable holiday destination. It is a place where travelers can slow down, explore and create experiences that stay with them long after the trip.'
      }
    ],

    highlights: [
      'Beautiful white-sand beaches',
      'Rich Swahili culture',
      'Stone Town heritage',
      'World-class snorkeling',
      'Romantic island experiences'
    ]
  },

  {
    slug: 'historical-zanzibar',
    category: 'CULTURE & HISTORY',
    title: 'Historical Sites You Must Visit In Zanzibar',
    excerpt:
      'Step beyond the beaches and discover Stone Town, the Old Fort, Forodhani Gardens and the historic places that shaped Zanzibar.',
    heroImage: '/img/hist.jpeg',
    author: 'Max Tour & Safari',
    date: 'August 2026',
    readTime: '6 min read',
    icon: 'fa-landmark',

    sections: [
      {
        heading: 'Stone Town',
        text:
          'Stone Town is the cultural heart of Zanzibar. Its narrow streets, historic buildings and beautifully carved wooden doors reflect centuries of Swahili, Arab, Indian and European influence.',
        image: '/img/stone-town-2.jpeg'
      },

      {
        heading: 'The Old Fort',
        text:
          'The Old Fort stands beside the Stone Town waterfront and is one of Zanzibar’s best-known historic landmarks. Today it is a lively cultural space with local art, events and shops.',
        image: '/img/old-fort.jpeg'
      },

      {
        heading: 'Forodhani Gardens',
        text:
          'When the sun goes down, Forodhani Gardens becomes one of Stone Town’s most vibrant places. Local vendors serve seafood, Zanzibar pizza, sugarcane juice and other popular Swahili treats.',
        image: '/img/foro.jpg'
      },

      {
        heading: 'A Journey Through Zanzibar History',
        text:
          'Exploring these sites gives visitors a deeper understanding of Zanzibar and the people, cultures and events that have shaped the island over generations.'
      }
    ],

    highlights: [
      'Stone Town',
      'Old Fort',
      'Forodhani Gardens',
      'Historic architecture',
      'Swahili heritage'
    ]
  },

  {
    slug: 'island-adventures',
    category: 'ADVENTURE & OCEAN',
    title: 'Best Island Trips & Ocean Adventures In Zanzibar',
    excerpt:
      'Explore turquoise waters, hidden sandbanks, coral reefs and unforgettable island adventures around Zanzibar.',
    heroImage: '/img/island.jpeg',
    author: 'Max Tour & Safari',
    date: 'August 2026',
    readTime: '6 min read',
    icon: 'fa-water',

    sections: [
      {
        heading: 'Mnemba Island',
        text:
          'Mnemba Island is famous for its clear waters and beautiful marine life. Snorkeling around the island gives visitors the opportunity to see colorful fish and coral reefs in a spectacular tropical environment.',
        image: '/img/island.jpeg'
      },

      {
        heading: 'Safari Blue',
        text:
          'Safari Blue is a full-day ocean adventure combining dhow sailing, snorkeling, sandbanks, swimming and a delicious seafood experience. It is one of Zanzibar’s most popular marine excursions.',
        image: '/img/c (167).jpeg'
      },

      {
        heading: 'Prison Island & Nakupenda',
        text:
          'Prison Island offers history and encounters with giant tortoises, while Nakupenda is famous for its beautiful white sandbank surrounded by turquoise water.',
        image: '/img/Nakupenda Beach.jpeg'
      },

      {
        heading: 'Dolphin Experiences',
        text:
          'For travelers interested in marine life, dolphin excursions offer another exciting way to experience Zanzibar’s coastline and surrounding waters.'
      }
    ],

    highlights: [
      'Mnemba snorkeling',
      'Safari Blue',
      'Prison Island',
      'Nakupenda Sandbank',
      'Dolphin experiences'
    ]
  },

  {
    slug: 'spice-culture',
    category: 'CULTURE & FOOD',
    title: 'Discover The Spice & Flavours Of Zanzibar',
    excerpt:
      'Explore why Zanzibar is known as the Spice Island and experience the aromas, food and traditions that make the island unique.',
    heroImage: '/img/spice-1.jpeg',
    author: 'Max Tour & Safari',
    date: 'August 2026',
    readTime: '5 min read',
    icon: 'fa-pepper-hot',

    sections: [
      {
        heading: 'Welcome To The Spice Island',
        text:
          'Zanzibar has long been associated with cloves, cinnamon, cardamom, vanilla and many other spices. A spice tour provides a fascinating introduction to the plants and traditions behind these famous flavours.',
        image: '/img/spice-1.jpeg'
      },

      {
        heading: 'From Farm To Table',
        text:
          'During a spice experience, visitors can learn how different spices are grown, harvested and used in local cuisine. The tour is not only about seeing plants but also understanding their importance to Zanzibar’s culture and economy.'
      },

      {
        heading: 'Traditional Zanzibar Flavours',
        text:
          'Zanzibar’s food reflects the island’s diverse history. Swahili dishes combine African traditions with Indian, Arab and coastal influences, creating rich flavours that are an important part of the travel experience.'
      },

      {
        heading: 'Experience It Yourself',
        text:
          'A spice tour becomes even more memorable when combined with a traditional cooking class, allowing visitors to discover local ingredients and enjoy authentic Zanzibar flavours.'
      }
    ],

    highlights: [
      'Cloves & cinnamon',
      'Local spice farms',
      'Swahili cuisine',
      'Traditional cooking',
      'Authentic local experience'
    ]
  }

];