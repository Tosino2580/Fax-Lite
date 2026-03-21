import { agbadaDatas } from '../../../../productData/agbadaDatas';
import CategoryPage from '../../../CategoryPage';

const Agbada = () => (
  <CategoryPage
    title="Agbada"
    products={agbadaDatas}
    basePath="/agbada"
    apiCategory="Agbada"
  />
);

export default Agbada;
