import { useState } from 'react'
import CodeEditor from '../../components/CodeEditor'
import './style.css';

const EditPage = () => {

  const [code, setCode] = useState('');

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', height: '100vh' }}>
      <div style={{ maxWidth: 960, width: '100%', padding: 20, boxSizing: 'border-box', flex: 1, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        {/* simple header with download button */}
        <header style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: "'Poppins', sans-seif", fontSize: 20, fontWeight: 800 }}>MC Picker</div>
          <button className='main-button' style={{ padding: '4px 16px' }}>Download</button>
        </header>
        {/* progress */}
        <div style={{ fontWeight: 600, color: '#aaaa', margin: '8px 0' }}>
          Building...
        </div>
        {/* code editor */}
        <div style={{ flex: 1 }}>
          <CodeEditor code={code} setCode={setCode} />
        </div>
      </div>
    </div>
  )
}

export default EditPage