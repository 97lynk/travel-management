import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Logger} from '../../../data/util/logger';

@Component({
  selector: 'app-tour-form',
  templateUrl: './tour-form.component.html',
  styleUrls: ['./tour-form.component.scss']
})
export class TourFormComponent implements OnInit {

  tourControl: FormGroup;

  contentHTML = '';

  constructor(private fb: FormBuilder) {
    this.tourControl = this.fb.group({
      tourName: ['', Validators.required],
      tourUrl: ['', Validators.required],
      numberOfDate: [1, [Validators.min(1), Validators.required]],
      numberOfNight: [1, [Validators.min(1), Validators.required]],
      description: ['', Validators.required],
      imageUrl: ['', [Validators.pattern('((http://)|(https://))(\.+\\.\.+)+'), Validators.required]]
    });
  }

  ngOnInit() {
  }

  CKEditorConfig = {
    extraPlugins: 'divarea',
    htmlEncodeOutput: false,
    entities: false,
    height: '200px',
    width: '100%'
  };


  loadImageError(img: HTMLImageElement) {
    img.src = 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2017/09/12/11/naturo-monkey-selfie.jpg?w968h681';
  }
}
