import Section from '../Section'
import Arrival from '../Arrival'
import ProductList from '../ProductList'
import Button from '../../Button'
import Story from '../Story'
import CategoryCarousel from '../CategoryCarousel'
import RecentlyViewed from '../RecentlyViewed'

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Section />
      <Arrival />
      <ProductList />
      <Button />
      <CategoryCarousel />
      <RecentlyViewed />
      <Story />
    </div>
  )
}

export default Home
