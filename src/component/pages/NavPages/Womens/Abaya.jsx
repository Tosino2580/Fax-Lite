import { ProductData } from '../../../../productData/ProductData';
import CategoryPage from '../../../CategoryPage';

const abayaIds = ['Large-linen-abaya', 'Negasi-red-abaya', 'Small-aso-oke-abaya', 'Hand-abaya'];
const abayaProducts = ProductData.filter(p => abayaIds.includes(p.id));

const Abaya = () => (
  <CategoryPage
    title="Abaya"
    products={abayaProducts}
    basePath="/products"
    categoryName="Abaya"
    apiCategory="Abaya"
  />
);

export default Abaya;
