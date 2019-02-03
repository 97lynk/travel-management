import {Component, Input} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';

@Component({
  template: `
    <nb-card style="width: 300px" class="rounded">
      <nb-card-header class="p-3 pr-2 border-bottom d-flex justify-content-between">
        <h3>{{ config.title }}</h3>
        <span class="p-1" (click)="ref.close()">
        <i class="nb-close font-w-bold" style="font-size: 2rem"></i>
      </span>
      </nb-card-header>
      <nb-card-body>{{ config.message }}</nb-card-body>
      <nb-card-footer class="p-2 d-flex justify-content-end">
        <button nbButton size="xsmall" shape="rectangle" [status]="config.leftButton.status"
                (click)="ref.close(config.leftButton.return)">{{ config.leftButton.label }}
        </button>
        <button nbButton size="xsmall" shape="rectangle" [status]="config.rightButton.status"
                (click)="ref.close(config.rightButton.return)">{{ config.rightButton.label }}
        </button>
      </nb-card-footer>
    </nb-card>
  `
})
export class ConfirmDialogComponent {

  @Input() config: {
    title: string,
    message: string,
    leftButton: {
      status: string,
      label: string,
      return: any
    },
    rightButton: {
      status: string,
      label: string
      return: any
    }
  };


  constructor(protected ref: NbDialogRef<any>) {
    this.config = {
      title: '', message: '',
      leftButton: {status: '', label: '', return: false},
      rightButton: {status: '', label: '', return: true}
    };
  }

}
