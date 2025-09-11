// AddBrandPage.tsx
import AddBrandForm from "./AddBrandForm";
// import { useAuth } from "../../context/AuthContext";

const AddBrandPage: React.FC = () => {
  

  const createdById = localStorage.getItem("merchant_id");
  console.log(createdById,'createdByIdcreatedByIdcreatedById');
  
  const createdByType: "Merchant" | "Admin" = "Merchant";
  console.log(createdByType,'MerchantMerchantMerchantMerchant');


  return (
    <div>
          <AddBrandForm createdById={createdById} createdByType={createdByType} />

    </div>
  );
};

export default AddBrandPage;
