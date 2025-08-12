import axiosInstance from '../utils/axiosInstance'

export interface BrandPayload {
  name: string;
  description: string;
  logo?: File | null;
  createdByType: 'Merchant' | 'Admin';
  createdById: string;
}

export const addBaseProduct = async (productData) => {
    try {
        const response = await axiosInstance.post('merchant/addBaseProduct', productData);
        console.log(response,'responseresponseresponseresponseresponse');    
        return response.data;
    } catch (error) {
        if (error.response?.data?.errors?.length) {
          // Throw the first validation error as a string
          throw new Error(error.response.data.errors[0].message);
        } else if (error.response?.data?.message) {
          // Generic backend error message
          throw new Error(error.response.data.message);
        } else {
          throw new Error('Network or unknown error occurred.');
        }
      }
};

export const getBaseProducts = async () => {
    try {
        const response = await axiosInstance.get('merchant/getBaseProducts');
        return response.data;zz
    } catch (error) {
        console.log(error)
        throw error.response ? error.response.data : new Error('Network Error');
    }
}




  

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get('/merchant/getCategories');
    return response.data;
  } catch (error) {
    console.log(error)
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

export interface AddBrandResponse {
  brand: {
    _id: string;
    name: string;
    description: string;
    logo: {
      public_id: string;
      url: string;
    } | null;
    createdByType: 'Merchant' | 'Admin';
    createdById: string;
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    // add further fields as required
  };
}

/**
 * Sends a brand creation request including file upload (logo).
 */
export const addBrand = async (
  brand: BrandPayload
): Promise<AddBrandResponse> => {
  try {
    const formData = new FormData();
    formData.append('name', brand.name);
    formData.append('description', brand.description);
    formData.append('createdByType', brand.createdByType);
    formData.append('createdById', brand.createdById);
    if (brand.logo) {
      formData.append('logo', brand.logo);
    }

    const response = await axiosInstance.post<AddBrandResponse>(
      '/merchant/brand/add',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error adding brand:', error);
    throw error;
  }
};

export const getBrands = async (merchantId) => {
  try {
          console.log('Merchant ID passed to getBrands:', merchantId);

    const response = await axiosInstance.get(`/merchant/brand/get?merchantId=${merchantId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting brands:", error);
    throw error;
  }
};


export const addVariant = async (productId, formData) => {
  try {
    console.log("📤 Sending formData to backend...");
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }

    const response = await axiosInstance.post(
      `merchant/addVariant/${productId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    );

    return response.data;
  } catch (error) {
    if (error.response?.data?.errors?.length) {
      throw new Error(error.response.data.errors[0].message);
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Network or unknown error occurred.");
    }
  }
};

export const updateVariant = async (productId, variantId, formData) => {
  try {
    const res = await axiosInstance.put(
      `merchant/updateVariant/${productId}/${variantId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Update failed");
  }
};



  
export const getBaseProductById = async (productId) => {
  // console.log(productId,'productIdproductIdproductId');
  
    try {
        const response = await axiosInstance.get(`merchant/getBaseProductById/${productId}`);
        return response.data;
    } catch (error) {
        console.log(error)
        throw error.response ? error.response.data : new Error('Network Error');
    }
}




  