import React, { useEffect, useState } from 'react'
import { FetchProps } from './DocSidebar'

const DocList: React.FC<FetchProps> = ({ fetchLink, parentDir }) => {

  const [dirs, setDirs] = useState<any[]>([]);
  const [dirsOpen, setDirsOpen] = useState<any>({});
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      // Get items from link
      try {
        const res = await fetch(fetchLink);
        const data = await res.json();
        setDirs(data.filter((item: any) => item.type === 'dir').sort((a: any, b: any) => a.name < b.name ? -1 : 1));
        setFiles(data.filter((item: any) => item.type === 'file').sort((a: any, b: any) => a.name < b.name ? -1 : 1).map((file: any) => { return { ...file, name: file.name.replace('.java', '') } }));
      } catch (error) {
        console.log(error)
      }
    })();
  }, []);

  // Setup folder open status
  useEffect(() => {
    setDirsOpen(dirs.reduce((acc, curr) => ({ ...acc, [curr.name]: false }), {}));
  }, [dirs]);


  return (
    <div className='flex flex-col text-sm'>
      {/* dirs */}
      {dirs.map(dir => <div className='mb-1'>
        <div className='flex justify-between items-center text-gray-500 cursor-pointer p-1' onClick={(e) => !(e.target as HTMLElement).classList.contains('dir-name') && setDirsOpen({ ...dirsOpen, [dir.name]: !dirsOpen[dir.name] })}>
          <div className='dir-name font-medium hover:text-blue-400' onClick={() => window.open(`https://hub.spigotmc.org/javadocs/bukkit/org/bukkit/${parentDir}/${dir.name}/package-summary.html`)}>{dir.name}</div>
          <i className={`text-xs fa-solid fa-angle-${dirsOpen[dir.name] ? 'down' : 'right'}`} />
        </div>
        {dirsOpen[dir.name] && <div className='pl-1 border-l'>
          <DocList fetchLink={`${fetchLink}/${dir.name}`} parentDir={`${parentDir}/${dir.name}`} />
        </div>}
      </div>)}
      {/* files */}
      {files.map(file => <div className='flex justify-between items-center text-gray-400 cursor-pointer mt-1 p-1 hover:text-blue-400' onClick={() => window.open(`https://hub.spigotmc.org/javadocs/bukkit/org/bukkit/${parentDir}/${file.name}.html`)}>
        <div className='font-bold text-xs'>{file.name}</div>
      </div>)}
    </div>
  )
}

export default DocList