import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const DropdownWomen = () => {
  const { t } = useTranslation();

  return (
    <div className="relative group">
      <div className="flex items-center text-white px-4 py-2 cursor-pointer relative w-fit">
        {t('nav.women')}
        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
        <FaChevronDown className="ml-2 w-3 transition-transform duration-300 group-hover:rotate-180" />
      </div>

      <div className="absolute left-0 mt-2 w-52 bg-black/95 backdrop-blur-md text-white border border-white/10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-1 transition-all duration-300 rounded-md">
        <ul className="py-2">
          <li><Link to="/abaya" className="block px-5 py-2.5 text-sm text-gray-300 hover:text-yellow-400 hover:bg-white/5 transition-colors">{t('menu.abaya')}</Link></li>
          <li><Link to="/crop-top" className="block px-5 py-2.5 text-sm text-gray-300 hover:text-yellow-400 hover:bg-white/5 transition-colors">{t('menu.cropTop')}</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default DropdownWomen;
