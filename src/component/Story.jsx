import { motion } from 'framer-motion'
import ShowRoom from '/src/assets/images/trax_showroom.webp'
import { useTranslation } from 'react-i18next'

const Story = () => {
    const { t } = useTranslation();

    return (
        <section className='max-w-7xl mx-auto px-6 md:px-10 py-20'>
            <div className='text-center mb-12'>
                <p className="text-yellow-400 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] mb-3">
                    {t('story.subtitle')}
                </p>
                <h2 className='text-white text-3xl md:text-5xl font-bold'>{t('story.title')}</h2>
                <div className="w-16 h-[2px] bg-yellow-500 mx-auto mt-4" />
            </div>

            <div className='flex flex-col md:flex-row items-center gap-10 md:gap-16'>
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className='md:w-1/2 space-y-6'
                >
                    <h3 className='text-white text-2xl md:text-3xl font-semibold leading-snug'>
                        {t('story.heading')}
                    </h3>
                    <p className='text-gray-400 leading-relaxed'>
                        {t('story.p1')}
                    </p>
                    <p className='text-gray-400 leading-relaxed'>
                        {t('story.p2')}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className='md:w-1/2'
                >
                    <img src={ShowRoom} alt="FAX Collections Showroom" className='rounded-xl w-full object-cover shadow-2xl' />
                </motion.div>
            </div>
        </section>
    )
}

export default Story
