import { SectionTitle } from '../components/section-title'
import { PricingTable } from '@clerk/clerk-react'

const pricingPage = () => {
  return (
    <div>
      <div className="md:flex flex-col items-center mt-15">
                <SectionTitle title='Pricing Plans' description='Our Pricing Plans are simple, transparent and flexible. Choose the plan that best suits your needs.' />
            </div>
            <div className='w-full max-w-5xl mx-auto z-20 max-md:px-4'>
                <div className='pt-14 py-4 px-4 '>
                    <div className='flex flex-wrap items-center justify-center gap-4'>
                       <PricingTable appearance={{
                         variables:{
                            colorBackground: 'none'
                         },
                         elements:{
                            pricingTableCardBody: 'bg-white/6',
                            pricingTableCardHeader: 'bg-white/10'
                         }
                       }} />
                    </div>
                </div>
            </div>
    </div>
  )
}

export default pricingPage
