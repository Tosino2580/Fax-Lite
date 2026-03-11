import { useTranslation } from 'react-i18next'

const Arrival = () => {
  const { t } = useTranslation();

  return (
    <section className="pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-yellow-400 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] mb-3">
          {t('arrivals.subtitle')}
        </p>
        <h2 className="text-white text-3xl md:text-5xl font-bold">
          {t('arrivals.title')}
        </h2>
        <div className="w-16 h-[2px] bg-yellow-500 mx-auto mt-4" />
      </div>
    </section>
  )
}

export default Arrival
