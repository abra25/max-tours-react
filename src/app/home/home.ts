import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { BLOG_POSTS } from '../data/blog-data';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-home',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements AfterViewInit, OnDestroy {

  //new year 
  currentYear = new Date().getFullYear();

  //blog
  homeBlogs = BLOG_POSTS.slice(0, 3);

  //Navbar Scroll
  scrollToSection(sectionId: string, event?: Event): void {
  event?.preventDefault();

  const section = document.getElementById(sectionId);

  if (!section) {
    return;
  }

  const headerOffset = 85;

  const elementPosition =
    section.getBoundingClientRect().top;

  const offsetPosition =
    elementPosition +
    window.pageYOffset -
    headerOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

  // ============================================
  // HERO SLIDES
  // ============================================

  heroSlides: HeroSlide[] = [

    {
      image: '/img/hero-1.jpeg',
      eyebrow: 'WELCOME TO ZANZIBAR',
      title: 'Discover',
      accent: 'the Extraordinary.',
      description:
        'Explore turquoise waters, timeless culture and unforgettable island experiences with Max Tours & Safari.',
      primaryText: 'Explore Tours',
      secondaryText: 'Plan Your Journey'
    },

    {
      image: '/img/hero-2.jpeg',
      eyebrow: 'ISLAND EXPERIENCES',
      title: 'Travel Slowly.',
      accent: 'Feel Zanzibar.',
      description:
        'From hidden beaches to historic streets, experience Zanzibar through moments that stay with you.',
      primaryText: 'Discover Zanzibar',
      secondaryText: 'View Destinations'
    },

    {
      image: '/img/hero-3.jpeg',
      eyebrow: 'SAFARI & ADVENTURE',
      title: 'Beyond The',
      accent: 'Island.',
      description:
        'Go further with unforgettable safari adventures, breathtaking landscapes and authentic African encounters.',
      primaryText: 'Explore Safari',
      secondaryText: 'Start Planning'
    },
    {
  image: '/img/hero-4.jpeg',
  eyebrow: 'TANZANIA SAFARI',
  title: 'Into The',
  accent: 'Wild.',
  description:
    'Witness the untamed beauty of Tanzania, from the endless Serengeti plains to unforgettable wildlife encounters in the heart of Africa.',
  primaryText: 'Explore Safari',
  secondaryText: 'Plan Your Safari'
}

  ];


  currentSlide = 0;

  isScrolled = false;

  isMenuOpen = false;

  private slideTimer?: ReturnType<typeof setInterval>;


  // ============================================
  // LIFECYCLE
  // ============================================

 ngAfterViewInit(): void {

  this.startAutoPlay();

  this.startDestinationAnimation();

}

  ngOnInit() {
  window.addEventListener('scroll', this.handleScroll);
 }
  ngOnDestroy(): void {

  this.stopAutoPlay();

  this.stopDestinationAnimation();

  window.removeEventListener(
    'scroll',
    this.handleScroll
  );

}


  // ============================================
  // NAVBAR SCROLL
  // ============================================

  @HostListener('window:scroll')
  onWindowScroll(): void {

    this.isScrolled = window.scrollY > 45;

    if (this.isScrolled && this.isMenuOpen) {
      this.isMenuOpen = false;
    }

  }


  // ============================================
  // MOBILE MENU
  // ============================================

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }


  closeMenu(): void {
    this.isMenuOpen = false;
  }


  // ============================================
  // HERO SLIDER
  // ============================================

  nextSlide(): void {

    this.currentSlide =
      (this.currentSlide + 1) %
      this.heroSlides.length;

    this.restartAutoPlay();

  }


  previousSlide(): void {

    this.currentSlide =
      (this.currentSlide - 1 + this.heroSlides.length) %
      this.heroSlides.length;

    this.restartAutoPlay();

  }


  goToSlide(index: number): void {

    if (index === this.currentSlide) {
      return;
    }

    this.currentSlide = index;

    this.restartAutoPlay();

  }


  // ============================================
  // AUTOPLAY
  // ============================================

  private startAutoPlay(): void {

    this.slideTimer = setInterval(() => {

      this.currentSlide =
        (this.currentSlide + 1) %
        this.heroSlides.length;

    }, 7000);

  }


  private stopAutoPlay(): void {

    if (this.slideTimer) {
      clearInterval(this.slideTimer);
    }

  }


  private restartAutoPlay(): void {

    this.stopAutoPlay();

    this.startAutoPlay();

  }


  // ============================================
  // HERO HOVER
  // ============================================

  pauseHero(): void {
    this.stopAutoPlay();
  }


  resumeHero(): void {
    this.startAutoPlay();
  }

 

