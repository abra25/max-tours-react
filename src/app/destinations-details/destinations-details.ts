import {
  Component,
  HostListener,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import {
  DESTINATIONS,
  Destination
} from '../data/destination-data';
import { CommonModule } from '@angular/common';


@Component({

  selector: 'app-destinations-details',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './destinations-details.html',

  styleUrl: './destinations-details.css'

})
export class DestinationsDetails
  implements OnInit {


  // =====================================================
  // YEAR
  // =====================================================

  currentYear =
    new Date().getFullYear();


  // =====================================================
  // DESTINATION
  // =====================================================

  destination?: Destination;


  // =====================================================
  // GALLERY
  // =====================================================

  galleryImages: string[] = [];


  // =====================================================
  // NAVBAR
  // =====================================================

  isScrolled = false;

  isMenuOpen = false;


  // =====================================================
  // BACK TO TOP
  // =====================================================

  showBackTop = false;


  constructor(

    private route: ActivatedRoute,

    private router: Router

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadDestination();

    this.handleScroll();

  }


  // =====================================================
  // LOAD DESTINATION
  // =====================================================

  private loadDestination(): void {

    const slug =
      this.route.snapshot.paramMap.get('slug');


    if (!slug) {

      this.router.navigate([
        '/destinations'
      ]);

      return;

    }


    this.destination =
      DESTINATIONS.find(
        item => item.slug === slug
      );


    // Destination haipo

    if (!this.destination) {

      this.router.navigate([
        '/destinations'
      ]);

      return;

    }


    this.buildGallery();

  }


  // =====================================================
  // BUILD GALLERY
  // =====================================================

  private buildGallery(): void {

    if (!this.destination) {

      return;

    }


    /*
     * Kwa sasa tunatumia main image kama
     * starting point ya gallery.
     *
     * Ukishakuwa na picha zaidi za kila
     * destination, unaweza kuongeza hapa.
     */

    this.galleryImages = [

      this.destination.image

    ];

  }


  // =====================================================
  // NAVBAR SCROLL
  // =====================================================

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


  // =====================================================
  // MOBILE MENU
  // =====================================================

  toggleMenu(): void {

    this.isMenuOpen =
      !this.isMenuOpen;

  }


  closeMenu(): void {

    this.isMenuOpen = false;

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

}