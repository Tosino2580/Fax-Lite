import { useTranslation } from 'react-i18next';
import ProductList from '../../ProductList'

const Collections = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen pt-28 pb-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <p className="text-yellow-400 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            {t('collections.subtitle')}
          </p>
          <h1 className="text-white text-4xl md:text-5xl font-bold">{t('collections.title')}</h1>
          <div className="w-16 h-[2px] bg-yellow-500 mx-auto mt-4" />
          <p className="text-gray-400 mt-4 max-w-lg mx-auto">
            {t('collections.description')}
          </p>
        </div>

        {/* Products Grid */}
        <ProductList />
      </div>
    </div>
  )
}

export default Collections
