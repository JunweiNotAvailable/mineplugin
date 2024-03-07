import Footer from '../../components/Footer'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion';
import { InView } from 'react-intersection-observer';

const Landing = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* hero */}
      <InView>
        {({ ref, inView }) => <div className='flex-1 relative' ref={ref}>
          <div style={{ width: '100%', aspectRatio: '2/1' }}>
            <video loop autoPlay muted>
              <source src={require('./river.mp4')} />
            </video>
          </div>
          <motion.div className='rounded-xl md:absolute top-1/2 md:-translate-y-1/2 px-8 py-16 md:py-8 max-w-xl' style={{ background: '#fffa' }} initial={{ opacity: 0, left: 32 }} animate={{ left: inView ? 64 : 32, opacity: inView ? 1 : 0 }} transition={{ duration: .5, ease: 'linear', delay: .3 }}>
            <div className='font-bold text-4xl'>Build Minecraft plugins in anywhere, at anytime</div>
            <div className='mt-4'>MinePlugin is a free tool to code, build and download Minecraft plugins all in one place.</div>
            <button className='main-button mt-8 text-lg py-1 px-8' onClick={() => navigate('/login')}>Get started</button>
          </motion.div>
        </div>}
      </InView>
      {/* footer */}
      <Footer />
    </>
  )
}

export default Landing