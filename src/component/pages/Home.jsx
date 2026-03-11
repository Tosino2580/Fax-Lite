import Section from '../Section'
import Arrival from '../Arrival'
import ProductList from '../ProductList'
import Button from '../../Button'
import Story from '../Story'
import CategoryCarousel from '../CategoryCarousel'

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Section />
      <Arrival />
      <ProductList />
      <Button />
      <CategoryCarousel />
      <Story />
    </div>
  )
}

export default Home
