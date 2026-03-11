import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Button = () => {
  const { t } = useTranslation();

  return (
    <div className='flex items-center justify-center py-10'>
      <Link to="/collections">
        <button className='py-3.5 px-10 bg-transparent border-2 border-yellow-500 cursor-pointer text-yellow-400 text-sm font-bold uppercase tracking-wider rounded-md transition-all duration-300 hover:bg-yellow-500 hover:text-black'>
          {t('viewAll')}
        </button>
      </Link>
    </div>
  )
}

export default Button
