import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const DropdownMen = () => {
  const { t } = useTranslation();

  const menuItems = [
    { path: "/jalabiya", label: t('menu.jalabiya') },
    { path: "/kafans-shirts", label: t('menu.kaftans') },
    { path: "/agbada", label: t('menu.agbada') },
    { path: "/casuals", label: t('menu.casuals') },
    { path: "/t-shirt", label: t('menu.tshirts') },
    { path: "/pants", label: t('menu.pants') },
  ];

  return (
    <div className="relative group">
      <div className="flex items-center text-white px-4 py-2 cursor-pointer relative w-fit">
        {t('nav.men')}
        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
        <FaChevronDown className="ml-2 w-3 transition-transform duration-300 group-hover:rotate-180" />
      </div>
      <div className="absolute left-0 mt-2 w-52 bg-black/95 backdrop-blur-md text-white border border-white/10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-1 transition-all duration-300 rounded-md">
        <ul className="py-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className="block px-5 py-2.5 text-sm text-gray-300 hover:text-yellow-400 hover:bg-white/5 transition-colors">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DropdownMen;