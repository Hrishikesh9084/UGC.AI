import { PricingTable } from '@clerk/clerk-react'
import { SectionTitle } from '../components/section-title'

const pricingPage = () => {
  return (
    <div className='p-5'>
        <div className='flex flex-col items-center p-8 mt-15'>
        <SectionTitle title='Pricing Plans' description='Our Pricing Plans are simple, transparent and flexible. Choose the plan that best suits your needs.'  />
        </div>
      <PricingTable/>
    </div>
  )
}

export default pricingPage
