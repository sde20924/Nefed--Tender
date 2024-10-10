import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";

const updatePages  = ()=>{
    return(
        <>
         <HeaderTitle
        padding={"p-4"}
        subTitle={"update pages the pages of website"}
        title={"update pages"}
      />
      <h1>pages </h1>
        <div className="">

        </div>
       
        </>
    )
}







updatePages.layout = UserDashboard; 
export default updatePages;