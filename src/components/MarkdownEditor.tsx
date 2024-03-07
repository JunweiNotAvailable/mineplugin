import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBold, faCode, faHeading, faItalic, faLink, faListOl, faListUl } from "@fortawesome/free-solid-svg-icons";
import UIWMarkdownEditor from '@uiw/react-markdown-editor';
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import './style.css';

interface Props {
  source: string
  setSource: React.Dispatch<React.SetStateAction<string>>
}

const MarkdownEditor: React.FC<Props> = React.memo(({ source, setSource }) => {

  const textareaRef = useRef(null);
  const [mode, setMode] = useState('write'); // the current mode of editor - write/preview

  // insert markdown format 
  const insertMarkdownFormat = (format: string) => {
    const easyFormats = {
      heading: { start: '### ', end: '' },
      bold: { start: '**', end: '**' },
      italic: { start: '*', end: '*' },
      code: { start: '`', end: '`' },
      link: { start: '[', end: '](url)' },
    }
    const textarea = textareaRef.current as any as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // when format is list
    if (format === 'ol' || format === 'ul') {
      // insert list
      const lines = textarea.value.split('\n'); // array of all lines
      const currLineIndex = textarea.value.substring(0, start).split('\n').length - 1; // get index of line the cursor is on
      // combine all lines with list format
      let newText;
      if (currLineIndex === 0) {
        let firstLine = lines[currLineIndex];
        if (format === 'ol') { // numeric list
          if (/^[-*]\s/.test(firstLine)) firstLine = firstLine.replace(/^[-*]\s/, '');
          firstLine = (/^\d+\.\s/.test(firstLine) ? firstLine.replace(/^\d+\.\s/, '') : `1. ${firstLine}`);
        } else { // bullet list
          if (/^\d+\.\s/.test(firstLine)) firstLine = firstLine.replace(/^\d+\.\s/, '');
          firstLine = (/^[-*]\s/.test(firstLine) ? firstLine.replace(/^[-*]\s/, '') : `- ${firstLine}`);
        }
        newText = [firstLine, ...lines.slice(1)].reduce((prev, currLine, i) => `${prev}\n${currLine}`);
      } else {
        newText = lines.reduce((prev, currLine, i) => {
          if (i === currLineIndex) {
            if (format === 'ol') { // numeric list
              if (/^[-*]\s/.test(currLine)) currLine = currLine.replace(/^[-*]\s/, '');
              currLine = (/^\d+\.\s/.test(currLine) ? currLine.replace(/^\d+\.\s/, '') : `1. ${currLine}`);
            } else { // bullet list
              if (/^\d+\.\s/.test(currLine)) currLine = currLine.replace(/^\d+\.\s/, '');
              currLine = (/^[-*]\s/.test(currLine) ? currLine.replace(/^[-*]\s/, '') : `- ${currLine}`);
            }
          }
          return `${prev}\n${currLine}`;
        });
      } 
      setSource(newText);
      // Focus on the textarea and set the cursor position
      textarea.focus();
      setTimeout(() => textarea.setSelectionRange(start, end), 10);
    // when it's other format
    } else {
      // insert easy format
      const selectedText = textarea.value.substring(start, end);
      const newText = `${textarea.value.slice(0, start)}${easyFormats[format as keyof typeof easyFormats].start}${selectedText}${easyFormats[format as keyof typeof easyFormats].end}${textarea.value.slice(end)}`;
      setSource(newText);
      // Set the new selection range (end of selected text)
      const newSelectionStart = start + easyFormats[format as keyof typeof easyFormats].start.length;
      const newSelectionEnd = newSelectionStart + selectedText.length;
      // Focus on the textarea and set the cursor position
      textarea.focus();
      setTimeout(() => textarea.setSelectionRange(newSelectionStart, newSelectionEnd), 10);
    }
  };

  // textarea keydown handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // generate list format when pressing enter
    if (e.key === 'Enter') {
      const textarea = textareaRef.current as any as HTMLTextAreaElement;
      let lines = textarea.value.split('\n');
      const prevLineIndex = textarea.value.substring(0, textarea.selectionStart).split('\n').length - 2;
      if (/^[-*]\s/.test(lines[prevLineIndex].trim())) { // the previous line is ul
        lines[prevLineIndex + 1] = (' '.repeat(/^(\s*)[-*]\s/.exec(lines[prevLineIndex])?.[1].length || 0)) + '- ' + lines[prevLineIndex + 1];
        const newText = lines.reduce((prev, currLine, i) => prev + '\n' + currLine);
        setSource(newText);
      } else if (/^\d+\.\s/.test(lines[prevLineIndex].trim())) {
        const match = /^(\s*)\d+\.\s/.exec(lines[prevLineIndex]);
        lines[prevLineIndex + 1] = (' '.repeat(match?.[1].length || 0)) + `${parseInt(match?.[0] || '1') + 1}. ` + lines[prevLineIndex + 1];
        const newText = lines.reduce((prev, currLine, i) => prev + '\n' + currLine);
        setSource(newText);
      }
      const newPosition = lines.slice(0, prevLineIndex + 2).reduce((prev, currLine, i) => prev + currLine.length + 1, 0) - 1;
      textarea.focus();
      setTimeout(() => textarea.setSelectionRange(newPosition, newPosition), 10);
    }
  }

  return (
    <div className="flex-1 flex flex-col border rounded-lg min-h-72 p-2" style={{ borderColor: '#dadbdc' }}>
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <button className={`md-editor-button ${mode === 'write' ? ' bg-gray-100' : ''} mr-2 hover:bg-gray-100`} style={{ color: mode === 'write' ? '#444' : '#888' }} onClick={() => setMode('write')}>Write</button>
          <button className={`md:mt-0 mt-1 md-editor-button ${mode === 'preview' ? ' bg-gray-100' : ''} hover:bg-gray-100`} style={{ color: mode === 'preview' ? '#444' : '#888' }} onClick={() => setMode('preview')}>Preview</button>
        </div>
        {mode === 'write' && <div className={`action-bar`}>
          <button className="hover:bg-gray-100" onClick={() => insertMarkdownFormat('heading')}><FontAwesomeIcon icon={faHeading} /></button>
          <button className="hover:bg-gray-100" onClick={() => insertMarkdownFormat('bold')}><FontAwesomeIcon icon={faBold} /></button>
          <button className="hover:bg-gray-100" onClick={() => insertMarkdownFormat('italic')}><FontAwesomeIcon icon={faItalic} /></button>
          <button className="hover:bg-gray-100" onClick={() => insertMarkdownFormat('code')}><FontAwesomeIcon icon={faCode} /></button>
          <button className="hover:bg-gray-100" onClick={() => insertMarkdownFormat('link')}><FontAwesomeIcon icon={faLink} /></button>
          <button className="hover:bg-gray-100" onClick={() => insertMarkdownFormat('ol')}><FontAwesomeIcon icon={faListOl} /></button>
          <button className="hover:bg-gray-100" onClick={() => insertMarkdownFormat('ul')}><FontAwesomeIcon icon={faListUl} /></button>
        </div>}
      </div>
      {/* textarea / preview */}
      {mode === 'write' ?
        <div className="flex flex-col flex-1">
          <textarea ref={textareaRef} className="main-input text-sm resize-none border mt-2 w-full flex-1" placeholder="Tell the details about your plugin, e.g. how it works" value={source} onKeyDown={(e) => setTimeout(() => handleKeyDown(e), 10)} onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSource(e.target.value)} />
          <div className="text-xs text-gray-400 mt-1"><FontAwesomeIcon icon={faMarkdown} className="mr-1" />Markdown</div>
        </div>
        : <div className="mt-2 w-full flex-1 p-2"><UIWMarkdownEditor.Markdown className={`markdown-content`} source={source} /></div>}
    </div>
  );
})

MarkdownEditor.displayName = 'MarkdownEditor';

export default MarkdownEditor;