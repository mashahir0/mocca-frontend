// // hooks/useProduct.js
// import { useQuery } from '@tanstack/react-query';
// import axios from '../services/api/userApi'

// const fetchProduct= async (id) => {
//   const response = await axios.get(`/product-info/${id}`); // Replace with your backend URL
//   if (!response.ok) {
//     throw new Error('Error fetching product data');
//   }
//   return response.json();
// };

// const useProduct = (id) => {
//     return useQuery({
//       queryKey: ['product', id],  // This is the unique key for the query
//       queryFn: () => fetchProduct(id),  // Pass the function that fetches the product
//     });
//   };

//   export default useProduct;