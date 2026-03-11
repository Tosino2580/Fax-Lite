/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';

const CurrencyContext = createContext();

const currencies = {
  NGN: { symbol: '₦', rate: 1, code: 'NGN', locale: 'en-NG' },
  USD: { symbol: '$', rate: 0.00063, code: 'USD', locale: 'en-US' },
  EUR: { symbol: '€', rate: 0.00058, code: 'EUR', locale: 'de-DE' },
  GBP: { symbol: '£', rate: 0.00050, code: 'GBP', locale: 'en-GB' },
  JPY: { symbol: '¥', rate: 0.094, code: 'JPY', locale: 'ja-JP' },
  ZAR: { symbol: 'R', rate: 0.011, code: 'ZAR', locale: 'en-ZA' },
};

export const CurrencyProvider = ({ children }) => {
  const [currencyCode, setCurrencyCode] = useState(() => {
    return localStorage.getItem('fax_currency') || 'NGN';
  });

  const currency = currencies[currencyCode] || currencies.NGN;

  const changeCurrency = (code) => {
    setCurrencyCode(code);
    localStorage.setItem('fax_currency', code);
  };

  const formatPrice = useCallback((ngnAmount) => {
    const converted = ngnAmount * currency.rate;
    if (currency.code === 'JPY') {
      return `${currency.symbol}${Math.round(converted).toLocaleString(currency.locale)}`;
    }
    return `${currency.symbol}${converted.toLocaleString(currency.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, currencyCode, changeCurrency, formatPrice, currencies }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
