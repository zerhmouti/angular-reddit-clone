import { Component, OnInit } from '@angular/core';
import { PostModel } from '../shared/post-model';
import { PostService } from '../shared/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  posts$: Array<PostModel> = [];

  constructor(private PostService:PostService){
    this.PostService.getAllPosts().subscribe(post=>{
      this.posts$ = post;
    }
      
    )
  }

  ngOnInit(): void {
  }

  
}
