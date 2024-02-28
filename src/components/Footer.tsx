import Logo from "../asset/svgs/Logo"

const Footer = () => {
  return (
    <footer className='bg-gray-700 flex justify-center text-gray-300'>
      <div className="flex justify-between items-center py-4 px-8 w-full">
        <div className="flex justify-center items-center font-light py-2">
          <i className="fa-regular fa-copyright text-xs" />
          <div className="text-sm ml-2">2024 MinePlugin</div>
        </div>
        <div className="w-6 mr-8">
          <Logo />  
        </div>
      </div>
    </footer>
  )
}

export default Footer