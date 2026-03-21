import { JalabiyaDatas } from '../../../../productData/JalabiyaDatas';
import CategoryPage from '../../../CategoryPage';

const Jalabiya = () => (
  <CategoryPage
    title="Jalabiya"
    products={JalabiyaDatas}
    basePath="/jalabiya"
    apiCategory="Jalabiya"
  />
);

export default Jalabiya;
