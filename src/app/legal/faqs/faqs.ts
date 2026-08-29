import {
  Component,
  HostListener
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';


interface FaqCategory {
  icon: string;
  number: string;
  title: string;
  description: string;

  questions: {
    question: string;
    answer: string;
  }[];
}


@Component({
  selector: 'app-faqs',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './faqs.html',
  styleUrl: './faqs.css'
})


export class Faqs {

  // =====================================================
  // NAVBAR
  // =====================================================

  isScrolled = false;
  isMenuOpen = false;


  // =====================================================
  // BACK TO TOP
  // =====================================================

  showBackTop = false;


  // =====================================================
  // FAQ
  // =====================================================

  openFaq: string | null = null;


  // =====================================================
  // YEAR
  // =====================================================

  currentYear = new Date().getFullYear();


  constructor(
    private router: Router
  ) {}


  // =====================================================
  // MOBILE MENU
  // =====================================================

  toggleMenu(): void {

    this.isMenuOpen = !this.isMenuOpen;

    document.body.style.overflow =
      this.isMenuOpen ? 'hidden' : '';

  }


  closeMenu(): void {

    this.isMenuOpen = false;

    document.body.style.overflow = '';

  }


  // =====================================================
  // NAVBAR + BACK TO TOP SCROLL
  // =====================================================

  @HostListener('window:scroll')
  onScroll(): void {

    const scrollY = window.scrollY;

    this.isScrolled = scrollY > 40;

    this.showBackTop = scrollY > 500;

  }


  // =====================================================
  // TOURS SECTION
  // =====================================================

  scrollToSection(
    sectionId: string,
    event?: Event
  ): void {

    event?.preventDefault();

    const section =
      document.getElementById(sectionId);


    // Section exists on current page
    if (section) {

      const headerOffset = 90;

      const elementPosition =
        section.getBoundingClientRect().top;

      const offsetPosition =
        elementPosition +
        window.scrollY -
        headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      this.closeMenu();

      return;
    }


    // Navigate home with fragment
    this.closeMenu();

    this.router.navigate(
      ['/'],
      {
        fragment: sectionId
      }
    );

  }


  // =====================================================
  // FAQ TOGGLE
  // =====================================================

  toggleFaq(
    category: number,
    question: number
  ): void {

    const key =
      `${category}-${question}`;

    this.openFaq =
      this.openFaq === key
        ? null
        : key;

  }


  isOpen(
    category: number,
    question: number
  ): boolean {

    return (
      this.openFaq ===
      `${category}-${question}`
    );

  }


  // =====================================================
  // BACK TO TOP
  // =====================================================

  scrollToTop(): void {

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }


  // =====================================================
  // FAQ DATA
  // =====================================================

  faqCategories: FaqCategory[] = [

    {
      number: '01',
      icon: 'fa-solid fa-compass',
      title: 'Planning Your Journey',
      description:
        'Everything you need to know before your adventure begins.',

      questions: [

        {
          question: 'How do I book a tour?',
          answer:
            'You can book directly through our website by selecting your preferred tour and completing the booking form. You can also contact our team through WhatsApp, phone or email for assistance with your booking.'
        },

        {
          question: 'Do you offer private tours?',
          answer:
            'Yes. We offer private tours as well as selected shared experiences. Private tours can be adjusted according to your preferred schedule, interests and group size.'
        },

        {
          question: 'Can you create a customized itinerary?',
          answer:
            'Absolutely. We can create a personalized Tanzania or Zanzibar itinerary based on the places you want to visit, the activities you enjoy, your travel dates and your budget.'
        },

        {
          question: 'How far in advance should I book?',
          answer:
            'We recommend booking as early as possible, especially during peak travel periods. For customized multi-day trips, earlier booking gives us more flexibility when arranging accommodation, transport and activities.'
        }

      ]
    },


    {
      number: '02',
      icon: 'fa-solid fa-credit-card',
      title: 'Booking & Payment',
      description:
        'Simple information about deposits, balances and confirmations.',

      questions: [

        {
          question: 'Is a deposit required?',
          answer:
            'A deposit may be required to secure your booking. The exact amount depends on the selected tour, accommodation and travel arrangements. Your booking confirmation will clearly show the payment requirements.'
        },

        {
          question: 'Which payment methods do you accept?',
          answer:
            'Available payment methods may include bank transfer, card payments and selected mobile money services. Our team will provide the appropriate payment instructions when your booking is being confirmed.'
        },

        {
          question: 'When will I receive my confirmation?',
          answer:
            'Once the required payment has been received and your arrangements are confirmed, we will send you your booking confirmation and relevant trip information.'
        }

      ]
    },


    {
      number: '03',
      icon: 'fa-solid fa-water',
      title: 'Tours & Activities',
      description:
        'Know what to expect when exploring Zanzibar and Tanzania.',

      questions: [

        {
          question: 'Are snorkeling tours suitable for beginners?',
          answer:
            'Many of our snorkeling experiences are suitable for beginners. However, guests should be comfortable in water and follow the safety instructions provided by the activity team.'
        },

        {
          question: 'Can weather affect my tour?',
          answer:
            'Yes. Certain ocean and outdoor activities depend on weather and sea conditions. If conditions become unsafe, we may adjust, postpone or reschedule an activity to protect our guests.'
        },

        {
          question: 'What should I wear during cultural tours?',
          answer:
            'Light and comfortable clothing is recommended. When visiting culturally or religiously significant areas, modest clothing is appreciated and helps respect local traditions.'
        },

        {
          question: 'Do you arrange airport transfers?',
          answer:
            'Yes. Airport and hotel transfers can be arranged as part of your itinerary or as a separate service.'
        }

      ]
    },


    {
      number: '04',
      icon: 'fa-solid fa-shield-halved',
      title: 'Safety & Support',
      description:
        'Travel confidently with support from our team.',

      questions: [

        {
          question: 'Do I need travel insurance?',
          answer:
            'Travel insurance is strongly recommended. It can provide protection for medical emergencies, cancellations, delays, lost belongings and other unexpected situations.'
        },

        {
          question: 'Can I contact your team during my trip?',
          answer:
            'Yes. Our team remains available to assist with your scheduled arrangements and general travel support during your trip.'
        },

        {
          question: 'Do you assist international travelers?',
          answer:
            'Yes. We welcome travelers from around the world and can assist with planning transportation, tours, activities and other travel arrangements.'
        }

      ]
    }

  ];

}