ctaFeatures: CtaFeature[] = [
  {
    icon: 'fa-solid fa-location-dot',
    title: 'Local expertise',
    description: 'People who know the places'
  },
  {
    icon: 'fa-solid fa-route',
    title: 'Flexible journeys',
    description: 'Private or small group'
  },
  {
    icon: 'fa-solid fa-calendar-check',
    title: 'Easy planning',
    description: 'Clear, friendly support'
  },
  {
    icon: 'fa-solid fa-hand-holding-heart',
    title: 'Made with care',
    description: 'Details that feel effortless'
  }
];

// =========================================================
// ABOUT US
// =========================================================



aboutServices: AboutService[] = [
  {
    icon: 'fa-solid fa-binoculars',
    title: 'Safari Adventures',
    description: 'Wildlife, nature and unforgettable African encounters.'
  },
  {
    icon: 'fa-solid fa-landmark',
    title: 'Culture & History',
    description: 'Discover the stories, traditions and heritage of Tanzania.'
  },
  {
    icon: 'fa-solid fa-water',
    title: 'Island Experiences',
    description: 'Turquoise waters, beaches, cruises and ocean adventures.'
  },
  {
    icon: 'fa-solid fa-car',
    title: 'Private Transfers',
    description: 'Comfortable and reliable journeys from arrival to departure.'
  }
];

aboutStats: AboutStat[] = [
  {
    value: '4+',
    label: 'Years of Experience'
  },
  {
    value: '20+',
    label: 'Unique Experiences'
  },
  {
    value: '100%',
    label: 'Local Expertise'
  }
];

aboutLanguages: string[] = [
  'English',
  'Spanish',
  'French',
  'Italian',
  'Polish',
  'German'
];

// =========================================================
// DESTINATION CINEMATIC RAIL
// =========================================================

activeDestination = 0;

private destinationTimer?: ReturnType<typeof setInterval>;

private destinationPaused = false;

destinations: Destination[] = [

  // ================================
  // ZANZIBAR
  // ================================

  {
    image: '/img/stone-town.jpeg',
    region: 'ZANZIBAR',
    title: 'Stone Town',
    description:
      'Wander through historic streets, Swahili architecture and centuries of culture in Zanzibar’s UNESCO-listed heart.',
    icon: 'fa-landmark'
  },

  {
    image: '/img/Mnemba Island.jpeg',
    region: 'ZANZIBAR',
    title: 'Mnemba Island',
    description:
      'Discover crystal-clear waters, vibrant marine life and unforgettable snorkeling experiences around Zanzibar’s iconic island.',
    icon: 'fa-water'
  },

  {
    image: '/img/Jozni forest.jpeg',
    region: 'ZANZIBAR',
    title: 'Jozani Forest',
    description:
      'Explore Zanzibar’s lush tropical forest and encounter the rare red colobus monkeys in their natural habitat.',
    icon: 'fa-leaf'
  },

  {
    image: '/img/nakupenda_bech-1.jpeg',
    region: 'ZANZIBAR',
    title: 'Nakupenda Beach',
    description:
      'Escape to a stunning sandbank surrounded by turquoise waters, perfect for swimming, relaxing and ocean adventures.',
    icon: 'fa-umbrella-beach'
  },

  // ================================
  // TANZANIA
  // ================================

  {
    image: '/img/serengeti.jpeg',
    region: 'NORTHERN TANZANIA',
    title: 'Serengeti',
    description:
      'Endless golden plains, extraordinary wildlife and the legendary Great Migration.',
    icon: 'fa-paw'
  },

  {
    image: '/img/Ngorongoro creater.jpg',
    region: 'NORTHERN TANZANIA',
    title: 'Ngorongoro Crater',
    description:
      'A breathtaking natural wonder where dramatic landscapes meet some of Africa’s richest wildlife.',
    icon: 'fa-mountain-sun'
  }

];

// =========================================================
// DESTINATION AUTOMATIC ANIMATION
// =========================================================

private startDestinationAnimation(): void {

  this.stopDestinationAnimation();

  this.destinationTimer = setInterval(() => {

    if (this.destinationPaused) {
      return;
    }

    this.activeDestination =
      (this.activeDestination + 1) %
      this.destinations.length;

  }, 4200);

}


private stopDestinationAnimation(): void {

  if (this.destinationTimer) {

    clearInterval(
      this.destinationTimer
    );

    this.destinationTimer = undefined;

  }

}


