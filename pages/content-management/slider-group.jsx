import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";

const sliderGroup = ()=>{
    return(
        <>
         <HeaderTitle
        padding={"p-4"}
        subTitle={"List of all sellers"}
        title={"Seller Management"}
      />
        <h1>slide Group</h1>
       
        </> 
    )
}







sliderGroup.layout = UserDashboard; 
export default sliderGroup;