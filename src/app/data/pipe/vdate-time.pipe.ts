import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'vdatetime'
})
export class VDateTimePipe implements PipeTransform {

    option = {
        // hour12: true, hour: '2-digit', minute: '2-digit',
        day: 'numeric', month: 'numeric', year: 'numeric'
    };

    transform(value: number | Date): string {
        let data: Date;
        if (value == null) return '';
        if (typeof value == 'number')
            data = new Date(value);
        else
            data = value;
        return data.toLocaleDateString('vi-VN', this.option);
    }

}
