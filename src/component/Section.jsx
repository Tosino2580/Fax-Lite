import { motion } from 'framer-motion'
import Image from '/src/assets/images/MEN/Casual/front-image.webp'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Section = () => {
  const { t } = useTranslation();

  return (
    <section className="relative w-full min-h-screen overflow-hidden pt-16">
      {/* Hero Image */}
      <div className="absolute inset-0">
        <img src={Image} alt="FAX Collections Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-end min-h-screen pb-20 md:pb-32 px-6 md:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <p className="text-yellow-400 text-sm md:text-base font-semibold uppercase tracking-[0.2em] mb-4">
            {t('hero.badge')}
          </p>
          <h1 className="text-4xl md:text-7xl font-bold text-white leading-tight mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-gray-300 text-base md:text-lg mb-8 max-w-lg">
            {t('hero.subtitle')}
          </p>
          <Link to="/collections">
            <button className="py-3.5 px-8 bg-yellow-500 cursor-pointer text-black text-sm md:text-base font-bold uppercase tracking-wider rounded-md transition-all duration-300 hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-500/20">
              {t('hero.cta')}
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default Section
