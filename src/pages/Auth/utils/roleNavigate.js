import { rolesRoutes } from "../../../config/rolesConfig";

export const navigateByRole = (userRole, navigate) => {
    const mappedRoles = rolesRoutes.reduce((acc, role) => {
        acc[role.role_name.toLowerCase().trim()] = role.route;
        return acc;
      }, {});

    if (!userRole || !mappedRoles || !navigate) return;

    const normalizedRole = userRole.toLowerCase().trim();
    if (mappedRoles[normalizedRole]) {
      navigate(mappedRoles[normalizedRole]); 
    } else {
      navigate("/"); 
    }
  };
  