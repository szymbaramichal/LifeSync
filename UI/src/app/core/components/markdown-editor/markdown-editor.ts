import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
  forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import EasyMDE from 'easymde';

@Component({
  selector: 'markdown-editor',
  templateUrl: './markdown-editor.html',
  styleUrl: './markdown-editor.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MarkdownEditorComponent),
      multi: true
    }
  ]
})
export class MarkdownEditorComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  @ViewChild('editorTextarea', { static: true }) textarea!: ElementRef<HTMLTextAreaElement>;

  @Input() initialValue: string = '';

  @Output() valueChange = new EventEmitter<string>();

  private easyMDE!: EasyMDE;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  // Called by Angular when the form control value changes programmatically
  writeValue(value: string): void {
    if (this.easyMDE) {
      this.easyMDE.value(value ?? '');
    } else {
      // Store until ngAfterViewInit
      this.initialValue = value ?? '';
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  ngAfterViewInit(): void {
    this.easyMDE = new EasyMDE({
      element: this.textarea.nativeElement,
      initialValue: this.initialValue,
      spellChecker: false,
      toolbar: [
        "bold", "italic", "heading", "|",
        "quote", "unordered-list", "ordered-list", "|",
        "link", "image", "|",
        "preview", "side-by-side", "fullscreen", "|",
        "guide"
      ]
    });

    // Notify Angular forms and emit output on every change
    this.easyMDE.codemirror.on('change', () => {
      const val = this.easyMDE.value();
      this.onChange(val);
      this.valueChange.emit(val);
    });

    this.easyMDE.codemirror.on('blur', () => {
      this.onTouched();
    });
  }

  ngOnDestroy(): void {
    // Crucial: Clean up the instance to prevent memory leaks
    if (this.easyMDE) {
      this.easyMDE.toTextArea();
      this.easyMDE = null as any;
    }
  }
}
