import { KaftanData } from '../../../../productData/KaftanData';
import CategoryPage from '../../../CategoryPage';

const Kaftan = () => (
  <CategoryPage
    title="Kaftan"
    breadcrumbLabel="Kaftan / Shirts"
    products={KaftanData}
    basePath="/kafans-shirts"
    apiCategory="Kaftan"
  />
);

export default Kaftan;
