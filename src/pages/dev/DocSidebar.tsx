import React, { useEffect, useState } from 'react'
import DocList from './DocList';

export interface FetchProps {
  fetchLink: string
  parentDir: string
}

const DocSidebar: React.FC<FetchProps> = ({ fetchLink, parentDir }) => {

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
    <aside className='w-80 box-border px-4 pb-4 sticky top-0 shadow scroller'>
      <div className='text-sm font-bold mt-4 flex items-center justify-between'>
        <div>Bukkit Resources</div>
        <button className='text-xs text-gray-500' onClick={() => window.open('https://hub.spigotmc.org/javadocs/bukkit/')}>Spigit MC<i className='ml-2 fa-solid fa-arrow-up-right-from-square' /></button>
      </div>
      <div className='mt-2 flex flex-col text-sm'>
        {/* dirs */}
        {dirs.map(dir => <div className='mb-1'>
          <div className='flex justify-between items-center text-gray-500 cursor-pointer p-1 mb-1 sticky top-0 z-10 bg-white' onClick={(e) => !(e.target as HTMLElement).classList.contains('dir-name') && setDirsOpen({ ...dirsOpen, [dir.name]: !dirsOpen[dir.name] })}>
            <div className='dir-name font-medium hover:text-blue-400' onClick={() => window.open(`https://hub.spigotmc.org/javadocs/bukkit/org/bukkit/${dir.name}/package-summary.html`)}>{dir.name}</div>
            <i className={`text-xs fa-solid fa-angle-${dirsOpen[dir.name] ? 'down' : 'right'}`} />
          </div>
          {dirsOpen[dir.name] && <div className='px-2 border-l'>
            <DocList fetchLink={`${fetchLink}/${dir.name}`} parentDir={dir.name} />
          </div>}
        </div>)}
        {/* files */}
        {files.map(file => <div className='flex justify-between items-center text-gray-400 cursor-pointer my-1 p-1 hover:text-blue-400' onClick={() => window.open(`https://hub.spigotmc.org/javadocs/bukkit/org/bukkit/${file.name}.html`)}>
          <div className='font-bold text-xs'>{file.name}</div>
        </div>)}
      </div>
    </aside>
  )
}

export default DocSidebar