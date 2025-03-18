import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators, ValueChangeEvent } from '@angular/forms';
import { OnlyNumbersDirective } from '@shared/directives/only-numbers.directive';
import { TIPO_DOCUMENTO_LABELS, TipoDocumentoEnum } from '@shared/enum/tipo-documento.enum';
import { PersonaModel } from '@shared/models/persona.model';
import { ReplacePipe } from '@shared/pipes/replace.pipe';
import { AuthService } from '@shared/services/auth.service';
import { FormStyle } from '@shared/style-clases/focus.style';
import { noWhiteSpaceValidator } from '@shared/validators/no-wite-space.validator';
import { passwordsMatchValidator } from '@shared/validators/password.validator';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzSelectModule,
    OnlyNumbersDirective,
  ],
  templateUrl: './usuario-form.component.html',
  styleUrls: [
    './usuario-form.component.css',
    '../../../../../../shared/styles/forms.style.css'
  ]
})
export class UsuarioFormComponent extends FormStyle implements OnInit,OnDestroy{

  private form_builder = inject(FormBuilder);
  private modal = inject(NzModalRef);
  private auth_service = inject(AuthService);

  actualizar_perfil:boolean = false;

  form:FormGroup;

  tipos_documento:{[key:string]:string} = TIPO_DOCUMENTO_LABELS
  tipo_documento_numb = TipoDocumentoEnum;

  pass_sub?:Subscription;

  constructor(){
    super();
    this.form = this.form_builder.group({
      per_documento:new FormControl(
        null,
        [
          Validators.required,
        ]),
      per_tipo_documento:new FormControl(
        null,
        [
          Validators.required,
        ]),
      email:new FormControl(
        null,
        [
          Validators.required,
          Validators.email
        ]),
      per_nombres:new FormControl(
        null,
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.minLength(5),
          noWhiteSpaceValidator()
        ]),
      per_apellidos:new FormControl(
        null,
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.minLength(5),
          noWhiteSpaceValidator()
        ]),
      per_telefono:new FormControl(
        null,
        [
          Validators.required,
          Validators.minLength(10),
        ]),
    });
  }

  get tipo_documento_keys() {
    return Object.keys(this.tipos_documento);
  }

  ngOnInit(): void {
    let {nzData} = this.modal.getConfig();
    let {actualizar_perfil} = nzData;
    this.actualizar_perfil = actualizar_perfil;
    if(!this.actualizar_perfil){
      this.form.addControl('password',
        new FormControl(null));
      this.form.addControl('password2',
        new FormControl(
          null));
      this.form.setValidators(passwordsMatchValidator);
      this.pass_sub = this.form.get('per_documento')!.valueChanges
          .subscribe({
            next: (value) => {
              console.log(value);
              
              this.form.get('password')!.setValue(value);
              this.form.get('password2')!.setValue(value);
            }
          })
    }else{
      let usuario = this.auth_service.usuario()!;
      this.form.patchValue(usuario);
    }
  }

  ngOnDestroy(): void {
    if(this.pass_sub) this.pass_sub.unsubscribe();
  }

  submitForm(){   
    if(this.form.valid){
      const {value} = this.form;
      this.modal.close({form:value});
    }
  }

}
