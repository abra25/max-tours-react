import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import {
  Package,
  PackageService
} from '../services/package.service';


interface Tour {

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

  selector: 'app-tours',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './tours.html',

  styleUrl: './tours.css'

})
export class Tours implements OnInit {


  // =========================================================
  // PAGE
  // =========================================================

  currentYear =
    new Date().getFullYear();


  // =========================================================
  // NAVBAR
  // =========================================================

  isScrolled = false;

  isMenuOpen = false;


  // =========================================================
  // BACK TO TOP
  // =========================================================

  showBackTop = false;


  // =========================================================
  // TOURS
  // =========================================================

  tours: Tour[] = [];

  toursLoading = false;

  toursError = '';


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private readonly packageService: PackageService,
    private readonly cdr: ChangeDetectorRef
  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.handleScroll();

    this.loadTours();

  }


  // =========================================================
  // LOAD TOURS FROM DATABASE
  // =========================================================

  async loadTours(): Promise<void> {

    this.toursLoading = true;

    this.toursError = '';

    /*
     * Force the loading state to appear immediately.
     */
    this.cdr.detectChanges();


    try {

      const packages =
        await this.packageService.getActivePackages();


      /*
       * Keep the same order as the database IDs:
       *
       * 34
       * 35
       * 36
       * ...
       *
       * PackageService currently returns active
       * packages, and we explicitly sort here too
       * so the page remains predictable.
       */
      const sortedPackages =
        [...packages].sort(
          (a, b) =>
            (a.id ?? 0) -
            (b.id ?? 0)
        );


      this.tours =
        sortedPackages.map(
          (item: Package) =>
            this.mapPackageToTour(item)
        );


      this.toursLoading = false;


      /*
       * Update the UI immediately after
       * the asynchronous database request.
       */
      this.cdr.detectChanges();


    } catch (error) {

      console.error(
        'Failed to load tours:',
        error
      );


      this.tours = [];

      this.toursError =
        'Unable to load tour packages right now.';


      this.toursLoading = false;


      this.cdr.detectChanges();

    }

  }


  // =========================================================
  // MAP DATABASE PACKAGE → TOUR CARD
  // =========================================================

  private mapPackageToTour(
    item: Package
  ): Tour {

    const category =
      item.category || 'tour';


    return {

      id:
        item.id ?? 0,


      slug:
        item.slug ||
        this.createSlug(item.title),


      title:
        item.title,


      category:
        category,


      categoryLabel:
        this.getCategoryLabel(category),


      location:
        item.location || 'Tanzania',


      duration:
        item.duration || '',


      price:
        item.price || '',


      /*
       * IMPORTANT:
       * We only use short_description here.
       * We do not show full_description/details
       * on the Tours listing page.
       */
      description:
        item.short_description || '',


      icon:
        this.getCategoryIcon(category),


      image:
        item.image_url ||
        '/img/placeholder.jpg',


      /*
       * Keep gallery available so the selected
       * package can later be used by Tour Details.
       */
      gallery:
        Array.isArray(item.gallery)
          ? item.gallery
          : []

    };

  }


  // =========================================================
  // CATEGORY LABEL
  // =========================================================

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


  // =========================================================
  // CATEGORY ICON
  // =========================================================

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


  // =========================================================
  // CREATE SLUG FALLBACK
  // =========================================================

  private createSlug(
    title: string
  ): string {

    return String(title || '')

      .toLowerCase()

      .trim()

      .replace(
        /[^a-z0-9]+/g,
        '-'
      )

      .replace(
        /^-+|-+$/g,
        '');

  }


  // =========================================================
  // NAVBAR SCROLL
  // =========================================================

  @HostListener('window:scroll')
  handleScroll(): void {

    this.isScrolled =
      window.scrollY > 45;


    this.showBackTop =
      window.scrollY > 400;


    if (
      this.isScrolled &&
      this.isMenuOpen
    ) {

      this.isMenuOpen = false;

    }

  }


  // =========================================================
  // NAVBAR SECTION SCROLL
  // =========================================================

  scrollToSection(
    sectionId: string,
    event?: Event
  ): void {

    event?.preventDefault();

    this.closeMenu();


    /*
     * Tours is a separate page.
     * If the requested section exists on this page,
     * scroll to it.
     */
    const section =
      document.getElementById(sectionId);


    if (section) {

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


      return;

    }


    /*
     * Otherwise return to Home and open
     * the requested Home section.
     */
    window.location.href =
      `/#${sectionId}`;

  }


  // =========================================================
  // MOBILE MENU
  // =========================================================

  toggleMenu(): void {

    this.isMenuOpen =
      !this.isMenuOpen;

  }


  closeMenu(): void {

    this.isMenuOpen = false;

  }


  // =========================================================
  // BACK TO TOP
  // =========================================================

  scrollToTop(): void {

    window.scrollTo({

      top: 0,

      behavior: 'smooth'

    });

  }


  // =========================================================
  // TRACK BY
  // =========================================================

  trackByTour(
    index: number,
    tour: Tour
  ): number {

    return tour.id;

  }

}