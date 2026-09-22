import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  Package,
  PackageService
} from '../services/package.service';


/* =========================================================
   ITINERARY MODEL
========================================================= */

interface ItineraryItem {

  day?: number | string;

  title?: string;

  desc?: string;

}


/* =========================================================
   TOUR DETAILS MODEL
========================================================= */

interface TourDetails {

  id: number;

  slug: string;

  title: string;

  category: string;

  categoryLabel: string;

  location: string;

  duration: string;

  price: string;

  childPrice: string;

  rating: string;

  description: string;

  fullDescription: string;

  details: string;

  icon: string;

  image: string;

  gallery: string[];

  features: string[];

  highlights: string[];

  inclusions: string[];

  essentials: string[];

  itinerary: ItineraryItem[];

}


/* =========================================================
   COMPONENT
========================================================= */

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


  /* =======================================================
     PAGE STATE
  ======================================================= */

  currentYear =
    new Date().getFullYear();

  showBackTop = false;


  /* =======================================================
     TOUR DATA
  ======================================================= */

  tour?: TourDetails;


  /* =======================================================
     LOADING / ERROR
  ======================================================= */

  loadingTour = false;

  tourError = '';


  /* =======================================================
     CONSTRUCTOR
  ======================================================= */

  constructor(

    private readonly route: ActivatedRoute,

    private readonly packageService: PackageService,

    private readonly cdr: ChangeDetectorRef

  ) {}


  /* =======================================================
     INITIALIZATION
  ======================================================= */

  ngOnInit(): void {

    this.handleScroll();

    this.loadTour();

  }


  /* =======================================================
     LOAD TOUR FROM SUPABASE
  ======================================================= */

  private async loadTour(): Promise<void> {

    this.loadingTour = true;

    this.tourError = '';

    this.tour = undefined;

    this.cdr.detectChanges();


    const slug =
      this.route.snapshot.paramMap.get('slug');


    if (!slug) {

      this.tourError =
        'Tour could not be found.';

      this.loadingTour = false;

      this.cdr.detectChanges();

      return;

    }


    try {

      /*
       * Fetch the selected active package
       * using its slug.
       */

      const packageData =
        await this.packageService.getPackageBySlug(
          slug
        );


      if (!packageData) {

        this.tourError =
          'This tour package could not be found.';

        this.loadingTour = false;

        this.cdr.detectChanges();

        return;

      }


      /*
       * Map Supabase package data
       * into the TourDetails model.
       */

      this.tour =
        this.mapPackageToTourDetails(
          packageData
        );


      this.loadingTour = false;

      this.cdr.detectChanges();


      /*
       * Scroll to the top when
       * the details page is opened.
       */

      window.scrollTo({

        top: 0,

        behavior: 'smooth'

      });


    } catch (error) {

      console.error(
        'Failed to load tour details:',
        error
      );


      this.tour = undefined;

      this.tourError =
        'Unable to load this tour right now. Please try again later.';

      this.loadingTour = false;

      this.cdr.detectChanges();

    }

  }


  /* =======================================================
     MAP PACKAGE TO TOUR DETAILS
  ======================================================= */

  private mapPackageToTourDetails(
    item: Package
  ): TourDetails {

    const category =
      item.category || 'tour';


    /*
     * Prepare gallery images.
     */

    const gallery =
      Array.isArray(item.gallery)
        ? item.gallery.filter(
            (image): image is string =>
              typeof image === 'string' &&
              image.trim().length > 0
          )
        : [];


    /*
     * Use hero image as gallery fallback
     * when no gallery images exist.
     */

    const finalGallery =
      gallery.length > 0
        ? gallery
        : item.image_url
          ? [item.image_url]
          : [];


    /*
     * Safely normalize itinerary data.
     */

    const itinerary =
      this.normalizeItinerary(
        item.itinerary
      );


    return {

      id:
        item.id ?? 0,


      slug:
        item.slug ||
        this.createSlug(item.title),


      title:
        item.title || 'Tour Experience',


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


      childPrice:
        item.child_price || '',


      rating:
        item.rating || '',


      /*
       * Short description.
       */

      description:
        item.short_description || '',


      /*
       * Full description fallback order:
       *
       * 1. full_description
       * 2. details
       * 3. short_description
       */

      fullDescription:
        item.full_description ||
        item.details ||
        item.short_description ||
        '',


      /*
       * Additional details.
       */

      details:
        item.details || '',


      icon:
        this.getCategoryIcon(category),


      image:
        item.image_url ||
        '/img/placeholder.jpg',


      gallery:
        finalGallery,


      /*
       * Features from Supabase.
       */

      features:
        this.normalizeStringArray(
          item.features
        ),


      /*
       * Highlights from Supabase.
       */

      highlights:
        this.normalizeStringArray(
          item.highlights
        ),


      /*
       * Inclusions from Supabase.
       */

      inclusions:
        this.normalizeStringArray(
          item.inclusions
        ),


      /*
       * Essentials retained for compatibility.
       */

      essentials:
        this.normalizeStringArray(
          item.essentials
        ),


      /*
       * Itinerary from Supabase.
       */

      itinerary:
        itinerary

    };

  }


  /* =======================================================
     NORMALIZE STRING ARRAYS
  ======================================================= */

  private normalizeStringArray(
    value: unknown
  ): string[] {

    if (!Array.isArray(value)) {

      return [];

    }


    return value.filter(

      (item): item is string =>

        typeof item === 'string' &&
        item.trim().length > 0

    );

  }


  /* =======================================================
     NORMALIZE ITINERARY
  ======================================================= */

  private normalizeItinerary(
    value: unknown
  ): ItineraryItem[] {

    if (!Array.isArray(value)) {

      return [];

    }


    return value

      .filter(

        (item): item is Record<string, unknown> =>

          typeof item === 'object' &&
          item !== null &&
          !Array.isArray(item)

      )

      .map(

        (item): ItineraryItem => ({

          day:
            typeof item['day'] === 'number' ||
            typeof item['day'] === 'string'
              ? item['day']
              : undefined,


          title:
            typeof item['title'] === 'string'
              ? item['title']
              : '',


          desc:
            typeof item['desc'] === 'string'
              ? item['desc']
              : ''

        })

      )

      .filter(

        item =>

          !!(
            item.title?.trim() ||
            item.desc?.trim()
          )

      );

  }


  /* =======================================================
     CATEGORY LABEL
  ======================================================= */

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

      String(category)
        .replace(/_/g, ' ')
        .toUpperCase()

    );

  }


  /* =======================================================
     CATEGORY ICON
  ======================================================= */

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


  /* =======================================================
     CREATE SLUG FALLBACK
  ======================================================= */

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


  /* =======================================================
     RATING HELPERS
  ======================================================= */

  getRatingNumber(): number {

    const rating =
      Number.parseFloat(
        this.tour?.rating || ''
      );


    if (

      Number.isNaN(rating) ||

      rating < 0

    ) {

      return 0;

    }


    return Math.min(
      rating,
      5
    );

  }


  getRatingStars(): number[] {

    const fullStars =
      Math.floor(
        this.getRatingNumber()
      );


    return Array.from(

      {
        length: fullStars
      },

      (_, index) => index

    );

  }


  getEmptyRatingStars(): number[] {

    const emptyStars =

      5 -
      Math.floor(
        this.getRatingNumber()
      );


    return Array.from(

      {
        length: Math.max(
          0,
          emptyStars
        )
      },

      (_, index) => index

    );

  }


  /* =======================================================
     OPTIONAL CONTENT CHECKS
  ======================================================= */

  hasInclusions(): boolean {

    return !!this.tour?.inclusions.length;

  }


  hasHighlights(): boolean {

    return !!this.tour?.highlights.length;

  }


  hasEssentials(): boolean {

    return !!this.tour?.essentials.length;

  }


  hasFeatures(): boolean {

    return !!this.tour?.features.length;

  }


  hasItinerary(): boolean {

    return !!this.tour?.itinerary.length;

  }


  hasDetails(): boolean {

    return !!this.tour?.details.trim();

  }


  /* =======================================================
     SCROLL HANDLING
  ======================================================= */

  @HostListener('window:scroll')

  handleScroll(): void {

    this.showBackTop =
      window.scrollY > 400;

  }


  /* =======================================================
     BACK TO TOP
  ======================================================= */

  scrollToTop(): void {

    window.scrollTo({

      top: 0,

      behavior: 'smooth'

    });

  }

}