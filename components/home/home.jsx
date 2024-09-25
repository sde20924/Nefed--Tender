import React from 'react'
import Link from "next/link";


const HomeSection = () => {
  return (
    <section className="header relative pt-16 items-center flex h-screen max-h-860-px">
    <div className="container mx-auto items-center flex flex-wrap">
      <div className="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
        <div className="pt-32 sm:pt-0">
          <h2 className="font-semibold text-4xl text-blueGray-600">
            Find Opportunities in Open Tender Auctions
          </h2>
          <h4 className="mt-4 text-2xl text-blueGray-600">
            The platform, supported by NAFED, facilitates a comprehensive
            registration process for tendor.
          </h4>
          <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
            Discover unparalleled business prospects with our Open Tender
            Auction platform. Unleash growth by navigating transparent
            procurement processes, ensuring fair competition. Find
            opportunities that matter and propel your business forward. Join
            us in revolutionizing open bidding for a future where success is
            just a bid away!
          </p>
          <div className="mt-12">
            {/* <Link
              href="https://www.creative-tim.com/learning-lab/tailwind/nextjs/overview/notus?ref=nnjs-index"
              target="_blank"
              className="get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-blueGray-400 active:bg-blueGray-500 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
            >
              Get started
            </Link> */}
            <Link
              href="https://github.com/creativetimofficial/notus-nextjs?ref=nnjs-index"
              className="github-star ml-1 text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-blueGray-700 active:bg-blueGray-600 uppercase text-sm shadow hover:shadow-lg"
              target="_blank"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </div>
    <img
      className="absolute top-0 b-auto right-0 pt-16 sm:w-6/12 -mt-48 sm:mt-0 w-10/12 max-h-860-px"
      src="/img/pattern_nextjs.png"
      alt="..."
    />
  </section>
  )
}

export default HomeSection