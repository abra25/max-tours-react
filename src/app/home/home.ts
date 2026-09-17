import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { BLOG_POSTS } from '../data/blog-data';
import { FormsModule } from '@angular/forms';
import { Package, PackageService } from '../services/package.service';



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
export class Home implements OnInit,  AfterViewInit, OnDestroy {

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
  constructor(
  private packageService: PackageService,
    private readonly cdr: ChangeDetectorRef
) {}

 ngAfterViewInit(): void {

  this.startAutoPlay();

  this.startDestinationAnimation();

}

  ngOnInit(): void {

  window.addEventListener(
    'scroll',
    this.handleScroll
  );

  this.loadHomePackages();

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
    image: '/img/stone-town-1.png',
    region: 'ZANZIBAR',
    title: 'Stone Town',
    description:
      'Wander through historic streets, Swahili architecture and centuries of culture in Zanzibar’s UNESCO-listed heart.',
    icon: 'fa-landmark'
  },

  {
    image: '/img/mnemba.jpeg',
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

homeTours: HomeTour[] = [];

packagesLoading = false;
packagesError = '';

  private async loadHomePackages(): Promise<void> {

  this.packagesLoading = true;
  this.packagesError = '';

  try {

    const packages =
      await this.packageService.getHomePackages();

    this.homeTours =
      packages.map((item: Package) =>
        this.mapPackageToHomeTour(item)
      );

  } catch (error) {

    console.error(
      'Failed to load home packages:',
      error
    );

    this.packagesError =
      'Unable to load tour packages right now.';

    this.homeTours = [];

  } finally {

    this.packagesLoading = false;

  }

}

private mapPackageToHomeTour(
  item: Package
): HomeTour {

  const category =
    item.category || 'TOUR EXPERIENCE';

  return {

    slug:
      item.slug ||
      this.createSlug(item.title),

    image:
      item.image_url ||
      '/img/placeholder.jpg',

    category:
      this.getCategoryLabel(category),

    location:
      item.location || 'Tanzania',

    title:
      item.title,

    duration:
      item.duration || '',

    price:
      item.price || '',

    description:
      item.short_description || '',

    icon:
      this.getCategoryIcon(category)

  };

}

private getCategoryLabel(
  category: string
): string {

  const labels: Record<string, string> = {

    holiday_package:
      'HOLIDAY PACKAGE',

    day_tour:
      'DAY TOUR',

    safari:
      'TANZANIA SAFARI',

    beach:
      'BEACH ESCAPE',

    adventure:
      'ADVENTURE',

    culture:
      'CULTURE & FOOD'

  };

  return (
    labels[category] ||
    category
      .replace(/_/g, ' ')
      .toUpperCase()
  );

}

private getCategoryIcon(
  category: string
): string {

  const icons: Record<string, string> = {

    holiday_package:
      'fa-suitcase-rolling',

    day_tour:
      'fa-route',

    safari:
      'fa-binoculars',

    beach:
      'fa-umbrella-beach',

    adventure:
      'fa-mountain-sun',

    culture:
      'fa-landmark'

  };

  return (
    icons[category] ||
    'fa-map-location-dot'
  );

}

private createSlug(title: string): string {

  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

}

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