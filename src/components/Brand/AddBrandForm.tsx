import React, { useState } from "react";
import { addBrand } from "../../api/products";
import type { BrandPayload } from "../../api/products";
import styles from "./AddBrandForm.module.css";

interface AddBrandFormProps {
  createdById: string;
  createdByType: "Merchant" | "Admin";
}

const AddBrandForm: React.FC<AddBrandFormProps> = ({
  createdById,
  createdByType,
}) => {
  const [form, setForm] = useState<BrandPayload>({
    name: "",
    description: "",
    logo: null,
    createdById,
    createdByType,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "logo" && files) {
      setForm((prev) => ({ ...prev, logo: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await addBrand({
        ...form,
        createdById,    // Always use the prop, not form state
        createdByType,  // Always use the prop, not form state
      });
      setSuccess("Brand added successfully!");
      setForm((prev) => ({
        ...prev,
        name: "",
        description: "",
        logo: null,
      }));
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Failed to add brand. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeading}>Add New Brand</div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className={styles.formField}>
          <label className={styles.formLabel}>Name:</label>
          <input
            className={styles.formInput}
            type="text"
            name="name"
            value={form.name}
            required
            onChange={handleChange}
            placeholder="Enter brand name"
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Description:</label>
          <input
            className={styles.formInput}
            type="text"
            name="description"
            value={form.description}
            required
            onChange={handleChange}
            placeholder="Describe the brand"
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Logo:</label>
          <input
            className={styles.formFileInput}
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        {/* <div className={styles.formField}>
          <label className={styles.formLabel}>Created By Type:</label>
          <input
            className={styles.formInput}
            type="text"
            name="createdByType"
            value={createdByType}
            readOnly
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Created By Id:</label>
          <input
            className={styles.formInput}
            type="text"
            name="createdById"
            value={createdById}
            readOnly
          />
        </div> */}
        <button
          type="submit"
          className={styles.formButton}
          disabled={loading}
        >
          {loading ? "Saving..." : "Add Brand"}
        </button>
        {success && <div className={styles.successMessage}>{success}</div>}
        {error && <div className={styles.errorMessage}>{error}</div>}
      </form>
    </div>
  );
};

export default AddBrandForm;
