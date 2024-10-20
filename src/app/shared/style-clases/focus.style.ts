import { inject, Renderer2 } from "@angular/core";

export class FormStyle {

    protected renderer = inject(Renderer2);


    onFocus(event:FocusEvent){
        const group = (event.target as HTMLElement).closest('.form-group');
        this.renderer.addClass(group, 'form-group_focus');
    }

    onBlur(event: FocusEvent) {
        const group = (event.target as HTMLElement).closest('.form-group');
        this.renderer.removeClass(group, 'form-group_focus');
    }
}