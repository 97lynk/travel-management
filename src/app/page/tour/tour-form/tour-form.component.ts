import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
window['CKEDITOR_BASEPATH'] = '//cdn.ckeditor.com/4.7.3/full-all/';
import 'ckeditor';
const CKEditorConfig = {
  extraPlugins: 'divarea',
  htmlEncodeOutput: false,
  entities: false,
  height: '100%',
  width: '100%'
};

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

  ngOnInit() {}
}
