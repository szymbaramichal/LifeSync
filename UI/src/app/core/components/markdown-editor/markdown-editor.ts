import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import EasyMDE from 'easymde';

@Component({
  selector: 'markdown-editor',
  templateUrl: './markdown-editor.html',
  styleUrl: './markdown-editor.css'
})
export class MarkdownEditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editorTextarea', { static: true }) textarea!: ElementRef<HTMLTextAreaElement>;

  @Input() initialValue: string = '';

  @Output() valueChange = new EventEmitter<string>();

  private easyMDE!: EasyMDE;

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

    // Listen to changes in the editor and emit them to Angular
    this.easyMDE.codemirror.on('change', () => {
      this.valueChange.emit(this.easyMDE.value());
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
