import { Editor } from '@monaco-editor/react'
import React from 'react'

interface Props {
  code: string
  setCode: React.Dispatch<React.SetStateAction<string>>
}

const CodeEditor: React.FC<Props> = React.memo(( props ) => {
  return (
    <Editor
      className='plugin-editor'
      height={'100%'}
      width={'100%'}
      theme='vs'
      defaultLanguage='java'
      value={props.code}
      onChange={text => props.setCode(text || '')}
    />
  )
})

export default CodeEditor