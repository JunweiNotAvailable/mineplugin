import { useEffect, useState } from 'react'
import CodeEditor from '../../components/CodeEditor'
import './style.css';
import Logo from '../../asset/Logo';
import { defaultCode, extractPluginName } from '../../utils/Code';
import { build, downloadFile, updateSpigotFiles } from '../../utils/CodeBuild';
import axios from 'axios';
import { config } from '../../utils/Config';

const EditPage = () => {

  let taskId: NodeJS.Timer;
  const [code, setCode] = useState(defaultCode);
  // status
  const [isChecking, setIsChecking] = useState(true);
  const [isGeneratingFiles, setIsGeneratingFiles] = useState(false);
  const [isBuilding, setIsBuilding] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // check building status every 5 seconds
  useEffect(() => {
    taskId = setInterval(async () => {
      const buildId = localStorage.getItem('MC-Picker-buildId');
      // check status if still building
      if (buildId) {
        setIsGeneratingFiles(false);
        setIsBuilding(true);
        const status = (await axios.get(`${config.api.codeBuild}/track-build?buildId=${buildId}`)).data.status;
        // remove build id from local storage if completed
        console.log(status);
        // start downloading if built success and just finished building
        if (status !== 'IN_PROGRESS') {
          localStorage.removeItem('MC-Picker-buildId');
          setIsBuilding(false);
        }
      // no current build
      } else {
        setIsBuilding(false);
      }
      setIsChecking(false);
    }, 5000);
    return () => taskId && clearInterval(taskId);
  }, []);

  /** 
   * store the code to AWS s3 file
   * trigger AWS CodeBuild and complie the java file
  */
  const generateAndbuild = async () => {
    setIsBuilding(true);
    setIsGeneratingFiles(true);
    // store files to s3
    const pluginName = extractPluginName(code) || '';
    await updateSpigotFiles(pluginName, code);
    // build
    const buildId = await build();
    localStorage.setItem('MC-Picker-buildId', buildId);
  }

  /**
   * get and download file content from s3
  */
  const download = async () => {
    setIsDownloading(true);
    const pluginName = extractPluginName(code) || '';
    await downloadFile(`${pluginName}.jar`, `${pluginName}.jar`);
    setIsDownloading(false);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', height: '100vh' }}>
      <div style={{ maxWidth: 960, width: '100%', padding: 20, boxSizing: 'border-box', flex: 1, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        {/* simple header with download button */}
        <header style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', fontFamily: "'Poppins', sans-seif", fontSize: 20, fontWeight: 800, color: 'var(--main-color)' }}>
            <div style={{ width: 28, marginRight: 16 }}>
              <Logo />
            </div>
            MC Picker
          </div>
          <div style={{ display: 'flex' }}>
            <button className={`main-button${(isBuilding || isGeneratingFiles || isDownloading || isChecking) ? ' disabled' : ''}`} disabled={(isBuilding || isGeneratingFiles || isDownloading || isChecking)} style={{ height: 28, padding: '0 16px' }} onClick={generateAndbuild}>Build</button>
            <button className={`main-button${(isBuilding || isGeneratingFiles || isDownloading || isChecking) ? ' disabled' : ''}`} disabled={(isBuilding || isGeneratingFiles || isDownloading || isChecking)} style={{ height: 28, padding: '0 16px', marginLeft: 16 }} onClick={download}>Download</button>
          </div>
        </header>
        {/* progress */}
        <div style={{ fontWeight: 600, color: '#aaaa', margin: '8px 0', display: 'flex', alignItems: 'center' }}>
          {(isBuilding || isGeneratingFiles || isDownloading || isChecking) && <div style={{ width: 30, marginRight: 16 }}>
            <Logo loading />
          </div>}
          {isChecking ? 'Checking...' : isGeneratingFiles ? 'Generating files...' : isBuilding ? 'Building...' : isDownloading ? 'Downloading...' : ''}
        </div>
        {/* code editor */}
        <div style={{ flex: 1, width: '100%', borderRadius: '.3rem', overflow: 'hidden' }}>
          <CodeEditor code={code} setCode={setCode} />
        </div>
      </div>
    </div>
  )
}

export default EditPage