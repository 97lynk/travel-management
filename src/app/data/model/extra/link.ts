export class Link {

  constructor(public rel: string = '',
              public href: string = '',
              public hreflang: string = '',
              public media: string = '',
              public title: string = '',
              public type: string = '',
              public deprecation: string = '') {
  }

}