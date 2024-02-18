import { Editor, Monaco } from '@monaco-editor/react'
import React from 'react'

interface Props {
  code: string
  setCode: React.Dispatch<React.SetStateAction<string>>
}

const CodeEditor: React.FC<Props> = React.memo(( props ) => {

  return (
    <Editor
      height={'100%'}
      width={'100%'}
      theme='vs-dark'
      defaultLanguage='java'
      value={props.code}
      onChange={text => props.setCode(text || '')}
    />
  )
})

export default CodeEditor