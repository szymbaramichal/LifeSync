import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import EasyMDE from 'easymde';

@Component({
  selector: 'app-markdown-editor',
  standalone: true,
  templateUrl: './markdown-editor.html',
  styleUrl: './markdown-editor.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MarkdownEditor),
      multi: true,
    },
  ],
})
export class MarkdownEditor implements AfterViewInit, OnDestroy, ControlValueAccessor {
  @ViewChild('editorTextarea') editorTextarea!: ElementRef<HTMLTextAreaElement>;

  @Input() placeholder = 'Write your description here...';
  @Input() minHeight = '200px';

  private easyMde: EasyMDE | null = null;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private pendingValue: string | null = null;
  private isDisabled = false;

  ngAfterViewInit(): void {
    this.easyMde = new EasyMDE({
      element: this.editorTextarea.nativeElement,
      placeholder: this.placeholder,
      minHeight: this.minHeight,
      spellChecker: false,
      autofocus: false,
      status: false,
      toolbar: [
        'bold', 'italic', 'heading', '|',
        'quote', 'unordered-list', 'ordered-list', '|',
        'link', '|',
        'preview', 'side-by-side', 'fullscreen', '|',
        'guide',
      ],
    });

    if (this.pendingValue !== null) {
      this.easyMde.value(this.pendingValue);
      this.pendingValue = null;
    }

    if (this.isDisabled) {
      this.easyMde.codemirror.setOption('readOnly', true);
    }

    this.easyMde.codemirror.on('change', () => {
      this.onChange(this.easyMde!.value());
    });

    this.easyMde.codemirror.on('blur', () => {
      this.onTouched();
    });
  }

  ngOnDestroy(): void {
    this.easyMde?.toTextArea();
    this.easyMde?.cleanup();
    this.easyMde = null;
  }

  // --- ControlValueAccessor ---

  writeValue(value: string): void {
    if (this.easyMde) {
      this.easyMde.value(value ?? '');
    } else {
      this.pendingValue = value ?? '';
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (this.easyMde) {
      this.easyMde.codemirror.setOption('readOnly', isDisabled);
    }
  }
}
