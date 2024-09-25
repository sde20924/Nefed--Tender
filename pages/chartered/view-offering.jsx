import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";
import React, { useEffect, useState } from 'react';
import { viewOfferingGetApi } from '../../utils/FetchApi';

const Tenders = () => {
  const [offerings, setOfferings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await viewOfferingGetApi('offering/published-approved'); // Replace 'your-route-here' with the appropriate route
        console.log("API Response:", data);
        const offeringsData = data.offerings || [];
        if (Array.isArray(offeringsData)) {
          setOfferings(offeringsData);
        } else {
          console.error("Offerings data is not an array:", offeringsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredOfferings = offerings.filter(offering =>
    offering.vessel_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <HeaderTitle
        padding={"p-4"}
        subTitle={"View All Offerings"}
        title={"All Offerings"}
        showSearch={true}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />
      <div className="p-4 space-y-4 mr-10 ml-10 pr-10 pl-10">
        {Array.isArray(filteredOfferings) && filteredOfferings.length > 0 ? (
          filteredOfferings.map((offering, index) => {
            const isIndividual = offering.hatch_details.type === 'individual';
            let maxPrice, minPrice, currency;
            if (isIndividual) {
              {/* maxPrice = minPrice = parseFloat(offering.hatch_details.price_per_mt.rate);
              currency = offering.hatch_details.price_per_mt.currency; */}
            } else {
              const rates = offering.hatch_details.hatch_wise_details.map(detail => parseFloat(detail.price_per_mt.rate));
              maxPrice = Math.max(...rates);
              minPrice = Math.min(...rates);
              currency = offering.hatch_details.hatch_wise_details[0].price_per_mt.currency;
            }

            return (
              <div key={index} className="relative border rounded-lg p-4 shadow-lg bg-white">
                <div className="absolute top-2 right-2 flex flex-col items-end">
                  <span className="text-sm font-semibold text-blue-500">{offering.offering_id}</span>
                  <span className="text-sm font-semibold text-green-500">{offering.status.toUpperCase()}</span>
                </div>
                <h2 className="text-xl font-bold mb-2">{offering.vessel_name}</h2>
                <p><strong>Lots Available:</strong> {offering.lots_available.max_lot} - {offering.lots_available.min_lot}</p>
                <p><strong>Vessel Size:</strong> {offering.vessel_size.quantity}</p>
                {isIndividual ? (
                  <>
                    <p><strong>Commodities:</strong> {offering.hatch_details.commodity_name}</p>
                    <p><strong>Price:</strong> {currency} {maxPrice}</p>
                  </>
                ) : (
                  <>
                    <p><strong>Commodities:</strong> {offering.hatch_details.hatch_wise_details.map(detail => detail.commodity_name).join(', ')}</p>
                    <p><strong>Price:</strong> {currency} {minPrice} - {maxPrice}</p>
                  </>
                )}
                <p><strong>Laycan Start Time:</strong> {new Date(parseInt(offering.laycan_start_date)).toLocaleString()}</p>
                <p><strong>Laycan End Time:</strong> {new Date(parseInt(offering.laycan_end_date)).toLocaleString()}</p>
                <p><strong>Ports:</strong> {offering.route_details.port_n_time.map(port => port.port_name).join(', ')}</p>
              </div>
            );
          })
        ) : (
          <p className="text-center">No offerings available.</p>
        )}
      </div>
    </div>
  );
};

Tenders.layout = UserDashboard;
export default Tenders;
