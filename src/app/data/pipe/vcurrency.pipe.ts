import {Pipe, PipeTransform} from '@angular/core';
import {CurrencyPipe} from '@angular/common';

@Pipe({
    name: 'vcurrency'
})
export class VCurrencyPipe implements PipeTransform {

    constructor() {
    }

    transform(value: any): any {
        let data = (new CurrencyPipe('en-US')).transform(value, 'VND');
        let currencySymbol = data.charAt(0);
        return data.substr(1) + currencySymbol;
    }

}
