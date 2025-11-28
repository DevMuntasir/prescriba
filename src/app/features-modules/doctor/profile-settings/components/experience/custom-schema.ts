import { nodes as basicNodes, marks as basicMarks } from 'ngx-editor';
import { Schema, MarkSpec } from 'prosemirror-model';

// ✅ MarkSpec for font size
const fontSizeMark: MarkSpec = {
  attrs: { size: { default: null } },

  parseDOM: [
    {
      style: 'font-size',
      getAttrs: (value) => {
        if (!value) return false;
        return { size: value }; // e.g. "16px"
      }
    }
  ],

  toDOM(mark) {
    const { size } = mark.attrs;
    const style = size ? `font-size: ${size};` : '';
    return ['span', { style }, 0];
  }
};

// ✅ Extend built-in marks
const marks = {
  ...basicMarks,
  font_size: fontSizeMark
};

// ✅ Extend built-in nodes
const nodes = {
  ...basicNodes
};

export const customSchema = new Schema({ nodes, marks });
