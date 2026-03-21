import { ProductData } from '../../../../productData/ProductData';
import CategoryPage from '../../../CategoryPage';

const cropTopIds = ['Takunsi-crop-top', 'Bishop-collar-shirt', 'Takunsi-aso-oke-crop-top', 'Hand-painted-crop-top'];
const cropTopProducts = ProductData.filter(p => cropTopIds.includes(p.id));

const CropTop = () => (
  <CategoryPage
    title="Crop Top"
    products={cropTopProducts}
    basePath="/products"
    categoryName="CropTop"
    apiCategory="CropTop"
  />
);

export default CropTop;
