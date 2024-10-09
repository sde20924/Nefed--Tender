import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import NotificationDropdown from "@/components/Dropdowns/NotificationDropdown";
import UserDropdown from "@/components/Dropdowns/UserDropdown";

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = useState("hidden");
  const [currentuser, setCurrentUser] = useState("admin");
  const [expandedItems, setExpandedItems] = useState({});
  const [tagId, setTagId] = useState(null);
  const router = useRouter();

  // Keep track of expanded items even after navigation
  useEffect(() => {
    const currentPath = router.pathname;
    const expandedItemsClone = { ...expandedItems };
    menus[currentuser].forEach((item) => {
      if (
        item.children &&
        item.children.some((child) => child.route === currentPath)
      ) {
        expandedItemsClone[item.id] = true;
      }
    });
    setExpandedItems(expandedItemsClone);
  }, [router.pathname, currentuser]);

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isActive = (item) => {
    // Check if the item or any of its children is active
    if (router.pathname === item.route) {
      return true;
    }
    if (item.children) {
      return item.children.some((child) => router.pathname === child.route);
    }
    return false;
  };

  //menus
  const menus = {
    admin: [
      {
        id: 0,
        icon: "fas fa-tachometer-alt",
        name: "dashboard",
        route: "/dashboard",
        active: true,
      },
      {
        id: 1,
        icon: "fas fa-user",
        name: "profile",
        route: "/admin/profile",
        active: true,
      },
      {
        id: 9,
        icon: "fas fa-shopping-cart",
        name: "Tags",
        route: "/buyers/buyer-tags",
        active: true,
        children: [
          { id: 1, name: "Buyer Tags", route: "/buyers/buyer-tags" },
          { id: 2, name: "Seller Tags", route: "/sellers/seller-tags" },
        ],
      },
      {
        id: 2,
        icon: "fas fa-shopping-cart",
        name: "All Buyers",
        route: "/buyers",
        active: true,
        children: [
          { id: 1, name: "Verified Buyers", route: "/buyers" },
          { id: 2, name: "New Application", route: "/buyers/new-applications" },
          {
            id: 3,
            name: "Rejected Application",
            route: "/buyers/rejected-applications",
          },
        ],
      },
      {
        id: 3,
        icon: "fas fa-store",
        name: "All Sellers",
        route: "/sellers",
        active: true,
        children: [
          { id: 1, name: "Verified Sellers", route: "/sellers" },
          {
            id: 2,
            name: "New Application",
            route: "/sellers/new-applications",
          },
          {
            id: 3,
            name: "Rejected Application",
            route: "/sellers/rejected-applications",
          },
        ],
      },
      {
        id: 4,
        icon: "fas fa-users-cog",
        name: "managers",
        route: "/managers",
        active: true,
      },
      {
        id: 5,
        icon: "fas fa-file-contract",
        name: "Tenders",
        route: "/tenders",
        active: true,
        children: [
          { id: 1, name: "Tenders", route: "/tenders" },
          { id: 2, name: "Add Tender", route: "/tenders/add-tender" },
        ],
      },
      {
        id: 6,
        icon: "fas fa-file-contract",
        name: "Reports",
        route: "/reports/auction-bids",
        active: true,
        children: [
          { id: 1, name: "Auction Bids", route: "/reports/auction-bids" },
          {
            id: 2,
            name: "Tender Allotment",
            route: "/reports/tender-allotment",
          },
          { id: 3, name: "Action Logs", route: "/reports/action-logs" },
          { id: 4, name: "Bid Allotment", route: "/reports/bid-allotment" },
          { id: 5, name: "Bid Position", route: "/reports/bid-position" },
        ],
      },
      {
        id: 7,
        icon: "fas fa-file-contract",
        name: "Content Management",
        route: "/content-management/mail",
        active: true,
        children: [
          {
            id: 1,
            name: "Mail/SMS Templates",
            route: "/content-management/mail",
          },
          { id: 2, name: "Pages", route: "/content-management/pages" },
        ],
      },
      {
        id: 8,
        icon: "fas fa-file-contract",
        name: "Setup and Configuration",
        route: "/setting/basic-details",
        active: true,
        children: [
          { id: 1, name: "Basic Details", route: "/setting/basic-details" },
          {
            id: 2,
            name: "General Configurations",
            route: "/setting/general-configration",
          },
          {
            id: 3,
            name: "Mail/SMS Configuration",
            route: "/setting/mail-configration",
          },
          { id: 4, name: "Features Activation", route: "/setting/features" },
        ],
      },
    ],
    buyer: [
      {
        id: 0,
        icon: "fas fa-tachometer-alt",
        name: "dashboard",
        route: "/dashboard",
        active: true,
      },
      {
        id: 1,
        icon: "fas fa-user",
        name: "profile",
        route: "/profile",
        active: true,
      },
      {
        id: 2,
        icon: "fas fa-users-cog",
        name: "managers",
        route: "/managers",
        active: true,
      },
        {
          id: 4,
          icon: "fas fa-file-contract",
          name: "Tenders",
          route: "/tenders",
          active: true,
          children: [
            { id: 1, name: "My Tenders", route: "/tenders/my-tenders"},
            { id: 2, name: "Explore Tender", route: "/tenders/explore-tenders" },
            { id: 3, name: "My Applications", route: "/tenders/my-applications" },
          ],
        },
    ],
    seller: [
      {
        id: 0,
        icon: "fas fa-tachometer-alt",
        name: "dashboard",
        route: "/dashboard",
        active: true,
      },
      {
        id: 1,
        icon: "fas fa-user",
        name: "profile",
        route: "/profile",
        active: true,
      },
      {
        id: 2,
        icon: "fas fa-users-cog",
        name: "managers",
        route: "/managers",
        active: true,
      },
      {
        id: 3,
        icon: "fas fa-file-contract",
        name: "Tenders",
        route: "/tenders",
        active: true,
        children: [
          { id: 1, name: "Tenders", route: "/tenders" },
          { id: 2, name: "Add Tender", route: "/tenders/add-tender" },
        ],
      },
      {
        id: 4,
        icon: "fas fa-file-contract",
        name: "Applications",
        route: "/tenders/sellerSideApplication",
        active: true,
      },
      {
        id: 5,
        icon: "fas fa-file-contract",
        name: "Reports",
        route: "/reports/auction-bids",
        active: true,
        children: [
          { id: 1, name: "Auction Bids", route: "/reports/auction-bids" },
          {
            id: 2,
            name: "Tender Allotment",
            route: "/reports/tender-allotment",
          },
          { id: 3, name: "Auction Logs", route: "/reports/auction-logs" },
          { id: 4, name: "Bid Allotment", route: "/reports/bid-allotment" },
          { id: 5, name: "Bid Position", route: "/reports/bid-position" },
          { id: 6, name: "Mini Summary", route: "/reports/mini-summary" },
          { id: 7 , name: "Tender Party Wise", route: "/reports/tender-party-wise" },
          { id: 8 , name: "Tender Challan", route: "/reports/tender-challan" }
        ],
      },
      {
        id: 6,
        icon: "fas fa-file-contract",
        name: "Administrator",
        route: "/administrator/admin-Management",
        active: true,
        children:[
          {id :1 , name : "Admin Management", route:"/administrator/admin-Management"},
          {id :2 , name : "User Management", route:"/administrator/user-Management"},
          {id :3 , name : "Manager Management", route:"/administrator/manager-Management"}
        ]
      },
      {
        id: 7,
        icon: "fas fa-file-contract",
        name: "Content Management",
        route: "/content-management/slider-group",
        active: true,
        children: [
          {
            id: 1,
            name: "Slider Group",
            route: "/content-management/slider-group",
          },
          { id: 2, name: "Paragraph Content", route: "/content-management/paragraph-content"},
          { id: 3, name: "Pages", route: "/content-management/page" },
        ],
      },
    ],
    manager: [
      {
        id: 0,
        icon: "fas fa-tachometer-alt",
        name: "dashboard",
        route: "/dashboard",
        active: true,
      },
      {
        id: 1,
        icon: "fas fa-user",
        name: "profile",
        route: "/profile",
        active: true,
      },
      {
        id: 2,
        icon: "fas fa-users-cog",
        name: "Client's",
        route: "/clients/buyers",
        active: true,
        children: [
          { id: 1, name: "Buyers", route: "/clients/buyers" },
          { id: 2, name: "Seller", route: "/clients/sellers" },
          { id: 3, name: "Admin", route: "/clients/admins" },
        ],
      },
      {
        id: 3,
        icon: "fas fa-file-contract",
        name: "Tenders",
        route: "/tenders",
        active: true,
        children: [
          { id: 1, name: "Tenders", route: "/tenders" },
          { id: 2, name: "Add Tender", route: "/tenders/add-tender" },
        ],
      },
    ],
  };

  if (tagId === 7) {
    menus.buyer.push({
      id: 4,
      icon: "fas fa-file-contract",
      name: "Shippers",
      route: "/shippers/create-requirements",
      active: true,
      children: [
        {
          id: 1,
          name: "Create Requirements",
          route: "/shippers/create-requirements",
        },
        {
          id: 2,
          name: "View Requirements",
          route: "/shippers/view-requirements",
        },
        { id: 3, name: "View Offerings", route: "/shippers/view-offerings" },
        {
          id: 4,
          name: "View Booking Status",
          route: "/shippers/view-booking-status",
        },
      ],
    });
  }
  if (tagId === 3 || tagId === 4) {
    menus.seller = menus.seller.filter(
      (menuItem) => menuItem.name !== "managers" && menuItem.name !== "Tenders"
    );

    const offeringsMenu = {
      id: 4,
      icon: "fas fa-clipboard-list",
      name: "Offerings",
      route: "/offerings",
      active: true,
      children: [
        { id: 1, name: "Create Offering", route: "/chartered/create-offering" },
        { id: 2, name: "View Offering", route: "/chartered/view-offering" },
      ],
    };

    const additionalMenus = [
      {
        id: 5,
        icon: "fas fa-box",
        name: "View Bookings",
        route: "/products",
        active: true,
      },
      {
        id: 6,
        icon: "fas fa-shopping-cart",
        name: "View Requirements",
        route: "/orders",
        active: true,
      },
      {
        id: 7,
        icon: "fas fa-chart-line",
        name: "Reports",
        route: "/reports",
        active: true,
      },
    ];
    const profileMenu = {
      id: 1,
      icon: "fas fa-user",
      name: "profile",
      route: "/profile",
      active: true,
    };
    menus.seller = [
      menus.seller[0], // Dashboard
      offeringsMenu,
      ...additionalMenus,
      profileMenu, // Profile at the end
    ];
  }

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("data"));
    setTagId(userData?.data?.tag_id || 0);
    setCurrentUser(userData.login_as);
  }, []);
  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          <div
            onClick={() => router.push("/dashboard")}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <img
              alt="logo"
              style={{ width: "100px" }}
              src="https://viexports.com/wp-content/uploads/2023/09/Untitled-design-18.jpg"
            />
          </div>
          <ul className="md:hidden items-center flex flex-wrap list-none">
            <li className="inline-block relative">
              <NotificationDropdown />
            </li>
            <li className="inline-block relative">
              <UserDropdown />
            </li>
          </ul>
          <div
            className={`md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded ${collapseShow}`}
          >
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link
                    href="/"
                    className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                  >
                    Notus NextJS
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            <form className="mt-6 mb-4 md:hidden">
              <div className="mb-3 pt-0">
                <input
                  type="text"
                  placeholder="Search"
                  className="border-0 px-3 py-2 h-12 border border-solid border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                />
              </div>
            </form>
            <hr className="my-0 md:min-w-full" />
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-0 my-4 no-underline">
              All Menus
            </h6>
            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              {menus[currentuser]
                .filter((ele) => ele.active === true)
                .map((ele) => {
                  const isExpanded = expandedItems[ele.id];
                  const active = isActive(ele);
                  return (
                    <li key={ele.id} className="items-center">
                      <div className="flex items-center justify-between">
                        <Link
                          href={ele.route}
                          className={`text-xs uppercase py-3 font-bold block ${
                            active
                              ? "text-lightBlue-500 hover:text-lightBlue-600"
                              : "text-blueGray-700 hover:text-blueGray-500"
                          }`}
                        >
                          {ele.name}
                        </Link>
                        {ele.children && (
                          <button
                            onClick={() => toggleExpand(ele.id)}
                            className="ml-2 focus:outline-none"
                          >
                            {isExpanded ? (
                              <i className="fas fa-chevron-up"></i>
                            ) : (
                              <i className="fas fa-chevron-down"></i>
                            )}
                          </button>
                        )}
                      </div>
                      {isExpanded && ele.children && (
                        <ul className="pl-6 mt-2">
                          {ele.children.map((child) => (
                            <li key={child.id} className="mt-2">
                              <Link
                                href={child.route}
                                className={`text-sm block py-2 ${
                                  router.pathname === child.route
                                    ? "text-lightBlue-500 hover:text-lightBlue-600"
                                    : "text-blueGray-700 hover:text-blueGray-500"
                                }`}
                              >
                                {child.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
