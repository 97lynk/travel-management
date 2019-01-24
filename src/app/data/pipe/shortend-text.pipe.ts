import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'shortendText'
})
export class ShortendTextPipe implements PipeTransform {

    transform(text: string, lengthCharacter: number = -1): string {
        if (!text) return '';
        if (lengthCharacter == -1)
            lengthCharacter = text.length;
        text = text.slice(0, lengthCharacter);
        const lastIndexOfSpace = text.lastIndexOf(' ');
        return text.slice(0, lastIndexOfSpace);
    }

}
