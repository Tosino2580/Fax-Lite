import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'

const Kids = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen pt-28 pb-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <p className="text-yellow-400 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            {t('kids.subtitle')}
          </p>
          <h1 className="text-white text-4xl md:text-5xl font-bold">{t('kids.title')}</h1>
          <div className="w-16 h-[2px] bg-yellow-500 mx-auto mt-4" />
        </div>

        {/* Coming Soon */}
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6">
            <span className="text-4xl">✨</span>
          </div>
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-3">{t('kids.comingSoon')}</h2>
          <p className="text-gray-400 max-w-md mb-8">
            {t('kids.comingSoonDesc')}
          </p>
          <Link to="/collections" className="py-3 px-8 bg-yellow-500 text-black font-bold rounded-md hover:bg-yellow-400 transition-colors uppercase text-sm tracking-wider">
            {t('kids.browseOther')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Kids
