import { Component, OnInit, Input, Inject} from '@angular/core';
import { Dish } from "../shared/dish"
import { Comment } from "../shared/comment"
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { from } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { flyInOut, expand } from '../animations/app.animation'
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'], 
  animations: [
    trigger('visibility', [
      state('shown', style({
          transform: 'scale(1.0)',
          opacity: 1
      })),
      state('hidden', style({
          transform: 'scale(0.5)',
          opacity: 0
      })),
      transition('* => *', animate('0.5s ease-in-out'))
  ]), 
  flyInOut(),
  expand()
]
})


export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  errMess: string;

  commentForm: FormGroup;
  comment: Comment;
  dishcopy: Dish;
  visibility = 'shown';

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required':      'Author Name is required.',
      'minlength':     'Author Name must be at least 2 characters long.',
      'maxlength':     'Author Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
      'minlength':     'Comment must be at least 1 characters long.'
    }
  };

  constructor(private dishservice: DishService,    
    @Inject('BaseURL') private baseURL,
    private route: ActivatedRoute,
    private location: Location,
    private fb:FormBuilder) {
      this.createForm();
     }

  ngOnInit() {

    this.dishservice.getDishIds().subscribe((dishIds) => this.dishIds = dishIds);

    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(params['id']); }))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNxt(dish.id); this.visibility = 'shown'; },
    errmess => this.errMess = <any>errmess);

    
   // this.dish = this.dishservice.getDish(""+id);
    // this.dishservice.getDish(""+id).subscribe((dish) => this.dish = dish);
  }

  setPrevNxt(dishId: string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];    
  }

  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      comment: ['', [Validators.required, Validators.minLength(1)] ],
      rating: 5
    });

    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
    this.comment = form.value;
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    console.log(this.comment);
    this.dishcopy.comments.push(this.comment);
    this.dishservice.putDish(this.dishcopy).subscribe(dish => {
      this.dish = dish;this.dishcopy = dish;
    },
    errmess => {this.dish = null; this.dishcopy = null; this.errMess = <any>errmess;});
    this.comment = null;
    this.commentForm.reset({
      author: '',
      comment: '',
      rating: 5
    });
  }

}
