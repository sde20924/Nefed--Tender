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
        <h1>Pages </h1>
       
        </>
    )
}







updatePages.layout = UserDashboard; 
export default updatePages;