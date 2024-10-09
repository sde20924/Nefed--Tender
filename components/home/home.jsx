import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { callApiGet } from '../../utils/FetchApi'; // Adjust the path based on your project structure

const HomeSection = () => {
  // State variables to hold the title, subheading, and description
  const [title, setTitle] = useState('');
  const [subheading, setSubheading] = useState('');
  const [description, setDescription] = useState('');

  // Fetch data from the server when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await callApiGet('/get-home-page-content'); // Use the correct route
        if (response.success && response.data) {
          // Set the state variables with the data from the server
          setTitle(response.data.title);
          setSubheading(response.data.subheading);
          setDescription(response.data.description);
        } else {
          console.error('Failed to load homepage data');
        }
      } catch (error) {
        console.error('Error fetching homepage content:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run only once on component mount

  return (
    <section className="header relative pt-16 items-center flex h-screen max-h-860-px">
      <div className="container mx-auto items-center flex flex-wrap">
        <div className="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
          <div className="pt-32 sm:pt-0">
            <h2 className="font-semibold text-4xl text-blueGray-600">
              {title || 'Loading title...'} {/* Fallback text if data isn't ready */}
            </h2>
            <h4 className="mt-4 text-2xl text-blueGray-600">
              {subheading || 'Loading subheading...'} {/* Fallback text if data isn't ready */}
            </h4>
            <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
              {description || 'Loading description...'} {/* Fallback text if data isn't ready */}
            </p>
            <div className="mt-12">
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
  );
};

export default HomeSection;
