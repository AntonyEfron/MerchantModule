// AddBrandPage.tsx
import AddBrandForm from "./AddBrandForm";
import { useAuth } from "../../context/AuthContext";

const AddBrandPage: React.FC = () => {
  const { merchant } = useAuth();

  const createdById = merchant?.id || "";
  const createdByType: "Merchant" | "Admin" = "Merchant";

  return (
    <div>
      {
        createdById ? (
          <AddBrandForm createdById={createdById} createdByType={createdByType} />
        ) : (
          <p style={{ color: "red" }}>You must be logged in as a merchant to add a brand.</p>
        )
      }
    </div>
  );
};

export default AddBrandPage;
