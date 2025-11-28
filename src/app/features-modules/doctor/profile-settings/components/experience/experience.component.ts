import {
  Component, EventEmitter, Input, OnChanges, OnDestroy,
  OnInit, Output, SimpleChanges
} from '@angular/core';

import {
  Editor, toDoc, toHTML, Toolbar, NgxEditorModule
} from 'ngx-editor';

import { FormsModule } from '@angular/forms';
import { ColorPickerDirective } from 'ngx-color-picker';  // ✅ directive import

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [
    NgxEditorModule,
    FormsModule,
    ColorPickerDirective,

  ],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent implements OnInit, OnDestroy, OnChanges {
  editor!: Editor;

  @Input() getDocs!: string;

  doc: any = {
    type: 'doc',
    content: [{ type: 'paragraph', content: [] }]
  };

  @Output() saveDoc = new EventEmitter<string>();

  toolbar: Toolbar = [
    ['bold', 'italic', 'underline'],
    ['align_center', 'align_justify', 'align_left', 'align_right'],
    ['ordered_list'],
    ['ordered_list', 'bullet_list'],
    ['link'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
  ];

  pickedColor = '#ff0000';

  ngOnInit(): void {
    this.editor = new Editor();
    if (this.getDocs) this.loadHtml(this.getDocs);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['getDocs']?.currentValue && this.editor) {
      this.loadHtml(this.getDocs);
    }
  }

  private loadHtml(htmlStr: string) {
    try {
      const parsedDoc = toDoc(htmlStr, this.editor.schema);
      this.doc = parsedDoc;
      this.editor.setContent(parsedDoc);
    } catch (e) {
      console.error("Invalid HTML:", e);
    }
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  onSaveClick() {
    const htmlString = toHTML(this.doc, this.editor.schema);
    this.saveDoc.emit(htmlString);
  }

  applyTextColor(color: string) {
    if (!this.editor?.view) return;

    const view = this.editor.view;
    const { state, dispatch } = view;
    const { from, to, empty } = state.selection;

    const markType =
      state.schema.marks['text_color'] ||
      state.schema.marks['textColor'];

    if (!markType) return;

    const mark = markType.create({ color });

    if (empty) dispatch(state.tr.addStoredMark(mark));
    else dispatch(state.tr.addMark(from, to, mark));

    view.focus();
  }

  clearTextColor() {
    if (!this.editor?.view) return;

    const view = this.editor.view;
    const { state, dispatch } = view;
    const { from, to } = state.selection;

    const markType =
      state.schema.marks['text_color'] ||
      state.schema.marks['textColor'];

    if (!markType) return;

    dispatch(state.tr.removeMark(from, to, markType));
    view.focus();
  }
}
