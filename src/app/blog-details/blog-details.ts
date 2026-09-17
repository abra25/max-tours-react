import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BLOG_POSTS, BlogPost } from '../data/blog-data';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-details.html',
  styleUrl: './blog-details.css'
})
export class BlogDetails implements OnInit {

  blog?: BlogPost;

  relatedBlogs: BlogPost[] = [];

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      const slug = params.get('slug');

      this.loadBlog(slug);

    });

  }

  private loadBlog(slug: string | null): void {

    if (!slug) {
      this.blog = undefined;
      this.relatedBlogs = [];
      return;
    }

    this.blog = BLOG_POSTS.find(
      post => post.slug === slug
    );

    if (this.blog) {

      this.relatedBlogs = BLOG_POSTS
        .filter(post => post.slug !== this.blog?.slug)
        .slice(0, 3);

    } else {

      this.relatedBlogs = [];

    }

  }

}