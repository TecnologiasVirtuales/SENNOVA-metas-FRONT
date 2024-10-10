export enum TipoDocumentoEnum {
    CEDULA_DE_CIUDADANIA = 'CC',
    TARJETA_DE_IDENTIDAD = 'TI',
    CEDULA_EXTRANJERA = 'CE',
    PASAPORTE = 'PA'
}

export const TIPO_DOCUMENTO_LABELS = {
    [TipoDocumentoEnum.CEDULA_DE_CIUDADANIA]: 'Cédula de ciudadanía',
    [TipoDocumentoEnum.TARJETA_DE_IDENTIDAD]: 'Tarjeta de identidad',
    [TipoDocumentoEnum.CEDULA_EXTRANJERA]: 'Cédula extranjera',
    [TipoDocumentoEnum.PASAPORTE]: 'Pasaporte'
};