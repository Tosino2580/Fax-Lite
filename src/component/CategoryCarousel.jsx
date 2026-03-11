import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { images } from "../productData/Images";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const CategoryCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handlePrevious = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    }, []);

    const handleNext = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % images.length);
    }, []);

    useEffect(() => {
        const interval = setInterval(handleNext, 4000);
        return () => clearInterval(interval);
    }, [handleNext]);

    return (
        <section className="w-full bg-black text-white py-20 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <p className="text-yellow-400 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] mb-3">
                        {t('carousel.subtitle')}
                    </p>
                    <h2 className="text-3xl md:text-5xl font-bold">{t('carousel.title')}</h2>
                    <div className="w-16 h-[2px] bg-yellow-500 mx-auto mt-4" />
                </div>

                {/* Carousel */}
                <div className="relative">
                    <div className="flex gap-6 justify-center items-center">
                        {images.map((item, index) => {
                            const isActive = index === activeIndex;
                            const isAdjacent = index === (activeIndex + 1) % images.length || index === (activeIndex - 1 + images.length) % images.length;

                            return (
                                <div
                                    key={index}
                                    className={`transition-all duration-500 ease-in-out cursor-pointer ${
                                        isActive ? 'scale-100 opacity-100' : isAdjacent ? 'scale-90 opacity-60 hidden md:block' : 'hidden'
                                    }`}
                                    onClick={() => isActive ? navigate(item.link) : setActiveIndex(index)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && navigate(item.link)}
                                    aria-label={`Go to ${item.title} category`}
                                >
                                    <div className="flex flex-col items-center">
                                        <div className={`rounded-full overflow-hidden border-2 transition-colors duration-300 ${isActive ? 'border-yellow-500' : 'border-transparent'}`}>
                                            <img
                                                src={item.src}
                                                alt={item.title}
                                                className="w-44 h-44 md:w-64 md:h-64 object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                        <p className={`text-center mt-4 text-lg md:text-xl font-bold transition-colors duration-300 ${isActive ? 'text-yellow-400' : 'text-gray-400'}`}>
                                            {item.title}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Controls */}
                <div className="mt-10 flex items-center justify-center gap-6">
                    <button
                        onClick={handlePrevious}
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-yellow-500 hover:border-yellow-500 hover:text-black transition-all cursor-pointer"
                        aria-label="Previous category"
                    >
                        <FaChevronLeft size={14} />
                    </button>
                    <div className="flex gap-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                    index === activeIndex ? 'w-8 bg-yellow-500' : 'w-2 bg-white/30 hover:bg-white/50'
                                }`}
                                aria-label={`Go to category ${index + 1}`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={handleNext}
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-yellow-500 hover:border-yellow-500 hover:text-black transition-all cursor-pointer"
                        aria-label="Next category"
                    >
                        <FaChevronRight size={14} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CategoryCarousel;