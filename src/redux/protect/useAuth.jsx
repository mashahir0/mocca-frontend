export const userAuth = () => {
  const userToken = localStorage.getItem("accessToken");
  return { userToken };
};

export const adminAuth = () => {
  const adminToken = localStorage.getItem("adminToken");
  return { adminToken };
};
