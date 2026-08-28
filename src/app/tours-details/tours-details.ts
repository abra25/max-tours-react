import {
  Component,
  HostListener,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';


interface TourDetails {

  id: number;

  slug: string;

  title: string;

  category: string;

  categoryLabel: string;

  location: string;

  duration: string;

  price: string;

  description: string;

  icon: string;

  image: string;

  gallery: string[];

}


@Component({

  selector: 'app-tours-details',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  styleUrl: './tours-details.css',

  templateUrl: './tours-details.html'

})
export class ToursDetails implements OnInit {


  // =========================================================
  // PAGE
  // =========================================================

  currentYear =
    new Date().getFullYear();

  showBackTop = false;


  // =========================================================
  // TOUR
  // =========================================================

  tour?: TourDetails;


  // =========================================================
  // DATA
  // =========================================================

  tours: TourDetails[] = [

    {
      id: 33,
      slug: 'tanzania-safari',
      title: 'Tanzania Safari',
      category: 'holiday_package',
      categoryLabel: 'TANZANIA SAFARI',
      location: 'Tanzania',
      duration: '3 Days / 2 Nights',
      price: '$400',
      description:
        'Experience Tanzania’s incredible wildlife, breathtaking landscapes and unforgettable safari moments.',
      icon: 'fa-binoculars',
      image: '/img/safari-1.jpeg',
      gallery: [
        '/img/safari-1.jpeg',
        '/img/safari.jpeg',
        '/img/safari-2.jpeg'
      ]
    },

    {
      id: 32,
      slug: '11-days-tanzania-zanzibar',
      title: '11 Days Tanzania & Zanzibar',
      category: 'holiday_package',
      categoryLabel: 'MULTI-DESTINATION',
      location: 'Tanzania & Zanzibar',
      duration: '11 Days',
      price: '$3,200',
      description:
        'A complete African escape combining unforgettable wildlife adventures with the tropical beauty of Zanzibar.',
      icon: 'fa-route',
      image: '/img/safari-3.jpeg',
      gallery: [
        '/img/safari-3.jpeg',
        '/img/znz-1.jpeg',
        '/img/safari-4.jpeg'
      ]
    },

    {
      id: 29,
      slug: '6-days-zanzibar-holidays',
      title: '6 Days Zanzibar Holidays',
      category: 'holiday_package',
      categoryLabel: 'ZANZIBAR HOLIDAY',
      location: 'Zanzibar',
      duration: '6 Days / 5 Nights',
      price: '$350',
      description:
        'Relax, explore and experience the best of Zanzibar with beautiful beaches, culture and island adventures.',
      icon: 'fa-umbrella-beach',
      image: '/img/holiday-1.png',
      gallery: [
        '/img/holiday-1.png',
        '/img/holiday-2.jpeg',
        '/img/holiday-3.jpeg'
      ]
    },

    {
      id: 28,
      slug: 'prison-island-nakupenda-beach',
      title: 'Prison Island & Nakupenda Beach',
      category: 'day_tour',
      categoryLabel: 'BEACH ESCAPE',
      location: 'Zanzibar',
      duration: 'Full Day',
      price: '$65',
      description:
        'Combine a visit to Prison Island with the stunning Nakupenda sandbank for a perfect day in paradise.',
      icon: 'fa-island-tropical',
      image: '/img/nakupenda_bech.jpeg',
      gallery: [
        '/img/nakupenda_bech.jpeg',
        '/img/c (224).jpeg',
        '/img/Blue Safari Trip Zanzibar.jpeg'
      ]
    },

    {
      id: 27,
      slug: 'spice-tour-cooking-class',
      title: 'Spice Tour with Cooking Class',
      category: 'day_tour',
      categoryLabel: 'CULTURE & FOOD',
      location: 'Zanzibar',
      duration: '3 Hours',
      price: '$40',
      description:
        'Discover Zanzibar’s famous spices and learn how local dishes are prepared in an authentic cooking experience.',
      icon: 'fa-utensils',
      image: '/img/spice-1.jpeg',
      gallery: [
        '/img/spice-1.jpeg',
        '/img/c (153).jpeg',
        '/img/c (105).jpeg'
      ]
    },

    {
      id: 26,
      slug: 'prison-island',
      title: 'Prison Island',
      category: 'day_tour',
      categoryLabel: 'ISLAND ADVENTURE',
      location: 'Zanzibar',
      duration: '3 Hours',
      price: '$55',
      description:
        'Visit historic Prison Island, discover its giant tortoises and enjoy beautiful views across the Indian Ocean.',
      icon: 'fa-island-tropical',
      image: '/img/1 (1).jpeg',
      gallery: [
        '/img/1 (1).jpeg',
        '/img/c (302).jpeg',
        '/img/c (224).jpeg'
      ]
    },

    {
      id: 25,
      slug: 'sunset-dhow-cruise',
      title: 'Sunset Dhow Cruise',
      category: 'day_tour',
      categoryLabel: 'OCEAN EXPERIENCE',
      location: 'Zanzibar',
      duration: '2 Hours',
      price: '$35',
      description:
        'Sail into a beautiful Zanzibar sunset aboard a traditional dhow while enjoying the calm Indian Ocean.',
      icon: 'fa-sailboat',
      image: '/img/g3.jpeg',
      gallery: [
        '/img/g3.jpeg',
        '/img/g7.jpeg',
        '/img/g10.jpeg'
      ]
    },

    {
      id: 24,
      slug: 'village-tour',
      title: 'Village Tour',
      category: 'day_tour',
      categoryLabel: 'LOCAL CULTURE',
      location: 'Zanzibar',
      duration: '3 Hours',
      price: '$30',
      description:
        'Meet local communities and discover everyday island life, traditions, crafts and authentic Swahili culture.',
      icon: 'fa-people-group',
      image: '/img/c (260).jpeg',
      gallery: [
        '/img/c (260).jpeg',
        '/img/c (278).jpeg',
        '/img/c (267).jpeg'
      ]
    },

    {
      id: 23,
      slug: 'local-fishing-trip',
      title: 'Local Fishing Trip',
      category: 'day_tour',
      categoryLabel: 'LOCAL EXPERIENCE',
      location: 'Zanzibar',
      duration: '6 Hours',
      price: '$50',
      description:
        'Experience traditional Zanzibar fishing and spend an unforgettable day on the water with local fishermen.',
      icon: 'fa-fish',
      image: '/img/c (193).jpeg',
      gallery: [
        '/img/c (193).jpeg',
        '/img/c (252).jpeg',
        '/img/c (93).jpeg'
      ]
    },

    {
      id: 22,
      slug: 'jozani-forest',
      title: 'Jozani Forest',
      category: 'day_tour',
      categoryLabel: 'NATURE & WILDLIFE',
      location: 'Zanzibar',
      duration: '3 Hours',
      price: '$40',
      description:
        'Explore Zanzibar’s lush tropical forest and encounter the rare red colobus monkeys in their natural habitat.',
      icon: 'fa-leaf',
      image: '/img/Jozni forest.jpeg',
      gallery: [
        '/img/Jozni forest.jpeg',
        '/img/c (193).jpeg',
        '/img/c (302).jpeg'
      ]
    },

    {
      id: 20,
      slug: 'blue-safari',
      title: 'Blue Safari',
      category: 'day_tour',
      categoryLabel: 'OCEAN ADVENTURE',
      location: 'Zanzibar',
      duration: 'Full Day',
      price: '$55',
      description:
        'Sail across Zanzibar’s turquoise waters, discover hidden sandbanks and enjoy an unforgettable marine adventure.',
      icon: 'fa-water',
      image: '/img/Blue Safari Trip Zanzibar.jpeg',
      gallery: [
        '/img/Blue Safari Trip Zanzibar.jpeg',
        '/img/c (224).jpeg',
        '/img/Mnemba Atoll Trip.jpeg'
      ]
    },

    {
      id: 19,
      slug: 'dolphin-tour',
      title: 'Dolphin Tour',
      category: 'day_tour',
      categoryLabel: 'MARINE EXPERIENCE',
      location: 'Zanzibar',
      duration: '3 Hours',
      price: '$50',
      description:
        'Set out into the Indian Ocean for an exciting dolphin experience surrounded by Zanzibar’s beautiful coastal scenery.',
      icon: 'fa-fish',
      image: '/img/c (302).jpeg',
      gallery: [
        '/img/c (302).jpeg',
        '/img/Mnemba Atoll Trip.jpeg',
        '/img/c (224).jpeg'
      ]
    },

    {
      id: 18,
      slug: 'spice-farm-tour',
      title: 'Spice Farm Tour',
      category: 'day_tour',
      categoryLabel: 'SPICE EXPERIENCE',
      location: 'Zanzibar',
      duration: '3 Hours',
      price: '$30',
      description:
        'Walk through Zanzibar’s famous spice farms and discover the aromas, flavours and traditions of the Spice Island.',
      icon: 'fa-seedling',
      image: '/img/c (153).jpeg',
      gallery: [
        '/img/c (153).jpeg',
        '/img/spice-1.jpeg',
        '/img/c (105).jpeg'
      ]
    },

    {
      id: 17,
      slug: 'stone-town-tour',
      title: 'Stone Town Tour',
      category: 'day_tour',
      categoryLabel: 'HISTORY & CULTURE',
      location: 'Zanzibar',
      duration: '3 Hours',
      price: '$30',
      description:
        'Walk through the narrow historic streets of Stone Town and discover its architecture, markets and fascinating heritage.',
      icon: 'fa-landmark',
      image: '/img/stone-town.jpeg',
      gallery: [
        '/img/stone-town.jpeg',
        '/img/stone-town-2.jpeg',
        '/img/stone-town-3.jpeg'
      ]
    }

  ];


  // =========================================================
  // INIT
  // =========================================================

  constructor(
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {

    const slug =
      this.route.snapshot.paramMap.get('slug');

    if (!slug) {
      return;
    }

    this.tour =
      this.tours.find(
        item => item.slug === slug
      );

    this.handleScroll();

  }


  // =========================================================
  // SCROLL
  // =========================================================

  @HostListener('window:scroll')
  handleScroll(): void {

    this.showBackTop =
      window.scrollY > 400;

  }


  scrollToTop(): void {

    window.scrollTo({

      top: 0,

      behavior: 'smooth'

    });

  }

}