activateDestination(index: number): void {

  this.activeDestination = index;

}


pauseDestinationAnimation(): void {

  this.destinationPaused = true;

}


resumeDestinationAnimation(): void {

  this.destinationPaused = false;

}

homeTours: HomeTour[] = [
  {
    image: '/img/safari-1.jpeg',
    category: 'TANZANIA SAFARI',
    location: 'Tanzania',
    title: 'Tanzania Safari',
    duration: '3 Days / 2 Nights',
    price: '$400',
    description:
      'Experience Tanzania’s incredible wildlife, breathtaking landscapes and unforgettable safari moments.',
    icon: 'fa-binoculars'
  },

  {
    image: '/img/safari-2.jpeg',
    category: 'MULTI-DESTINATION',
    location: 'Tanzania & Zanzibar',
    title: '11 Days Tanzania & Zanzibar',
    duration: '11 Days',
    price: '$3,200',
    description:
      'A complete African escape combining unforgettable wildlife adventures with the tropical beauty of Zanzibar.',
    icon: 'fa-route'
  },

  {
    image: '/img/holiday-1.jpeg',
    category: 'ZANZIBAR HOLIDAY',
    location: 'Zanzibar',
    title: '6 Days Zanzibar Holidays',
    duration: '6 Days / 5 Nights',
    price: '$350',
    description:
      'Relax, explore and experience the best of Zanzibar with beautiful beaches, culture and island adventures.',
    icon: 'fa-umbrella-beach'
  },

  {
    image: '/img/blue-safari-1.jpeg',
    category: 'OCEAN ADVENTURE',
    location: 'Zanzibar',
    title: 'Blue Safari',
    duration: 'Full Day',
    price: '$55',
    description:
      'Sail across Zanzibar’s turquoise waters, discover hidden sandbanks and enjoy an unforgettable marine adventure.',
    icon: 'fa-water'
  },

  {
    image: '/img/nakupenda_bech.jpeg',
    category: 'BEACH ESCAPE',
    location: 'Zanzibar',
    title: 'Prison Island & Nakupenda Beach',
    duration: 'Full Day',
    price: '$65',
    description:
      'Combine a visit to Prison Island with the stunning Nakupenda sandbank for a perfect day in paradise.',
    icon: 'fa-island-tropical'
  },

  {
    image: '/img/spice-1.jpeg',
    category: 'CULTURE & FOOD',
    location: 'Zanzibar',
    title: 'Spice Tour with Cooking Class',
    duration: '3 Hours',
    price: '$40',
    description:
      'Discover Zanzibar’s famous spices and learn how local dishes are prepared in an authentic cooking experience.',
    icon: 'fa-utensils'
  }
];


contactFormData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  sendingMessage = false;

  contactStatus = {
    message: '',
    type: ''
  };


  async sendContactMessage() {

    const name = this.contactFormData.name.trim();
    const email = this.contactFormData.email.trim();
    const subject = this.contactFormData.subject.trim();
    const message = this.contactFormData.message.trim();

    if (!name || !email || !subject || !message) {

      this.contactStatus = {
        message: 'Please fill in all fields before sending your message.',
        type: 'error'
      };

      return;
    }


    this.sendingMessage = true;

    this.contactStatus = {
      message: '',
      type: ''
    };


    try {

      /*
       * EmailJS
       * --------------------------------
       * Replace these three values after
       * creating your EmailJS account.
       */

      const serviceId = 'YOUR_SERVICE_ID';
      const templateId = 'YOUR_TEMPLATE_ID';
      const publicKey = 'pclOlrkHNTr2X1slc';


      const emailjs = await import('@emailjs/browser');


      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: name,
          from_email: email,
          subject: subject,
          message: message,

          /*
           * This makes the destination clear
           * inside the EmailJS template.
           */
          to_email: 'maxtourandsafari@gmail.com'
        },
        {
          publicKey: publicKey
        }
      );


      this.contactStatus = {
        message:
          'Thank you! Your message has been sent successfully. Our team will get back to you soon.',
        type: 'success'
      };


      this.contactFormData = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };


    } catch (error) {

      console.error('Contact message error:', error);

      this.contactStatus = {
        message:
          'We could not send your message right now. Please try again or contact us directly by email or WhatsApp.',
        type: 'error'
      };

    } finally {

      this.sendingMessage = false;

    }

  }

  showBackTop = false;

private handleScroll = () => {
  this.showBackTop = window.scrollY > 400;
};

scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

}