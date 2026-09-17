import { Injectable } from '@angular/core';
import { supabaseClient } from '../lib/supabase';

export interface Package {
  id?: number;
  title: string;
  slug?: string | null;
  category: string;
  location: string;
  price?: string | null;
  child_price?: string | null;
  duration?: string | null;
  rating?: string | null;

  // Main / Hero image
  image_url?: string | null;

  // Additional gallery images
  gallery?: string[];

  short_description?: string | null;
  full_description?: string | null;
  details?: string | null;

  features?: string[];
  highlights?: string[];
  itinerary?: any[];
  inclusions?: string[];
  essentials?: string[];

  is_featured?: boolean;
  is_active?: boolean;

  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  private readonly tableName = 'packages';


  // =========================================================
  // GET ACTIVE PACKAGES
  // =========================================================

  /**
   * Get all active packages.
   * Used mainly by the public Tours page.
   */
  async getActivePackages(): Promise<Package[]> {

    const { data, error } =
      await supabaseClient
        .from(this.tableName)
        .select('*')
        .eq('is_active', true)
        .order(
          'created_at',
          {
            ascending: false
          }
        );

    if (error) {

      console.error(
        'Error loading active packages:',
        error
      );

      throw error;
    }

    return (data ?? []) as Package[];
  }


  // =========================================================
  // GET HOME PACKAGES
  // =========================================================

  /**
   * Get the first 6 active packages.
   * Used by the Home page.
   */
async getHomePackages(): Promise<Package[]> {
  const { data, error } = await supabaseClient
    .from(this.tableName)
    .select('*')
    .eq('is_active', true)
    .order('id', { ascending: true })
    .limit(6);

  if (error) {
    console.error('Error loading home packages:', error);
    throw error;
  }

  return (data ?? []) as Package[];
}


  // =========================================================
  // GET PACKAGE BY SLUG
  // =========================================================

  /**
   * Get one package using its slug.
   * Used by Tour Details page.
   */
  async getPackageBySlug(
    slug: string
  ): Promise<Package | null> {

    const { data, error } =
      await supabaseClient
        .from(this.tableName)
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

    if (error) {

      console.error(
        'Error loading package by slug:',
        error
      );

      throw error;
    }

    return data as Package | null;
  }


  // =========================================================
  // GET ALL PACKAGES
  // =========================================================

  /**
   * Get all packages.
   * Used by Admin.
   */
  async getAllPackages(): Promise<Package[]> {

    const { data, error } =
      await supabaseClient
        .from(this.tableName)
        .select('*')
        .order(
          'created_at',
          {
            ascending: false
          }
        );

    if (error) {

      console.error(
        'Error loading all packages:',
        error
      );

      throw error;
    }

    return (data ?? []) as Package[];
  }


  // =========================================================
  // CREATE PACKAGE
  // =========================================================

  /**
   * Create a new package.
   */
  async createPackage(
    packageData:
      Omit<
        Package,
        'id' |
        'created_at' |
        'updated_at'
      >
  ): Promise<Package> {

    const { data, error } =
      await supabaseClient
        .from(this.tableName)
        .insert(packageData)
        .select()
        .single();

    if (error) {

      console.error(
        'Error creating package:',
        error
      );

      throw error;
    }

    return data as Package;
  }


  // =========================================================
  // UPDATE PACKAGE
  // =========================================================

  /**
   * Update an existing package.
   */
  async updatePackage(
    id: number,
    packageData: Partial<Package>
  ): Promise<Package> {

    const updateData = {
      ...packageData,
      updated_at:
        new Date().toISOString()
    };

    delete updateData.id;
    delete updateData.created_at;

    const { data, error } =
      await supabaseClient
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) {

      console.error(
        'Error updating package:',
        error
      );

      throw error;
    }

    return data as Package;
  }


  // =========================================================
  // DELETE PACKAGE
  // =========================================================

  /**
   * Delete a package.
   */
  async deletePackage(
    id: number
  ): Promise<void> {

    const { error } =
      await supabaseClient
        .from(this.tableName)
        .delete()
        .eq('id', id);

    if (error) {

      console.error(
        'Error deleting package:',
        error
      );

      throw error;
    }
  }


  // =========================================================
  // UPLOAD PACKAGE IMAGE
  // =========================================================

  /**
   * Upload package image to Supabase Storage.
   *
   * Hero:
   * packages/hero/filename
   *
   * Gallery:
   * packages/gallery/filename
   */
  async uploadPackageImage(
    file: File,
    folder: 'hero' | 'gallery' = 'gallery'
  ): Promise<string> {

    if (!file) {

      throw new Error(
        'No image file selected.'
      );
    }

    if (!file.type.startsWith('image/')) {

      throw new Error(
        'Please select a valid image file.'
      );
    }

    const extension =
      file.name
        .split('.')
        .pop()
        ?.toLowerCase()
        || 'jpg';

    const safeName =
      `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const filePath =
      `packages/${folder}/${safeName}`;

    const { error } =
      await supabaseClient.storage
        .from('tour-images')
        .upload(
          filePath,
          file,
          {
            cacheControl: '3600',
            upsert: false
          }
        );

    if (error) {

      console.error(
        'Package image upload error:',
        error
      );

      throw error;
    }

    const { data } =
      supabaseClient.storage
        .from('tour-images')
        .getPublicUrl(
          filePath
        );

    if (!data?.publicUrl) {

      throw new Error(
        'Could not generate public image URL.'
      );
    }

    return data.publicUrl;
  }

}