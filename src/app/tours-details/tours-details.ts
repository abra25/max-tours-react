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


interface ItineraryItem {

  day?: number;

  title?: string;

  desc?: string;

}


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
  // LOADING / ERROR
  // =========================================================

  loadingTour = false;

  tourError = '';


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(

    private readonly route: ActivatedRoute,

    private readonly packageService: PackageService,

    private readonly cdr: ChangeDetectorRef

  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.handleScroll();

    this.loadTour();

  }


  // =========================================================
  // LOAD TOUR FROM DATABASE
  // =========================================================

  private async loadTour(): Promise<void> {

    this.loadingTour = true;

    this.tourError = '';

    this.tour = undefined;


    /*
     * Make the loading state available immediately.
     */
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
       * Get the selected active package
       * directly from Supabase using its slug.
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
       * Convert database Package into the
       * structure used by the Details page.
       */
      this.tour =
        this.mapPackageToTourDetails(
          packageData
        );


      this.loadingTour = false;


      /*
       * Update the page immediately after
       * the asynchronous database request.
       */
      this.cdr.detectChanges();


      /*
       * Start from the top whenever a tour
       * details page is opened.
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


  // =========================================================
  // MAP PACKAGE → TOUR DETAILS
  // =========================================================

  private mapPackageToTourDetails(
    item: Package
  ): TourDetails {

    const category =
      item.category || 'tour';


    const gallery =
      Array.isArray(item.gallery)
        ? item.gallery.filter(Boolean)
        : [];


    /*
     * If Admin did not add gallery images,
     * use the hero image as a fallback.
     */
    const finalGallery =
      gallery.length > 0
        ? gallery
        : item.image_url
          ? [item.image_url]
          : [];


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
        this.getCategoryLabel(
          category
        ),


      location:
        item.location ||
        'Tanzania',


      duration:
        item.duration ||
        '',


      price:
        item.price ||
        '',


      childPrice:
        item.child_price ||
        '',


      rating:
        item.rating ||
        '',


      /*
       * Short description is used as
       * the main concise description.
       */
      description:
        item.short_description ||
        '',


      /*
       * Full description is available
       * for the detailed story section.
       */
      fullDescription:
        item.full_description ||
        item.details ||
        item.short_description ||
        '',


      details:
        item.details ||
        '',


      icon:
        this.getCategoryIcon(
          category
        ),


      image:
        item.image_url ||
        '/img/placeholder.jpg',


      gallery:
        finalGallery,


      features:
        Array.isArray(item.features)
          ? item.features
          : [],


      highlights:
        Array.isArray(item.highlights)
          ? item.highlights
          : [],


      inclusions:
        Array.isArray(item.inclusions)
          ? item.inclusions
          : [],


      essentials:
        Array.isArray(item.essentials)
          ? item.essentials
          : [],


      itinerary:
        Array.isArray(item.itinerary)
          ? item.itinerary
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

      String(category)
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
  // RATING HELPERS
  // =========================================================

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

    const rating =
      this.getRatingNumber();


    const fullStars =
      Math.floor(rating);


    return Array.from(
      {
        length: fullStars
      },
      (_, index) => index
    );

  }


  getEmptyRatingStars(): number[] {

    const rating =
      this.getRatingNumber();


    const emptyStars =
      5 - Math.floor(rating);


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


  // =========================================================
  // CHECK OPTIONAL CONTENT
  // =========================================================

  hasInclusions(): boolean {

    return !!(
      this.tour?.inclusions &&
      this.tour.inclusions.length
    );

  }


  hasHighlights(): boolean {

    return !!(
      this.tour?.highlights &&
      this.tour.highlights.length
    );

  }


  hasEssentials(): boolean {

    return !!(
      this.tour?.essentials &&
      this.tour.essentials.length
    );

  }


  hasFeatures(): boolean {

    return !!(
      this.tour?.features &&
      this.tour.features.length
    );

  }


  hasItinerary(): boolean {

    return !!(
      this.tour?.itinerary &&
      this.tour.itinerary.length
    );

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