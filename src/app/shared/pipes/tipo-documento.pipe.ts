import { Pipe, PipeTransform } from '@angular/core';
import { TIPO_DOCUMENTO_LABELS, TipoDocumentoEnum } from '@shared/enum/tipo-documento.enum';

@Pipe({
  name: 'tipoDocumento',
  standalone: true
})
export class TipoDocumentoPipe implements PipeTransform {

  transform(key: TipoDocumentoEnum): string {
    return TIPO_DOCUMENTO_LABELS[key];
  }

}
